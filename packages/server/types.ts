import { Admin, Client, Message, AddClient } from '../../types';

export interface Database {
  clients: Client[];
  admins: Admin[];
}

export { Admin, Client, Message, AddClient };
