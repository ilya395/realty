import { pool } from '../../services/index.js';
import crypto from 'crypto';

class SessionsController {
  async setSessionThroughUserId(data) {
    const { userId } = data;
    const hashId = crypto.randomBytes(20).toString('hex');
    const dateCreation = (new Date()).getTime();
    const statuses = await pool.query(`INSERT INTO sessions (session_id, user_id, date_creation) values ($1, $2, $3) RETURNING *;`, [hashId, userId, dateCreation]);
    return statuses.rows;
  }
  async getSessionThroughtSessionId(data) {
    const { sessionId } = data;
    const session = await pool.query(`SELECT * FROM sessions WHERE session_id = $1;`, [sessionId]);
    return session.rows[0];
  }
  async deleteSessionThroughtSessionId(data) {
    const { sessionId } = data;
    const session = await pool.query(`DELETE FROM sessions WHERE session_id = $1;`, [sessionId]);
    return session.rows;
  }
}

export const sessionController = new SessionsController();