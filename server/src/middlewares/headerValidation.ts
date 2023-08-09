import { ALLOWED } from "../config/variables";
import {Response, Request, NextFunction} from 'express';
import boom from '@hapi/boom';

export function headerValidation(req:Request, res:Response, next:NextFunction){
    const cabeza = req.headers.permiso;
    if(!cabeza || cabeza!== ALLOWED){
        throw boom.unauthorized('No tienes permiso de usar esta Api');
    }
    next();
}