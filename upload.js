const { createObjectCsvWriter } = require('csv-writer');
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
const dotenv = require('dotenv');
const csv = require('csv-parser'); // Import the csv-parser module
dotenv.config();
const uri = process.env.MONGODB;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
        // Connect the client to the server
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('vec');

        // Specify the path to your CSV file
        const csvFilePath = 'emb.csv';

        // Read the CSV file and insert records into MongoDB
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', async (row) => {
                // Extract data from the CSV row
                const { ID, Content, Embedding } = row;

                // Convert the embedding string to an array of numbers
                const embeddingArray = Embedding.split(',').map(Number);

                // Create a new record and insert it into the collection
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

// Call the function to connect to MongoDB and insert data
// connectAndInsertData().catch(console.dir);
module.exports = connectAndInsertData;