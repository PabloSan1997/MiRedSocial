import joi from 'joi';
import { UsuarioReq, inicioReq } from '../controllers/usuarioController';


 const nombre = joi.string().min(1);
 const email = joi.string().email();
 const contra = joi.string().min(1);
 const superUsuario = joi.boolean();
 const id_usuario = joi.string().min(2);
 const token = joi.string().min(1);

 export const agregarUsuarioJoi: joi.ObjectSchema<UsuarioReq> = joi.object(
    {
        nombre:nombre.required(),
        email:email.required(),
        contra:contra.required(),
        superUsuario:superUsuario.required()
    }
 );

 export const iniciarSecionJoi: joi.ObjectSchema<inicioReq> = joi.object(
    {
        email:email.required(),
        contra:contra.required(),
    }
 );

 export const inicioTokenJoi: joi.ObjectSchema<{token:string}> = joi.object(
    {
        token:token.required()
    }
 );