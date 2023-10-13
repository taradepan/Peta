// import upload from './mongo.js';
import search from './search.js';
import chat from './GPT.js';

// upload("drmgr.csv").catch(console.dir);

const query = "harsenth email";

const document = search(query);
console.log(document.then((res) => {
    console.log(res[0].path);
    chat(res[0].content, query).then((res) => {
        console.log(res);
    })
}));