import { Response, Request, NextFunction } from 'express';
import { AppDataSource } from '../db/config';
import { Usuario } from '../db/schemas/usuario';
import { v4 as uuidV4 } from 'uuid';
import bcrypt from 'bcrypt';
import Boom from '@hapi/boom';

export class ControllerUsuario {
    async agregarUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const repositorio = AppDataSource.getRepository(Usuario);
            const nuevoUsuario = req.body as UsuarioReq;
            const id_usuario = uuidV4();
            const contra = await bcrypt.hash(nuevoUsuario.contra, 7);
            const agregar = new Usuario();
            const dato = await repositorio.find({
                where: {
                    email: nuevoUsuario.email
                }
            });
            if(dato.length>0){
                next(Boom.badRequest('Ese correo ya existe'));
            }
            agregar.contra = contra;
            agregar.email = nuevoUsuario.email;
            agregar.superUsuario = nuevoUsuario.superUsuario;
            agregar.id_usuario = id_usuario;
            agregar.nombre = nuevoUsuario.nombre;
            await repositorio.manager.save(agregar);
            res.status(201).json({ message: 'Se agregó elemento con éxtito' });
        } catch (error) {
            next(Boom.badData('Problemas al agregar usuario'));
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