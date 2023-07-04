import express, { Express, Request, Response } from "express";
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

import router from "./route";
import './db';
import { globalErrorHandler } from "./utils";

let app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.use(globalErrorHandler);

app.listen(8000, () => {
  console.log('Server started at port 8000');
});
