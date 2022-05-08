import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Database } from '../types';

const secret = process.env.JWT_SECRET || 'alksjd;kl3lkrjtokensfklhklkef';

export default function (io: Server, db: Database) {
  // Verify jwt token on socket connection
  io.use((socket, next) => {
    if (
      socket.handshake.query &&
      socket.handshake.query.token &&
      typeof socket.handshake.query.token === 'string'
    ) {
      jwt.verify(
        socket.handshake.query.token,
        secret,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function (err, admin: any) {
          if (err) {
            console.log('[DEBUG] socket middleware jwt error');
            return next(new Error('Authentication error'));
          }
          socket.admin = admin;
        }
      );
    }
    next();
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
}
