import express from 'express';
import { objectsComplexController } from '../../controllers/complex-controllers/objects/objects.controller.js';
import { apiObjectsController } from '../../controllers/index.js';
export const objectsRoutes = express.Router();

objectsRoutes
  .route('/')
  .get(apiObjectsController.getObjects)
  .put(apiObjectsController.putObject)
  .post(apiObjectsController.setObject)
  .delete(apiObjectsController.deleteObject)


export const publicObjectRoutes = express.Router();

publicObjectRoutes
  .route('/')
  .get(objectsComplexController.getPublicObjects)