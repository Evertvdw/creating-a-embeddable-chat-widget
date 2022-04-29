import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Database } from './types';
import adminHandler from './handlers/adminHandler';
import clientHandler from './handlers/clientHandler';
import initDB from './database/database';
import crypto from 'crypto';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [/http:\/\/localhost:\d*/],
  },
});

io.on('connection', (socket) => {
  console.log(
    `Socket ${socket.id} connected from origin: ${socket.handshake.headers.origin}`
  );
  adminHandler(io, socket, db);
  clientHandler(io, socket, db);

  socket.onAny((event, ...args) => {
    console.log('[DEBUG]', event, args);
  });
});

// Socket middleware to set a clientID
const randomId = () => crypto.randomBytes(8).toString('hex');
io.use((socket, next) => {
  const clientID = socket.handshake.auth.clientID;
  if (clientID) {
    const client = db.clients.findOne({ id: clientID });
    if (client) {
      socket.clientID = clientID;
      return next();
    }
  }
  socket.clientID = randomId();
  next();
});

let db: Database;
(async function () {
  try {
    db = await initDB();
    server.listen(5000, () => {
      console.log(
        `Server started on port ${5000} at ${new Date().toLocaleString()}`
      );
    });
  } catch (err) {
    console.log('Server failed to start.');
    console.error(err);
  }
})();
