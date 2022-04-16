<template>
  <q-list>
    <q-item-label header> Client list </q-item-label>
    <q-item
      v-for="client in clientStore.clients"
      :key="client.id"
      v-ripple
      class="q-my-sm"
      clickable
      @click="clientStore.setClientSelected(client)"
    >
      <q-item-section avatar>
        <q-avatar color="primary" text-color="white"
          >{{ client.name.charAt(0) }}
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ client.name }}</q-item-label>
        <q-item-label caption lines="1">{{ client.id }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-badge rounded :color="client.connected ? 'green' : 'red'" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useClientStore } from 'src/stores/client';

const clientStore = useClientStore();
</script>

<style lang="scss"></style>
