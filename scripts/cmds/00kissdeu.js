const fs = require("fs");
module.exports = {
config:{
name: "kissdeu",
version: "1.0.1",
role: 0,
author: "rko", 
shortDescription: "Fun",
longdescription: "noprefix",
category: "no prefix",
guide: "🥰",
countDown: 5, 
},

onChat: async function({ api, event, client, __GLOBAL }) {
var { threadID, messageID } = event;
const content = event.body ? event.body : '';
const body = content.toLowerCase();
const axios = require('axios')
const media = (
await axios.get(
'https://i.imgur.com/0q4quqZ.mp4',
{ responseType: 'stream' }
)
).data;

if (body.indexOf("kiss deu ")==0 || body.indexOf("kiss deu na")==0 || body.indexOf("kiss deu")==0 || body.indexOf("need kiss")==0 || body.indexOf("kiss chaiyo")==0) {
var msg = {
body: "𝗟𝗮𝘂 𝗯𝗮𝗯𝗲 𝗰𝗵𝘂𝗽𝗽𝗮🥵🔥💋💋",
attachment: media
}
api.sendMessage( msg, threadID, messageID);
api.setMessageReaction("💋", event.messageID, (err) => {}, true)
}
},
onStart: function({}) {
}
  }
