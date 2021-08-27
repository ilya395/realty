import { hash, pool } from '../../services/index.js';

class UserController {
  async createUser(data) {
    const { login, password } = data;
    const user = await pool.query(`INSERT INTO users (login, password) values ($1, $2) RETURNING *`, [login, hash(password)]);
    return user.rows;
  }
  async getUser(data) {
    const { id } = data;
    const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return user.rows;
  }
  async checkUser(data) {
    const { login, password } = data;
    const user = await pool.query(`SELECT * FROM users WHERE login = $1`, [login]);
    if (user.rows[0]) {
      if (user.rows[0].password === hash(password)) {
        return {
          check: true,
          auth: true,
          data: user.rows[0],
        };
      }
      return {
        check: true,
        auth: false,
        data: null,
      };
    }
    return {
      check: false,
      auth: false,
      data: null,
    };
  }
}

export const userController = new UserController();