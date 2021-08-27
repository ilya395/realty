import dotenv from 'dotenv';
dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN;

export const BD_USER = process.env.BD_USER;
export const BD_PASSWORD = process.env.BD_PASSWORD;
export const BD_HOST = process.env.BD_HOST;
export const BD_PORT = process.env.BD_PORT;
export const BD_NAME = process.env.BD_NAME;

export const LIFETIME_SESSION = process.env.LIFETIME || 7200000;

export const FORM_CALLBACK = "FORM_CALLBACK";

export const ERROR = "ERROR";
export const SUCCESS = "SUCCESS";

export const EMAIL_LOGIN = process.env.EMAIL_LOGIN;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export const ADMIN_EMAIL = "work.i395@yandex.ru";