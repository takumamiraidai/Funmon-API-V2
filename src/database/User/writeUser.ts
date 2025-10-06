interface User {
  id: string;
  comments: string[];
  sub: string[];
}

interface Env {
  DB: D1Database;
}

export async function writeUser(
  id: string,
  funmons: string[],
  sub: string[],
  env: Env
): Promise<Response> {
  try {
    if (!id || !funmons || !sub ) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const typeString = JSON.stringify(funmons);
    const tagString = JSON.stringify(sub);

    const db = env.DB;
    if (!db) {
      throw new Error("Database connection not found in env.DB");
    }

    // テーブルが存在しない場合に作成
    const createTableQuery = 
      `CREATE TABLE IF NOT EXISTS FunMon (
        id TEXT PRIMARY KEY,
        funmons TEXT,
        sub TEXT,
      )`;
    await db.prepare(createTableQuery).run();

    const query = `
      INSERT INTO FunMon (id, funmons, sub)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        funmons = excluded.funmons,
        sub = excluded.sub
    `;


    console.log("Preparing to run query with values:", id, typeString, tagString);

    const statement = db.prepare(query);
    const result = await statement.bind(id, typeString, tagString).run();

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
