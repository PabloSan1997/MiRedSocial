import { Response, Request, NextFunction } from 'express';
import { AppDataSource } from '../db/config';
import { Usuario } from '../db/schemas/usuario';
import { v4 as uuidV4 } from 'uuid';
import bcrypt from 'bcrypt';
import Boom from '@hapi/boom';
import {Repository} from 'typeorm';

async function  investigarCorreo(email: string, repositorio: Repository<Usuario>): Promise<Comprobar> {
    try {
        const dato = await repositorio.find({
            where: {
                email
            }
        });
        return {existe:dato.length > 0, cuenta:dato};
    } catch (error) {
        return {existe:false, cuenta:[]};
    }

}

export class ControllerUsuario {
     
    async agregarUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const repositorio = AppDataSource.getRepository(Usuario);
            const nuevoUsuario = req.body as UsuarioReq;
            const checar = await investigarCorreo(nuevoUsuario.email, repositorio);
            if(checar.existe){
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
            if(typeof error === 'string'){
                next(Boom.unauthorized(error));
            }else{
                next(Boom.badRequest('Problemas al agregar usuario'));
            }
        }
    }
    async iniciarSecion(req: Request, res: Response, next: NextFunction) {
        const solicitud = req.body as inicioReq;
        const repositorio = AppDataSource.getRepository(Usuario);
        try {
            const checar = await investigarCorreo(solicitud.email, repositorio);
            if(!checar.existe){
                throw 'No se encontró usuario con ese correo' ;
            }
            const usuarioExistente = checar.cuenta[0];
            const verificarContra = await bcrypt.compare(solicitud.contra, usuarioExistente.contra);
            if(!verificarContra){
                throw 'Usuario o contraseña incorrectos';
            }
            res.json({message:"si pasas"});
        } catch (error) {
            if(typeof error === 'string'){
                const errorSecion:ErrorSe = {
                    errorSecion:true,
                    mensaje:error
                }
                next(errorSecion);
            }else{
                next(Boom.badRequest('Problemas con iniciar sesion'));
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
type Comprobar={
    existe:boolean,
    cuenta:Usuario[]
}
type ErrorSe = {
    errorSecion:boolean,
    mensaje:string
}