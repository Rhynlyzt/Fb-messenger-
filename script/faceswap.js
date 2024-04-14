
'use strict'

module.exports.config = {

  name: "faceswap",

  prefix: false,

  accessableby: 0,

  description: "Generate image",

  usage: "[reply to a 2 image]",

  react: "⏳",
 
  author: "Deku"

}

module.exports.start = async function({ event, text, react, reply }) {

  try {

    const { Prodia } = require("prodia.js");

    const prodia = new Prodia("PRODIA APIKEY");

    const axios = require("axios"), fs = require('fs');

    let url, url1;

    if (event.type == "message_reply") {

      if (event.messageReply.attachments.length < 0) return reply("No image found.");

      if (event.messageReply.attachments[0].type !== "photo") return reply("Only image can be converted.");

      url = event.messageReply.attachments[0].url;

      if (event.messageReply.attachments.lengt > 2) return reply("Only 2 image can be converted.");

      url = event.messageReply.attachments[0].url

      url1 = event.messageReply.attachments[1].url

      react(this.config.react);

      reply("Processing...");

      const generate = await prodia.faceSwap({

        sourceUrl: encodeURI(url),

        targetUrl: encodeURI(url1),

      });

      while (generate.status !== "succeeded" && generate.status !== "failed") {

        new Promise((resolve) => setTimeout(resolve, 250));

        const job = await prodia.getJob(generate.job);

        if (job.status === "succeeded") {

          let img = (await axios.get(job.imageUrl, { responseType: "arraybuffer" })).data;

          let path = __dirname + '/cache/gen.png';

          fs.writeFileSync(path, Buffer.from(img, "utf-8"))

          return reply({ attachment: fs.createReadStream(path) });

        }

      }

    } else {

      return reply("Please reply to an image.");

    }

  } catch (e) {

    return reply(e.message)

  }

}