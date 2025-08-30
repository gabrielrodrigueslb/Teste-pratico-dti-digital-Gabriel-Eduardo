import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Apaga todos os drones existentes para evitar duplicatas ao rodar o seed várias vezes
  await prisma.drone.deleteMany();
  console.log('Drones antigos deletados.');

  // Cria novos drones
  await prisma.drone.createMany({
    data: [
      { model: 'Lightweight', maxWeight: 2, battery: 100 },
      { model: 'Standard', maxWeight: 5, battery: 100 },
      { model: 'Heavy-Duty', maxWeight: 10, battery: 100 },
    ],
  });
  console.log('Novos drones criados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Fecha a conexão com o banco de dados
    await prisma.$disconnect();
  });