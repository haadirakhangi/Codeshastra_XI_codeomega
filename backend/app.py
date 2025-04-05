from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.output_parsers import StrOutputParser
from typing import Literal, List
from typing_extensions import TypedDict
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder
from core.ingest import DataLoader

load_dotenv()
RETRIEVER = DataLoader.load_pdf(
    pdf_path=["data/sample.pdf"], emdeddings=GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
)
EMBEDDINGS = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
RERANKER_MODEL = HuggingFaceCrossEncoder(model_name="BAAI/bge-reranker-base")
compressor = CrossEncoderReranker(model=RERANKER_MODEL, top_n=5)
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor, base_retriever=RETRIEVER
)

class RouteQuery(BaseModel):
    """Route a user query to the most suitable function"""

    datasource: Literal["vectorstore", "answer_directly"] = Field(
        ...,
        description="Given a user question decide if the question can be answered directly or requires an external data source. Choose between vectorstore or answer_directly",
    )

class GradeDocuments(BaseModel):
    """Binary score for relevance check on retrieved documents."""

    binary_score: str = Field(
        description="Documents are relevant to the question, 'yes' or 'no'"
    )

class GradeHallucinations(BaseModel):
    """Binary score for hallucination present in generation answer."""

    binary_score: str = Field(
        description="Answer is grounded in the facts, 'yes' or 'no'"
    )

class GradeAnswer(BaseModel):
    """Binary score to assess answer addresses question."""

    binary_score: str = Field(
        description="Answer addresses the question, 'yes' or 'no'"
    )



LLM = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

# ROUTER
structured_llm_router = LLM.with_structured_output(RouteQuery)
router_system_prompt = """You are an expert at routing a user's question. Understand the user query and decide if it requires an external data source or can be answered directly. 
Accordingly, route the user question to vectorstore or answer_directly.
The vectorstore contains information about user's private data. 
Use the vectorstore for questions on these topics. Otherwise, answer-directly."""
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

class GraphState(TypedDict):
    """
    Represents the state of our graph.

    Attributes:
        question: question
        generation: LLM generation
        documents: list of documents
    """

    question: str
    generation: str
    documents: List[str]

