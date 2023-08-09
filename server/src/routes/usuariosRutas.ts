import express from 'express';
import { ControllerUsuario } from '../controllers/usuarioController';
import { joiHandle } from '../middlewares/joiHandel';
import { agregarUsuarioJoi, iniciarSecionJoi, inicioTokenJoi } from '../schemas/usuarioShcema';

export const routerUsuarios = express.Router();

const controlador = new ControllerUsuario();

routerUsuarios.post('/agregar', joiHandle(agregarUsuarioJoi), controlador.agregarUsuario);
routerUsuarios.post('/iniciarSecion', joiHandle(iniciarSecionJoi), controlador.iniciarSecion);
routerUsuarios.post('/inicioToken', joiHandle(inicioTokenJoi), controlador.inicioToken);