import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Env } from '../types/env';

export class ImageService {
  constructor(private env: Env) {}

  async upload(file: File): Promise<string> {
    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type');
    }

    const arrayBuffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    const objectKey = file.name;

    const s3 = new S3Client({
      region: this.env.R2_REGION,
      credentials: {
        accessKeyId: this.env.R2_ACCESS_KEY_ID,
        secretAccessKey: this.env.R2_SECRET_ACCESS_KEY,
      },
      endpoint: `https://${this.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    });

    const command = new PutObjectCommand({
      Bucket: this.env.R2_BUCKET_NAME,
      Key: objectKey,
      Body: imageBuffer,
      ContentType: file.type,
    });

    await s3.send(command);

    return `https://pub-1172a055b8e3433bb426d1a8426b5f69.r2.dev/${objectKey}`;
  }

  async load(objectKey: string): Promise<{ buffer: ArrayBuffer; contentType: string }> {
    const r2Url = `https://${this.env.R2_BUCKET_NAME}.${this.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${objectKey}`;

    const r2Response = await fetch(r2Url, {
      method: 'GET',
    });

    if (!r2Response.ok) {
      throw new Error(`Failed to fetch image: ${r2Response.statusText}`);
    }

    const imageBuffer = await r2Response.arrayBuffer();
    const contentType = r2Response.headers.get('Content-Type') || 'image/jpeg';

    return { buffer: imageBuffer, contentType };
  }
}
