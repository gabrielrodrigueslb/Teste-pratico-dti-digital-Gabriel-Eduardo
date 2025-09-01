import { prisma } from '../lib/prisma.js';

export async function getAllAvaibleDrones() {
  const drones = await prisma.drone.findMany({
    include: {
      _count: {
        select: {
          packages: { where: { status: 'IN_TRANSIT' } },
        }
      }
    }
  });
  return drones;
}

// Função para criar um novo drone
export async function createDrone(data) {
  const { model, maxWeight, maxDistance } = data;
  if (!model || maxWeight == null || maxDistance == null) {
    throw new Error('Modelo, peso máximo e distância máxima são obrigatórios.');
  }

  return prisma.drone.create({
    data: {
      model,
      maxWeight,
      maxDistance,
      battery: 100,
      status: 'IDLE',
    },
  });
}

// Função para editar um drone existente
export async function updateDrone(id, data) {
  return prisma.drone.update({
    where: { id },
    data,
  });
}