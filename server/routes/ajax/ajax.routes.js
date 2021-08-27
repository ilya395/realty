import express from 'express';
import { requestAjaxController } from '../../controllers/index.js';

export const ajaxHandlerRoutes = express.Router();

ajaxHandlerRoutes
  .route("/")
  .post(requestAjaxController.setData)