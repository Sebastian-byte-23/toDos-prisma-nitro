import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  event.res.statusCode = 200;
  event.res.setHeader('Content-Type', 'text/plain');
  event.res.end('Hello World!');
});
