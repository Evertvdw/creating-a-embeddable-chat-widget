import { defineStore } from 'pinia';
import { Message } from 'types';

export const useSocketStore = defineStore('socket', {
  state: () => ({
    messages: [] as Message[],
    id: localStorage.getItem('clientID'),
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
  },
});
