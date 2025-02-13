// /api/auth/logout.ts
import { defineEventHandler, createError } from 'h3';
import { PrismaClient } from '@prisma/client';

// Inicializar Prisma Client
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Verificar que sea un método POST
  if (event.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'HTTP method not allowed',
    });
  }

  // Obtener el token de la cabecera
  const token = event.req.headers['x-authorization'];

  // Asegúrate de que el token sea un string
  if (!token || Array.isArray(token)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No token provided',
    });
  }

  // Buscar al usuario por el token
  const user = await prisma.user.findFirst({
    where: { token }, // Usa `findFirst` si `token` no es único
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    });
  }

  // Opcional: Invalidar el token (por ejemplo, establecerlo como null o vacío)
  await prisma.user.update({
    where: { id: user.id }, // Utiliza el ID del usuario encontrado
    data: { token: null }, // O puedes usar "" para vaciar el token
  });

  // Respuesta exitosa
  event.res.statusCode = 204; // No Content
});
