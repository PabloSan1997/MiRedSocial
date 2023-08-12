import joi from 'joi';
import {Solicitudes, SolicitudEditar} from '../controllers/textosController';


const id_texto = joi.string().min(2);
const mensaje = joi.string().min(1);
const token = joi.string().min(1);


export const agregarTextoJoi: joi.ObjectSchema<Solicitudes> = joi.object({
    token:token.required(),
    mensaje:mensaje.required()
});

export const editarTextoJoi: joi.ObjectSchema<SolicitudEditar> = joi.object({
    id_texto:id_texto.required(),
    mensaje:mensaje.required(),
    token:token.required()
});
