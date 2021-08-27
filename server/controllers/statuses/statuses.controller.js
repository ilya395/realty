import { pool } from '../../services/index.js';

class StatusesController {
  async getStatuses() {
    const statuses = await pool.query(`SELECT * FROM object_statuses;`);
    return statuses.rows;
  }
}

export const statusController = new StatusesController();

class APIStatusesController {
  async getStatuses(request, response) {
    if(!request.body) return response.sendStatus(400);
    const items = await pool.query(`SELECt * FROM object_statuses;`);
    response.json(items.rows);
  }
}

export const apiStatusesController = new APIStatusesController();