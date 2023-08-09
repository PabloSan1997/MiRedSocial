import { Request, Response, NextFunction} from 'express';

import {Boom} from '@hapi/boom';

export function boomHandle( error:Boom,req:Request, res:Response, next:NextFunction){
    if(error.isBoom){
        const response = error.output.payload;
        res.status(response.statusCode).json(response);
    }
    next(error);
}