const uuid = require('uuid');
const express = require('express');

const routerIndex = require('./routes/index');

const app = express();

app.use(express.json());
app.use('/', routerIndex)

const PORT = process.env.PORT || 3000;
app.listen(PORT);