import { Socket, Server } from 'socket.io';
import { AddClient, Client, Database, Message } from '../types';

export default function (io: Server, socket: Socket, db: Database) {
  socket.on('client:add', (data: AddClient) => {
    socket.join('clients');
    socket.join(socket.clientID);

    socket.emit('client:id', socket.clientID);

    // Emit a list of admins to the client so it can views it's name and image
    socket.emit(
      'client:admin_list',
      db.admins.find().map((admin) => {
        return { name: admin.name, image: admin.image };
      })
    );

    let client: Client;
    const DBClient = db.clients.findOne({ id: socket.clientID });
    if (DBClient) {
      client = DBClient;
      client.connected = true;
      socket.emit('client:messages', client.messages);
    } else {
      client = {
        ...data,
        typing: '',
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

    socket.on('client:typing', (text: string) => {
      client.typing = text;
      io.to('admins').emit('admin:client_typing', {
        id: client.id,
        text,
      });
    });

    socket.on('disconnect', async () => {
      const matchingSockets = await io.in(socket.clientID).allSockets();
      const isDisconnected = matchingSockets.size === 0;
      if (isDisconnected) {
        client.connected = false;
        client.typing = '';
        io.to('admins').emit('admin:client_typing', {
          id: client.id,
          status: '',
        });
        io.to('admins').emit('admin:client_status', {
          id: client.id,
          status: false,
        });
      }
    });
  });
}
