import mimetypes
from dotenv import load_dotenv
from google import genai
import os
import io
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.output_parsers import StrOutputParser
from typing import List
from typing_extensions import TypedDict
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder
from core.ingest import DataLoader
from google.genai import types
from core.utils import Utilities
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
import faiss
from langchain_community.docstore.in_memory import InMemoryDocstore
from flask import (
    Flask,
    redirect,
    request,
    jsonify,
    Response,
    stream_with_context,
    session,
    send_from_directory,
)
import json
from pymongo import MongoClient
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from langgraph.graph import END, StateGraph, START
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus
from bson import ObjectId
from werkzeug.utils import secure_filename
import base64
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from langmem import create_prompt_optimizer
from models.data_models import *

load_dotenv()

app = Flask(__name__)
CORS(app)
app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)
password = quote_plus(os.getenv("MONGO_PASS"))
uri = (
    "mongodb+srv://hatim:"+ password + "@cluster0.f7or37n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tlsAllowInvalidCertificates=true"
)
client = MongoClient(uri, server_api=ServerApi("1"))
mongodb = client["CodeShastra"]
user_collection = mongodb["users"]
policy_collection = mongodb["policy"]

bcrypt = Bcrypt(app)
GEMININ_CLIENT = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
FAISS_INDEX_PATH = os.path.join("faiss_index", "index.faiss")
LLM = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
EMBEDDINGS = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

structured_llm_router = LLM.with_structured_output(AnalyzeQuery)
router_system_prompt = """You are an expert in analyzing user queries to determine the correct routing destination and whether access should be granted to documents from different departments.

DEPARTMENTS:
- hr
- sales
- legal

ROUTES:
- 'vectorstore': Use when the user asks general questions or external data is required.
- 'generate_report': Use when the user asks to generate or request a report.
- 'write_email': Use when the user asks for help composing or sending an email.

ACCESS CONTROL RULES:
- The user should typically be given access to the documents from their own department.
- Only provide access if:
    1. The task clearly requires a higher access level.
    2. The policy instructions explicitly permit it.

INSTRUCTIONS:
{instructions}


OUTPUT:
- route: One of ['vectorstore', 'generate_report', 'write_email']
- access_level: Final access level to be used (same as original unless changed per policy)
"""
route_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", router_system_prompt),
        ("human", "INPUT:\n- user's current department: {department}\n- user's question: {question}"),
    ]
)

question_router = route_prompt | structured_llm_router

# GRADER
structured_llm_grader = LLM.with_structured_output(GradeDocuments)

grade_system_prompt = """You are a grader assessing relevance of a retrieved document to a user question. \n 
    If the document contains keyword(s) or semantic meaning related to the user question, grade it as relevant.\nIt does not need to be a stringent test. The goal is to filter out erroneous retrievals. When the user is asking for a request like creating an email, then your aim should be to output 'yes' if it has the slightest information on the actual topic, in rest cases, be strict and ensure the context is relevant to the question.\n
    Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question."""
grade_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", grade_system_prompt),
        ("human", "Retrieved document: \n\n {document} \n\n User question: {question}"),
    ]
)

retrieval_grader = grade_prompt | structured_llm_grader

question = "Generate a report on adversarial attacks on llm"
structured_llm_checker = LLM.with_structured_output(GradeHallucinations)

system = """You are a grader assessing whether an LLM generation is grounded in / supported by a set of retrieved facts. \n 
     Give a binary score 'yes' or 'no'. 'Yes' means that the answer is grounded in / supported by the set of facts."""
hallucination_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "Set of facts: \n\n {documents} \n\n LLM generation: {generation}"),
    ]
)

hallucination_grader = hallucination_prompt | structured_llm_checker

# ANSWER GRADER
structured_llm_answer_grader = LLM.with_structured_output(GradeAnswer)

system = """You are a grader assessing whether an answer addresses / resolves a question \n 
     Give a binary score 'yes' or 'no'. Yes' means that the answer resolves the question."""
answer_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "User question: \n\n {question} \n\n LLM generation: {generation}"),
    ]
)

answer_grader = answer_prompt | structured_llm_answer_grader

# QUESTION RE-WRITER
# Prompt
system = """You are a question re-writer that converts an input question to a better version that is optimized \n 
     for vectorstore retrieval. Look at the input and try to reason about the underlying semantic intent / meaning."""
re_write_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        (
            "human",
            "Here is the initial question: \n\n {question} \n Formulate an improved question.",
        ),
    ]
)

question_rewriter = re_write_prompt | LLM | StrOutputParser()



def retrieve(state):
    """
    Retrieve documents

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): New key added to state, documents, that contains retrieved documents
    """
    print("---RETRIEVE---")
    question = state["question"]
    dept = state["department"]
    new_dept = state["new_dept"]
    user_id = session["user_id"]
    # print(f"FAISS index path: {faiss_index_path}")
    vectorstore = FAISS.load_local(FAISS_INDEX_PATH, embeddings=EMBEDDINGS, allow_dangerous_deserialization=True)
    RERANKER_MODEL = HuggingFaceCrossEncoder(model_name="BAAI/bge-reranker-base")
    compressor = CrossEncoderReranker(model=RERANKER_MODEL, top_n=5)
    compression_retriever = ContextualCompressionRetriever(
        base_compressor=compressor, base_retriever=vectorstore.as_retriever()
    )
    # # Retrieval
    retriever = vectorstore.as_retriever()
    base_docs = retriever.invoke(question, filter={"dept": new_dept[0]})
    rel_docs = compression_retriever.invoke(question, filter={"dept": new_dept[0]})
    print(len(base_docs))
    print(len(rel_docs))

    return {"documents": rel_docs, "question": question}

def generate(state):
    """
    Generate answer

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): New key added to state, generation, that contains LLM generation
    """
    print("---GENERATE---")
    question = state["question"]
    documents = state["documents"]
    prompt_type = state["question_type"]

    generate_report_prompt = """
You are a senior data analyst. Your job is to generate a clear, well-structured analytical report based on the information provided.

The report should be written in **Markdown format** and cover all relevant aspects based on the context and the user's question.

---

## 🧾 Report Requirements:

1. **Executive Summary**  
   - Start with a brief summary of the key findings or insights.
   
2. **Direct Answer to the User’s Question**  
   - Provide a focused and data-supported answer.

3. **Key Metrics and Highlights**  
   - Present relevant quantitative or qualitative metrics depending on the context (e.g., revenue, conversions, sentiment scores, traffic volume, etc.).
   - Use bullet points.

4. **Trends, Patterns, and Anomalies**  
   - Highlight any noticeable changes or patterns over time or across segments.

5. **Performance Drivers or Root Causes**  
   - Explain any underlying factors influencing the outcomes.

6. **Recommendations**  
   - Include actionable insights or strategic suggestions where applicable.

7. **Professional Formatting**  
   - Use Markdown elements such as:
     - Headings (##, ###)
     - Lists
     - Bold for emphasis
"""
    email_prompt = """You are an expert in writing professional and effective emails.

Your task is to write an email that fulfills the user's intent based on the question, using the supporting context provided.

## ✉️ Email Requirements:
- Include the following fields:
  - **To**: Based on the recipient(s) implied in the user request or context.
  - **Subject**: A clear and concise subject line that reflects the purpose.
  - **Body**: A professional, coherent message that includes:
    - A proper greeting
    - Clear, relevant information from the context
    - A call to action or closing statement
    - Polite tone and appropriate formatting

Generate the full email now with the fields:

**To:**  
**Subject:**  
**Body:**"""
    if prompt_type == "generate_report":
        print("GENERATING REPORT...")
        generation_system_prompt = generate_report_prompt
    elif prompt_type == "write_email":
        generation_system_prompt = email_prompt
        generation_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", generation_system_prompt),
                ("human", "CONTEXT:\n{context}: \n\n USER QUESTION: {question}"),
            ]
        )
        rag_chain = generation_prompt | LLM.with_structured_output(GenerateEmail)
        generation = rag_chain.invoke({"context": documents, "question": question})
        return {"documents": documents, "question": question, "generation": generation, "action": prompt_type}
    else:
        generation_system_prompt = "You're an AI assistant for Sentra Vault. Answer the user question based on the context provided.\n\n"
    generation_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", generation_system_prompt),
            ("human", "CONTEXT:\n{context}: \n\n USER QUESTION: {question}"),
        ]
    )

    # def format_docs(docs):
    #     return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = generation_prompt | LLM | StrOutputParser()

    # RAG generation
    generation = rag_chain.invoke({"context": documents, "question": question})
    return {"documents": documents, "question": question, "generation": generation, "action": prompt_type}

def grade_documents(state):
    """
    Determines whether the retrieved documents are relevant to the question.

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Updates documents key with only filtered relevant documents
    """

    print("---CHECK DOCUMENT RELEVANCE TO QUESTION---")
    question = state["question"]
    documents = state["documents"]

    # Score each doc
    filtered_docs = []
    for d in documents:
        score = retrieval_grader.invoke(
            {"question": question, "document": d.page_content}
        )
        grade = score.binary_score
        if grade == "yes":
            print("---GRADE: DOCUMENT RELEVANT---")
            filtered_docs.append(d)
        else:
            print("---GRADE: DOCUMENT NOT RELEVANT---")
            continue
    return {"filtered_documents": filtered_docs, "question": question, "action": state["question_type"]}


def transform_query(state):
    """
    Transform the query to produce a better question.

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Updates question key with a re-phrased question
    """

    print("---TRANSFORM QUERY---")
    question = state["question"]
    documents = state["documents"]

    # Re-write question
    better_question = question_rewriter.invoke({"question": question})
    return {"documents": documents, "question": better_question}

def classify_user_query(state):
    """
    Classify user query

    Args:
        state (dict): The current graph state

    Returns:
        state (dict): Updates documents key with appended web results
    """

    print("---CLASSIFYING INPUT---")
    question = state["question"]
    department = state["department"]
    instructions = state["instructions"]    
    response = question_router.invoke({"question":question, "department": department, "instructions": instructions})

    return {"question_type": response.route, "new_dept":response.dept_access}

def decide_to_generate(state):
    """
    Determines whether to generate an answer, or re-generate a question.

    Args:
        state (dict): The current graph state

    Returns:
        str: Binary decision for next node to call
    """

    print("---ASSESS GRADED DOCUMENTS---")
    state["question"]
    new_dept = state["new_dept"]
    filtered_documents = state["filtered_documents"]

    if not filtered_documents:
        print("---DECISION: RAISE ERROR---")
        return "raise_error"
    else:
        # We have relevant documents, so generate answer
        print("---DECISION: GENERATE---")
        return "generate"

def grade_generation_v_documents_and_question(state):
    """
    Determines whether the generation is grounded in the document and answers question.

    Args:
        state (dict): The current graph state

    Returns:
        str: Decision for next node to call
    """

    print("---CHECK HALLUCINATIONS---")
    question = state["question"]
    documents = state["documents"]
    generation = state["generation"]

    score = hallucination_grader.invoke(
        {"documents": documents, "generation": generation}
    )
    grade = score.binary_score

    if grade == "yes":
        print("---DECISION: GENERATION IS GROUNDED IN DOCUMENTS---")
        print("---GRADE GENERATION vs QUESTION---")
        score = answer_grader.invoke({"question": question, "generation": generation})
        grade = score.binary_score
        if grade == "yes":
            print("---DECISION: GENERATION ADDRESSES QUESTION---")
            return "useful"
        else:
            print("---DECISION: GENERATION DOES NOT ADDRESS QUESTION---")
            return "not useful"
    else:
        print("---DECISION: GENERATION IS NOT GROUNDED IN DOCUMENTS, RE-TRY---")
        return "not supported"

def raise_error(state):
    """
    Raise an error if the user is trying to access a document they are not authorized for.

    Args:
        state (dict): The current graph state

    Returns:
        str: Error message
    """
    return {"error": f"User is not authorized to access documents. Please contact your manager for access."}

class GraphState(TypedDict):
    """
    Represents the state of our graph.

    Attributes:
        question: question
        generation: LLM generation
        documents: list of documents
        question_type: type of question
        department: department of user
        access: access level of user
        new_dept: new department to access
        instructions: instructions or policy
        error: error message
        filtered_documents: filtered documents based on relevance
        action: action to take (e.g., generating_report, raise error)
    """

    question: str
    generation: str
    documents: List[str]
    question_type : str
    department: str
    access: List[str]
    new_dept : List[str]
    instructions: str
    error: str
    filtered_documents: List[Document]
    action: str


workflow = StateGraph(GraphState)

# Define the nodes
workflow.add_node("classify_user_query", classify_user_query) 
workflow.add_node("retrieve", retrieve)  # retrieve
workflow.add_node("grade_documents", grade_documents)  # grade documents
workflow.add_node("generate", generate)  # generatae
workflow.add_node("raise_error", raise_error) 

# Build graph
workflow.add_edge(START, "classify_user_query")
workflow.add_edge("classify_user_query", "retrieve")
workflow.add_edge("retrieve", "grade_documents")
workflow.add_conditional_edges(
    "grade_documents",
    decide_to_generate,
    {
        "raise_error": "raise_error",
        "generate": "generate",
    },
)
workflow.add_edge("generate",END)
workflow.add_edge("raise_error", END)

# Compile
RAG = workflow.compile()

UPLOAD_FOLDER = 'uploads'
FILE_LIST_PATH = 'uploaded_files.json'
ALLOWED_EXTENSIONS = {'pdf', 'txt', 'jpg', 'jpeg', 'png', 'csv'}

# Make sure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    required_fields = ["email", "password", "confirm_password", "role", "Dept", "location", "region"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    # You could use email as username or separate username field
    email = data["email"]
    password = data["password"]
    confirm_password = data["confirm_password"]

    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    if user_collection.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    user_data = {
        "email": email,
        "password": hashed_password,
        "role": data["role"],
        "department": data["Dept"],
        "location": data["location"],
        "region": data["region"],
    }

    result = user_collection.insert_one(user_data)

    return jsonify({
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }), 200

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user_data = user_collection.find_one({"email": email})

    if user_data and bcrypt.check_password_hash(user_data["password"], password):
        session["user_id"] = str(user_data["_id"])  # Store user ID in session
        return jsonify({"message": "Login successful","email":email}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401
    
@app.route("/agent-chat", methods=["POST"])
def agent_chat():
    user_id = session.get('user_id')  
    if not user_id:
        return jsonify({'error': 'Unauthorized. No user in session.'}), 401
    user_data: dict = user_collection.find_one({"_id": ObjectId(user_id)})
    data: dict = request.get_json()
    user_message = data["query"]
    if not user_message:
        return "No message provided", 400
    user_id = session["user_id"]
    print(f"User ID: {user_id}")
    user_data: dict = user_collection.find_one({"_id": ObjectId(user_id)})
    if not user_data:
        return "User not found", 404
    instructions = """- Legal documents should only be accessed or referenced by managers or admins. Interns are strictly prohibited.
- Sales documents may be accessed by interns, managers, and admins.
- HR-related documents can be accessed by managers and admins. Interns may request access but should not be elevated unless explicitly approved.
- Technical documentation is open to all roles.
- If the user requests access to a document they are not authorized for, do not elevate their access unless business-critical justification is clearly present in the query.
"""
    inputs = {"question": user_message,"department": user_data['department'], "access": user_data["role"], "instructions": instructions}
    config = {"configurable": {"user_id": user_id, "thread_id": "2"}}
    def generate():
        for s in RAG.stream(
            inputs, config=config, stream_mode=["values", "messages"]
        ):
            # print(f"\n\nStreamed response: \n{s}\n\n")
            function_name = None
            arguments = None
            function_call = False
            tool_call = False
            tool_name = None
            if s[0]=="messages":
                s = s[1]
                if hasattr(s[0], "additional_kwargs") and s[0].additional_kwargs.get(
                    "function_call"
                ):
                    print(f"Function call: {s[0].additional_kwargs['function_call']}")
                    function_call = True
                    function_name = s[0].additional_kwargs["function_call"]["name"]
                    arguments = json.loads(
                        s[0].additional_kwargs["function_call"]["arguments"]
                    )
                elif hasattr(s[0], "tool_call_id"):
                    print(f"Tool call: {s[0].name}")
                    tool_name = s[0].name
                    tool_call = True

                data = {
                    "payload_type": "message",
                    "content": s[0].content,
                    "function_call": function_call,
                    "function_name": function_name,
                    "arguments": arguments,
                    "tool_call": tool_call,
                    "tool_name": tool_name,
                }
                yield f"data: {json.dumps(data)}\n\n".encode("utf-8")
            elif s[0] == "values":
                values_data = s[1]
                print("VALUES DATA", values_data)
                data = {}
                data["payload_type"] = "values"
                if "error" or "action" in values_data:
                    if "action" in values_data:
                        action = values_data["action"]
                        data["action"] = action
                    if "error" in values_data:
                        error_message = values_data["error"]
                        data["error"] = error_message
                yield f"data: {json.dumps(data)}\n\n".encode("utf-8")
    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
    )

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def classify_file_type(filename):
    ext = filename.rsplit('.', 1)[1].lower()
    if ext == 'pdf':
        return 'pdf'
    elif ext == 'csv':
        return 'csv'
    elif ext in ['jpg', 'jpeg', 'png']:
        return 'image'
    return None  # Ignore other types

@app.route('/upload-docs', methods=['POST'])
def upload_docs():
    user_id = session.get('user_id')  # You can still use this for folder structuring
    if not user_id:
        return jsonify({'error': 'Unauthorized. No user in session.'}), 401
    user_data: dict = user_collection.find_one({"_id": ObjectId(user_id)})
    department= user_data["department"]

    if not user_id:
        return jsonify({'error': 'Unauthorized. No user in session.'}), 401
    print(request.files)
    if 'files' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    files = request.files.getlist('files')
    saved_files = []
    pdfs = []
    csvs  = []
    image = []
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_type = classify_file_type(filename)

            if not file_type:
                continue

            # Maintain folder structure: uploads/<user_id>/<text|image>/
            folder_type = 'text' if file_type in ['pdf', 'csv'] else 'image'
            user_folder = os.path.join(UPLOAD_FOLDER, str(user_id), folder_type)
            os.makedirs(user_folder, exist_ok=True)

            file_path = os.path.join(user_folder, filename)
            file.save(file_path)
            saved_files.append(file_path)

            # Append to global list
            if file_type == 'pdf':
                pdfs.append(file_path)
            elif file_type == 'csv':
                csvs.append(file_path)
            elif file_type in ['jpg', 'jpeg', 'png']:
                image.append(file_path)
    all_docs_with_metadata=[]
    # client = genai.Client(api_key="YOUR_API_KEY")
    # def encode_image_base64(image_path):
    #     with open(image_path, "rb") as image_file:
    #         return base64.b64encode(image_file.read()).decode("utf-8")

    # base_list = []
    # for image_path in image:
    #     b64_string = encode_image_base64(image_path)
    #     mime_type = "image/jpeg" if image_path.lower().endswith(("jpg", "jpeg")) else "image/png"
    #     base_list.append(f"data:{mime_type};base64,{b64_string}")


    # # Send to Gemini
    # response = client.models.generate_content(
    #     model="gemini-2.0-flash-exp",
    #     contents=["I want you to analyze these images and give me a summary of its description. i want you to return me a list of images according to list of images provided to you.", base_list],
    # )
    
    # print("Response from Gemini:", response)

    for pdf in pdfs:
        system_prompt= """\n\nYou have to determine who has access to this document based on the following instruction. The types of users are: intern, manager and admin. 
        - Legal documents should not be made available to interns
        - Financial documents should not be made available to manager and intern 
        - Admin has access to all the documents

        Respond with a list of user types who are allowed to access the document. The response should strictly be a list of the user types.""" 
        context,docs = DataLoader.load_pdf(pdf)
        policy_doc = policy_collection.find_one({'_id': ObjectId('67f200964f60da27ad6d9f3b')})
        policy = policy_doc.get("policy", "")
        policy += system_prompt
        print("policy", policy)
        policy_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", policy),
                ("human", "{context}"),
            ]
        )
        llm = ChatGoogleGenerativeAI(model='gemini-2.0-flash')
        policy_agent = policy_prompt | llm.with_structured_output(Policy)

        response = policy_agent.invoke({"context":context})
        metadata = response.access
        # print("metadata", metadata)
        for doc in docs:
            all_docs_with_metadata.append(Document(page_content=doc.page_content, metadata={"access": metadata, "dept":department}))
    for csv in csvs:
        system_prompt= """You have to determine who has access to this document based on the following instruction. The types of users are: intern, manager and admin. 
        - Legal documents should not be made available to interns
        - Financial documents should not be made available to manager and intern 
        - Admin has access to all the documents

        Respond with a list of user types who are allowed to access the document.""" 
        context,docs = DataLoader.load_csv(csv)
        policy_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                ("human", "{context}"),
            ]
        )
        llm = ChatGoogleGenerativeAI(model='gemini-2.0-flash')
        policy_agent = policy_prompt | llm.with_structured_output(Policy)

        response = policy_agent.invoke({"context":context})
        metadata = response.access
        # print("metadata", metadata)
        for doc in docs:
            all_docs_with_metadata.append(Document(page_content=doc.page_content, metadata={"access": metadata, "dept":department}))


    if os.path.exists(FAISS_INDEX_PATH):
        print("HELLO HERE")
        vector_store = FAISS.load_local(FAISS_INDEX_PATH, embeddings=EMBEDDINGS, allow_dangerous_deserialization=True)
        vector_store.add_documents(all_docs_with_metadata)
        vector_store.save_local(FAISS_INDEX_PATH)
    else:
        print("HELLO HERE 2")
        index = faiss.IndexFlatL2(768)
        vector_store = FAISS(
            embedding_function=EMBEDDINGS,
            index=index,
            docstore=InMemoryDocstore(),
            index_to_docstore_id={}
        )
        vector_store.add_documents(all_docs_with_metadata)
        vector_store.save_local(FAISS_INDEX_PATH)
    return jsonify({'message': f'{len(saved_files)} file(s) uploaded successfully.'}),200


@app.route('/upload', methods=['POST'])
def upload_files():
    print(request.files)
    if 'documents' not in request.files:
        return jsonify({'error': 'No files part in the request'}), 400

    files = request.files.getlist('documents')
    saved_files = []

    for file in files:
        if file.filename == '':
            continue
        filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}-{secure_filename(file.filename)}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        saved_files.append(filename)

    return jsonify({
        'message': 'Files uploaded successfully!',
        'files': saved_files
    }), 200



@app.route('/files', methods=['GET'])
def get_user_files():
    user_id = session.get('user_id')  # You can still use this for folder structuring
    if not user_id:
        return jsonify({'error': 'Unauthorized. No user in session.'}), 401
    user_dir = os.path.join('./uploads', user_id, 'text')
    
    if not os.path.exists(user_dir):
        return jsonify({"message": "No files found for this user."}), 404

    files = []
    for filename in os.listdir(user_dir):
        file_path = os.path.join(user_dir, filename)
        if os.path.isfile(file_path):
            files.append({
                "filename": filename,
                "path": f"uploads/{user_id}/text/{filename}"
            })

    return jsonify({
        "user_id": user_id,
        "files": files
    })

@app.route('/upload-new', methods=['POST'])
def upload_new_files():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized. No user in session.'}), 401

    if 'documents' not in request.files:
        return jsonify({'error': 'No files part in the request'}), 400

    files = request.files.getlist('documents')
    saved_files = []

    for file in files:
        if file.filename == '':
            continue

        filename = secure_filename(file.filename)

        # You can determine type by MIME type or just fallback to 'others'
        # content_type = file.mimetype or ''
        # if content_type.startswith('text/'):
        #     folder_type = 'text'
        # elif content_type.startswith('image/'):
        #     folder_type = 'image'
        # elif content_type.startswith('application/pdf'):
        #     folder_type = 'pdf'
        # else:
        folder_type = 'docs'

        user_folder = os.path.join("public2", str(user_id), folder_type)
        os.makedirs(user_folder, exist_ok=True)

        file_path = os.path.join(user_folder, filename)
        file.save(file_path)

        saved_files.append({
            'filename': filename,
            'path': file_path,
            'type': folder_type
        })

    return jsonify({
        'message': f'{len(saved_files)} file(s) uploaded successfully.',
        'files': saved_files
    }), 200

@app.route('/uploads/<user_id>/text/<filename>', methods=['GET'])
def serve_uploaded_file(user_id, filename):
 # You can still use this for folder structuring
    print(f"Current user ID: {user_id}")
  

    file_path = os.path.join("uploads", user_id, "text")

    print(f"File path: {file_path}")
    return send_from_directory(file_path, filename, as_attachment=False)
   



client = genai.Client(api_key= os.getenv("GOOGLE_API_KEY"))

@app.route('/connected-files', methods=['POST'])
def connected_files():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized. No user in session.'}), 401

    data = request.get_json()
    connected_files = data.get('connected_files', [])
    question = data.get('question', '')
    
    print(f"Question: {question}")
    print(f"Connected files from frontend: {connected_files}")

    # Define user's upload directory
    user_dir = os.path.join('public2', user_id ,'docs')
    print(f"User directory: {user_dir}")
    if not os.path.exists(user_dir):
        return jsonify({"message": "No files found for this user."}), 404

    # Prepare list of matched files
    matched_files = []
    connected_normalized = [cf.replace(" ", "_").strip().lower() for cf in connected_files]

    for filename in os.listdir(user_dir):
        file_path = os.path.join(user_dir, filename)

        if os.path.isfile(file_path):
            normalized_filename = filename.replace(" ", "_").strip().lower()

            if normalized_filename in connected_normalized:
                mime_type, _ = mimetypes.guess_type(file_path)
                matched_files.append({
                "filename": filename,
                "path": f"{file_path}",
                "type": mime_type or "application/octet-stream"
                })


    print(f"Matched Files to Process: {matched_files}")
   
       # Upload files to Gemini
    uploaded_docs = []
    for file in matched_files:
        file_path = file['path']
        type = file['type']
        try:
            with open(file_path, "rb") as f:
                file_data = io.BytesIO(f.read())
                uploaded_doc = client.files.upload(
                    file=file_data,
                    config=dict(mime_type=type),
                )
                uploaded_docs.append(uploaded_doc)
        except Exception as e:
            print(f"Error uploading {file['filename']}: {e}")
            return jsonify({"error": f"Failed to upload file {file['filename']}"}), 500

    # Ask question using Gemini
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Unauthorized. No user in session.'}), 401
        user_data: dict = user_collection.find_one({"_id": ObjectId(user_id)})
        role = user_data["role"]
        dept = user_data["department"]
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[*uploaded_docs, "My role is" + role + "and i belong to " + dept + "department and here is my question. Answer my question " + question]
        )


        print(f"Gemini response: {response.text}")
        # Clean up all files uploaded to the client
        for f in client.files.list():
            try:
                print(f"Deleting file: {f.name}")
                client.files.delete(f.name)
    
            except Exception as e:
                print(f"Error deleting file {e}") 
        return jsonify({"message": response.text})
    except Exception as e:
        print(f"Error generating content: {e}")
        return jsonify({"error": "Gemini failed to respond."}), 500
    
from email.message import EmailMessage
import smtplib, ssl

def send_mail(recipient_email, subject, message):
    sender_email = "codeomega11@gmail.com"
    sender_password = "gqnknjdlvmtedqzt"

    email = EmailMessage()
    email['From'] = sender_email
    email['To'] = recipient_email
    email['Subject'] = subject
    email.set_content(message)

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, sender_password)
        server.send_message(email)
        print("Mail Sent")


@app.route('/send-email', methods=['POST'])
def send_email_api():
    data = request.json
    to = data.get('to')
    subject = data.get('subject')
    message = data.get('message')

    if not all([to, subject, message]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        send_mail(to, subject, message)
        return jsonify({'message': 'Email sent successfully'}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
    


@app.route('/get-policy', methods=['GET'])
def get_policy():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized. No user in session.'}), 401

    try:
        policy = policy_collection.find_one({'_id': ObjectId('67f200964f60da27ad6d9f3b')})
        if not policy:
            return jsonify({'error': 'Policy not found'}), 404
        
        return jsonify({
            'policy': policy.get('policy', '')  # Assuming the text is stored under 'content'
        }), 200

    except Exception as e:
        print("Error fetching policy:", e)
        return jsonify({'error': 'Invalid ID or internal error'}), 500

@app.route('/optimize-policy', methods=['POST'])
def optimize_policy():
    data = request.json

    policy_id = "67f200964f60da27ad6d9f3b"
    feedback = data.get("feedback")

    if not policy_id or not feedback:
        return jsonify({"error": "Missing policy ID or feedback"}), 400

    # try:
        # Fetch existing policy from DB
    policy_doc = policy_collection.find_one({"_id": ObjectId(policy_id)})
    if not policy_doc:
        return jsonify({"error": "Policy not found"}), 404

    original_policy = policy_doc.get("policy", "")
    prompt = """You are a Prompt Optimizer. Your role is to take an existing prompt and improve its clarity, effectiveness, and alignment with the user's intent. You will also incorporate any feedback provided by the user.

Follow these steps:

Understand the Goal: Read the original prompt and the user's feedback carefully to determine the intended outcome.

Identify Issues: Look for any vagueness, redundancy, unnecessary complexity, or lack of focus in the original prompt.

Optimize: Rewrite the prompt to be more clear, concise, and targeted, ensuring it aligns with the user's desired output.\n\nEXISTING PROMPT:```{prompt}```\n"""
    improved_policy = client.models.generate_content(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(
            system_instruction=prompt.format(prompt=original_policy)),
        contents=f"FEEDBACK:{feedback}"
    )


    # Update in MongoDB
    policy_collection.update_one(
        {"_id": ObjectId(policy_id)},
        {"$set": {"policy": improved_policy.text}}
    )

    return jsonify({"message": "Policy optimized and updated", "optimizedPolicy": improved_policy.text}), 200

    # except Exception as e:
    #     print("Optimization error:", e)
    #     return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
