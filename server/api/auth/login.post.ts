// /api/auth/login.ts
import { defineEventHandler, readBody } from 'h3';
import { scryptSync, randomBytes } from 'node:crypto';
import * as v from 'valibot';
import { LoginSchema } from '../../utils/schemas/login';
import { client } from '../../utils/prisma';

// Función para validar y obtener el cuerpo de la solicitud
const getValidatedBody = async (event, schema) => {
  const body = await readBody(event); // Obtener el cuerpo de la solicitud
  return v.parse(schema, body); // Validar el cuerpo utilizando el esquema
};

export default defineEventHandler(async (event) => {
  //Verificar que sea un método POST
  if (event.node.req.method !== 'POST') {
    // Establecer el código de estado y retornar un error
    event.res.statusCode = 405; // Método no permitido
    return { error: 'Method Not Allowed'};
  }


  try {
    // Validar y obtener el cuerpo de la solicitud
    const data = await getValidatedBody(event, LoginSchema);
    const { username, password } = data;

    // Verificar si el usuario existe en la base de datos
    const user = await client.user.findUnique({
      where: { username },
    });

    if (!user) {
      event.res.statusCode = 401; // Usuario no encontrado
      return { error: 'Usuario y/o contraseña incorrecta' };
    }

    // Separar la sal y la llave
    const [salt, storedKey] = user.password.split(':');

    // Derivar la llave usando la misma sal
    const derivedKey = scryptSync(password, salt, 64).toString('hex');

    // Verificar si la contraseña es correcta
    if (storedKey !== derivedKey) {
      event.res.statusCode = 401; // Contraseña incorrecta
      return { error: 'Usuario y/o contraseña incorrecta' };
    }

    // Generar un token para el usuario
    const token = randomBytes(48).toString('hex');

    // Actualizar el token en la base de datos
    await client.user.update({
      where: { username },
      data: { token },
    });

    // Devolver los detalles del usuario y el token
    return {
      username: user.username,
      name: user.name,
      token,
    };

  } catch (error) {
    // Manejar errores de validación
    if (error.name === 'ValidationError') {
      event.res.statusCode = 400;
      return { error: 'Error de validación', details: error.errors };
    }

    console.error('Error en el login:', error);
    event.res.statusCode = 500; // Error interno del servidor
    return { error: 'Error interno del servidor', details: error.message };
  }
});
