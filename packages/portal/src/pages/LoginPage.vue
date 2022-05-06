<template>
  <q-page class="row justify-center items-center">
    <q-form class="q-gutter-md" @submit="onSubmit" @reset="onReset">
      <q-input v-model="email" filled label="Emailadress" />
      <q-input v-model="password" filled type="password" label="Password" />
      <div>
        <q-btn
          label="Login"
          type="submit"
          color="primary"
          :loading="authStore.status === AuthStatus.loading"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore, AuthStatus } from 'src/stores/auth';
import { useRouter } from 'vue-router';
import { socket } from 'src/boot/socket';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();
const router = useRouter();

async function onSubmit() {
  await authStore.login({ email: email.value, password: password.value });
  socket.connect();
  if (authStore.isAuthenticated) router.push(authStore.urlAfterLogin);
  onReset();
}

function onReset() {
  email.value = '';
  password.value = '';
}
</script>
