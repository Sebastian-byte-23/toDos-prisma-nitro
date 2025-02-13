import { defineEventHandler, readBody } from 'h3';
import * as v from 'valibot';
import { createTaskSchema } from '../../utils/schemas/task'; // Importa el esquema de validación
import { addToDo, getLastId } from '../../utils/repositories/toDos'; // Importa las funciones

// Función para validar y obtener el cuerpo de la solicitud
const getValidatedBody = async (event, schema) => {
  const body = await readBody(event); // Obtener el cuerpo de la solicitud
  return v.parse(schema, body); // Validar el cuerpo utilizando el esquema
};

export default defineEventHandler(async (event) => {
  const method = event.req.method;

  if (method === 'POST') {
    try {
      // Validar y obtener el cuerpo de la solicitud utilizando el esquema de creación de tareas
      const validatedData = await getValidatedBody(event, createTaskSchema);

      // Validar el campo 'completed' manualmente
      if (validatedData.completed !== undefined && typeof validatedData.completed !== 'boolean') {
        throw new Error('El campo completed debe ser un valor booleano o estar ausente');
      }

      const userId = validatedData.userId || 1; // Obtener el userId, reemplazar con el ID del usuario autenticado

      // Obtener el último ID y asignar el nuevo ID, comenzando desde 1
      const lastId = await getLastId(); // Función que obtiene el último ID utilizado
      const newId = lastId ? lastId + 1 : 1; // Incrementar el ID o empezar desde 1

      // Crear un objeto que cumpla con FormularioCreacionTarea
      const newToDoData = {
        id: newId, // Asignar el nuevo ID
        title: validatedData.title,
        completed: validatedData.completed || false,
        userId, // Asegúrate de que 'userId' esté en el objeto
      };

      // Agregar la nueva tarea en la base de datos
      const newToDo = await addToDo(newToDoData); // Solo pasamos el objeto completo

      // Establecer el código de estado 201 para una operación exitosa
      event.res.statusCode = 201;
      return newToDo; // Devolver el ToDo recién creado
    } catch (error) {
      // Manejar errores de validación y creación
      console.error('Error de creación de tarea:', error); // Mensaje de depuración
      event.res.statusCode = 400;
      return { error: 'Datos de creación inválidos', details: error.message || error };
    }
  } else {
    // Manejar el caso en que el método no sea POST
    event.res.statusCode = 405; // Método no permitido
    return { error: 'Método no permitido' };
  }
});
