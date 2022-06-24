import { defineStore } from 'pinia';
import { Admin, Client, Message } from 'types';

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [] as Client[],
    clientSelected: null as Client | null,
    self: null as Admin | null,
  }),
  actions: {
    SOCKET_self(payload: Admin) {
      this.self = payload;
    },
    SOCKET_list(payload: Client[]) {
      this.clients = payload;
      // When the list is updated the clientSelected loses it reactivity
      // This will reset the correct clientSelected based on the new list
      if (this.clientSelected) {
        const currentSelectedId = this.clientSelected.id;
        this.clientSelected =
          this.clients.find((client) => client.id === currentSelectedId) ||
          null;
      }
    },
    SOCKET_message(payload: { id: string; message: Message }) {
      const client = this.clients.find((c) => c.id === payload.id);
      if (client) {
        client.messages.push(payload.message);
      }
    },
    SOCKET_client_status(payload: { id: string; status: boolean }) {
      const client = this.clients.find((c) => c.id === payload.id);
      if (client) {
        client.connected = payload.status;
      }
    },
    SOCKET_client_typing(payload: { id: string; text: string }) {
      const client = this.clients.find((c) => c.id === payload.id);
      if (client) {
        client.typing = payload.text;
      }
    },
    setClientSelected(payload: Client) {
      this.clientSelected = payload;
    },
  },
});
