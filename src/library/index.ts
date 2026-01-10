import { config } from'dotenv';
config()

import express from 'express';
import { createServer } from 'http';
import path from 'path';
import mongoose from 'mongoose';
import session from 'express-session';
import { Server } from 'socket.io';

import { errorMiddleware } from './middleware';
import { passport } from './libs';

import routerIndex from './routes/index';
import routerBooks from './routes/books';
import routerApi from './routes/api';

const app = express();
const server = createServer(app);
const io = new Server(server, {
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

async function start(port: number, urlDb: string) {
  try {
    await mongoose.connect(urlDb);
    server.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (e) {
    console.log(e);
  }
}

const URL_DB = process.env.DATABASE_URL
const PORT = process.env.PORT || 3000;

start(PORT, URL_DB);

module.exports = { io }