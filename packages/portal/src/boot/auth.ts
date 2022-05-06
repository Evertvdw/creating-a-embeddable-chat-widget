import { boot } from 'quasar/wrappers';
import { AuthStatus, useAuthStore } from 'src/stores/auth';
import { socket } from 'src/boot/socket';

export default boot(({ store, router }) => {
  const authStore = useAuthStore(store);

  if (authStore.token) {
    authStore.status = AuthStatus.success;
    socket.io.opts.query = { token: authStore.token };
    socket.connect();
  }

  socket.on('connect_error', async (err) => {
    console.log('[DEBUG] connect_error', err);
    if (err.message === 'Authentication error') {
      const refresh = await authStore.refresh_token();
      if (!refresh) {
        authStore.logout();
        router.push('/');
        socket.disconnect();
      } else {
        socket.connect();
      }
    }
  });

  router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.auth)) {
      if (!authStore.isAuthenticated) {
        authStore.urlAfterLogin = to.fullPath;
        next({
          path: '/',
        });
      } else {
        next();
      }
    }
    if (to.fullPath === '/' && authStore.isAuthenticated)
      next({ path: '/clients' });
    next();
  });
});
