import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const errorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    console.error('Error occurred:', error);
    
    if (error instanceof HTTPException) {
      return c.json(
        { message: error.message },
        error.status
      );
    }
    
    if (error instanceof Error) {
      return c.json(
        { message: error.message || 'Internal server error' },
        500
      );
    }
    
    return c.json(
      { message: 'Internal server error' },
      500
    );
  }
};
