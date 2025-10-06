/**
 * @deprecated このファイルはリファクタリング前の旧実装です。
 * 新しい実装は src/index.ts を参照してください。
 * 
 * このファイルは参照用として残されています。
 * レガシーコードの理解やマイグレーションの参考としてご利用ください。
 */

import { getAllFunMon } from "./database/fun-mon/getAllFunMon";
import { getFunMonById } from "./database/fun-mon/getFuMonById";
import { writeFunMon } from "./database/fun-mon/writeFunMon";
import { getFunMonByNames } from "./database/fun-mon/getFunMonByNameList"; 
import { botRequest } from "./gpt/botRequest";
import { loadPic } from "./pics/loadPics";
import { uploadPic } from "./pics/upPics";
import { writeUser } from "./database/User/writeUser";
import { getUserById } from "./database/User/getUserById";

export interface Env {
  DB: D1Database;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET_NAME: string;
  R2_REGION: string;
  R2_ACCOUNT_ID: string;
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const allowedOrigins = ["http://localhost:3000", "https://funmon.pages.dev"];
  const origin = request.headers.get("Origin");
  const allowedOrigin = allowedOrigins.includes(origin as string) ? origin : null;

  if (request.method === "OPTIONS") {
    return handleOptionsRequest(allowedOrigin);
  }

  const url = new URL(request.url);
  const path = url.pathname;
  console.log('Request Path:', path);
  console.log('Request Method:', request.method);

  try {
    let response: Response;
    console.log('Try request:', request.url);
    await new Promise(resolve => setTimeout(resolve, 0));

    if (path.startsWith('/api/write_funmon') && request.method === 'POST') {
      console.log('post funmon:', url);
      response = await handleWriteFunmonRequest(request, env);
    } else if (path.startsWith('/api/get_all_funmon') && request.method === 'GET') {
      console.log('get funmon:', url);
      response = await handleGetAllFunmonRequest(env);
    } else if (path.startsWith('/api/get_funmon_by_id') && request.method === 'GET') {
      console.log('get funmon by id:', url);
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(JSON.stringify({ message: 'Missing id parameter' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      response = await handleGetFunmonByIdRequest(env, id);
    } else if (path.startsWith('/api/get_funmon_by_name_list') && request.method === 'POST') {
      console.log('get funmon by name list:', url);
      response = await handleGetFunmonByNameListRequest(request, env); // 修正した関数を呼び出す
    } else if (path.startsWith('/api/write_user') && request.method === 'POST') {
      console.log('write user:', url);
      response = await handleWriteUserRequest(request, env);
    } else if (path.startsWith('/api/get_user_by_id') && request.method === 'GET') {
      console.log('get user by id:', url);
      response = await handleGetUserByIdRequest(request, env);
    }else if (path.startsWith('/api/upload_pic') && request.method === 'POST') {
      console.log('upload pic:', url);
      response = await uploadPic(request, env);
    } else if (path.startsWith('/api/load_pic') && request.method === 'GET') {
      console.log('load pic:', url);
      const objectKey = url.searchParams.get('key');
      if (!objectKey) {
        return new Response(JSON.stringify({ message: 'Missing key parameter' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      response = await loadPic(objectKey, env);
    } else if (path.startsWith('/api/gpt') && request.method === 'GET') {
      console.log('gpt:', url);
      const input = url.searchParams.get('input');
      if (!input) {
        return new Response(JSON.stringify({ message: 'Missing input parameter' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      response = await handleBotRequest(url.searchParams, env);
    } else {
      console.log('Not found');
      response = new Response('Not found', { status: 404 });
    }

    if (allowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    }

    return response;

  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

function handleOptionsRequest(allowedOrigin: string | null): Response {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  if (allowedOrigin) {
    headers.set("Access-Control-Allow-Origin", allowedOrigin);
  }

  return new Response(null, { status: 204, headers });
}

async function handleWriteFunmonRequest(request: Request, env: Env): Promise<Response> {
  try {
    const { id, nickname, name, uniqueImageURL, imageURL, course, professions, room, urls, description, parameters, comments }: {
      id: string, nickname: string, name: string, uniqueImageURL: string, imageURL: string, course: string, professions: string[], room: number, urls: string[], description: string, parameters: string[], comments: string[]
    } = await request.json();
    const missingFields: string[] = [];

    if (!id) missingFields.push('id');
    if (!nickname) missingFields.push('nickname');
    if (!name) missingFields.push('name');
    if (!imageURL) missingFields.push('imageURL');
    if (!course) missingFields.push('course');
    if (!professions) missingFields.push('professions');
    if (room === 0) missingFields.push('room');

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields.join(', '));
      return new Response(JSON.stringify({ message: 'Missing required fields', missingFields }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await writeFunMon(id, nickname, name, uniqueImageURL, imageURL, course, professions, room, urls, description, parameters, comments, env);
    return response;
  } catch (error) {
    console.error('Error in handleWriteFunmonRequest:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ message: 'Failed to write funmon', error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleGetAllFunmonRequest(env: Env): Promise<Response> {
  try {
    const response = await getAllFunMon(env);
    return response;
  } catch (error) {
    console.error('Error in handleGetAllFunmonRequest:', error);
    return new Response(JSON.stringify({ message: 'Failed to get funmons' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleGetFunmonByIdRequest(env: Env, id: string): Promise<Response> {
  try {
    const response = await getFunMonById(id, env);
    const responseData = await response.clone().json();
    console.log('Funmon fetched:', responseData);  
    return response;
  } catch (error) {
    console.error('Error in handleGetFunmonByIdRequest:', error);
    return new Response(JSON.stringify({ message: 'Failed to get funmon' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleGetFunmonByNameListRequest(request: Request, env: Env): Promise<Response> {
  try {
    const { names }: { names: string[] } = await request.json();

    if (!names || names.length === 0) {
      return new Response(JSON.stringify({ message: 'Missing names parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // getFunMonByNamesを使用してデータを取得
    const response = await getFunMonByNames(names, env);
    return response;

  } catch (error) {
    console.error('Error in handleGetFunmonByNameListRequest:', error);
    return new Response(JSON.stringify({ message: 'Failed to get funmons by name list' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
 
async function handleWriteUserRequest (request: Request, env: Env): Promise<Response> {
  try {
    const { id, funmons, sub }: { id: string, funmons: string[], sub: string[] } = await request.json();
    if (!id || !funmons || !sub) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const response = await writeUser(id, funmons, sub, env);
    return response;
  } catch (error) {
    console.error('Error in handleWriteUserRequest:', error);
    return new Response(JSON.stringify({ message: 'Failed to write user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleGetUserByIdRequest (request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ message: 'Missing id parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const response = await getUserById(id, env);
    return response;
  } catch (error) {
    console.error('Error in handleGetUserByIdRequest:', error);
    return new Response(JSON.stringify({ message: 'Failed to get user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleBotRequest(searchParams: URLSearchParams, env: Env): Promise<Response> {
  const input = searchParams.get('input');

  if (!input) {
    return new Response(JSON.stringify({ message: 'Missing input parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const text = await botRequest(env, input);

  return new Response(JSON.stringify({ message: text }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}


export default {
  fetch: handleRequest,
};
