import { defineEventHandler, readBody } from 'h3';
import { addToDo, getToDosByUser } from '../../utils/repositories/toDos'; // Asegúrate de que la ruta sea correcta

// listar y crear
export default defineEventHandler(async (event) => {
  const method = event.req.method;

  if (method === 'POST') {
    const userId = 1; // Aquí puedes reemplazar con el ID del usuario autenticado
    try {
      const todos = await getToDosByUser(userId);  // Obtener tareas desde la BD
      return todos;
    } catch (error) {
      event.res.statusCode = 500;
      return { error: 'Error al obtener las tareas' };
    }
  } else if (method === 'POST') {
    const body = await readBody(event);
    console.log(body); // Verifica el contenido del cuerpo

    if (!body.title) {
      event.res.statusCode = 400;
      return { error: 'El título es obligatorio' };
    }

    const userId = body.userId || 1; // Reemplazar con el ID del usuario autenticado
    try {
      const newToDo = await addToDo({
        userId,
        title: body.title,
        completed: body.completed || false, // Asegúrate de que esto sea un booleano
      });
      return newToDo; // Devolver el ToDo recién creado
    } catch (error) {
      console.error('Error al crear la tarea:', error); // Mensaje de error
      event.res.statusCode = 500;
      return { error: 'Error al crear la tarea' };
    }}})
