import { Response, Request, NextFunction } from 'express';
import { AppDataSource } from '../db/config';
import { Texto } from '../db/schemas/textos';
import boom from '@hapi/boom';
import { Usuario } from '../db/schemas/usuario';
import { verificarJWT } from '../utilities/generarJSONToken';
import { v4 as uuidV4 } from 'uuid';
import { generarFecha } from '../utilities/generarFecha';
import { filtrarUsuario } from '../utilities/filtrarUsuario';
import { procesoSolicitud } from '../utilities/prosesoSolicitud';


export class TextosController {
    async leerTextos(req: Request, res: Response, next: NextFunction) {
        const repositorio = AppDataSource.getRepository(Texto);
        try {
            const datos = await repositorio.find({ relations: { usuario: true } });
            const respuesta = datos.map(elemento => filtrarUsuario(elemento));
            res.json(respuesta.reverse());
        } catch (error) {
            next(boom.notFound('Problemas al obtener los datos'));
        }
    }

    async leerTextoId(req: Request, res: Response, next: NextFunction) {
        try {
            const repositorio = AppDataSource.getRepository(Texto);
            const { id_texto } = req.params as { id_texto: string };
            const elementos = await repositorio.find({
                relations: { usuario: true },
                where: {
                    id_texto
                }
            });
            if (elementos.length === 0) {
                throw 'No se encontró texto';
            }
            const respuesta = filtrarUsuario(elementos[0]);
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
                textos: usuarioExistene[0].textos.reverse()
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

            if (usuario.length === 0) {
                throw 'No tienes permiso para generar esta acción';
            }
            const usuarioVerificado = usuario[0];
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

    async editarTexto(req: Request, res: Response, next: NextFunction) {
        try {
            const solicitud = req.body as SolicitudEditar;
            const repositorio = AppDataSource.getRepository(Texto);
            const repositurioUsuario = AppDataSource.getRepository(Usuario);
            const respuesta = await procesoSolicitud(solicitud.token, repositurioUsuario, repositorio, solicitud.id_texto);
            await repositorio.update({ id_texto: respuesta.id_texto }, { mensaje: solicitud.mensaje });
            res.json({ message: "Se edito texto con exito", texto: solicitud.mensaje });
        } catch (error) {
            if (typeof error === 'string') {
                next(boom.unauthorized(error));
            }
            else {
                next(boom.badImplementation('Problemas con la acción'));
            }
        }
    }
    async eliminarTexto(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.headers as { token: string };
            const { id_texto } = req.params as { id_texto: string };
            const repositorio = AppDataSource.getRepository(Texto);
            const usuarioRepositorio = AppDataSource.getRepository(Usuario);
            const respuesta = await procesoSolicitud(token, usuarioRepositorio, repositorio, id_texto);
            await repositorio.delete({ id_texto:respuesta.id_texto });
            res.json({ message: "Elemento eliminado con exito" });
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

export type Solicitudes = {
    token: string,
    mensaje: string
}
export type SolicitudEditar = {
    token: string,
    mensaje: string,
    id_texto: string
}