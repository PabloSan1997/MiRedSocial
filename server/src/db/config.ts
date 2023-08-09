import {DataSource} from 'typeorm';
import { URL_DATABASE } from '../config/variables';
import { Usuario } from './schemas/usuario';
import { Texto } from './schemas/textos';


export const AppDataSource = new DataSource({
    type:'postgres',
    url:URL_DATABASE,
    synchronize: true,
    logging: true,
    entities:[Usuario, Texto]
});

export function conectar(){
    AppDataSource.initialize()
    .then(()=>console.log('Conectado a la base de datos'))
    .catch(()=>console.log('Error con la base de datos'));
}