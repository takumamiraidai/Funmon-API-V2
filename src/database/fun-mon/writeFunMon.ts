interface FunMon {
  id: string;
  nickname: string;
  name: string;
  uniqueImageURL: string;
  imageURL: string;
  course: string;
  professions: string[];
  room: number;
  urls: string[];
  description: string;
  parameters: string[];
  comments: string[];
}

interface Env {
  DB: D1Database;
}

export async function writeFunMon(
  id: string,
  nickname: string,
  name: string,
  uniqueImageURL: string,
  imageURL: string,
  course: string,
  professions: string[],
  room: number,
  urls: string[],
  description: string,
  parameters: string[],
  comments: string[],
  env: Env
): Promise<Response> {
  try {
    if (!id || !nickname || !name  || !imageURL || !course || !professions || room === 0) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const typeString = JSON.stringify(professions);
    const tagString = JSON.stringify(urls);
    const parameterString = JSON.stringify(parameters);
    const commentString = JSON.stringify(comments);

    const db = env.DB;
    if (!db) {
      throw new Error("Database connection not found in env.DB");
    }

    // テーブルが存在しない場合に作成
    const createTableQuery = 
      `CREATE TABLE IF NOT EXISTS FunMon (
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
      )`;
    await db.prepare(createTableQuery).run();

    const query = `
      INSERT INTO FunMon (id, nickname, name, uniqueImageURL, imageURL, course, professions, room, urls, description, parameters, comments)
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


    console.log("Preparing to run query with values:", id, nickname, name, uniqueImageURL, imageURL, course, typeString, room, tagString, description, parameterString, commentString);

    const statement = db.prepare(query);
    const result = await statement.bind(id, nickname, name, uniqueImageURL, imageURL, course, typeString, room, tagString, description, parameterString, commentString ).run();

    console.log("Query executed successfully", result);

    return new Response(
      JSON.stringify({ message: "User information saved successfully" }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error saving user info:", error);

    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: (error as any).message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
