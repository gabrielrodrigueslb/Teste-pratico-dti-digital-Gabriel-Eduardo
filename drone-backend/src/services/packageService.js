import {prisma} from '../lib/prisma.js';

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
