import { defineStore } from 'pinia';
import { socket } from 'src/boot/socket';

export enum AuthStatus {
  init,
  loading,
  success,
  error,
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('jwt') || '',
    status: AuthStatus.init,
    urlAfterLogin: '/clients',
  }),
  getters: {
    isAuthenticated: (state) => state.status === AuthStatus.success,
  },
  actions: {
    async login(payload: { email: string; password: string }) {
      this.status = AuthStatus.loading;
      const response = await fetch(
        `${import.meta.env.VITE_SOCKET_URL}/auth/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      console.log('[DEBUG] login response', response.ok, response.status);
      if (response.ok) {
        this.status = AuthStatus.success;

        const token = await response.text();
        localStorage.setItem('jwt', token);
        this.token = token;
        socket.io.opts.query = { token };

        console.log('[DEBUG]: login response', token);
      } else this.status = AuthStatus.error;
    },
    async refresh_token() {
      const response = await fetch(
        `${import.meta.env.VITE_SOCKET_URL}/auth/refresh_token`,
        {
          credentials: 'include',
        }
      );
      if (response.ok) {
        const token = await response.text();
        localStorage.setItem('jwt', token);
        this.token = token;
        socket.io.opts.query = { token };
        console.log('[DEBUG] refresh_token response', token);
        return true;
      } else {
        return false;
      }
    },
    logout() {
      this.status = AuthStatus.init;
      localStorage.removeItem('jwt');
      this.token = '';
    },
  },
});
