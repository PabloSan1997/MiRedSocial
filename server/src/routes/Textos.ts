import express from 'express';

export const routerTextos = express.Router();

routerTextos.get('/', (req, res)=>{
    res.json({message:"textos sirve"});
});