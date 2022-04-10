import App from './App.vue';
import { createPinia } from 'pinia';
import { defineCustomElement, createApp } from 'vue';

const app = createApp(App);

app.use(createPinia());

const chatWidget = defineCustomElement(App);

customElements.define('chat-widget', chatWidget);
