const dotenv = require('dotenv')
dotenv.config()

const uuid = require('uuid');
const express = require('express');
const http = require('http');
const path = require('path');
const { router: routerIndex } = require('./routes/index');
const routerBooks = require('./routes/books');
const routerApi = require('./routes/api')
const errorMiddleware = require('./middleware/error');
const mongoose = require('mongoose');
const session = require('express-session');
const socketIO = require('socket.io');
const passport = require('./libs/passport');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(express.urlencoded());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', "ejs");

app.use(session({secret: 'SECRET'}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routerIndex);
app.use('/api', routerApi)
app.use('/books', routerBooks)

app.use(errorMiddleware)

io.on('connection', (socket) => {
  const { id } = socket;

  console.log(`Socket connected: ${id}`);

  const { roomName } = socket.handshake.query;
  console.log(`Socket roomName: ${roomName}`);
  socket.join(roomName);

  socket.on('message-to-book', (msg) => {
    msg.type = `room: ${roomName}`;
    socket.to(roomName).emit('message-to-book', msg);
    socket.emit('message-to-book', msg);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${id}`);
  });
})

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

module.exports = { io }