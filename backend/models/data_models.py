from pydantic import BaseModel, Field
from typing import Literal, List

class Policy(BaseModel):
    """Based on the policy, determine which types of users have access to this"""

    access: List[Literal["admin", "manager", "intern"]] = Field(
        ...,
        description="List of the user types who are allowed to access the document",
    )


class AnalyzeQuery(BaseModel):
    """Analyze the user query to route it to the most suitable function and what access level is required."""

    route: Literal["vectorstore", "generate_report", "write_email"] = Field(
        ...,
        description="Given a user question decide the most suitable function to route the user question to. Choose one of:\n'vectorstore' : when external data is required to answer the question.\n'generate_report': Question which involves generating report.\n'write_email': If writing an email is required.",
    )
    dept_access: List[Literal["hr", "sales", "legal"]] = Field(
        ...,
        description="List of the department types who are allowed to access the document",
    )
class GenerateReport(BaseModel):
    """Generate a report based on the user query"""

    title: Literal["vectorstore", "generate_report", "write_email"] = Field(
        ...,
        description="Title of the report",
    )
    executive_summary: str = Field(
        ...,
        description="Quick snapshot of overall performance, Key achievements and challenges",
    )
    sales_overview: str = Field(
        ...,
        description="A high-level overview of the sales department, including key metrics and performance indicators.",
    )
    Challenges : str = Field(
        ...,
        description="Challenges faced by the sales department in the past quarter",
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

