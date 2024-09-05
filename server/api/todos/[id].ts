import { defineEventHandler, readBody, createError } from 'h3';

// Simulación de base de datos en memoria
const todos: Array<{ id: string, title: string, completed: boolean }> = []; // Debe coincidir con el archivo index.ts

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    return createError({ statusCode: 400, message: 'ID de tarea no proporcionado' });
  }

  if (event.req.method === 'PATCH') {
    try {
      const body = await readBody(event);
      const { title, completed } = body as { title?: string, completed?: boolean };

      const todoIndex = todos.findIndex(todo => todo.id === id);
      if (todoIndex === -1) {
        return createError({ statusCode: 404, message: 'Tarea no encontrada' });
      }

      if (title !== undefined) todos[todoIndex].title = title;
      if (completed !== undefined) todos[todoIndex].completed = completed;

      return todos[todoIndex];
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      return createError({ statusCode: 500, message: 'Error al actualizar la tarea' });
    }
  } else if (event.req.method === 'DELETE') {
    try {
      const todoIndex = todos.findIndex(todo => todo.id === id);
      if (todoIndex === -1) {
        return createError({ statusCode: 404, message: 'Tarea no encontrada' });
      }

      todos.splice(todoIndex, 1);

      return { message: 'Tarea eliminada' };
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      return createError({ statusCode: 500, message: 'Error al eliminar la tarea' });
    }
  } else {
    return createError({ statusCode: 405, message: 'Método no permitido' });
  }
});
