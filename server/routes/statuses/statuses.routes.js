import express from 'express';
import { apiStatusesController } from '../../controllers/index.js';
export const statusesRoutes = express.Router();

statusesRoutes
  .route('/')
  .get(apiStatusesController.getStatuses)
  // .put(apiStatusesController.putObject)
  // .post(apiStatusesController.setObject)
  // .delete(apiStatusesController.deleteObject)