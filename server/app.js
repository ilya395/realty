// const express = require('express');
import express from 'express';
import hbs from 'hbs';
import expressHbs from 'express-handlebars';
import { apiRoutes, publicRoutes } from './routes/index.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { objectsController } from './controllers/objects/objects.controller.js';
import { statusController } from './controllers/statuses/statuses.controller.js';
import session from 'express-session';
import { hash, loadUser } from './services/index.js';
import bodyParser from 'body-parser';
import { sessionController, userController } from './controllers/index.js';
import cookieParser from 'cookie-parser';
import { checkName, checkPassword } from './validate/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url)); // потомучто работаю с модулями, а в них нет __dirname & __filename

export const app = express();

const host = '127.0.0.1';
const port = process.env.PORT || 7000;

app.use(cookieParser('secret key'));

app.use('/static', express.static(__dirname.replace("server", "") + 'client\\public'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// app.use(express.cookieDecoder()); // зачем?
app.use(
  session({
    secret: 'you secret key',
    saveUninitialized: true,
  })
)

// устанавливаем настройки для файлов layout
app.engine("hbs", expressHbs(
  {
      layoutsDir: "server/views/layouts",
      partialsDir: "server/views/partials", // это подключило partials
      defaultLayout: "layout",
      extname: "hbs"
  }
))
app.set("view engine", "hbs");
app.set("views", "server/views/templates"); // установка пути к представлениям
// hbs.registerPartials(__dirname + "/views/partials"); // это не подключило partials

// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});

// создаем парсер для данных в формате json
const jsonParser = express.json();

app.use('/api', apiRoutes);
app.get('/login', async (request, response) => {
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
        response.render("login.hbs"); // сессия истекла
      } else {
        response.redirect('/');
      }
    } else {
      response.render("login.hbs");
    }
  }
  response.render("login.hbs");
});
app.post('/login', urlencodedParser, async (request, response) => {
  // console.log(request.session);
  // console.log(request.body);
  if(!request.body) return response.sendStatus(400);
  const { hiddenTitle, login, password } = request.body;
  // console.log(password, hash(password))
  console.log(checkName(login), checkPassword(password))
  if (checkName(login) && checkPassword(password)) {
    const checkUser = await userController.checkUser({ // идентификация пользователя
      login,
      password
    });
    if (checkUser.check) {
      if (checkUser.auth) {
        // какая-то магия с сессиями
        const session = await sessionController.setSessionThroughUserId({
          userId: checkUser.data.id
        });
        request.session.user = {
          sessionId: session[0].session_id,
          // id: session[0].user_id,
        }
        response.redirect("/");
      } else {
        response.redirect("/login"); // что-то с паролем
      }
    } else {
      response.redirect("/login"); // не знаем кто это
    }
  } else {
    response.redirect("/login"); // не понравился пароль или логин
  }
});
app.post('/logout', loadUser, jsonParser, async (request, response) => {
  if(!request.body) return response.sendStatus(400);
  const { action } = request.body;
  if (action && action === "logout") {
    const deletedSession = await sessionController.deleteSessionThroughtSessionId({
      sessionId: request.session.user.sessionId
    });
    delete request.session.user;
    response.json({location: "/login"});
  }
});
app.get('/', loadUser, async (request, response) => {
  const statuses = await statusController.getStatuses();
  const objects = await objectsController.getObjects();
  const objs = objects.map(item => {
    const status = statuses.find(j => +j.id === +item.status_id);
    return {
      id: item.id,
      number: item.number,
      square: item.square,
      status: status.name,
    }
  });
  response.render("main.hbs", {
    objects: objs,
    visible: objects.length > 0 ? true : false,
  });
});
app.use('/public', publicRoutes);
app.use((request, response, next) => {
  response.status(404).render("404.hbs")
});

app.listen(port, host, () =>
  console.log(`Server listens http://${host}:${port}`)
)