export interface AddClient {
  name: string;
}

export interface Client extends AddClient {
  id: string;
  connected: boolean;
  messages: Message[];
}

export interface Admin {
  name: string;
  connected?: boolean;
}

enum MessageType {
  Admin = 'admin',
  Client = 'client',
  Info = 'info',
}

export interface Message {
  time: number;
  message: string;
  adminName?: Admin['name'];
  type: MessageType;
}

export interface Database {
  clients: Client[];
  admins: Admin[];
}
