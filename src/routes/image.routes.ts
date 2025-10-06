import { Hono } from 'hono';
import { ImageController } from '../controllers/image.controller';

const imageRoutes = new Hono();

imageRoutes.post('/upload_pic', ImageController.upload);
imageRoutes.get('/load_pic', ImageController.load);

export default imageRoutes;
