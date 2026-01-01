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
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});

app.use(express.static(path.join(__dirname, 'public')));
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

io.use((socket, next) => {
  const { roomName } = socket.handshake.query;

  if(roomName) {
    return next()
  }

  next(new Error('Room name is required'));
})

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  const { roomName } = socket.handshake.query;
  console.log(`Joining room: ${roomName}`);
  socket.join(roomName);

  socket.emit('joined-room', { roomName });

  socket.on('message-to-book', (msg) => {
    console.log('Message received:', msg)

    const messageWithMeta = {
      ...msg,
      roomName,
      socketId: socket.id,
      timestamp: new Date().toISOString()
    }

    io.to(roomName).emit('message-to-book', messageWithMeta);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
})

async function start(PORT, UrlDB) {
  try {
    await mongoose.connect(UrlDB);
    server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}

const URL_DB = process.env.URL_DB
const PORT = process.env.PORT || 3000;

start(PORT, URL_DB);

module.exports = { io }