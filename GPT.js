import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import dotenv from 'dotenv';

dotenv.config(); 

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OpenAI API key not found");
}


async function chat(document, question){
    const model = new OpenAI({ temperature: 0 });
    const prompt = PromptTemplate.fromTemplate(
        `
        your task is to answer the quesions based on given document, if the ques is not relevent to the content provided in the doc respond with "Not Found!!!".
        Doc:"""'{document}'""".
        Ques: {question}
        
        `
    );
        
    const chain = new LLMChain({ llm: model, prompt });

    const res = await chain.call({
        document: document,
        question: question,
      });
    return res.text;
}
export default chat;