import express, {Express} from 'express';
import { routerUsuarios } from './usuariosRutas';
import { routerTextos } from './Textos';

const routerIndex = express.Router();
const baseRouter = '/api/v1';

export function generateApi(app:Express){
    app.use(baseRouter, routerIndex);
    routerIndex.use('/users', routerUsuarios);
    routerIndex.use('/texts', routerTextos);
    app.get('/', (req, res)=>{
        res.json({message:'Bienvenido a mi api :)'});
    });
}