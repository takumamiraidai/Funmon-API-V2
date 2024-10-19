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

export async function getAllFunMon(env: Env): Promise<Response> {
  try {
    const db = env.DB;
    const query = `SELECT * FROM FunMon`;
    const result = await db.prepare(query).all();

    if (!result.results) {
      return new Response(JSON.stringify({ message: 'No funmon data found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const funmons: FunMon[] = result.results.map((task: any) => ({
      id: task.id,
      nickname: task.nickname,
      name: task.name,
      uniqueImageURL: task.uniqueImageURL,
      imageURL: task.imageURL,
      course: task.course,
      professions: task.professions ? JSON.parse(task.professions) : [],
      room: task.room,
      urls: task.urls ? JSON.parse(task.urls) : [],
      description: task.description,
      parameters: task.parameters ? JSON.parse(task.parameters) : [],
      comments: task.comments ? JSON.parse(task.comments) : [],
    }));

    return new Response(JSON.stringify(funmons), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error retrieving task:', error);
    return new Response(JSON.stringify({ message: 'Failed to get tasks' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
