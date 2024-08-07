const si = require('systeminformation');
module.exports = {
  config: {
    name: "system",
    version: "1.0",
    author: "𝐀𝐒𝐈𝐅 𝐱𝟔𝟗",
    countDown: 5,
    role: 0,
    shortDescription: "System",
    longDescription: "",
    category: "goatbot",
    guide: "{pn}"
  },

  onStart: function(bytes) {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(bytes, 10) || 0;
    while (n >= 1024 && ++l) n = n / 1024;
    return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)}${units[l]}`;
  },

  onStart: async function ({ api, event }) {
    const { cpu, cpuTemperature, currentLoad, memLayout, diskLayout, mem, osInfo } = si;
    const timeStart = Date.now();
    const axios = require ("axios");
    const request = require ("request");
    const fs = require ("fs-extra");

    try {
      var { manufacturer, brand, speed, physicalCores, cores } = await cpu();
      var { main: mainTemp } = await cpuTemperature();
      var { currentLoad: load } = await currentLoad();
      var diskInfo = await diskLayout();
      var memInfo = await memLayout();
      var { total: totalMem, available: availableMem } = await mem();
      var { platform: OSPlatform, build: OSBuild } = await osInfo();

      var time = process.uptime();
      var hours = Math.floor(time / (60 * 60));
      var minutes = Math.floor((time % (60 * 60)) / 60);
      var seconds = Math.floor(time % 60);
      if (hours < 10) hours = "0" + hours;
      if (minutes < 10) minutes = "0" + minutes;
      if (seconds < 10) seconds = "0" + seconds;

      var ZiaRein = (
        "𝗦𝘆𝘀𝘁𝗲𝗺 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻" +
        "\𝗨 𝗜𝗻𝗳𝗼" +
        "\𝗨 𝗠𝗼𝗱𝗲𝗹: " + manufacturer + brand +
        "\?𝗲𝗱: " + speed + "GHz" +
        "\?𝗲𝘀: " + physicalCores +
        "\?𝗲𝗮𝗱𝘀: " + cores +
        "\?𝗽𝗲𝗿𝗮𝘁𝘂𝗿𝗲: " + mainTemp + "°C" +
        "\?𝗱: " + load.toFixed(1) + "%" +
        "\𝗺𝗼𝗿𝘆 𝗜𝗻𝗳𝗼" +
        "\?𝗲: " + this.byte2mb(memInfo[0].size) +
        "\?𝗲: " + memInfo[0].type +
        "\?𝗮𝗹: " + this.byte2mb(totalMem) +
        "\?𝗶𝗹𝗮𝗯𝗹𝗲: " + this.byte2mb(availableMem) +
        "\𝘀𝗸 𝗜𝗻𝗳𝗼" +
        "\?𝗲: " + diskInfo[0].name +
        "\?𝗲: " + this.byte2mb(diskInfo[0].size) +
        "\?𝗽𝗲𝗿𝗮𝘁𝘂𝗿𝗲: " + diskInfo[0].type +
        "\?𝘀𝗲: " + diskInfo[0].temperature + "°C" +
        "\ 𝗜𝗻𝗳𝗼" +
        "\?𝘁𝗳𝗼𝗿𝗺: " + OSPlatform +
        "\?𝗹𝗱: " + OSBuild +
        "\?𝗶𝗺𝗲: " + hours + ":" + minutes + ":" + seconds +
        "\?𝗴: " + (Date.now() - timeStart) + "ms");

      const link = [
        "https://i.postimg.cc/DfgD88yd/FB-IMG-17077249517830670.jpg",
"https://i.postimg.cc/TPd527kc/FB-IMG-17077250166874919.jpg",
"https://i.postimg.cc/j5CWPWYw/FB-IMG-17077250851616438.jpg",
"https://i.postimg.cc/6QM28rgx/FB-IMG-17077250915086783.jpg",
"https://i.postimg.cc/DfgD88yd/FB-IMG-17077249517830670.jpg",
"https://i.postimg.cc/TPd527kc/FB-IMG-17077250166874919.jpg",
"https://i.postimg.cc/rpZ3FpGF/FB-IMG-17077249461439656.jpg",
"https://i.postimg.cc/bN17HpP3/FB-IMG-17077248801860776.jpg",
"https://i.postimg.cc/rwJ73jK4/FB-IMG-17077248694524562.jpg",
      ];

      var callback = () => api.sendMessage({ body: ZiaRein, attachment: fs.createReadStream(__dirname + "/cache/5.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/5.jpg"), event.messageID);

      request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/5.jpg")).on("close", () => callback());
    }
    catch (e) {
      console.log(e);
    }
  }
};