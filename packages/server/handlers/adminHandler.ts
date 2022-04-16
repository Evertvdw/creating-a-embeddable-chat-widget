import { Socket, Server } from 'socket.io';
import { Database, Message } from '../types';

export default function (io: Server, socket: Socket, db: Database) {
  socket.on('admin:add', (name: string) => {
    socket.join('admins');

    const admin = db.admins.find((admin) => admin.name === name);

    if (!admin) return socket.disconnect(true);
    admin.connected = true;

    socket.emit('admin:list', db.clients);

    socket.on(
      'admin:message',
      ({ id, message }: { id: string; message: Message }) => {
        const client = db.clients.find((client) => client.id === id);
        if (client) {
          // Store message in the DB
          client.messages.push(message);
          // Send message to the client
          socket.to(client.id).emit('client:message', message);
          // Send message to all admins
          io.to('admins').emit('admin:message', {
            id: client.id,
            message,
          });
        }
      }
    );

    socket.on('disconnect', () => {
      admin.connected = false;
    });
  });
}
