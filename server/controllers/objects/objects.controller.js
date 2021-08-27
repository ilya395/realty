import { pool } from '../../services/index.js';

class APIObjectsController {
  async getObjects(request, response) {
    if(!request.body) return response.sendStatus(400);
    const items = await pool.query(`SELECT * FROM realty;`);
    response.json(items.rows);
  }
  async setObject(request, response) {
    if(!request.body) return response.sendStatus(400);
    const { square, number, statusId, id } = request.body;
    const object = await pool.query(`UPDATE realty SET square = $1, number = $2, status_id = $3 WHERE id = $4;`, [square, number, statusId, id]);
    response.json(object.rows);
  }
  async putObject(request, response) {
    if(!request.body) return response.sendStatus(400);
    const { square, number, statusId } = request.body;
    const object = await pool.query(`INSERT INTO realty (square, number, status_id) values ($1, $2, $3) RETURNING *;`, [square, number, statusId]);
    response.json(object.rows);
  }
  async deleteObject(request, response) {
    if(!request.body) return response.sendStatus(400);
    const { id } = request.body;
    const items = await pool.query(`DELETE FROM realty WHERE id = $1;`, [id]);
    response.json(items.rows);
  }
}

export const apiObjectsController = new APIObjectsController();

class ObjectsController {
  async getObjects() {
    const items = await pool.query(`SELECT * FROM realty;`);
    return items.rows;
  }
}

export const objectsController = new ObjectsController();