import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

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
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
});

server.listen(5000, () => {
  console.log(
    `Server started on port ${5000} at ${new Date().toLocaleString()}`
  );
});
