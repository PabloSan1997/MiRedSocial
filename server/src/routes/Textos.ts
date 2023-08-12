import express from 'express';
import { TextosController } from '../controllers/textosController';
import { joiHandle } from '../middlewares/joiHandel';
import { agregarTextoJoi, editarTextoJoi } from '../schemas/textoSchema';

export const routerTextos = express.Router();
const controller = new TextosController();


routerTextos.get('/', controller.leerTextos);
routerTextos.post('/agregar', joiHandle(agregarTextoJoi),controller.agregarTexto);
routerTextos.get('/leer/usuario/:id_usuario', controller.leerUsuarioTexto);
routerTextos.get('/leer/:id_texto', controller.leerTextoId);
routerTextos.patch('/', joiHandle(editarTextoJoi),controller.editarTexto);
routerTextos.delete('/:id_texto', controller.eliminarTexto);