// const fs = require('fs');
// const path = require('path');
// const { YoutubeTranscript } = require("youtube-transcript");


// async function fetchTranscript( videoLink ) {
//     let transcript;
//     try{
//         transcript = await YoutubeTranscript.fetchTranscript(videoLink);
//     } catch (error) {
//         console.log(error);
//         return -1;
//     }

//     let text = "";
//     for( line of transcript ) {
//       text += line.text + " ";
//     }
    
//     const newDirectory = "D:\\Programming\\VS_code\\NodeJS\\Gemini_Tryout\\assets";
//     process.chdir(newDirectory);

//     fs.writeFileSync('transcription.txt', text.replace(/\n/g, ''), 'utf8');
// }


// module.exports = { fetchTranscript } ;


const fs = require("fs");
const path = require("path");
const { YoutubeTranscript } = require("youtube-transcript");
const { HttpsProxyAgent } = require("https-proxy-agent");

const proxy = "http://160.223.163.31:8080"; // Replace with your proxy server
const agent = new HttpsProxyAgent(proxy);

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function fetchTranscript(videoLink) {
  let transcript;
  try {
    transcript = await YoutubeTranscript.fetchTranscript(videoLink, { agent });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return -1;
  }

  let text = transcript.map((line) => line.text).join(" ");

  const newDirectory = path.join(
    __dirname,
    "..",
    "..",
    "assets",
    "transcription.txt"
  );

  ensureDirectoryExists(newDirectory);
  fs.writeFileSync(newDirectory, text, "utf8");

  console.log("Transcript saved to:", newDirectory);
  return text; 
}

module.exports = { fetchTranscript };
