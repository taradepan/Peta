import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import { HuggingFaceTransformersEmbeddings } from "langchain/embeddings/hf_transformers";

dotenv.config();
const uri = process.env.MONGODB;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const embedding = new HuggingFaceTransformersEmbeddings({
  modelName: "Xenova/all-MiniLM-L6-v2",
});

async function findSimilarDocuments(embeddings) {
  try {
    await client.connect();

    const db = client.db('newdb');
    const collection = db.collection('data');

    const documents = await collection.aggregate([
      {
        "$search": {
          "index": "newIdx",
          "knnBeta": {
            "vector": embeddings,
            "path": "embedding",
            "k": 1
          }
        }
      },
      {
        "$project": {
          "_id": 0,
          "path": 1,
          "content": 1,
        }
      }
    ]).toArray();
    const docs = documents.map((doc) => {
      return {
        path: doc.path,
        content: doc.content,
      };
    });
    return docs;
  } finally {
    await client.close();
  }
}

async function search(query) {
  try {
    const embeddings = await embedding.embedQuery(query);
    const documents = await findSimilarDocuments(embeddings);
    return documents;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// search("google").then((res) => {
//   console.log(res[0]);
// });

export default search;
