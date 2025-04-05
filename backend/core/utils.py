from langchain.schema import Document
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

class MultiAgentSystem:

    @staticmethod
    def retrieve(state, compression_retriever):
        print("---RETRIEVE---")
        question = state["question"]
        documents = compression_retriever.invoke(question)
        return {"documents": documents, "question": question}

    @staticmethod
    def generate(state, rag_chain):
        print("---GENERATE---")
        question = state["question"]
        documents = state["documents"]
        generation = rag_chain.invoke({"context": documents, "question": question})
        return {"documents": documents, "question": question, "generation": generation}

    @staticmethod
    def grade_documents(state, retrieval_grader):
        print("---CHECK DOCUMENT RELEVANCE TO QUESTION---")
        question = state["question"]
        documents = state["documents"]

        filtered_docs = []
        for d in documents:
            score = retrieval_grader.invoke({"question": question, "document": d.page_content})
            grade = score.binary_score
            if grade == "yes":
                print("---GRADE: DOCUMENT RELEVANT---")
                filtered_docs.append(d)
            else:
                print("---GRADE: DOCUMENT NOT RELEVANT---")
        return {"documents": filtered_docs, "question": question}

    @staticmethod
    def transform_query(state, question_rewriter):
        print("---TRANSFORM QUERY---")
        question = state["question"]
        documents = state["documents"]
        better_question = question_rewriter.invoke({"question": question})
        return {"documents": documents, "question": better_question}

    @staticmethod
    def web_search(state, web_search_tool):
        print("---WEB SEARCH---")
        question = state["question"]
        docs = web_search_tool.invoke({"query": question})
        web_results = "\n".join([d["content"] for d in docs])
        web_results = Document(page_content=web_results)
        return {"documents": web_results, "question": question}

    @staticmethod
    def answer_directly(state):
        print("---ANSWER DIRECTLY---")
        question = state["question"]
        llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
        prompt = ChatPromptTemplate.from_messages([
            ("system", 'Helpful AI agent'),
            ("human", "{question}"),
        ])
        chain = prompt | llm | StrOutputParser()
        response = chain.invoke({"question": question})
        return {"generation": response, "question": question}

    @staticmethod
    def route_question(state, question_router):
        print("---ROUTE QUESTION---")
        question = state["question"]
        source = question_router.invoke({"question": question})
        if source.datasource == "answer_directly":
            print("---ROUTE QUESTION TO ANSWER DIRECTLY---")
            return "answer_directly"
        elif source.datasource == "vectorstore":
            print("---ROUTE QUESTION TO RAG---")
            return "vectorstore"

    @staticmethod
    def decide_to_generate(state):
        print("---ASSESS GRADED DOCUMENTS---")
        filtered_documents = state["documents"]

        if not filtered_documents:
            print("---DECISION: ALL DOCUMENTS ARE NOT RELEVANT TO QUESTION, TRANSFORM QUERY---")
            return "transform_query"
        else:
            print("---DECISION: GENERATE---")
            return "generate"

    @staticmethod
    def grade_generation_v_documents_and_question(state, hallucination_grader, answer_grader):
        print("---CHECK HALLUCINATIONS---")
        question = state["question"]
        documents = state["documents"]
        generation = state["generation"]

        score = hallucination_grader.invoke({"documents": documents, "generation": generation})
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
