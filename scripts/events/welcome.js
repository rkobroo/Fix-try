const { getTime, drive } = global.utils;
const moment = require('moment-timezone');

if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

module.exports = {
config: {
name: "welcome",
version: "1.7",
author: "NTKhang", // modified by vex kshitiz
category: "events"
},

langs: {
vi: {
session1: "sáng",
session2: "trưa",
session3: "chiều",
session4: "tối",
welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
multiple1: "bạn",
multiple2: "các bạn",
defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
},
en: {
session1: "morning",
session2: "noon",
session3: "afternoon",
session4: "evening",
welcomeMessage: "𝗖𝗛𝗘𝗡𝗚𝗔𝗥𝗜 𝗕𝗢𝗧👽 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 𝗦𝗨𝗦𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬 !\n𝗕𝗢𝗧 𝗣𝗥𝗘𝗙𝗜𝗫: %1\n𝗧𝗼 𝘃𝗶𝗲𝘄 𝗹𝗶𝘀𝘁 𝗼𝗳 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀, 𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿: %1help",
multiple1: "𝘆𝗼𝘂",
multiple2: "𝘆𝗼𝘂 𝗴𝘂𝘆𝘀",
defaultWelcomeMessage: `╔════•| ✿ |•════╗\n 🌿𝗛𝗲𝗹𝗹𝗼 🌿Friend 🌿\n╚════•| ✿ |•════╝\n\n ✨🆆🅴🅻🅻 🅲🅾🅼🅴✨\n\n ❥𝐍𝐄𝐖~\n\n ~🇲‌🇪‌🇲‌🇧‌🇪‌🇷‌~\n\n {userName}.\n {multiple}༄ 𝗜𝗻 𝗢𝘂𝗿 𝗚𝗿𝗼𝘂𝗽✺࿐\n\n {boxName}\n🥰🖤🌸𝗛𝗮𝗽𝗽𝘆🍀𝗘𝗻𝗷𝗼𝘆🍀—🌸🥀\n\n 🥀𝗺𝗲𝗹𝗲𝗿𝗮 𝗯𝗮𝘀𝗻𝘂🥀\n\n༄✺𝗮𝗻𝗶 𝗧𝗺𝗶 𝘆𝗼 𝗚𝗿𝗼𝘂𝗽 𝗞𝗼 {memberCount} 𝗠𝗲𝗺𝗯𝗲𝗿 𝗛𝗮𝘂 𝗘𝗻𝗷𝗼𝘆 🥳 # ]࿐\n\n ╔╦══• •✠•❀•✠ •  ♻️   •══╦╗\n 💝 ═╩╝\n𝗗𝗮𝘁𝗲: {date} || {time}\n𝗔𝗱𝗱𝗲𝗱 𝗯𝘆: {addedBy}\n𝗛𝗮𝘃𝗲 𝗮 𝗻𝗶𝗰𝗲 {session} 😊`
}
},

onStart: async ({ threadsData, message, event, api, getLang }) => {
if (event.logMessageType == "log:subscribe") {
const handleWelcome = async () => {
const hours = moment().tz('Asia/Kathmandu').hour(); // Use Nepali time zone
const { threadID } = event;
const { nickNameBot } = global.GoatBot.config;
const prefix = global.utils.getPrefix(threadID);
const dataAddedParticipants = event.logMessageData.addedParticipants;
const authorID = event.logMessageData.author;

let authorName = "unknown";

try {
const authorInfo = await api.getUserInfo(authorID);
if (authorInfo[authorID]) {
authorName = authorInfo[authorID].name;
} else {
const logMessageBody = event.logMessageBody;
const matches = logMessageBody.match(/(.*) added/);
if (matches && matches[1]) {
authorName = matches[1];
}
}

console.log(`Author Info: ${JSON.stringify(authorInfo)}`);
console.log(`Author Name: ${authorName}`);

if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
if (nickNameBot)
api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
return message.send(getLang("welcomeMessage", prefix));
}

if (!global.temp.welcomeEvent[threadID])
global.temp.welcomeEvent[threadID] = {
joinTimeout: null,
dataAddedParticipants: []
};

global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
const threadData = await threadsData.get(threadID);
if (threadData.settings.sendWelcomeMessage == false)
return;
const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
const dataBanned = threadData.data.banned_ban || [];
const threadName = threadData.threadName;
const userName = [],
mentions = [];
let multiple = false;

if (dataAddedParticipants.length > 1)
multiple = true;

for (const user of dataAddedParticipants) {
if (dataBanned.some((item) => item.id == user.userFbId))
continue;
userName.push(user.fullName);
mentions.push({
tag: user.fullName,
id: user.userFbId
});
}

if (userName.length == 0) return;

const { members } = await threadsData.get(threadID);
const memberCount = members ? members.length : dataAddedParticipants.length;

let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;

const form = {
mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
};

welcomeMessage = welcomeMessage
.replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
.replace(/\{boxName\}|\{threadName\}/g, threadName)
.replace(
/\{multiple\}/g,
multiple ? getLang("multiple2") : getLang("multiple1")
)
.replace(
/\{session\}/g,
hours < 12
? getLang("session1") // Morning
: hours < 16
? getLang("session2") // Noon
: hours < 19
? getLang("session3") // Afternoon
: getLang("session4") // Evening
)
.replace(
/\{memberCount\}/g,
memberCount
)
.replace(
/\{date\}/g,
moment().tz('Asia/Kathmandu').format('DD/MM/YYYY')
)
.replace(
/\{time\}/g,
moment().tz('Asia/Kathmandu').format('HH:mm:ss')
)
.replace(
/\{addedBy\}/g,
authorName
);

form.body = welcomeMessage;

if (threadData.data.welcomeAttachment) {
const files = threadData.data.welcomeAttachment;
const attachments = files.reduce((acc, file) => {
acc.push(drive.getFile(file, "stream"));
return acc;
}, []);
form.attachment = (await Promise.allSettled(attachments))
.filter(({ status }) => status == "fulfilled")
.map(({ value }) => value);
}

message.send(form);
delete global.temp.welcomeEvent[threadID];
}, 1500);
} catch (error) {
console.error("Error fetching author info:", error);
}
};

return handleWelcome();
}
}
};