import { Request, Response, NextFunction} from 'express';


export function errorSesion( error:Error,req:Request, res:Response, next:NextFunction){
    if(error.errorSecion){
        const pasar = {
            permiso:false,
            token:'',
            message:error.mensaje,
            nombre:''
        }
        res.status(401).json(pasar);
    }
    next(error);
}

type Error = {
    errorSecion:boolean,
    mensaje:string
}