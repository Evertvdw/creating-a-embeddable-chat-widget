import { defineStore } from 'pinia';
import { AdminPublic, Message } from 'types';

export const useSocketStore = defineStore('socket', {
  state: () => ({
    messages: [] as Message[],
    id: localStorage.getItem('clientID'),
    admin_typing: false,
    adminList: [] as AdminPublic[],
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
    SOCKET_admin_list(payload: AdminPublic[]) {
      this.adminList = payload;
    },
  },
});
