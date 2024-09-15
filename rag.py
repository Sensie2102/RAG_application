import params
from pymongo import MongoClient
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
import warnings
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_huggingface import HuggingFaceEndpoint
import json

warnings.filterwarnings("ignore", category=UserWarning, module="langchain")

client = MongoClient(params.mongodb_conn_string)
collection = client[params.db_name][params.collection_name]

vectorStore = MongoDBAtlasVectorSearch(
    collection, HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2"), index_name=params.index_name
)

def retrieve_intent(query:str):
    docs = vectorStore.max_marginal_relevance_search(query, k=1)
    for doc in docs:
        file_path = doc.metadata['source']
        with open(file_path,'r') as file:
            data = json.loads(file.read())
            print(data['intent'])
        
