

export function filtrarUsuario(texto: Argumento):Respuesta{
    const usuario = {
        id_usuario: texto.usuario.id_usuario,
		nombre: texto.usuario.nombre,
		email: texto.usuario.email
    }
    const filtrar = {
        ...texto,
        usuario
    }
    return filtrar;
}

type Argumento = {
	id_texto: string,
	mensaje: string,
	fecha: string,
	usuario: {
		id_usuario:string,
		nombre: string,
		email: string,
		contra: string,
		superUsuario: boolean
	}
}
type Respuesta ={
	id_texto: string,
	mensaje: string,
	fecha: string,
	usuario: {
		id_usuario:string,
		nombre: string,
		email: string,
	}
}
