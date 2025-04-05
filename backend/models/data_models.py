from pydantic import BaseModel, Field
from typing import Literal, List

class Policy(BaseModel):
    """Based on the policy, determine which types of users have access to this"""

    access: Literal["admin", "manager", "intern"] = Field(
        ...,
        description="One of the user types who are allowed to access the document",
    )


class RouteQuery(BaseModel):
    """Route a user query to the most suitable function"""

    route: Literal["vectorstore", "generate_report", "write_email"] = Field(
        ...,
        description="Given a user question decide the most suitable function to route the user question to. Choose one of:\n'vectorstore' : when external data is required to answer the question.\n'generate_report': Question which involves generating report.\n'write_email': If writing an email is required.",
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

