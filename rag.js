import { CustomJSONLoader } from "./jsonLoader.js";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";

//Data Loading
const loader = new DirectoryLoader(
    "data",
    {
      ".json": (path) => new CustomJSONLoader(path),
    }
  );

  const docs = await loader.load();
  console.log({ docs });

