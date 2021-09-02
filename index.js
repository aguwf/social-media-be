/** @format */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import createHttpError from 'http-errors';
import routes from './API/routes/index.js';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import csrf from 'csurf';

const csrfProtection = csrf({
  cookie: true,
});
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }),
);

const PORT = process.env.PORT || 4444;
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(logger('dev'));
app.use(
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/public/images'));
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
  }).any(),
);
// app.use(csrfProtection);

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to mongodb !');
  })
  .catch((error) => {
    console.log('We have some trouble when connect with mongodb' + error);
  });

app.use('/api', routes);
// app.use('/', (req, res) => {
//   res.send('Welcome to meo network api.');
// });

app.use(function (req, res, next) {
  next(createHttpError(404));
});

app.use(function (req, res, next) {
  //set locally only provide error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // response json error with unexpected error
  res.status(err.status || 500);
  res.json({ err: err.message });
});

app.listen(PORT);

console.log('Meo Social API server started on: ' + PORT);

export default app;
