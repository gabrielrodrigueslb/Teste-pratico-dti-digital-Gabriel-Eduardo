// 1. IMPORTAÇÃO CORRIGIDA: 'type' é usado para importar apenas tipos.
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Drone, Pacote } from '@/types/types';


interface DroneData {
  model: string;
  maxWeight: number;
  maxDistance: number;
  battery?: number;
  status?: string;
}

interface NovoPedidoData {
  weight: number;
  destinationX: number;
  destinationY: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

// 2. NOVAS INTERFACES: Tipos para as respostas da API que antes usavam 'any'.
interface AllocationResult {
  message: string;
  details?: string[];
}

interface CompletionResult {
  message: string;
  details?: {
    packagesUpdated: number[];
    dronesFreed: number[];
  };
}

interface RechargeResult {
  message: string;
}

interface GetPedidosParams {
  params?: {
    status?: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED';
  }
}

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
});

// Pedidos
export const getPedidos = (config?: GetPedidosParams): Promise<AxiosResponse<Pacote[]>> => apiClient.get('/pedidos', config);
export const createPedido = (
  pedidoData: NovoPedidoData,
): Promise<AxiosResponse<Pacote>> => apiClient.post('/pedidos', pedidoData);

// Drones
export const getDrones = (): Promise<AxiosResponse<Drone[]>> => apiClient.get('/drones');

export const allocateManual = (
  droneId: number,
  packageIds: number[],
): Promise<AxiosResponse<AllocationResult>> =>
  apiClient.post(`/drones/${droneId}/alocar`, { packageIds });
export const createDrone = (data: DroneData): Promise<AxiosResponse<Drone>> =>
  apiClient.post('/drones', data);
export const updateDrone = (
  id: number,
  data: Partial<DroneData>,
): Promise<AxiosResponse<Drone>> => apiClient.put(`/drones/${id}`, data);

// Alocações
export const triggerAlocacao = (): Promise<AxiosResponse<AllocationResult>> =>
  apiClient.post('/alocacoes');
export const triggerFinalizacao = (): Promise<
  AxiosResponse<CompletionResult>
> => apiClient.post('/alocacoes/finalizar');
export const triggerRecarga = (): Promise<AxiosResponse<RechargeResult>> =>
  apiClient.post('/alocacoes/recarregar');
