import "reflect-metadata";
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { AppDataSource, conectar } from "./db/config";
import { generateApi } from "./routes";

conectar();
const app = express();

app.use(cors());
app.use(express.json());

generateApi(app);



app.listen(3000);