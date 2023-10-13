import { MongoClient, ServerApiVersion } from 'mongodb';
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { HuggingFaceTransformersEmbeddings } from "langchain/embeddings/hf_transformers";
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGODB, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const dbName = 'newdb';
const collectionName = 'data';

async function upload(fpath) {
    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const embeddings = new HuggingFaceTransformersEmbeddings({
            modelName: "Xenova/all-MiniLM-L6-v2",
        });
        if (fpath.endsWith(".pdf")) {
            const loader = new PDFLoader(fpath);
            const docs = await loader.load();
    
            for (const page of docs) {
                const pageContent = page.pageContent;
                const pageEmbedding = await embeddings.embedQuery(pageContent);
    
                const result = {
                    path: fpath,
                    content: pageContent,
                    embedding: pageEmbedding,
                };
    
                const insertResult = await collection.insertOne(result);
                console.log("Document inserted with _id:", insertResult.insertedId);
            }
          } else if (fpath.endsWith(".csv")) {
            const loader = new CSVLoader(fpath);

            const docs = await loader.load();
            console.log(docs);
            const chunkSize = 10; 

            const chunks = [];
            for (let i = 0; i < docs.length; i += chunkSize) {
            const chunk = docs.slice(i, i + chunkSize).map(doc => doc.pageContent);
            chunks.push(chunk);
            }
            for(const chunk of chunks){
                console.log(chunk);
                const joinedText = chunk.join(" "); // Join the elements into a single string
                const pageEmbedding = await embeddings.embedQuery(joinedText);

                // const pageEmbedding = await embeddings.embedQuery(chunk);
    
                const result = {
                    path: fpath,
                    content: chunk,
                    embedding: pageEmbedding,
                };
    
                const insertResult = await collection.insertOne(result);
                console.log("Document inserted with _id:", insertResult.insertedId);
            }
          } else {
            console.log("It's neither a PDF nor a CSV file.");
          }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

upload("drmgr.csv").catch(console.dir);
