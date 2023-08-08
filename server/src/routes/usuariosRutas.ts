import express from 'express';

export const routerUsuarios = express.Router();

routerUsuarios.get('/', (req, res)=>{
    res.json({message:"usuarios sirve"});
});