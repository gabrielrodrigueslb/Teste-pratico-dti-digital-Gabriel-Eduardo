import * as packageService from '../services/packageService.js';

export async function getPackages(req, res) {
  try {
    // Esta é a versão correta, que passa o filtro (req.query) para o service
    const packages = await packageService.getAllPackages(req.query);
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pacotes.' });
  }
}

// Função para criar um novo pacote (estava faltando)
export async function createPackage(req, res) {
  try {
    const newPackage = await packageService.createPackage(req.body);
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}