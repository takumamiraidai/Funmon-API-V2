import { Context, Next } from 'hono';

export const logger = async (c: Context, next: Next) => {
  const start = Date.now();
  const path = c.req.path;
  const method = c.req.method;
  
  console.log(`[${method}] ${path} - Request received`);
  
  await next();
  
  const end = Date.now();
  const status = c.res.status;
  
  console.log(`[${method}] ${path} - ${status} (${end - start}ms)`);
};
