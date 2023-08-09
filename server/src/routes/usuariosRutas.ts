import express from 'express';
import { ControllerUsuario } from '../controllers/usuarioController';
import { joiHandle } from '../controllers/joiHandel';
import { agregarUsuarioJoi } from '../schemas/usuarioShcema';

export const routerUsuarios = express.Router();

const controlador = new ControllerUsuario();

routerUsuarios.post('/agregar', joiHandle(agregarUsuarioJoi), controlador.agregarUsuario);