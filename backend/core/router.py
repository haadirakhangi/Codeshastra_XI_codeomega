from typing import Literal
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI

class RouteQuery(BaseModel):
    """Route a user query to the most suitable function"""

    datasource: Literal["vectorstore", "answer_directly"] = Field(
        ...,
        description="Given a user question decide if the question can be answered directly or requires an external data source. Choose between vectorstore or answer_directly",
    )
