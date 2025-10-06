interface Env {
  DB: D1Database;
}

interface User {
  id: string;
  comments: string[];
  sub: string[];
}


export async function getUserById(id: string, env: Env): Promise<Response> {
  try {
    const db = env.DB;
    const query = `SELECT * FROM User WHERE id = ?`;
    
    // クエリの実行結果を取得
    const result = await db.prepare(query).bind(id).first() as {
      id: string;
      comments: string | null;
      sub: string | null;
    } | null;

    // データがない場合のエラーハンドリング
    if (!result) {
      return new Response(JSON.stringify({ message: 'No User data found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Userオブジェクトの生成
    const user: User = {
      id: result.id,
      comments: result.comments ? JSON.parse(result.comments) : [],
      sub: result.sub ? JSON.parse(result.sub) : [],
    };

    return new Response(JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 
