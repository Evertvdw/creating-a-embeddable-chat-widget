import { Socket, Server } from 'socket.io';
import { Database, Message } from '../types';

export default function (io: Server, socket: Socket, db: Database) {
  socket.on('admin:add', (email: string) => {
    const admin = db.admins.findOne({ email });

    if (!admin) return socket.disconnect(true);
    admin.connected = true;

    socket.join('admins');
    socket.emit('admin:self', admin);
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

    socket.on(
      'admin:typing',
      ({ id, typing }: { id: string; typing: boolean }) => {
        const client = db.clients.findOne({ id });
        if (client) {
          if (typing) {
            client.adminsTyping[admin.email] = true;
            socket.to(client.id).emit('client:admin_typing', typing);
          } else {
            delete client.adminsTyping[admin.email];
            if (!Object.keys(client.adminsTyping).length) {
              socket.to(client.id).emit('client:admin_typing', typing);
            }
          }
        }
      }
    );

    socket.on('disconnect', () => {
      admin.connected = false;
    });
  });
}
