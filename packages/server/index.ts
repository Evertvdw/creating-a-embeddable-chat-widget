import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Database } from './types';
import adminHandler from './handlers/adminHandler';
import clientHandler from './handlers/clientHandler';
import initDB from './database/database';
import authRoutes from './routes/auth';
import socketMiddleware from './middleware/socket';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import serveStatic from 'serve-static';
import history from 'connect-history-api-fallback';
import path from 'path';

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(
  cors({
    origin: [/http:\/\/localhost:\d*/, 'https://cdpn.io'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [/http:\/\/localhost:\d*/, 'https://cdpn.io'],
  },
});

io.on('connection', (socket) => {
  console.log(
    `Socket ${socket.id} connected from origin: ${socket.handshake.headers.origin}`
  );
  if (socket.admin) adminHandler(io, socket, db);
  clientHandler(io, socket, db);

  socket.onAny((event, ...args) => {
    console.log('[DEBUG]', event, args);
  });
});

let db: Database;
(async function () {
  try {
    db = await initDB();

    if (process.env.APP_ENV === 'production' && !process.env.JWT_SECRET) {
      throw new Error('Should provide JWT_SECRET env variable');
    }

    socketMiddleware(io, db);
    app.use('/auth', authRoutes(db));

    if (process.env.APP_ENV === 'production') {
      app.use(history());
      app.use(
        serveStatic(path.join(__dirname, './../../dist/widget'), {
          setHeaders: (res) => {
            res.header('Cross-Origin-Resource-Policy', 'cross-origin');
          },
        })
      );
      app.use(serveStatic(path.join(__dirname, './../../dist/portal')));
    }

    server.listen(port, () => {
      console.log(
        `Server started on port ${port} at ${new Date().toLocaleString()}`
      );
    });
  } catch (err) {
    console.log('Server failed to start.');
    console.error(err);
  }
})();
