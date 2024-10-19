import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface Env {
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET_NAME: string;
  R2_REGION: string;
    R2_ACCOUNT_ID: string;
  }
  

  export async function uploadPic(request: Request, env: Env): Promise<Response> {
    const formData = await request.formData();
    const file = formData.get('file') as File;
  
    if (!file || !file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ message: 'Invalid file type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    const arrayBuffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    const objectKey = file.name;
  
    const s3 = new S3Client({
      region: env.R2_REGION,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    });
  
    const command = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: objectKey,
      Body: imageBuffer,
      ContentType: file.type,
    });
  
    try {
      await s3.send(command);
  
      const publicUrl = `https://pub-1172a055b8e3433bb426d1a8426b5f69.r2.dev/${objectKey}`;
  
      return new Response(JSON.stringify({ message: 'Image uploaded successfully', url: publicUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error uploading image to R2:', error);
      return new Response(JSON.stringify({ message: 'Failed to upload image' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  

