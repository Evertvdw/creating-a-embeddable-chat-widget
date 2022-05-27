<template>
  <div class="chat-widget">
    <ChatMessages v-if="!mainStore.collapsed" />
    <q-btn
      size="lg"
      round
      color="primary"
      :icon="matChat"
      @click="mainStore.toggleCollapsed"
    />
  </div>
</template>

<script setup lang="ts">
import { AddClient } from 'types';
import { onUnmounted, watch, inject } from 'vue';
import { useSocketStore } from './stores/socket';
import { matChat } from '@quasar/extras/material-icons';
import { useMainStore } from './stores/main';
import ChatMessages from './components/ChatMessages.vue';
import { Socket } from 'socket.io-client';

const socket = inject('socket') as Socket;
const props = defineProps<{
  name: string;
}>();

const socketStore = useSocketStore();
const mainStore = useMainStore();

watch(
  () => socketStore.id,
  (val) => {
    socket.auth = {
      clientID: val,
    };
  }
);

const addClient: AddClient = {
  name: props.name,
};

// This will be called on the initial connection and also on reconnects
socket.on('connect', () => {
  socket.emit('client:add', addClient);
});

socket.onAny((event: string, ...args) => {
  if (event.startsWith('client:')) {
    const eventName = event.slice(7);
    if (Object.hasOwn(socketStore, 'SOCKET_' + eventName)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      socketStore['SOCKET_' + eventName](...args);
    }
  }
  console.log(`[DEBUG] ${event}`, args);
});

onUnmounted(() => {
  socket.off('connect_error');
});
</script>

<style lang="scss">
@import url('quasar/dist/quasar.prod.css');
@import './css/app.scss';

.chat-widget {
  --q-primary: #1976d2;
  --q-secondary: #26a69a;
  --q-accent: #9c27b0;
  --q-positive: #21ba45;
  --q-negative: #c10015;
  --q-info: #31ccec;
  --q-warning: #f2c037;
  --q-dark: #1d1d1d;
  --q-dark-page: #121212;
  --q-transition-duration: 0.3s;
  --animate-duration: 0.3s;
  --animate-delay: 0.3s;
  --animate-repeat: 1;
  --q-size-xs: 0;
  --q-size-sm: 600px;
  --q-size-md: 1024px;
  --q-size-lg: 1440px;
  --q-size-xl: 1920px;

  *,
  :after,
  :before {
    box-sizing: border-box;
  }

  font-family: -apple-system, Helvetica Neue, Helvetica, Arial, sans-serif;

  position: fixed;
  bottom: 16px;
  left: 16px;
}
</style>
