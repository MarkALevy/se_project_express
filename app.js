const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { PORT = 3001 } = process.env;

mongoose.set('strictQuery', true);

mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
