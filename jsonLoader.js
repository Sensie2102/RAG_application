
//Embbed the data
//Store the embeddings
//make retriever
import fs from 'fs';
import path from 'path';
import { BaseDocumentLoader} from "langchain/document_loaders/base";

export class CustomJSONLoader extends BaseDocumentLoader {
  constructor(filePath) {
    super();
    this.filePath = filePath
  }
  
  async load() {
    return new Promise((resolve, reject) => {
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.jsonData = null;
      try {
        this.jsonData = JSON.parse(data);
        const documents = [{
          pageContent: `${this.jsonData.action}`,
          metadata: { source: this.filePath } 
        }];

        resolve(documents);
      } catch (parseErr) {
        reject(`Error processing JSON data: ${parseErr.message}`);
      }
    });
  }
}


const fp = path.resolve("data/json_file_4.json")
const loader = new CustomJSONLoader(fp)

loader.load()
  .then(docs =>{
    console.log("loaded docs",docs)
  })
  .catch(error =>{
    console.error("error loading docs",error)
  })
