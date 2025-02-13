import { defineEventHandler } from 'h3';
import { deleteToDoById } from '../../utils/repositories/toDos'; // Importa la función que elimina tareas de la base de datos

export default defineEventHandler(async (event) => {
  const { params } = event.context; 
  if (!params || !params.id) {
    event.res.statusCode = 400;
    return { error: 'Parámetros no encontrados o ID no proporcionado' };
  }

  const id = Number(params.id); // Convertir el ID a número si es necesario
  if (isNaN(id)) {
    event.res.statusCode = 400;
    return { error: 'El ID debe ser un número válido' };
  }

  try {
    const success = await deleteToDoById(id); // Llama a la función que elimina la tarea de la base de datos
    if (!success) {
      event.res.statusCode = 404;
      return { error: 'Tarea no encontrada' };
    }

    event.res.statusCode = 204; // No Content, para indicar que la tarea fue eliminada
    return { mensaje: 'Tarea eliminada con éxito' };
  } catch (error) {
    event.res.statusCode = 500;
    return { error: 'Error al eliminar la tarea', details: error.message };
  }
});
