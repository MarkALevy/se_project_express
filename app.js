// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mainRouter = require('./routes/index');
const { NON_EXISTING_ADDRESS_CODE } = require('./utils/errors');

const app = express();
const { PORT = 3001 } = process.env;

mongoose.set('strictQuery', true);

mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(console.error);
app.use(cors());
app.use(express.json());

app.use('/', mainRouter);

app.use((req, res) => {
  res
    .status(NON_EXISTING_ADDRESS_CODE)
    .send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
