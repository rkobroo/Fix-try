module.exports.config = {
    name: "welcome",
    eventType: ["log:subscribe"],
    version: "1.0.1",
    author: "RKO BRO",
    category: "events",
    longDescription: "Notify bot or group member with random gif/photo/video",
    shortDescription: "welcome",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "pidusage": ""
    }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const path = join(__dirname, "cache", "joinGif");
    if (!existsSync(path)) mkdirSync(path, { recursive: true });

    const path2 = join(__dirname, "cache", "joinGif", "randomgif");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

    return;
}

onStart = async function({ api, event }) {
    const { join } = global.nodemodule["path"];
    const { threadID } = event;
    
    // Await the promise to get the current user ID
    const currentUserID = await api.getCurrentUserID();

    // Check if the bot is one of the added participants
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == currentUserID)) {
        await api.changeNickname(`{ ${global.config.PREFIX} } × ${(!global.config.BOTNAME) ? "bot" : global.config.BOTNAME}`, threadID, currentUserID);
        const fs = require("fs");
        return api.sendMessage("Hello Everyone🙋‍♂️ RKO 𝐁𝐨𝐭 𝐢𝐬 𝐍𝐨𝐰 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝⛓️", event.threadID, () => api.sendMessage({
            body: `🌺🦋🌺 
𝐁𝐨𝐭 Made By RKO BRO ☘️
<------------------------------> 
BOT CONNECTED SUCCESSFULLY !!! 

APPROVAL ALLOW IN THIS GROUP!!!
<------------------------------>

USE HELP TO SEE COMMAND 
\n\nUse ${global.config.PREFIX}help to see commands.\n\nexample :\n${global.config.PREFIX}video7 (video songs)\n${global.config.PREFIX}music (audio songs)\n${global.config.PREFIX}help (command list)\n${global.config.PREFIX}info 
<<<<<------------------------------>>>>>
AND FOR ANY REPORT OR CONTACT BOT DEVELOPER`,
            attachment: fs.createReadStream(join(__dirname, "cache", "joinmp4", "intro.mp4"))
        }, threadID));
    } else {
        try {
            const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);

            const threadData = global.data.threadData.get(parseInt(threadID)) || {};
            const path = join(__dirname, "cache", "joinGif");
            const pathGif = join(path, `${threadID}.gif`);

            const mentions = [];
            const nameArray = [];
            const memLength = [];

            for (const participant of event.logMessageData.addedParticipants) {
                const userName = participant.fullName;
                nameArray.push(userName);
                mentions.push({ tag: userName, id: participant.userFbId });
                memLength.push(participantIDs.length - nameArray.length);
            }
            memLength.sort((a, b) => a - b);

            let msg = threadData.customJoin || "╔════•| ✿ |•════╗\n 🌿𝗛𝗲𝗹𝗹𝗼 🌿Friend 🌿\n╚════•| ✿ |•════╝\n\n ✨🆆🅴🅻🅻 🅲🅾🅼🅴✨\n\n ❥𝐍𝐄𝐖~\n\n ~🇲‌🇪‌🇲‌🇧‌🇪‌🇷‌~\n\n [ {name} ]\n\n༄ In Our 𝗚𝗿𝗼𝘂𝗽✺࿐\n\n{threadName}\n\n 🥰🖤🌸𝗛𝗮𝗽𝗽𝘆🍀𝗘𝗻𝗷𝗼𝘆🍀—🌸🥀\n\n 🥀melera basnu🥀\n\n༄✺ani 𝗧mi yo 𝗚𝗿𝗼𝘂𝗽 𝗞o {soThanhVien} 𝗠𝗲𝗺𝗯𝗲𝗿 𝗛au 𝗘𝗻𝗷𝗼𝘆 🥳 # ]࿐\n\n ╔╦══• •✠•❀•✠ • •══╦╗\n ♥ ═╩╝";
            msg = msg
                .replace(/\{name}/g, nameArray.join(', '))
                .replace(/\{type}/g, (memLength.length > 1) ? 'You' : 'Friend')
                .replace(/\{soThanhVien}/g, memLength.join(', '))
                .replace(/\{threadName}/g, threadName);

            if (!existsSync(path)) mkdirSync(path, { recursive: true });

            const randomPath = readdirSync(join(__dirname, "cache", "joinGif", "randomgif"));

            let formPush;

            if (existsSync(pathGif)) {
                formPush = { body: msg, attachment: createReadStream(pathGif), mentions };
            } else if (randomPath.length !== 0) {
                const pathRandom = join(__dirname, "cache", "joinGif", "randomgif", randomPath[Math.floor(Math.random() * randomPath.length)]);
                formPush = { body: msg, attachment: createReadStream(pathRandom), mentions };
            } else {
                formPush = { body: msg, mentions };
            }

            return api.sendMessage(formPush, threadID);
        } catch (e) {
            console.log(e);
            return;
        }
    }
	}
								     
