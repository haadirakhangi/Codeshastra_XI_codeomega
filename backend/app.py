from dotenv import load_dotenv
import os
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
from core.utils import Utilities
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
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

bcrypt = Bcrypt(app)


LLM = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
EMBEDDINGS = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")


# ROUTER
structured_llm_router = LLM.with_structured_output(RouteQuery)
router_system_prompt = """You are an expert at routing a user's question. Understand the user query and decide where to route the user question. 
Choose one of:
'vectorstore' : when external data is required to answer the question or user asks in general question.
'generate_report': Question which involves generating report.
'write_email': If writing an email is required."""
route_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", router_system_prompt),
        ("human", "{question}"),
    ]
)

question_router = route_prompt | structured_llm_router

# GRADER
structured_llm_grader = LLM.with_structured_output(GradeDocuments)

grade_system_prompt = """You are a grader assessing relevance of a retrieved document to a user question. \n 
    If the document contains keyword(s) or semantic meaning related to the user question, grade it as relevant. \n
    It does not need to be a stringent test. The goal is to filter out erroneous retrievals. \n
    Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question."""
grade_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", grade_system_prompt),
        ("human", "Retrieved document: \n\n {document} \n\n User question: {question}"),
    ]
)

retrieval_grader = grade_prompt | structured_llm_grader


# GENERATION
generation_system_prompt = "Generate a detailed report based on the user's request using the information provided to you"
generation_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", generation_system_prompt),
        ("human", "Set of facts: \n\n {context} \n\n User question: {question}"),
    ]
)

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

rag_chain = generation_prompt | LLM | StrOutputParser()

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
    access = state["access"]
    user_id = session["user_id"]
    faiss_index_path = os.path.join(UPLOAD_FOLDER, str(user_id), "text",'faiss_index', 'index.faiss')
    print(f"FAISS index path: {faiss_index_path}")
    vectorstore = FAISS.load_local(faiss_index_path, embeddings=EMBEDDINGS, allow_dangerous_deserialization=True)
    RERANKER_MODEL = HuggingFaceCrossEncoder(model_name="BAAI/bge-reranker-base")
    compressor = CrossEncoderReranker(model=RERANKER_MODEL, top_n=5)
    compression_retriever = ContextualCompressionRetriever(
        base_compressor=compressor, base_retriever=vectorstore.as_retriever()
    )

    # Retrieval
    documents = compression_retriever.invoke(question, config={'metadata': {"access":access, "dept":dept}})
    return {"documents": documents, "question": question}

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

    # RAG generation
    generation = rag_chain.invoke({"context": documents, "question": question})
    return {"documents": documents, "question": question, "generation": generation}

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
    return {"documents": filtered_docs, "question": question}


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

    print("---ANSWER DIRECTLY---")
    question = state["question"]
    
    response = question_router.invoke({"question":question})

    return {"question_type": response.route, "question": question}

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
    filtered_documents = state["documents"]

    if not filtered_documents:
        print(
            "---DECISION: ALL DOCUMENTS ARE NOT RELEVANT TO QUESTION, TRANSFORM QUERY---"
        )
        return "transform_query"
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
    """

    question: str
    generation: str
    documents: List[str]
    question_type : str
    department: str
    access: str


workflow = StateGraph(GraphState)

# Define the nodes
workflow.add_node("classify_user_query", classify_user_query) 
workflow.add_node("retrieve", retrieve)  # retrieve
workflow.add_node("grade_documents", grade_documents)  # grade documents
workflow.add_node("generate", generate)  # generatae
workflow.add_node("transform_query", transform_query)  # transform_query

# Build graph
workflow.add_edge(START, "classify_user_query")
workflow.add_edge("classify_user_query", "retrieve")
workflow.add_edge("retrieve", "grade_documents")
workflow.add_edge("transform_query", "retrieve")
workflow.add_conditional_edges(
    "grade_documents",
    decide_to_generate,
    {
        "transform_query": "transform_query",
        "generate": "generate",
    },
)
workflow.add_edge("generate",END)

# Compile
RAG = workflow.compile()

UPLOAD_FOLDER = 'uploads'
FILE_LIST_PATH = 'uploaded_files.json'
ALLOWED_EXTENSIONS = {'pdf', 'txt', 'jpg', 'jpeg', 'png'}

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
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401
    
@app.route("/agent-chat", methods=["POST"])
def agent_chat():
    user_id = session.get('user_id')  # You can still use this for folder structuring
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
    inputs = {"question": [{"role": "user", "content": user_message}],"department": user_data["department"], "access": user_data["role"]}
    config = {"configurable": {"user_id": user_id, "thread_id": "2"}}
    response = RAG.invoke(inputs, config=config)
    print(f"Response: {response}")
    return jsonify({"response": str(response)}), 200

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

    if 'files' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    files = request.files.getlist('files')
    saved_files = []
    pdfs = []
    csv  = []
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
                csv.append(file_path)
            elif file_type in ['jpg', 'jpeg', 'png']:
                image.append(file_path)
    all_docs_with_metadata=[]
    for pdf in pdfs:
        system_prompt= """You have to determine who has access to this document based on the following instruction. The types of users are: intern, manager and admin. 
        - Legal documents should not be made available to interns
        - Financial documents should not be made available to manager and intern 
        - Admin has access to all the documents

        Respond with a list of user types who are allowed to access the document.""" 
        context,docs = DataLoader.load_pdf(pdf)
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
        print("metadata", metadata)
        for doc in docs:
            all_docs_with_metadata.append(Document(page_content=doc.page_content, metadata={"access": metadata, "dept":department}))
    faiss_folder = os.path.join(UPLOAD_FOLDER, str(user_id), "text",'faiss_index')
    os.makedirs(faiss_folder, exist_ok=True)
    faiss_index_path = os.path.join(faiss_folder, 'index.faiss')
    print(all_docs_with_metadata[:2])

    if os.path.exists(faiss_index_path):
        index = (faiss_index_path)
        vector_store = FAISS.load_local(faiss_index_path, embeddings=EMBEDDINGS, allow_dangerous_deserialization=True)
        vector_store.add_documents(all_docs_with_metadata)
    else:
        index = faiss.IndexFlatL2(768)
        vector_store = FAISS(
            embedding_function=EMBEDDINGS,
            index=index,
            docstore=InMemoryDocstore(),
            index_to_docstore_id={}
        )
        vector_store.add_documents(all_docs_with_metadata)
        vector_store.save_local(faiss_index_path)
    return jsonify({'message': f'{len(saved_files)} file(s) uploaded successfully.'}),200



if __name__ == "__main__":
    app.run(debug=True, port=5000)
