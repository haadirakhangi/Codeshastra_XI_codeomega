from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
import faiss
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.vectorstores import FAISS
from dotenv import load_dotenv
import os
load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")
os.environ["TAVILY_API_KEY"] = os.getenv("TAVILY_API_KEY")

class DataLoader:
    @staticmethod
    def load_pdf(pdf_path : str, emdeddings : GoogleGenerativeAIEmbeddings):
        """Load PDF files and create a retriever"""
        docs = [PyPDFLoader(pdf).load() for pdf in pdf_path]
        docs_list = [item for sublist in docs for item in sublist]

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500, chunk_overlap=100, length_function=len
        )
        doc_splits = text_splitter.split_documents(docs_list)

        index = faiss.IndexFlatL2(len(emdeddings.embed_query("hello world")))

        vector_store = FAISS(
            embedding_function=emdeddings,
            index=index,
            docstore=InMemoryDocstore(),
            index_to_docstore_id={},
        )

        vector_store.add_documents(doc_splits)
        retriever = vector_store.as_retriever()
        return retriever