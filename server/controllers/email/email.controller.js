import nodemailer from "nodemailer";
import { EMAIL_LOGIN, EMAIL_PASSWORD, ERROR, SUCCESS } from "../../constants/index.js";

export class EmailSendler {
  constructor() {
    this.instance = null;
  }

  async create() {
    this.instance = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_LOGIN,
        pass: EMAIL_PASSWORD,
      },
    })
  }

  async go(data) {
    const { email, dataForMessage } = data;
    let result = await this.instance.sendMail({
      from: `"Tester" <${EMAIL_LOGIN}>`,
      to: `${email}`,
      subject: 'Заявка',
      text: 'Это сообщение о заявке',
      html: `
        <p>
          Данные о заявке:\n
            email: ${dataForMessage.email},\n
            имя: ${dataForMessage.name},\n
            телефон: ${dataForMessage.phone}\n
        </p>
      `,
      attachments: [],
    });
    if (result) {
      return {status: SUCCESS, message: "Send Ok!"}
    } else {
      return {status: ERROR, message: "Cant Send :("}
    }
  }

  async send(data) {
    if (this.instance) {
      return await this.go(data);
    } else {
      await this.create();
      return await this.go(data);
    }
  }
}