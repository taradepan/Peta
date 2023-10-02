const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const uri = process.env.MONGODB;
const gpt = require('./GPT.js');

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    }
});
async function getEmbedding(query) {
    const url = 'https://api.openai.com/v1/embeddings';
    const openai_key = process.env.OPENAI_API_KEY; 
    let response = await axios.post(url, {
        input: query,
        model: "text-embedding-ada-002"
    }, {
        headers: {
            'Authorization': `Bearer ${openai_key}`,
            'Content-Type': 'application/json'
        }
    });
    
    if(response.status === 200) {
        return response.data.data[0].embedding;
    } else {
        throw new Error(`Failed to get embedding. Status code: ${response.status}`);
    }
}


async function findSimilarDocuments(embedding) {
    
    try {
        await client.connect();
        
        const db = client.db('Peta'); 
        const collection = db.collection('vec');
        

        const documents = await collection.aggregate([
            {
              "$search": {
                "index": "VecIndex",
                "knnBeta": {
                  "vector": embedding,
                  "path": "Embedding",
                  "k": 1
                }
              }
            },
            {
              "$project": {
                "_id": 0,
                "ID": 1,
                "Content": 1
              }
            }
          ]).toArray();
        
        return documents;
    } finally {
        await client.close();
    }
}

async function search(query) {
    
    try {
        const embedding = await getEmbedding(query);
        console.log(embedding);
        const documents = await findSimilarDocuments(embedding);
        const output = await gpt(documents[0].Content);
        
        console.log(output);
    } catch(err) {
        console.error(err);
    }
}

search("vector");
module.exports = search;