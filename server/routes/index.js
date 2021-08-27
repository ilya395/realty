import express from 'express';
import { loadUser } from '../services/index.js';
import { ajaxHandlerRoutes } from './ajax/ajax.routes.js';
import { objectsRoutes, publicObjectRoutes } from './objects/objects.routes.js';
import { statusesRoutes } from './statuses/statuses.routes.js';
export const apiRoutes = express.Router();

apiRoutes
  .use('/objects', loadUser, objectsRoutes)
  .use('/statuses', loadUser, statusesRoutes)


export const publicRoutes = express.Router();

publicRoutes
  .use('/objects', publicObjectRoutes)
  .use('/ajax', ajaxHandlerRoutes)