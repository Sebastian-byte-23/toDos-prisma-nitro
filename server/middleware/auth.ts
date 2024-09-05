import { defineEventHandler, H3Event, send, createError } from 'h3';

// Lista de rutas protegidas
const protectedRoutes = ['/api/todos']; // Añadir más rutas protegidas según sea necesario

export default defineEventHandler(async (event: H3Event) => {
  const { req } = event;

  if (!req || !req.headers) {
    // Manejar el caso en el que `req` o `req.headers` sean indefinidos
    console.error('Request or headers are undefined');
    return createError({ statusCode: 500, message: 'Internal Server Error' });
  }

  const url = req.url || ''; // Asegúrate de que `url` tenga un valor por defecto

  // Verificar si la ruta es protegida
  if (protectedRoutes.some(route => url.startsWith(route))) {
    const token = req.headers['x-authorization'];

    if (!token) {
      console.error('Token not provided');
      return createError({ statusCode: 401, message: 'Token not provided' });
    }

    console.log('Received Token:', token);

    // Aquí deberías agregar la lógica para verificar el token.
    // Simulación de validación de token
    // Por ejemplo, podrías comparar el token con un valor predefinido o hacer una llamada a un servicio de autenticación.
    // const validToken = 'tu_token_de_validacion'; // Token válido predefinido para simulación
    // if (token !== validToken) {
    //   console.error('Invalid Token');
    //   return createError({ statusCode: 403, message: 'Invalid Token' });
    // }

    // Si el token es válido, continúa con el manejo de la solicitud
  } else {
    console.log('No token required for:', url);
  }

  // Si la ruta no es protegida, simplemente continua con el manejo de la solicitud
});
