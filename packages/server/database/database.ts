import { join } from 'path';
import adminSeed from './admins';
import loki from 'lokijs';
import { Admin, Client, Database } from '../types';
const lsfa = require('lokijs/src/loki-fs-structured-adapter');

export default function initDB() {
  return new Promise<Database>((resolve) => {
    const adapter = new lsfa();
    const db = new loki(join(__dirname, './server.db'), {
      adapter,
      autoload: true,
      autosave: true,
      autosaveInterval: 4000,
      autoloadCallback: () => {
        db.removeCollection('admins');
        const admins = db.addCollection<Admin>('admins', {
          autoupdate: true,
        });
        adminSeed.forEach((admin) => {
          admins.insertOne(admin);
        });
        let clients = db.getCollection<Client>('clients');
        if (clients === null) {
          clients = db.addCollection<Client>('clients', {
            autoupdate: true,
            indices: ['id'],
          });
        }
        resolve({ admins, clients });
      },
    });
  });
}
