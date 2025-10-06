import { Env } from '../types/env';
import { User, CreateUserRequest } from '../types/user';

export class UserService {
  constructor(private env: Env) {}

  async getById(id: string): Promise<User | null> {
    const db = this.env.DB;
    const query = `SELECT * FROM User WHERE id = ?`;
    const result = await db.prepare(query).bind(id).first() as any;

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      funmons: result.funmons ? JSON.parse(result.funmons) : [],
      sub: result.sub ? JSON.parse(result.sub) : [],
    };
  }

  async create(data: CreateUserRequest): Promise<void> {
    const db = this.env.DB;

    // テーブルが存在しない場合に作成
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS User (
        id TEXT PRIMARY KEY,
        funmons TEXT,
        sub TEXT
      )
    `;
    await db.prepare(createTableQuery).run();

    const query = `
      INSERT INTO User (id, funmons, sub)
      VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        funmons = excluded.funmons,
        sub = excluded.sub
    `;

    await db
      .prepare(query)
      .bind(
        data.id,
        JSON.stringify(data.funmons),
        JSON.stringify(data.sub)
      )
      .run();
  }
}
