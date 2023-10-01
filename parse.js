const fs = require('fs');
const pdf = require('pdf-parse');
const natural = require('natural');
const dotenv = require('dotenv');
dotenv.config();

const tokenizer = new natural.WordTokenizer();

// Function to read text from a PDF file
async function readTextFromPDF(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    throw error;
  }
}

function tokenizeText(text) {
  const tokens = tokenizer.tokenize(text);
  return tokens.join(' '); 
}

// Main function to process PDF text and write to a text file
async function processPDFTextAndWriteToFile(pdfPath) {
  try {
    const pdfText = await readTextFromPDF(pdfPath);
    const formattedText = tokenizeText(pdfText);

    console.log('Formatted Text:', formattedText);

    fs.writeFileSync('text.txt', formattedText, 'utf-8');
    console.log(`Formatted text has been written `);
  } catch (error) {
    console.error('Error reading PDF:', error);
  }
}

// const pdfPath = 'vector.pdf';
// const outputFilePath = 'output.txt';
// processPDFTextAndWriteToFile(pdfPath);

module.exports = processPDFTextAndWriteToFile;
