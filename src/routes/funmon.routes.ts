import { Hono } from 'hono';
import { FunMonController } from '../controllers/funmon.controller';

const funmonRoutes = new Hono();

funmonRoutes.get('/get_all_funmon', FunMonController.getAll);
funmonRoutes.get('/get_funmon_by_id', FunMonController.getById);
funmonRoutes.post('/get_funmon_by_name_list', FunMonController.getByNameList);
funmonRoutes.post('/write_funmon', FunMonController.create);

export default funmonRoutes;
