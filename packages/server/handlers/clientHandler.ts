import { Socket, Server } from 'socket.io';
import { AddClient, Client, Database, Message } from '../types';

export default function (io: Server, socket: Socket, db: Database) {
  socket.on('client:add', (data: AddClient) => {
    socket.join('clients');
    socket.join(socket.clientID);

    socket.emit('client:id', socket.clientID);

    let client: Client;
    const DBClient = db.clients.findOne({ id: socket.clientID });
    if (DBClient) {
      client = DBClient;
      client.connected = true;
      socket.emit('client:messages', client.messages);
    } else {
      client = {
        ...data,
        messages: [],
        id: socket.clientID,
        connected: true,
      };
      db.clients.insert(client);
    }

    io.to('admins').emit('admin:list', db.clients.find());

    socket.on('client:message', (message: Message) => {
      // Add message to DB
      client.messages.push(message);
      // Update the client as autoupdate wont detect array modifications
      db.clients.update(client);
      // Send message back to client
      socket.emit('client:message', message);
      // Send message to all admins
      io.to('admins').emit('admin:message', {
        id: client.id,
        message,
      });
    });

    socket.on('disconnect', async () => {
      const matchingSockets = await io.in(socket.clientID).allSockets();
      const isDisconnected = matchingSockets.size === 0;
      if (isDisconnected) {
        client.connected = false;
        io.to('admins').emit('admin:client_status', {
          id: client.id,
          status: false,
        });
      }
    });
  });
}
