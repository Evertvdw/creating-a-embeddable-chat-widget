import { defineStore } from 'pinia';
import { Message } from '../../../../types';

export const useSocketStore = defineStore('socket', {
  state: () => ({
    messages: [] as Message[],
  }),
  actions: {
    SOCKET_message(payload: Message) {
      this.messages.push(payload);
    },
  },
});
