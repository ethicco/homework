const uuid = require('uuid');
const express = require('express');
const path = require('path');
const { router: routerIndex } = require('./routes/index');
const routerBooks = require('./routes/books');
const routerApi = require('./routes/api')
const errorMiddleware = require('./middleware/error');

const app = express();

app.use(express.urlencoded());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', "ejs");

app.use('/', routerIndex);
app.use('/api', routerApi)
app.use('/books', routerBooks)

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
