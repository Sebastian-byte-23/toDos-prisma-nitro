import { ToDo } from './types';
import { FormularioCreacionTarea, FormularioActualizacionTarea } from "../../utils/schemas/task"; // Importa los tipos de entrada
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"; // Importa la clase de error de Prisma
import { client } from '../prisma';

// Función para obtener el último ID de la base de datos
export async function getLastId(): Promise<number | null> {
  const lastToDo = await client.toDo.findFirst({
    orderBy: {
      id: 'desc', // Ordenar por ID en orden descendente
    },
  });

  return lastToDo ? lastToDo.id : null; // Retornar el último ID o null si no hay tareas
}

// Función para agregar una nueva tarea a la base de datos
export async function addToDo(toDo: FormularioCreacionTarea): Promise<ToDo> {
  // Validamos que todos los campos requeridos están presentes
  if (!toDo.userId || typeof toDo.userId !== 'number') {
    throw new Error("El campo 'userId' es obligatorio y debe ser un número.");
  }
  if (!toDo.title || typeof toDo.title !== 'string') {
    throw new Error("El campo 'title' es obligatorio y debe ser una cadena de texto.");
  }

  // Desestructuramos los datos y añadimos un valor por defecto a `completed`
  const { userId, title, completed = false } = toDo;

  // Intentamos crear la tarea en la base de datos
  try {
    // Obtener el último ID utilizado
    const lastId = await getLastId();
    const newId = lastId ? lastId + 1 : 1; // Incrementar el ID o empezar desde 1

    const newToDo = await client.toDo.create({
      data: {
        id: newId, // Asignar el nuevo ID
        title,
        completed,
        userId, // Relacionamos la tarea con el ID del usuario
      },
    });
    if (!newToDo) {
      throw new Error("No se pudo crear la tarea. Verifica la base de datos.");
    }

    // Convertimos el ID a string para cumplir con el tipo `ToDo`
    return {
      ...newToDo,
      id: newToDo.id.toString(),
    };
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    throw new Error("No se pudo crear la tarea.");
  }
}

// Función para actualizar una tarea por ID
export async function updateToDoById(id: number, data: Partial<FormularioActualizacionTarea>): Promise<ToDo | null> {
  if (!id || typeof id !== 'number') {
    throw new Error("El ID de la tarea debe ser un número válido.");
  }

  try {
    const updatedToDo = await client.toDo.update({
      where: { id },
      data,
    });

    // Convertimos el ID a string para cumplir con la interfaz
    return {
      ...updatedToDo,
      id: updatedToDo.id.toString(),
    };
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new Error("Tarea no encontrada.");
    }
    return null;
  }
}

// Función para encontrar una tarea por ID
export async function findToDoById(id: number): Promise<ToDo | null> {
  if (!id || typeof id !== 'number') {
    throw new Error("El ID de la tarea debe ser un número válido.");
  }

  const toDo = await client.toDo.findUnique({
    where: { id },
  });

  // Si la tarea existe, convertir el ID a string
  return toDo ? { ...toDo, id: toDo.id.toString() } : null;
}

// Función para eliminar una tarea por ID
export async function deleteToDoById(id: number): Promise<boolean> {
  if (!id || typeof id !== 'number') {
    throw new Error("El ID de la tarea debe ser un número válido.");
  }

  try {
    await client.toDo.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Error al eliminar la tarea:', error);
      if (error.code === 'P2025') {
        return false; // Tarea no encontrada
      }
    }
    throw error;
  }
}

// Función para obtener todas las tareas de un usuario
export async function getToDosByUser(userId: number): Promise<ToDo[]> {
  if (!userId || typeof userId !== 'number') {
    throw new Error("El ID del usuario debe ser un número válido.");
  }

  const toDos = await client.toDo.findMany({
    where: { userId },
  });

  // Convertir los IDs de cada tarea a string
  return toDos.map(toDo => ({ ...toDo, id: toDo.id.toString() }));
}
