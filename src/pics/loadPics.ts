export interface Env {
    R2_ACCESS_KEY_ID: string;
    R2_SECRET_ACCESS_KEY: string;
    R2_BUCKET_NAME: string;
    R2_REGION: string;
    R2_ACCOUNT_ID: string;
  }

export async function loadPic(objectKey: string, env: Env): Promise<Response> {
    const r2Url = `https://${env.R2_BUCKET_NAME}.${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${objectKey}`;
  
    try {
      const r2Response = await fetch(r2Url, {
        method: 'GET',
      });
  
      if (!r2Response.ok) {
        throw new Error(`Failed to fetch image: ${r2Response.statusText}`);
      }
  
      const imageBuffer = await r2Response.arrayBuffer();
      const contentType = r2Response.headers.get('Content-Type') || 'image/jpeg';
  
      return new Response(imageBuffer, {
        headers: { 'Content-Type': contentType },
      });
    } catch (error) {
      console.error('Error fetching image from R2:', error);
      return new Response(JSON.stringify({ message: 'Failed to fetch image' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  