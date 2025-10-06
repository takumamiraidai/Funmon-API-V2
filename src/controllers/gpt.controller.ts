import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { GPTService } from '../services/gpt.service';
import { Env } from '../types/env';

export class GPTController {
  static async generate(c: Context) {
    const env = c.env as Env;
    const input = c.req.query('input');
    
    if (!input) {
      throw new HTTPException(400, { message: 'Missing input parameter' });
    }
    
    const service = new GPTService(env);
    const text = await service.generateResponse(input);
    
    return c.json({ message: text }, 200);
  }
}
