import { PrismaClient } from "@prisma/client";
import credentials from "./credential.json" assert { type: "json" };

const client = new PrismaClient();

// Función para obtener el próximo ID disponible
async function getNextId() {
  const users = await client.user.findMany();
  const ids = users.map(user => user.id); // Asegúrate de que el ID sea un número
  return ids.length > 0 ? Math.max(...ids) + 1 : 1; // Devuelve el próximo ID disponible
}

// Crear un nuevo usuario
async function createUser() {
  const newId = await getNextId(); // Obtener el próximo ID

  await client.user.create({
    data: {
      id: newId, // Asegúrate de que el ID sea un número
      username: credentials.username,
      name: credentials.name,
      password: credentials.password, // Contraseña encriptada
    },
  });

  console.log('Usuario creado correctamente');
}

createUser().catch(e => {
  console.error(e);
}).finally(async () => {
  await client.$disconnect();
});
