import { defineEventHandler, readBody } from 'h3';
import * as v from 'valibot';
import { validarCreacionTarea } from '../../utils/schemas/task'; // Asegúrate de que este esquema esté bien definido
import { addToDo } from '../../utils/repositories/toDos'; // Importa la función para agregar tareas

// Función para validar y obtener el cuerpo de la solicitud
const getValidatedBody = async (event, schema) => {
  const body = await readBody(event); // Obtener el cuerpo de la solicitud
  return v.parse(schema, body); // Validar el cuerpo utilizando el esquema
};

// Manejar la creación de tareas
export default defineEventHandler(async (event) => {
  
  try {
    // Validar y obtener el cuerpo de la solicitud
    const validatedData = await getValidatedBody(event, validarCreacionTarea);
    
    // Validar el campo 'userId'
    if (!validatedData.userId || typeof validatedData.userId !== 'number') {
      throw new Error('El campo userId es obligatorio y debe ser un número válido.');
    }

    // Crear un objeto que cumpla con el tipo esperado para la tarea
    const newToDoData = {
      title: validatedData.title,
      completed: validatedData.completed || false, // Si no se proporciona, se establece como false
      userId: validatedData.userId,
    };

    // Agregar la nueva tarea en la base de datos
    const newToDo = await addToDo(newToDoData);

    // Establecer el código de estado 201 para una operación exitosa
    event.res.statusCode = 201;
    return newToDo; // Devolver el ToDo recién creado
  } catch (error) {
    // Manejar errores de validación y creación
    console.error('Error de creación de tarea:', error);

    if (error.name === 'ValidationError') {
      event.res.statusCode = 400; // Código de estado para errores de validación
      return { error: 'Datos de creación inválidos', details: error.errors };
    }
    
    event.res.statusCode = 500; // Error interno del servidor
    return { error: 'Error interno del servidor', details: error.message };
  }
});
