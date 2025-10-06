import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { FunMonService } from '../services/funmon.service';
import { createFunMonSchema, getFunMonByNameListSchema } from '../validators/funmon.validator';
import { Env } from '../types/env';

export class FunMonController {
  static async getAll(c: Context) {
    const env = c.env as Env;
    const service = new FunMonService(env);
    
    const funmons = await service.getAll();
    
    if (funmons.length === 0) {
      throw new HTTPException(404, { message: 'No funmon data found' });
    }
    
    return c.json(funmons);
  }

  static async getById(c: Context) {
    const env = c.env as Env;
    const id = c.req.query('id');
    
    if (!id) {
      throw new HTTPException(400, { message: 'Missing id parameter' });
    }
    
    const service = new FunMonService(env);
    const funmon = await service.getById(id);
    
    if (!funmon) {
      throw new HTTPException(404, { message: 'No FunMon data found' });
    }
    
    return c.json(funmon);
  }

  static async getByNameList(c: Context) {
    const env = c.env as Env;
    const body = await c.req.json();
    
    const validation = getFunMonByNameListSchema.safeParse(body);
    
    if (!validation.success) {
      throw new HTTPException(400, { 
        message: validation.error.issues.map(e => e.message).join(', ') 
      });
    }
    
    const service = new FunMonService(env);
    const funmons = await service.getByNames(validation.data.names);
    
    if (funmons.length === 0) {
      throw new HTTPException(404, { message: 'No FunMon data found' });
    }
    
    return c.json(funmons);
  }

  static async create(c: Context) {
    const env = c.env as Env;
    const body = await c.req.json();
    
    const validation = createFunMonSchema.safeParse(body);
    
    if (!validation.success) {
      const missingFields = validation.error.issues.map(e => e.path.join('.'));
      throw new HTTPException(400, { 
        message: 'Missing required fields',
        cause: { missingFields } 
      });
    }
    
    const service = new FunMonService(env);
    await service.create(validation.data);
    
    return c.json({ message: 'FunMon information saved successfully' }, 200);
  }
}
