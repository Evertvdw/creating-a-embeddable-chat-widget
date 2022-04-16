import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Client, Database } from './types';
import admins from './admins';
import adminHandler from './handlers/adminHandler';
import clientHandler from './handlers/clientHandler';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [/http:\/\/localhost:\d*/],
  },
});

const tempList: Client[] = [
  {
    id: 'temp',
    connected: false,
    messages: [],
    name: 'John Doe',
  },
  {
    id: 'temp1',
    connected: true,
    messages: [],
    name: 'Jane Doe',
  },
];

// Create an in memory 'database'
const db: Database = {
  clients: tempList,
  admins: admins,
};

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

server.listen(5000, () => {
  console.log(
    `Server started on port ${5000} at ${new Date().toLocaleString()}`
  );
});
