from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
load_dotenv()

EMBEDDINGS = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
