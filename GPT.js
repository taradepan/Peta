const OpenAI = require("openai");
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function gpt(input) {
  const prompt = `
  You will be provided with a document delimited by triple quotes. Your task is to fix the spacing between each word using only the provided document and to cite the complete document. Use the following format for to cite relevant document ({"content": …}).
  """'${input}'"""
  `;
  
  const completion = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt,
    max_tokens: 3000,
    temperature: 0,
  });

  const text = completion.choices[0].text;
  console.log(text);
}

module.exports = gpt;