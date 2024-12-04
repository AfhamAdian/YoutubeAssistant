const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
dotenv.config();


// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);


async function transcriptionReader(){
    const newDirectory = path.join(__dirname, '..', '..', 'assets', 'transcription.txt');
    // console.log(newDirectory);
    const text = fs.readFileSync( newDirectory, 'utf8');

    return text;
}

async function initiateBot(){
  const userHistory = await transcriptionReader();

  // The Gemini 1.5 models are versatile and work with multi-turn conversations (like chat)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "You are a friendly youtube video transcriptor assistant.Here is the transcript of an youtube video "+  userHistory + " Now Based only on the transcript( you will answer only on this transcript ), can you answer the following questions?." }],
      },
      {
        role: "model",
        parts: [{ text: "Sure! What are your questions?" }],
      }
    ],
    generationConfig: {
      maxOutputTokens: 350,
    },
  });

  return chat;
}

async function sendMessageReturnsResponseText( chatObject, msg ) {
  const result = await chatObject.sendMessage(msg);
  const response = await result.response;
  const text = response.text();

  // console.log(text);
  return text;
}



module.exports = { initiateBot, sendMessageReturnsResponseText };