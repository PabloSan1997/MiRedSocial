import "reflect-metadata";
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { conectar } from "./db/config";
import { generateApi } from "./routes";
import { boomHandle } from "./middlewares/boomHandle";
import { headerValidation } from "./middlewares/headerValidation";

conectar();
const app = express();

app.use(cors());
app.use(express.json());
app.use(headerValidation);

generateApi(app);

app.use(boomHandle);


app.listen(3000);