interface Env {
  DB: D1Database;
}

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

export async function getFunMonById(id: string, env: Env): Promise<Response> {
  try {
    const db = env.DB;
    const query = `SELECT * FROM FunMon WHERE id = ?`;
    
    // クエリの実行結果を取得
    const result = await db.prepare(query).bind(id).first() as {
      id: string;
      nickname: string;
      name: string;
      uniqueImageURL: string;
      imageURL: string;
      course: string;
      professions: string | null;
      room: number;
      urls: string | null;
      description: string;
      parameters: string | null;
      comments: string | null;
    } | null;

    // データがない場合のエラーハンドリング
    if (!result) {
      return new Response(JSON.stringify({ message: 'No FunMon data found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // FunMonオブジェクトの生成
    const funMon: FunMon = {
      id: result.id,
      nickname: result.nickname,
      name: result.name,
      uniqueImageURL: result.uniqueImageURL,
      imageURL: result.imageURL,
      course: result.course,
      professions: result.professions ? JSON.parse(result.professions) : [],
      room: result.room,
      urls: result.urls ? JSON.parse(result.urls) : [],
      description: result.description,
      parameters: result.parameters ? JSON.parse(result.parameters) : [],
      comments: result.comments ? JSON.parse(result.comments) : [],
    };

    // FunMonデータをレスポンスとして返す
    return new Response(JSON.stringify(funMon), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error retrieving FunMon:', error);
    return new Response(JSON.stringify({ message: 'Failed to get FunMon', error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
