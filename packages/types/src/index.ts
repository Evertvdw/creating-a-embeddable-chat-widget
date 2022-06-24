export interface AddClient {
  name: string;
}

export interface Client extends AddClient {
  id: string;
  connected: boolean;
  typing: string;
  adminsTyping: Record<string, boolean>;
  messages: Message[];
}

export interface Admin extends AdminPublic {
  email: string;
  hash: string;
  connected?: boolean;
}

export interface AdminPublic {
  name: string;
  image: string;
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
