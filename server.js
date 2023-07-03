import express from "express";
import { APP_PORT, DB_URL } from "./config/index.js";

const app = express();

import routes from "./routes/index.js";
import errorHandlers from "./middlewares/errorHandler.js";

import mongoose from "mongoose";

mongoose.set('strictQuery', false);
mongoose.connect(DB_URL, { useNewUrlParser: true });

import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

global.AppRoot = path.resolve(__dirname);
app.use(express.urlencoded({ extended: false }))

app.use(express.json());

app.use('/api', routes);
app.use('/upload', express.static('upload'));

app.use(errorHandlers);
app.listen(APP_PORT, () => {
    console.log(`Port Running ${APP_PORT}.`);
})