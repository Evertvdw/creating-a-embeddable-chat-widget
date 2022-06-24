import { defineStore } from 'pinia';
import { Message } from 'types';

export const useSocketStore = defineStore('socket', {
  state: () => ({
    messages: [] as Message[],
    id: localStorage.getItem('clientID'),
    admin_typing: false,
  }),
  actions: {
    SOCKET_message(payload: Message) {
      this.messages.push(payload);
    },
    SOCKET_messages(payload: Message[]) {
      this.messages = payload;
    },
    SOCKET_id(payload: string) {
      localStorage.setItem('clientID', payload);
      this.id = payload;
    },
    SOCKET_admin_typing(payload: boolean) {
      this.admin_typing = payload;
    },
  },
});
