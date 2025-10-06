import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { UserService } from '../services/user.service';
import { createUserSchema } from '../validators/user.validator';
import { Env } from '../types/env';

export class UserController {
  static async getById(c: Context) {
    const env = c.env as Env;
    const id = c.req.query('id');
    
    if (!id) {
      throw new HTTPException(400, { message: 'Missing id parameter' });
    }
    
    const service = new UserService(env);
    const user = await service.getById(id);
    
    if (!user) {
      throw new HTTPException(404, { message: 'No User data found' });
    }
    
    return c.json(user);
  }

  static async create(c: Context) {
    const env = c.env as Env;
    const body = await c.req.json();
    
    const validation = createUserSchema.safeParse(body);
    
    if (!validation.success) {
      throw new HTTPException(400, { 
        message: 'Missing required fields',
        cause: validation.error.issues 
      });
    }
    
    const service = new UserService(env);
    await service.create(validation.data);
    
    return c.json({ message: 'User information saved successfully' }, 200);
  }
}
