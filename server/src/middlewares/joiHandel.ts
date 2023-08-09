import { UsuarioReq, inicioReq } from '../controllers/usuarioController';
import { Response, Request, NextFunction } from 'express';
import joi from 'joi';
import boom from '@hapi/boom';

type Schema =
    joi.ObjectSchema<UsuarioReq> |
    joi.ObjectSchema<inicioReq> |
    joi.ObjectSchema<{token:string}>


export function joiHandle(schema: Schema) {
    return (req:Request, res:Response, next:NextFunction)=>{
        const cuerpo = req.body;
        const {error} = schema.validate(cuerpo, {abortEarly:false});
        if(!!error){
            throw boom.badRequest(error);
        }
        next();
    }
}