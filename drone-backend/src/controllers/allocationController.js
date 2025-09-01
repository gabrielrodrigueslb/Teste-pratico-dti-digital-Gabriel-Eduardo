import * as allocationService from '../services/allocationService.js';

export async function allocatePackages(req, res) {
  try {
    const result = await allocationService.allocatePackages();
    res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao alocar pacotes:', error);
    res.status(500).json({ message: 'Erro ao alocar pacotes.' });
  }
}

export async function triggerCompletion(req, res) {
  try {
    // Agora esta chamada vai funcionar, pois a função existe no service
    const result = await allocationService.completeDeliveries();
    res.status(200).json(result);
  } catch (error){
    console.error('Erro no processo de finalização:', error);
    res.status(500).json({ message: 'Ocorreu um erro durante a finalização das entregas.' });
  }
}

export async function triggerRecharge(req, res) {
  try {
    const result = await allocationService.rechargeDrones();
    res.status(200).json(result);
  } catch (error) {
    console.error('Erro no processo de recarga:', error);
    res.status(500).json({ message: 'Ocorreu um erro durante a recarga dos drones.' });
  }
}