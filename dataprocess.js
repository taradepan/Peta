const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const { createEmbedding } = require('./embed.js');


const content = fs.readFileSync('text.txt', 'utf-8');

// Create a CSV writer
const csvWriter = createObjectCsvWriter({
  path: 'emb.csv',
  header: [
    { id: 'id', title: 'ID' },
    { id: 'content', title: 'Content' },
    { id: 'embedding', title: 'Embedding' },
  ],
});

// Process the text, create embeddings, and write to CSV
async function processAndSaveContentsAndEmbeddings() {
  const records = [];
  const id = generateUniqueId(); 
  const embedding = await createEmbedding(content);
  records.push({ id, content, embedding }); 

  csvWriter.writeRecords(records)
    .then(() => console.log('Contents and Embeddings CSV file has been written successfully'));
}

function generateUniqueId() {
  return Date.now().toString();
}

// processAndSaveContentsAndEmbeddings(text);

module.exports = processAndSaveContentsAndEmbeddings;