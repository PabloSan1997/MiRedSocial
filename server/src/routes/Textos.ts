import express from 'express';
import { TextosController } from '../controllers/textosController';

export const routerTextos = express.Router();
const controller = new TextosController();


routerTextos.get('/', controller.leerTextos);
routerTextos.post('/agregar', controller.agregarTexto);
routerTextos.get('/leer/:id_usuario', controller.leerUsuarioTexto);