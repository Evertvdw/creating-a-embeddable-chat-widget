<template>
  <div v-if="clientStore.clientSelected" class="fit column">
    <div class="text-h6 q-pa-md">
      Chat with {{ clientStore.clientSelected.name }}
    </div>
    <q-separator></q-separator>
    <div class="col q-pa-md">
      <div
        v-for="(message, index) in clientStore.clientSelected.messages"
        :key="index"
      >
        {{ message.message }}
      </div>
    </div>
    <div class="q-pa-md row items-center">
      <q-input
        v-model="text"
        outlined
        placeholder="Type your message here"
        class="col"
      />
      <div class="q-pl-md">
        <q-btn
          outline
          round
          icon="send"
          :disabled="!text"
          @click="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useClientStore } from 'src/stores/client';
import { socket } from 'src/boot/socket';
import { Message, MessageType } from 'types';

const clientStore = useClientStore();
const text = ref('');

function sendMessage() {
  if (clientStore.clientSelected) {
    const message: Message = {
      time: Date.now(),
      message: text.value,
      type: MessageType.Admin,
    };
    socket.emit('admin:message', {
      id: clientStore.clientSelected.id,
      message,
    });
    text.value = '';
  }
}
</script>

<style lang="scss"></style>
