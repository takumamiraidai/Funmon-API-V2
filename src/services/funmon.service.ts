import { Env } from '../types/env';
import { FunMon, CreateFunMonRequest } from '../types/funmon';

export class FunMonService {
  constructor(private env: Env) {}

  async getAll(): Promise<FunMon[]> {
    const db = this.env.DB;
    const query = `SELECT * FROM FunMon`;
    const result = await db.prepare(query).all();

    if (!result.results || result.results.length === 0) {
      return [];
    }

    return result.results.map((row: any) => this.mapRowToFunMon(row));
  }

  async getById(id: string): Promise<FunMon | null> {
    const db = this.env.DB;
    const query = `SELECT * FROM FunMon WHERE id = ?`;
    const result = await db.prepare(query).bind(id).first();

    if (!result) {
      return null;
    }

    return this.mapRowToFunMon(result);
  }

  async getByNames(names: string[]): Promise<FunMon[]> {
    const db = this.env.DB;
    const placeholders = names.map(() => '?').join(', ');
    const query = `SELECT * FROM FunMon WHERE name IN (${placeholders})`;

    const results = await db.prepare(query).bind(...names).all();

    if (!results || !results.results || results.results.length === 0) {
      return [];
    }

    return results.results.map((row: any) => this.mapRowToFunMon(row));
  }

  async create(data: CreateFunMonRequest): Promise<void> {
    const db = this.env.DB;

    // テーブルが存在しない場合に作成
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS FunMon (
        id TEXT PRIMARY KEY,
        nickname TEXT,
        name TEXT,
        uniqueImageURL TEXT,
        imageURL TEXT,
        course TEXT,
        professions TEXT,
        room INTEGER,
        urls TEXT,
        description TEXT,
        parameters TEXT,
        comments TEXT
      )
    `;
    await db.prepare(createTableQuery).run();

    const query = `
      INSERT INTO FunMon (
        id, nickname, name, uniqueImageURL, imageURL, course,
        professions, room, urls, description, parameters, comments
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        nickname = excluded.nickname,
        name = excluded.name,
        uniqueImageURL = excluded.uniqueImageURL,
        imageURL = excluded.imageURL,
        course = excluded.course,
        professions = excluded.professions,
        room = excluded.room,
        urls = excluded.urls,
        description = excluded.description,
        parameters = excluded.parameters,
        comments = excluded.comments
    `;

    await db
      .prepare(query)
      .bind(
        data.id,
        data.nickname,
        data.name,
        data.uniqueImageURL,
        data.imageURL,
        data.course,
        JSON.stringify(data.professions),
        data.room,
        JSON.stringify(data.urls),
        data.description,
        JSON.stringify(data.parameters),
        JSON.stringify(data.comments)
      )
      .run();
  }

  private mapRowToFunMon(row: any): FunMon {
    return {
      id: row.id,
      nickname: row.nickname,
      name: row.name,
      uniqueImageURL: row.uniqueImageURL,
      imageURL: row.imageURL,
      course: row.course,
      professions: row.professions ? JSON.parse(row.professions) : [],
      room: row.room,
      urls: row.urls ? JSON.parse(row.urls) : [],
      description: row.description,
      parameters: row.parameters ? JSON.parse(row.parameters) : [],
      comments: row.comments ? JSON.parse(row.comments) : [],
    };
  }
}
