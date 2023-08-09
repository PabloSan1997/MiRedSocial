import { Response, Request, NextFunction } from 'express';
import { AppDataSource } from '../db/config';
import { Usuario } from '../db/schemas/usuario';
import { v4 as uuidV4 } from 'uuid';
import bcrypt from 'bcrypt';
import Boom from '@hapi/boom';
import { investigarCorreo } from '../utilities/buscarCorreo';
import { generarJWT, verificarJWT } from '../utilities/generarJSONToken';



export class ControllerUsuario {

    async agregarUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const repositorio = AppDataSource.getRepository(Usuario);
            const nuevoUsuario = req.body as UsuarioReq;
            const checar = await investigarCorreo(nuevoUsuario.email, repositorio);
            if (checar.existe) {
                throw 'Correo ya existente';
            }
            const id_usuario = uuidV4();
            const contra = await bcrypt.hash(nuevoUsuario.contra, 7);
            const agregar = new Usuario();
            agregar.contra = contra;
            agregar.email = nuevoUsuario.email;
            agregar.superUsuario = nuevoUsuario.superUsuario;
            agregar.id_usuario = id_usuario;
            agregar.nombre = nuevoUsuario.nombre;
            await repositorio.manager.save(agregar);
            res.status(201).json({ message: 'Se agregó elemento con éxtito' });
        } catch (error) {
            if (typeof error === 'string') {
                next(Boom.unauthorized(error));
            } else {
                next(Boom.badImplementation('Problemas al agregar usuario'));
            }
        }
    }
    async iniciarSecion(req: Request, res: Response, next: NextFunction) {
        const solicitud = req.body as inicioReq;
        const repositorio = AppDataSource.getRepository(Usuario);
        try {
            const checar = await investigarCorreo(solicitud.email, repositorio);
            if (!checar.existe) {
                throw 'No se encontró usuario con ese correo';
            }
            const usuarioExistente = checar.cuenta[0];
            const verificarContra = await bcrypt.compare(solicitud.contra, usuarioExistente.contra);
            if (!verificarContra) {
                throw 'Usuario o contraseña incorrectos';
            }
            const nuevoEncriptado = await bcrypt.hash(solicitud.contra, 7);
            usuarioExistente.contra = nuevoEncriptado;
            await repositorio.manager.save(usuarioExistente);
            const token = generarJWT(usuarioExistente);

            const response: InicioRes = {
                permiso: true,
                token,
                message: '',
                nombre: usuarioExistente.nombre,
                superUsuario: usuarioExistente.superUsuario,
                id_usuario:usuarioExistente.id_usuario
            }

            res.json(response);

        } catch (error) {
            if (typeof error === 'string') {
                const errorSesion: ErrorSe = {
                    errorSecion: true,
                    mensaje: error
                }
                next(errorSesion);
            } else {
                next(Boom.badRequest('Problemas con iniciar sesion'));
            }
        }
    }

    async inicioToken(req: Request, res: Response, next: NextFunction) {
        try {
            const cuerpo = req.body as { token: string };
            const usuarioExistente = await verificarJWT(cuerpo.token);
            const repositorio = AppDataSource.getRepository(Usuario);
            const checar = await investigarCorreo(usuarioExistente.email, repositorio);
            if (!checar.existe) {
                throw 'No se puede iniciar sesion'
            }
            const response: InicioRes = {
                permiso: true,
                token: cuerpo.token,
                message: '',
                nombre: usuarioExistente.nombre,
                superUsuario: usuarioExistente.superUsuario,
                id_usuario:usuarioExistente.id_usuario
            }

            res.json(response);
        } catch (error) {
            if (typeof error === 'string') {
                const errorSesion: ErrorSe = {
                    errorSecion: true,
                    mensaje: error
                }
                next(errorSesion);
            } else {
                next(Boom.badImplementation('Problemas con iniciar sesion'));
            }
        }
    }
}


export type UsuarioReq = {
    nombre: string;
    email: string;
    contra: string;
    superUsuario: boolean;
}
export type inicioReq = {
    email: string;
    contra: string;
}

type ErrorSe = {
    errorSecion: boolean,
    mensaje: string
}
export type UsuarioRes = {
    id_usuario: string,
    nombre: string;
    email: string;
    contra: string;
    superUsuario: boolean;
}
type InicioRes = {
    permiso: boolean,
    token: string,
    message: string,
    nombre: string,
    superUsuario: boolean,
    id_usuario:string
}