// /api/auth/logout.ts
import { defineEventHandler, createError } from 'h3'
import { users } from '../../utils/repositories/users';

export default defineEventHandler(async (event) => {
  // Verificar que el método sea POST
  if (event.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'HTTP method not allowed',
    });
  }

  // Obtener el token de la cabecera
  const token = event.req.headers['x-authorization'];

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No token provided',
    });
  }

  // Buscar al usuario por el token
  const user = users.find(u => u.token === token);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    });
  }



  return {
    message: 'Successfully logged out',
  };
});
