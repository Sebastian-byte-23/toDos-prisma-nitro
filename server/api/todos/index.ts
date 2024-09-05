import { defineEventHandler, readBody, createError } from 'h3';
import { v4 as uuidv4 } from 'uuid';

// Simulación de base de datos en memoria
const todos: Array<{ id: string, title: string, completed: boolean }> = [];

export default defineEventHandler(async (event) => {
  if (event.req.method === 'POST') {
    try {
      const body = await readBody(event);
      const { title } = body as { title: string };

      if (!title || typeof title !== 'string') {
        return createError({ statusCode: 400, message: 'El título no fue enviado correctamente' });
      }

      const newTodo = {
        id: uuidv4(),
        title,
        completed: false,
      };

      todos.push(newTodo);

      return newTodo;
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      return createError({ statusCode: 500, message: 'Error al crear la tarea' });
    }
  } else if (event.req.method === 'GET') {
    try {
      return todos;
    } catch (error) {
      console.error('Error al listar las tareas:', error);
      return createError({ statusCode: 500, message: 'Error al listar las tareas' });
    }
  } else {
    return createError({ statusCode: 405, message: 'Método no permitido' });
  }
});
