import { Response, Request, NextFunction } from 'express';
import { AppDataSource } from '../db/config';
import { Texto } from '../db/schemas/textos';
import boom from '@hapi/boom';
import { Usuario } from '../db/schemas/usuario';
import { verificarJWT } from '../utilities/generarJSONToken';
import { v4 as uuidV4 } from 'uuid';
import { generarFecha } from '../utilities/generarFecha';
import { investigarCorreo } from '../utilities/buscarCorreo';

export class TextosController {
    async leerTextos(req: Request, res: Response, next: NextFunction) {
        const repositorio = AppDataSource.getRepository(Texto);
        try {
            const datos = await repositorio.find({ relations: { usuario: true } });
            const respuesta = datos.map(elemento => {
                const modificar = elemento.usuario;
                const usuario = {
                    id_usuario: modificar.id_usuario,
                    nombre: modificar.nombre,
                    email: modificar.email
                }
                const nuevo = {
                    ...elemento,
                    usuario
                }
                return nuevo
            });
            res.json(respuesta);
        } catch (error) {
            next(boom.notFound('Problemas al obtener los datos'));
        }
    }
    async agregarTexto(req: Request, res: Response, next: NextFunction) {
        try {
            const repositorio = AppDataSource.getRepository(Usuario);
            const repositorioText = AppDataSource.getRepository(Texto);
            const cuerpo = req.body as Solicitudes;
            const usuarioExistente = await verificarJWT(cuerpo.token);

            const usuario = await repositorio.find({
                where: {
                    id_usuario: usuarioExistente.id_usuario
                }
            });

            console.log(usuario[0]);

            if (usuario.length === 0) {
                throw 'No tienes permiso para generar esta acción';
            }
            const usuarioVerificado = usuario[0];
            console.log(usuarioVerificado);
            const nuevoTexto = new Texto();
            nuevoTexto.id_texto = uuidV4();
            nuevoTexto.fecha = generarFecha();
            nuevoTexto.mensaje = cuerpo.mensaje;
            nuevoTexto.usuario = usuarioVerificado;
            await repositorioText.manager.save(nuevoTexto);
            res.status(201).json({ message: "Texto agregado con éxito" });

        } catch (error) {
            if (typeof error === 'string') {
                next(boom.unauthorized(error));
            }
            else {
                next(boom.badImplementation('Problemas con la acción'));
            }
        }
    }
    async leerUsuarioTexto(req: Request, res: Response, next: NextFunction) {
        try {
            const { id_usuario } = req.params as { id_usuario: string };
            const repositorio = AppDataSource.getRepository(Usuario);
            const usuarioExistene = await repositorio.find({
                where: {
                    id_usuario
                },
                relations: {
                    textos: true
                }
            });
            const usuario = usuarioExistene[0];
            const respuesta = {
                nombre: usuario.nombre,
                email: usuario.email,
                textos: usuarioExistene[0].textos
            }
            res.json(respuesta);
        } catch (error) {
            if (typeof error === 'string') {
                next(boom.notFound(error));
            }
            else {
                next(boom.badImplementation('Problemas con la acción'));
            }
        }

    }
}

type Solicitudes = {
    token: string,
    mensaje: string
}