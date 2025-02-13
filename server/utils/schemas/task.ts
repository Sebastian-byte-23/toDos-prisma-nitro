import * as v from 'valibot';

export const createTaskSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1), v.trim()), // Asegurar que el título no esté vacío y eliminar espacios
  completed: v.any(), // Permitir un valor booleano o undefined
  userId: v.optional(v.pipe(v.number(), v.integer())), // ID del usuario opcional, debe ser un número entero si se proporciona
  // ID del usuario que crea la tarea, debe ser un número entero
});

// Inferir el tipo de entrada a partir del esquema
export type FormularioCreacionTarea = v.InferInput<typeof createTaskSchema>;

// Crear una función de validación
export const validarCreacionTarea = v.parser(createTaskSchema);

// Esquema de validación para la actualización de tareas
export const updateTaskSchema = v.object({
  title: v.optional(v.pipe(v.string(), v.minLength(1), v.trim())), // El título es opcional, pero si se proporciona, no debe estar vacío
  completed: v.optional(v.boolean()), // El campo "completed" debe ser un booleano si se proporciona
  userId: v.optional(v.pipe(v.number(), v.integer())), // ID del usuario opcional, debe ser un número entero si se proporciona
});

// Inferir el tipo de entrada a partir del esquema
export type FormularioActualizacionTarea = v.InferInput<typeof updateTaskSchema>;

// Crear una función de validación
export const validarActualizacionTarea = (data: any) => {
  try {
    return v.parse(updateTaskSchema, data); // Realizar la validación
  } catch (error) {
    console.error("Error de validación:", error);
    throw new Error('Datos de validación inválidos');
  }
};