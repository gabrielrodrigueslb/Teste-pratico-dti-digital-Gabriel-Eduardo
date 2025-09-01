import { prisma } from '../lib/prisma.js';
import * as packageService from './packageService.js';

function calculateStripDistance(packages) {
  if (packages.length === 0) return 0;

  let totalDistance = 0;
  let lastX = 0;
  let lastY = 0;

  // Ordena os pacotes pela proximidade da  base (0,0) para otimizar o percurso
  const sortedPackages = [...packages].sort(
    (a, b) =>
      Math.abs(a.destinationX) +
      Math.abs(a.destinationY) -
      (Math.abs(b.destinationX) + Math.abs(b.destinationY)),
  );

  // Calcula a distância total do percurso
  for (const pkg of sortedPackages) {
    totalDistance +=
      Math.abs(pkg.destinationX - lastX) + Math.abs(pkg.destinationY - lastY);
    lastX = pkg.destinationX;
    lastY = pkg.destinationY;
  }

  // Adiciona a distância de volta à base (0,0)
  totalDistance += Math.abs(lastX) + Math.abs(lastY);

  return totalDistance / 10;
}

export async function allocatePackages() {
  const pendingPackages = await packageService.getAllPackages();
  const availableDrones = await prisma.drone.findMany({
    where: {
      status: 'IDLE',
      battery: { gt: 20 },
    },
  });

  if (availableDrones.length === 0) {
    return { message: 'Nenhum drone disponível com bateria suficiente para alocação.' };
  }

  const allocationLog = [];
  // NOVO: Um Set para rastrear todos os pacotes já alocados nesta rodada.
  const allocatedPackageIds = new Set();

  for (const drone of availableDrones) {
    let currentWeight = 0;
    const packagesForThisTrip = [];

    // Itera sobre os pacotes PENDENTES
    for (const pkg of pendingPackages) {
      // Pula o pacote se ele já foi alocado por um drone anterior.
      if (allocatedPackageIds.has(pkg.id)) {
        continue;
      }

      const potentialTripPackages = [...packagesForThisTrip, pkg];
      const potentialWeight = currentWeight + pkg.weight;
      const potentialDistance = calculateStripDistance(potentialTripPackages);

      if (
        potentialWeight <= drone.maxWeight &&
        potentialDistance <= drone.maxDistance &&
        potentialDistance <= drone.battery
      ) {
        packagesForThisTrip.push(pkg);
        currentWeight = potentialWeight;
      }
    }

    if (packagesForThisTrip.length > 0) {
      const packageIdsForThisTrip = packagesForThisTrip.map((pkg) => pkg.id);
      const finalDistance = calculateStripDistance(packagesForThisTrip);

      try {
        await prisma.$transaction([
          prisma.package.updateMany({
            where: { id: { in: packageIdsForThisTrip } },
            data: { status: 'IN_TRANSIT', droneId: drone.id },
          }),
          prisma.drone.update({
            where: { id: drone.id },
            data: {
              status: 'IN_FLIGHT',
              battery: { decrement: Math.round(finalDistance) },
            },
          }),
        ]);

        // Adiciona os IDs dos pacotes desta viagem ao controle central
        packageIdsForThisTrip.forEach(id => allocatedPackageIds.add(id));

        allocationLog.push(
          `Drone #${drone.id}(${drone.model}) alocado com ${packagesForThisTrip.length} pacote(s). Peso: ${currentWeight.toFixed(2)}kg. Distância: ${finalDistance.toFixed(2)}km. Bateria gasta: ${Math.round(finalDistance)}%.`
        );
      } catch (error) {
        console.error(`Falha ao alocar pacotes para o Drone #${drone.id}:`, error);
      }
    }
  }

  if (allocationLog.length === 0) {
    return { message: 'Nenhum pacote pôde ser alocado.' };
  }

  return {
    message: 'Alocação otimizada concluída.',
    details: allocationLog,
  };
}

export async function completeDeliveries() {
  // 1. Sua lógica inicial de buscar pacotes em trânsito (mantida)
  const packagesInTransit = await prisma.package.findMany({
    where: { status: 'IN_TRANSIT' },
  });

  if (packagesInTransit.length === 0) {
    return { message: 'Nenhuma entrega em andamento para finalizar.' };
  }

  // 2. Sua lógica de extrair e limpar os IDs (mantida e otimizada)
  const completedPackageIds = packagesInTransit.map((pkg) => pkg.id);
  const droneIdsFromPackages = [
    ...new Set(
      packagesInTransit.map((pkg) => pkg.droneId).filter((id) => id != null),
    ),
  ];

  // 3. Sua validação para o caso de não haver drones (mantida)
  if (droneIdsFromPackages.length === 0) {
    console.log(
      'Pacotes em trânsito encontrados, mas sem drones associados para liberar.',
    );
    await prisma.package.updateMany({
      where: { id: { in: completedPackageIds } },
      data: { status: 'DELIVERED' },
    });
    return {
      message: 'Entregas finalizadas, nenhum drone precisou ser liberado.',
    };
  }

  // Buscamos o estado atualizado dos drones para ver a bateria final deles
  const returningDrones = await prisma.drone.findMany({
    where: { id: { in: droneIdsFromPackages } },
  });

  const LOW_BATTERY_THRESHOLD = 20;
  const droneUpdatePromises = []; // Array para guardar as promessas de atualização

  // Decidimos o destino de cada drone individualmente
  for (const drone of returningDrones) {
    const shouldRecharge = drone.battery < LOW_BATTERY_THRESHOLD;

    droneUpdatePromises.push(
      prisma.drone.update({
        where: { id: drone.id },
        data: {
          status: shouldRecharge ? 'CHARGING' : 'IDLE',
          battery: shouldRecharge ? drone.battery : 100,
        },
      }),
    );
  }

  try {
    // Executa a atualização dos pacotes e todas as atualizações individuais dos drones
    await prisma.$transaction([
      prisma.package.updateMany({
        where: { id: { in: completedPackageIds } },
        data: { status: 'DELIVERED' },
      }),
      ...droneUpdatePromises,
    ]);

    // SEU RETORNO DETALHADO (mantido)
    return {
      message: `${packagesInTransit.length} entregas finalizadas com sucesso! Status dos drones atualizado.`,
      details: {
        packagesUpdated: completedPackageIds,
        dronesFreed: droneIdsFromPackages,
      },
    };
  } catch (error) {
    console.error('Falha ao finalizar entregas:', error);
    throw new Error(
      'Não foi possível atualizar o status das entregas e drones.',
    );
  }
}

export async function rechargeDrones() {
  const chargedDrones = await prisma.drone.updateMany({
    where: { status: 'CHARGING' },
    data: {
      status: 'IDLE',
      battery: 100,
    },
  });

  return {
    message: `${chargedDrones.count} drones foram recarregados e estão agora disponíveis.`,
  };
}
