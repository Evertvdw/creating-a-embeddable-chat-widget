import { defineStore } from 'pinia';
import { Message } from 'types';
import faker from '@faker-js/faker/locale/en';

export const useSocketStore = defineStore('socket', {
  state: () => ({
    messages: [] as Message[],
    id: localStorage.getItem('clientID'),
    name: localStorage.getItem('clientName') || '',
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
    setName() {
      const name = faker.name.firstName();
      this.name = name;
      localStorage.setItem('clientName', name);
    },
  },
});
