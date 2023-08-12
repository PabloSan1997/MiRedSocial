import "reflect-metadata";
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { conectar } from "./db/config";
import { generateApi } from "./routes";
import { boomHandle } from "./middlewares/boomHandle";
import { headerValidation } from "./middlewares/headerValidation";
import { errorSesion } from "./middlewares/errorSesion";

const PORT = process.env.PORT || 3000;
conectar();
const app = express();

app.use(cors());
app.use(express.json());
app.use(headerValidation);

generateApi(app);

app.use(boomHandle);
app.use(errorSesion);

app.listen(PORT);