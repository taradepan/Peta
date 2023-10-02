const processPDFTextAndWriteToFile = require('./parse.js');
const processAndSaveContentsAndEmbeddings = require('./dataprocess.js');
const { createEmbedding } = require('./embed.js');
const connectAndInsertData = require('./upload.js');
const search = require('./search.js');

async function upload(pdfPath) {
    processPDFTextAndWriteToFile(pdfPath).then(() => console.log('PDF file processing complete'));
    await processAndSaveContentsAndEmbeddings();
    connectAndInsertData()
}

// upload('anime.pdf');
search('anime');