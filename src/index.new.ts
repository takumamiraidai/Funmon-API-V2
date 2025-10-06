import { Hono } from 'hono';
import { Env } from './types/env';
import { corsMiddleware } from './middlewares/cors.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { logger } from './middlewares/logger.middleware';
import funmonRoutes from './routes/funmon.routes';
import userRoutes from './routes/user.routes';
import gptRoutes from './routes/gpt.routes';
import imageRoutes from './routes/image.routes';

const app = new Hono<{ Bindings: Env }>();

// グローバルミドルウェア
app.use('*', logger);
app.use('*', errorHandler);
app.use('*', corsMiddleware);

// ルート
app.route('/api', funmonRoutes);
app.route('/api', userRoutes);
app.route('/api', gptRoutes);
app.route('/api', imageRoutes);

// ヘルスチェック
app.get('/', (c) => {
  return c.json({ 
    status: 'ok', 
    message: 'FunMon API is running',
    version: '2.0.0' 
  });
});

// 404ハンドラー
app.notFound((c) => {
  return c.json({ message: 'Not found' }, 404);
});

export default app;
