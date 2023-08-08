import {DataSource} from 'typeorm';
import { URL_DATABASE } from '../config/variables';


export const AppDataSource = new DataSource({
    type:'postgres',
    url:URL_DATABASE,
    synchronize: true,
    logging: true,
    entities:[]
});

export function conectar(){
    AppDataSource.initialize()
    .then(()=>console.log('Conectado a la base de datos'))
    .catch(()=>console.log('Error con la base de datos'));
}