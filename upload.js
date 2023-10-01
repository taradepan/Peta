const { createObjectCsvWriter } = require('csv-writer');
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
const dotenv = require('dotenv');
const csv = require('csv-parser'); 
dotenv.config();
const uri = process.env.MONGODB;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const dbName = "Peta";

async function connectAndInsertData() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('vec');

        const csvFilePath = 'emb.csv';

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', async (row) => {
                const { ID, Content, Embedding } = row;

                const embeddingArray = Embedding.split(',').map(Number);

                const newData = {
                    ID,
                    Content,
                    Embedding: embeddingArray,
                };

                try {
                    const result = await collection.insertOne(newData);
                    console.log(`Record with ID ${ID} inserted successfully`);
                } catch (error) {
                    console.error(`Error inserting record with ID ${ID}:`, error);
                }
            })
            .on('end', () => {
                console.log('CSV file processing complete');
                client.close();
            });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// connectAndInsertData().catch(console.dir);
module.exports = connectAndInsertData;