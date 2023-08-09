import {Repository} from 'typeorm';
import { Usuario } from '../db/schemas/usuario';

export async function investigarCorreo(email: string, repositorio: Repository<Usuario>): Promise<Comprobar> {
    try {
        const dato = await repositorio.find({
            where: {
                email
            }
        });
        return { existe: dato.length > 0, cuenta: dato };
    } catch (error) {
        return { existe: false, cuenta: [] };
    }
}

type Comprobar={
    existe:boolean,
    cuenta:Usuario[]
}