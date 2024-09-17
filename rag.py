import params
from pymongo import MongoClient
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
import warnings
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
import json
import os


warnings.filterwarnings("ignore", category=UserWarning, module="langchain")

client = MongoClient(params.mongodb_conn_string)
collection = client[params.db_name][params.collection_name]

vectorStore = MongoDBAtlasVectorSearch(
    collection, HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2"), index_name=params.index_name
)

def retrieve_intent(query:str):
    docs = vectorStore.max_marginal_relevance_search(query, k=1)
    for doc in docs:
        action = doc.page_content
        file_path = doc.metadata['source']
        with open(file_path,'r') as file:
            data = json.loads(file.read())
            intent = data['intent']
    return action,intent

directory = 'test'

for filename in os.listdir(directory):
    file_path = os.path.join(directory, filename)
    try:
            # Open and read the JSON file
            with open(file_path, 'r') as file:
                data = json.load(file)
                
            action,intent = retrieve_intent(data['Task Title']) 
            data['Predicted Action'] = action
            data['Predicted Intent'] = intent   
            print(json.dumps(data, indent=4))
            with open(file_path,'w') as file:
                file.write(json.dumps(data,indent=4))
    except json.JSONDecodeError as e:
        print(f'Error decoding JSON in file {filename}: {e}')
    except Exception as e:
        print(f'Error processing file {filename}: {e}')

   
