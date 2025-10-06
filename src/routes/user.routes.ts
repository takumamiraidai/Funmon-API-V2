import { Hono } from 'hono';
import { UserController } from '../controllers/user.controller';

const userRoutes = new Hono();

userRoutes.get('/get_user_by_id', UserController.getById);
userRoutes.post('/write_user', UserController.create);

export default userRoutes;
