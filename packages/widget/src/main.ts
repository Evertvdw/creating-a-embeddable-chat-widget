import App from './App.vue';
import { createPinia } from 'pinia';
import { createApp, defineCustomElement, h, getCurrentInstance } from 'vue';
import { Quasar } from 'quasar';
import io from 'socket.io-client';
import { useSocketStore } from './stores/socket';

const app = createApp(App);

app.use(createPinia());
app.use(Quasar, { plugins: {} });

const URL = import.meta.env.VITE_SOCKET_URL;
const socketStore = useSocketStore();
const socket = io(URL, {
  auth: {
    clientID: socketStore.id,
  },
});

app.provide('socket', socket);

const chatWidget = defineCustomElement({
  render: () => h(App),
  styles: App.styles,
  props: {},
  setup() {
    const instance = getCurrentInstance();
    Object.assign(instance?.appContext, app._context);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    Object.assign(instance?.provides, app._context.provides);
  },
});

customElements.define('chat-widget', chatWidget);
