import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    collapsed: true,
  }),
  actions: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
  },
});
