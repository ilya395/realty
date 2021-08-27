import https from "https";
import axios from "axios";
import { ERROR, SUCCESS } from "../../constants/index.js";

class TelegramController {
  constructor(object) {
    this.botToken = object.botToken;
    this.chatId = object.chatId;
  }
  _getUrl() {
    return `https://api.telegram.org/bot${this.botToken}/sendMessage`
  }
  async send(obj) {
    try {
      console.log("send start!")
      const { message } = obj;
      // const data = new TextEncoder().encode(
      //   JSON.stringify({
      //     chat_id: this.chatId,
      //     text: message
      //   })
      // )
      const postData = JSON.stringify({
        chat_id: this.chatId,
        text: message
      });
      const options = {
        hostname: this._getUrl(),
        port: process.env.PORT || 7000,
        path: '/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };
      console.log(options)
      const req = await https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
        res.setEncoding('utf8');
        res.on('data', d => {
          process.stdout.write(d)
        })
        res.on('end', () => {
          console.log('No more data in response.');
        });
      })
      req.on('error', error => {
        console.error(error)
      })
      req.write(data)
      req.end()

      return {
        status: SUCCESS,
        message: "Ok!"
      }
    } catch(e) {
      return {
        status: ERROR,
        message: e
      }
    }

  }
  async simpleSend(obj) {
    const { message } = obj;
    return await axios
      .post(this._getUrl(), {
        chat_id: this.chatId,
        text: message
      })
      .then(() => {
        return {
          status: SUCCESS,
          message: "Ok!"
        }
      })
      .catch(() => {
        return {
          status: ERROR,
          message: e
        }
      });
  }
}

export const telegramSandler = new TelegramController({
  botToken: "919656472:AAFtg4HI0cmd_fkpdJbSomlBMeJPCGIL9jM",
  chatId: "-1001352697643"
});