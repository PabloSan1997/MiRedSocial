import { Repository } from "typeorm";
import { Texto } from "../db/schemas/textos";
import { Usuario } from "../db/schemas/usuario";
import { verificarJWT } from "./generarJSONToken";
import { investigarCorreo } from "./buscarCorreo";



export async function procesoSolicitud(
    token: string, 
    repositorioUsuario: Repository<Usuario>, 
    repositorioTexto: Repository<Texto>,
    id_texto:string
    ):Promise<RES> {
        const usuarioRes = await verificarJWT(token);
        const checar = await investigarCorreo(usuarioRes.email, repositorioUsuario);
        if(!checar.existe){
            throw 'No puedes generar esta accion';
        }
        const textos = await repositorioTexto.find({
            relations:{usuario:true},
            where:{
                id_texto
            }
        });
        if(textos.length===0){
            throw 'No se encontro elemento';
        }
        const texto = textos[0];
        
        const usuario = checar.cuenta[0];
        
        if(!usuario.superUsuario && usuario.email!==texto.usuario.email){
            throw 'No tienes permiso para esta accion';
        }
        return {id_texto:texto.id_texto};
}

type RES = {
    id_texto:string,
}