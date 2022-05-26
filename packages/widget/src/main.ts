import ChatWidget from './App.vue';
import { createPinia } from 'pinia';
import { createApp, defineCustomElement, h, getCurrentInstance } from 'vue';
import { Quasar } from 'quasar';

const app = createApp(ChatWidget);

app.use(createPinia());
app.use(Quasar, { plugins: {} });

const chatWidget = defineCustomElement({
  render: () => h(ChatWidget),
  styles: ChatWidget.styles,
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
