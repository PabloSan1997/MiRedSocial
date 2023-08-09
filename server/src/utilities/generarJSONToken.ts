import jwt from 'jsonwebtoken';
import { UsuarioRes } from '../controllers/usuarioController';
import { PALABRA } from '../config/variables';

export function generarJWT(objeto: UsuarioRes): string {
    const clonar = { ...objeto }
    const token = jwt.sign(clonar, PALABRA);
    return token;
}

export async function verificarJWT(token: string): Promise<UsuarioRes> {
    try {
        const objeto = jwt.verify(token, PALABRA) as UsuarioRes;
        return objeto;
    } catch (error) {
        throw 'No se puede iniciar sesión'
    }
}