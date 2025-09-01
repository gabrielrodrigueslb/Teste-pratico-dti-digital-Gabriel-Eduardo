import * as dronesService from '../services/dronesService.js';

export async function allAvaibleDrones(req, res) {
  try {
    const drones = await dronesService.getAllAvaibleDrones();
    res.status(200).json(drones);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar drones disponíveis.' });
  }
}

export async function createDrone(req, res) {
  try {
    const newDrone = await dronesService.createDrone(req.body);
    res.status(201).json(newDrone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function updateDrone(req, res) {
  try {
    const droneId = parseInt(req.params.id, 10);
    const updatedDrone = await dronesService.updateDrone(droneId, req.body);
    res.status(200).json(updatedDrone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}