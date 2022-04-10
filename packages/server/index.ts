import express from 'express';
import { createServer } from 'http';

const app = express();

const server = createServer(app);

server.listen(5000, () => {
  console.log(
    `Server started on port ${5000} at ${new Date().toLocaleString()}`
  );
});
