import { ADMIN_EMAIL, ERROR, FORM_CALLBACK, SUCCESS } from "../../../constants/index.js";
import { checkEmail } from "../../../validate/checkEmail/checkEmail.js";
import { checkName } from "../../../validate/checkName/checkName.js";
import { checkPhoneNum } from "../../../validate/checkPhone/checkPhone.js";
import { EmailSendler } from "../../email/email.controller.js";
import { telegramSandler } from "../../telegram/telegram.controller.js";

class RequestAjaxController {
  async setData(request, response) {
    if(!request.body) return response.sendStatus(400);
    const { action, phone, email, name } = request.body;
    if (action === FORM_CALLBACK) {
      if (checkName(name) && checkPhoneNum(phone) && checkEmail(email)) {
        const localResponse = {};
        const message = (data) => {
          const { phone, email, name } = data;
          return `
            ----- Заявка ------
            телефон: ${phone},
            email: ${email},
            имя: ${name}
          `;
        }
        const result = await telegramSandler.simpleSend({
          message: message({phone, email, name}),
        });
        const emailSendler = new EmailSendler();
        const emailSend = await emailSendler.send({
          email: ADMIN_EMAIL,
          dataForMessage: {
            phone,
            email,
            name
          }
        });
        if (result && result.status === SUCCESS) {
          localResponse.telegram = {status: SUCCESS, message: "Request to telegram is OK!"};
        } else {
          localResponse.telegram = {status: ERROR, message: "Request to telegram is not OK!"};
        }
        if (emailSend) {
          localResponse.email = {status: SUCCESS, message: "Request to email is OK!"};
        } else {
          localResponse.email = {status: ERROR, message: "Request to email is not OK!"};
        }
        await response.json(localResponse);
      } else {
        await response.json({
          status: ERROR,
          message: "Wrong data!",
          result: {
            phone: checkPhoneNum(phone),
            email: checkEmail(email),
            name: checkName(name)
          }
        });
      }
    } else {
      await response.json({status: ERROR, message: "Wrong action!"});
    }
  }
}

export const requestAjaxController = new RequestAjaxController();