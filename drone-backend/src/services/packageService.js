import { prisma } from '../lib/prisma.js';

export async function createPackage(packageData) {
  const { weight, destinationX, destinationY, priority } = packageData;

  // A partir daqui, as variáveis podem ser usadas sem erro
  if (weight == null || destinationX == null || destinationY == null) {
    throw new Error('Dados incompletos: Peso e destino são obrigatórios.');
  }

  const newPackage = await prisma.package.create({
    data: {
      weight,
      destinationX,
      destinationY,
      priority,
    },
  });
  return newPackage;
}

export async function getAllPackages(filters = {}) {
  const whereClause = {};

  if (filters.status) {
    whereClause.status = filters.status;
  }

  const packages = await prisma.package.findMany({
    where: whereClause,
    include: {
      drone: true,
    },
  });

  const priority = { HIGH: 3, MEDIUM: 2, LOW: 1 };

  packages.sort((a, b) => {
    const priorityA = priority[a.priority];
    const priorityB = priority[b.priority];
    return priorityB - priorityA; // Ordena em ordem decrescente de prioridade
  });

  return packages;
}
