import { defineEventHandler, H3Event, createError } from 'h3';

// Lista de rutas protegidas
const protectedRoutes = ['/api/todos']; 

export default defineEventHandler(async (event: H3Event) => {
  const { req } = event;

  if (!req || !req.headers) {
    // Manejar el caso en el que `req` o `req.headers` sean indefinidos
    console.error('Request or headers are undefined');
    return createError({ statusCode: 500, message: 'Internal Server Error' });
  }

  const url = req.url || ''; 

  // Verifica si la ruta es protegida
  if (protectedRoutes.some(route => url.startsWith(route))) {
    const token = req.headers['x-authorization'];

    if (!token) {
      console.error('Token not provided');
      return createError({ statusCode: 401, message: 'Token not provided' });
    }

    console.log('Received Token:', token);

    // Si el token es válido se continúa 
  } else {
    console.log('No token required for:', url);
  }
});
