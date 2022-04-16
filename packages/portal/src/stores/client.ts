import { defineStore } from 'pinia';
import { Client, Message } from '../../../../types';

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [] as Client[],
    clientSelected: null as Client | null,
  }),
  actions: {
    SOCKET_list(payload: Client[]) {
      this.clients = payload;
    },
    SOCKET_message(payload: { id: string; message: Message }) {
      const client = this.clients.find((c) => c.id === payload.id);
      if (client) {
        client.messages.push(payload.message);
      }
    },
    setClientSelected(payload: Client) {
      this.clientSelected = payload;
    },
  },
});
