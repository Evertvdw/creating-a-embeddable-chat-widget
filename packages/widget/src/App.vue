<template>
  <div class="chat-widget">
    Chat-widget says hi!
    <div>From the store: {{ mainStore.hello }}</div>
  </div>
</template>

<script setup lang="ts">
import io from 'socket.io-client';
import { onUnmounted } from 'vue';
import { useMainStore } from './stores/main';

const URL = 'http://localhost:5000';
const socket = io(URL);
const mainStore = useMainStore();

socket.on('connect_error', (err) => {
  console.log('connection error', err);
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

onUnmounted(() => {
  socket.off('connect_error');
});
</script>

<style lang="scss">
.chat-widget {
  background-color: red;
  color: white;
}
</style>
