from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders.csv_loader import CSVLoader
import random
from dotenv import load_dotenv
import os
load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")
os.environ["TAVILY_API_KEY"] = os.getenv("TAVILY_API_KEY")

class DataLoader:
    @staticmethod
    def load_pdf(pdf_path : str):
        """Load PDF files and create a retriever"""
        docs = PyPDFLoader(pdf_path).load()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500, chunk_overlap=100, length_function=len
        )
        doc_splits = text_splitter.split_documents(docs)
        num_indexes = 10
        random_indexes = random.sample(range(len(doc_splits)), num_indexes)
        random_docs= [doc_splits[i] for i in random_indexes]
        context = "\n\n".join(doc.page_content for doc in random_docs)
        print("Context created from random documents",context)
        return context, docs
    
    @staticmethod
    def load_csv(csv_path : str):
        """Load PDF files and create a retriever"""
        docs = CSVLoader(csv_path).load()

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500, chunk_overlap=100, length_function=len
        )
        doc_splits = text_splitter.split_documents(docs)
        num_indexes = 10
        random_indexes = random.sample(range(len(doc_splits)), num_indexes)
        random_docs= [doc_splits[i] for i in random_indexes]
        context = "\n\n".join(doc.page_content for doc in random_docs)
        print("Context created from random documents",context)
        return context, docs