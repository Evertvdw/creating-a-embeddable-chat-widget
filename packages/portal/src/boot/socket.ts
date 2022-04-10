import { boot } from 'quasar/wrappers';
import io from 'socket.io-client';

export default boot(({}) => {
  const URL = 'http://localhost:5000';
  const socket = io(URL);
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
});
