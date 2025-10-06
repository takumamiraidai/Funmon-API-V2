import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ImageService } from '../services/image.service';
import { Env } from '../types/env';

export class ImageController {
  static async upload(c: Context) {
    const env = c.env as Env;
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new HTTPException(400, { message: 'No file provided' });
    }
    
    const service = new ImageService(env);
    const url = await service.upload(file);
    
    return c.json({ message: 'Image uploaded successfully', url }, 200);
  }

  static async load(c: Context) {
    const env = c.env as Env;
    const objectKey = c.req.query('key');
    
    if (!objectKey) {
      throw new HTTPException(400, { message: 'Missing key parameter' });
    }
    
    const service = new ImageService(env);
    const { buffer, contentType } = await service.load(objectKey);
    
    return new Response(buffer, {
      headers: { 'Content-Type': contentType },
    });
  }
}
