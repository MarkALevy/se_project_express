// app.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const mainRouter = require('./routes/index');

const errorHandler = require('./middlewares/error-handler');
const NotFoundError = require('./utils/errors/NotFoundError');

const app = express();
const { PORT = 3001 } = process.env;

mongoose.set('strictQuery', true);

mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(console.error);

app.use(
  cors({
    origin: [
      'https://wtwr2024.serverpit.com',
      'https://www.wtwr2024.serverpit.com',
      'https://api.wtwr2024.serverpit.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);

app.use(express.json());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use('/', mainRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
