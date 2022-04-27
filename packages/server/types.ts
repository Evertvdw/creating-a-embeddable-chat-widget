import { Collection } from 'lokijs';
import { Admin, Client, Message, AddClient } from '../../types';

export interface Database {
  clients: Collection<Client>;
  admins: Collection<Admin>;
}

export { Admin, Client, Message, AddClient };
