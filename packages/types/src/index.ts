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
  email: string;
  hash: string;
  connected?: boolean;
}

export enum MessageType {
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
