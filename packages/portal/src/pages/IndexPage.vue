<template>
  <q-page :style-fn="fullPage">
    <ClientChat />
  </q-page>
</template>

<script setup lang="ts">
import ClientChat from 'src/components/ClientChat.vue';

function fullPage(offset: number) {
  return { height: offset ? `calc(100vh - ${offset}px)` : '100vh' };
}
</script>
