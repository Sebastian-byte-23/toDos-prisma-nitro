import { defineEventHandler, readBody } from 'h3'; // Asegúrate de ajustar la ruta correcta a tu archivo de tipos
import { users } from '../../utils/repositories/users'; // Asegúrate de importar tu lista de usuarios
import { scryptSync, randomBytes } from 'node:crypto';



export default defineEventHandler(async (event) => {
  
  const body = await readBody(event);
  
  const { username, password } = body;

  // Verificar que los datos fueron enviados en el formato correcto
  if (!username || !password) {
    event.res.statusCode = 400;
    return { error: 'Faltan campos obligatorios' };
  }

  const user = users.find((u) => u.username === username);

  // Verificar si el usuario existe
  if (!user) {
    event.res.statusCode = 401;
    return { error: 'Usuario no existe' };
  }

  // Separar la sal y la llave
  const [salt, storedKey] = user.password.split(':');

  // Derivar la llave usando la misma sal
  const derivedKey = scryptSync(password, salt, 64).toString('hex');

  // Verificar si la contraseña es correcta
  if (storedKey !== derivedKey) {
    event.res.statusCode = 401;
    return { error: 'Contraseña incorrecta' };
  }
  if (event.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }
  // Generar un token para el usuario
  const token = randomBytes(48).toString('hex');
  user.token = token;

  return {
    username: user.username,
    name: user.name,
    token: user.token,
  };
});
function createError(arg0: { statusCode: number; statusMessage: string; }) {
  throw new Error('Function not implemented.');
}

