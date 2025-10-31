const dotenv = require('dotenv')
dotenv.config()

const uuid = require('uuid');
const express = require('express');
const path = require('path');
const { router: routerIndex } = require('./routes/index');
const routerBooks = require('./routes/books');
const routerApi = require('./routes/api')
const errorMiddleware = require('./middleware/error');
const mongoose = require('mongoose')

const app = express();

app.use(express.urlencoded());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', "ejs");

app.use('/', routerIndex);
app.use('/api', routerApi)
app.use('/books', routerBooks)

app.use(errorMiddleware)

async function start(PORT, UrlDB) {
  try {
    await mongoose.connect(UrlDB);
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}

const URL_DB = process.env.URL_DB
const PORT = process.env.PORT || 3000;

start(PORT, URL_DB);