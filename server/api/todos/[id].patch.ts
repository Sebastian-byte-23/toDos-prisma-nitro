// /api/tasks/update.ts
import { defineEventHandler, readBody } from 'h3';
import { updateToDoById } from '../../utils/repositories/toDos'; // Importa la función para actualizar tareas
import { validarActualizacionTarea } from '../../utils/schemas/task'; // Importa tu nueva función de validación

// Función para validar y obtener el cuerpo de la solicitud
const getValidatedBody = async (event) => {
  const body = await readBody(event); // Obtener el cuerpo de la solicitud
  return validarActualizacionTarea(body); // Validar el cuerpo utilizando la nueva función
};

export default defineEventHandler(async (event) => {
  const { params } = event.context;
  
  // Validar parámetros
  if (!params || !params.id) {
    event.res.statusCode = 400;
    return { error: 'Parámetros no encontrados o ID no proporcionado' };
  }

  const id = Number(params.id); // Convertir el ID a número
  if (isNaN(id)) {
    event.res.statusCode = 400;
    return { error: 'El ID debe ser un número válido' };
  }

  try {
    // Validar y obtener el cuerpo de la solicitud utilizando la función de validación
    const validatedData = await getValidatedBody(event); 

    // Actualizar la tarea en la base de datos utilizando Prisma
    const updatedToDo = await updateToDoById(id, validatedData); // Aquí id es number

    if (!updatedToDo) {
      event.res.statusCode = 404;
      return { error: 'Tarea no encontrada' };
    }

    // Establecer el código de estado 200 para una operación exitosa
    event.res.statusCode = 200;
    return updatedToDo; // Devolver la tarea actualizada
  } catch (error) {
    // Manejar errores de validación y actualización
    console.error('Error en la actualización de tarea:', error);
    if (error.message === 'Datos de validación inválidos') {
      event.res.statusCode = 400;
      return { error: 'Datos de actualización inválidos', details: error.errors }; // Manejo específico para errores de validación
    }

    event.res.statusCode = 500; // Error interno del servidor
    return { error: 'Error interno del servidor', details: error.message || error };
  }
});
