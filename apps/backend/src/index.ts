import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/health', (c) => {
  return c.text('OK');
});

export default {
  port: 4000,
  hostname: '0.0.0.0',
  fetch: app.fetch,
};
