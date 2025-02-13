import * as v from 'valibot';

// Definición del esquema de inicio de sesión
export const LoginSchema = v.object({
  username: v.pipe(v.string(), v.minLength(3, 'El nombre de usuario debe tener al menos 3 caracteres')),
  password: v.pipe(v.string(), v.minLength(6, 'La contraseña debe tener al menos 6 caracteres')),
});


