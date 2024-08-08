const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const cacheFolder = path.join(__dirname, 'cache');

if (!fs.existsSync(cacheFolder)) {
  fs.mkdirSync(cacheFolder);
}

module.exports = {
  config: {
    name: "vtg",
    version: "1.0",
    author: "Vex_Kshitiz",
    shortDescription: "Convert a video to GIF",
    longDescription: "Convert a video into a GIF .",
    category: "video",
    guide: {
      en: "{p}vtg"
    }
  },
  onStart: async function ({ message, event, api }) {
    try {
      if (event.type !== "message_reply") {
        return message.reply("❌ || Reply to a video to convert it into a GIF.");
      }

      const attachment = event.messageReply.attachments;
      if (!attachment || attachment.length !== 1 || attachment[0].type !== "video") {
        return message.reply("❌ || Please reply to a single video.");
      }

      const videoUrl = attachment[0].url;

      const userVideoPath = path.join(cacheFolder, `video_${Date.now()}.mp4`);
      const gifPath = path.join(cacheFolder, `converted_${Date.now()}.gif`);

     
      const responseVideo = await axios({
        url: videoUrl,
        method: 'GET',
        responseType: 'stream'
      });
      const writerVideo = fs.createWriteStream(userVideoPath);
      responseVideo.data.pipe(writerVideo);

      await new Promise((resolve, reject) => {
        writerVideo.on('finish', resolve);
        writerVideo.on('error', reject);
      });

  
      const ffmpegCommand = [
        '-i', userVideoPath,
        '-vf', 'fps=10,scale=320:-1:flags=lanczos',
        '-c:v', 'gif',
        gifPath
      ];

      exec(`${ffmpeg} ${ffmpegCommand.join(' ')}`, async (error, stdout, stderr) => {
        if (error) {
          console.error("FFmpeg error:", error);
          message.reply("❌ || An error occurred during conversion.");
          return;
        }
        console.log("FFmpeg output:", stdout);
        console.error("FFmpeg stderr:", stderr);

        message.reply({
          attachment: fs.createReadStream(gifPath)
        }).then(() => {
         
          fs.unlinkSync(userVideoPath);
          fs.unlinkSync(gifPath);
        }).catch((sendError) => {
          console.error("Error sending GIF:", sendError);
          message.reply("❌ || An error occurred while sending the GIF.");
        });
      });

    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ || An error occurred.");
    }
  }
};