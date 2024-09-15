from langchain_community.document_loaders import JSONLoader
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from pymongo import MongoClient
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
import params
import os

directory = 'data'

documents = []

#Loading data
for filename in os.listdir(directory):
    file_path = os.path.join(directory, filename)
    if os.path.isfile(file_path):  
        loader = JSONLoader(
            file_path=file_path,
            jq_schema='.action'
        )
        data = loader.load()
        documents.append(data[0])
        
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

client = MongoClient(params.mongodb_conn_string)
collection = client[params.db_name][params.collection_name]

collection.delete_many({})

#store in MongoDB vector store
docsearch = MongoDBAtlasVectorSearch.from_documents(
    documents,embeddings,collection = collection,index_name = params.index_name
)


