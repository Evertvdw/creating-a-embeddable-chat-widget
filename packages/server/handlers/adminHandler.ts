import { Socket, Server } from 'socket.io';
import { Database, Message } from '../types';

export default function (io: Server, socket: Socket, db: Database) {
  socket.on('admin:add', (name: string) => {
    socket.join('admins');

    const admin = db.admins.findOne({ name });

    if (!admin) return socket.disconnect(true);
    admin.connected = true;

    socket.emit('admin:list', db.clients.find());

    socket.on(
      'admin:message',
      ({ id, message }: { id: string; message: Message }) => {
        const client = db.clients.findOne({ id });
        if (client) {
          // Store message in the DB
          client.messages.push(message);
          // Update the client as autoupdate wont detect array modifications
          db.clients.update(client);
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
