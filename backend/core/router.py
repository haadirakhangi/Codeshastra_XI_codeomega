from typing import Literal
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI

# Data model
class RouteQuery(BaseModel):
    """Route a user query to the most suitable function"""

    datasource: Literal["vectorstore", "answer_directly"] = Field(
        ...,
        description="Given a user question decide if the question can be answered directly or requires an external data source. Choose between vectorstore or answer_directly",
    )

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
structured_llm_router = llm.with_structured_output(RouteQuery)

system = """You are an expert at routing a user's question. Understand the user query and decide if it requires an external data source or can be answered directly. 
Accordingly, route the user question to vectorstore or answer_directly.
The vectorstore contains information about user's private data. 
Use the vectorstore for questions on these topics. Otherwise, answer-directly."""
route_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system),
        ("human", "{question}"),
    ]
)

question_router = route_prompt | structured_llm_router
print(
    question_router.invoke(
        {"question": "What are llms?"}
    )
)
print(question_router.invoke({"question": "What are the 2023 compliance guidelines"}))