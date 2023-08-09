

export function generarFecha(): string {
    // Obtener la fecha y hora actual
    const fechaActual = new Date();

    // Obtener componentes individuales de la fecha y hora
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1; // Los meses son indexados desde 0
    const anio = fechaActual.getFullYear();
    const horas = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    const segundos = fechaActual.getSeconds();

    // Formatear componentes individuales para asegurarte de que tengan dos dígitos
    const diaFormateado = dia < 10 ? '0' + dia : dia;
    const mesFormateado = mes < 10 ? '0' + mes : mes;
    const horasFormateadas = horas < 10 ? '0' + horas : horas;
    const minutosFormateados = minutos < 10 ? '0' + minutos : minutos;
    const segundosFormateados = segundos < 10 ? '0' + segundos : segundos;

    // Crear el texto formateado
    const fechaHoraTexto = `${diaFormateado}/${mesFormateado}/${anio} ${horasFormateadas}:${minutosFormateados}:${segundosFormateados}`;
    return fechaHoraTexto;
}