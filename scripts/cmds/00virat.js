const fs = require("fs");
module.exports = {
config:{
	name: "npx2",
version: "1.0.1",
	role: 0,
	author: "RKO BRO", 
	shortDescription: "Fun",
  longdescription: "cricket",
	category: "no prefix",
	guide: "🏏",
countDown: 5, 
},

onChat: async function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
const content = event.body ? event.body : '';
const body = content.toLowerCase();
const axios = require('axios')
const media = (
await axios.get(
'https://i.imgur.com/3XTWS9Q.mp4',
{ responseType: 'stream' }
)
).data;

	if (body.indexOf("king")==0 || body.indexOf("virat")==0) {
		var msg = {
				body: "God of Cricket 💥🏟️",
				attachment: media
			}
			api.sendMessage( msg, threadID, messageID);
api.setMessageReaction("🏏", event.messageID, (err) => {}, true)
		}
	},
	onStart: function({ }) {
}
}