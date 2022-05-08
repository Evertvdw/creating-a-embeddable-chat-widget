import { boot } from 'quasar/wrappers';
import io from 'socket.io-client';
import { useClientStore } from 'src/stores/client';

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
});

export default boot(({ store }) => {
  const clientStore = useClientStore(store);

  // This will be called on the initial connection and also on reconnects
  socket.on('connect', () => {
    socket.emit('admin:add', 'Evert');
  });

  socket.onAny((event: string, ...args) => {
    if (event.startsWith('admin:')) {
      const eventName = event.slice(6);
      if (Object.hasOwn(clientStore, 'SOCKET_' + eventName)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        clientStore['SOCKET_' + eventName](...args);
      }
    }
    console.log(`[DEBUG] ${event}`, args);
  });
});

export { socket };
