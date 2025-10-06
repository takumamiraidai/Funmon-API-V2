import { Hono } from 'hono';
import { GPTController } from '../controllers/gpt.controller';

const gptRoutes = new Hono();

gptRoutes.get('/gpt', GPTController.generate);

export default gptRoutes;
