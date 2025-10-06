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


  export async function getFunMonByNames(names: string[], env: Env): Promise<Response> {
    try {
      const db = env.DB;
  
      // プレースホルダーとバインドするパラメータの確認
      const placeholders = names.map(() => '?').join(', ');
      const query = `SELECT * FROM FunMon WHERE name IN (${placeholders})`;
  
      console.log(`Query: ${query}, Values: ${names}`); // クエリとバインドする値をログ出力
  
      // クエリ実行
      const results = await db.prepare(query).bind(...names).all();
      console.log('DB Query Results:', results.results); // クエリ結果のログ出力
  
      if (!results || results.results.length === 0) {
        return new Response(JSON.stringify({ message: 'No FunMon data found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      // FunMonリストの生成
      const funMonList = results.results.map((result: any) => ({
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
      }));
  
      return new Response(JSON.stringify(funMonList), {
        headers: { 'Content-Type': 'application/json' },
      });
  
    } catch (error) {
      console.error('Error retrieving FunMon by names:', error);
      return new Response(JSON.stringify({ message: 'Failed to get FunMon by names', error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  
  