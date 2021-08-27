import { BD_USER, BD_PASSWORD, BD_HOST, BD_PORT, BD_NAME, LIFETIME_SESSION } from '../constants/index.js';
import crypto from 'crypto';

import pge from "pg";
import { userController } from '../controllers/users/users.controller.js';
import { sessionController } from '../controllers/index.js';
const Pool = pge.Pool;
export const pool = new Pool({
  user: BD_USER,
  password: BD_PASSWORD,
  host: BD_HOST,
  port: BD_PORT,
  database: BD_NAME
});

export function hash(text) {
  return crypto
    .createHash('sha1')
    .update(text)
    .digest('base64')
}

export async function loadUser(request, response, next) {
  // if (request.session.user && request.session.user.id) {
  //   const user = await userController.getUser({
  //     id: request.session.user.id
  //   });
  //   if (user.length === 1) {
  //     request.currentUser = user; // зачем?
  //     next();
  //   } else {
  //     response.redirect('/login');
  //   }
  // } else {
  //   response.redirect('/login');
  // }
  if (request.session && request.session.user && request.session.user.sessionId) {
    const session = await sessionController.getSessionThroughtSessionId({
      sessionId: request.session.user.sessionId
    });
    if (session) {
      const nowTimestamp = (new Date).getTime();
      if (+nowTimestamp >= +session.date_creation + +LIFETIME_SESSION) { // время жизни истекло
        const deletedSession = await sessionController.deleteSessionThroughtSessionId({
          sessionId: request.session.user.sessionId
        })
        response.redirect('/login'); // сессия истекла
      } else {
        next();
      }
    } else {
      response.redirect('/login'); // данные по сессии есть, но такую сессию не нашли
    }
  } else {
    response.redirect('/login'); // вообще нет сессии
  }
}

export async function ajaxLoadUser(request, response, next) {
  if (request.session && request.session.user && request.session.user.sessionId) {
    const session = await sessionController.getSessionThroughtSessionId({
      sessionId: request.session.user.sessionId
    });
    if (session) {
      const nowTimestamp = (new Date).getTime();
      if (+nowTimestamp >= +session.date_creation + +LIFETIME_SESSION) { // время жизни истекло
        const deletedSession = await sessionController.deleteSessionThroughtSessionId({
          sessionId: request.session.user.sessionId
        })
        response.redirect('/login'); // сессия истекла
      } else {
        next();
      }
    } else {
      response.redirect('/login'); // данные по сессии есть, но такую сессию не нашли
    }
  } else {
    response.redirect('/login'); // вообще нет сессии
  }
}