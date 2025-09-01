import { useEffect, useState, useCallback } from 'react';
import Card from '@/components/ui/Card';
import { Package, Plane, PackageCheck, Drone as DroneIcon } from 'lucide-react';
import { getPedidos, getDrones, triggerAlocacao } from '@/services/api'; // Importa a função de alocação
import toast from 'react-hot-toast'; // Importa o toast para feedback
import {
  translateStatus,
  translatePriority,
  getPriorityColor,
} from '@/utils/translations';
import type { Pacote, Drone } from '@/types/types';

export default function Dashboard() {
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [drones, setDrones] = useState<Drone[]>([]);
  const [isAllocating, setIsAllocating] = useState(false); // Estado de controle para o botão

  const fetchData = useCallback(async () => {
    try {
      const [pedidosResponse, dronesResponse] = await Promise.all([
        getPedidos(),
        getDrones(),
      ]);
      setPacotes(pedidosResponse.data);
      setDrones(dronesResponse.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  // Função para acionar a distribuição de pacotes
  const handleAlocacao = async () => {
    setIsAllocating(true);
    const loadingToast = toast.loading('Otimizando e distribuindo pacotes...');

    try {
      const response = await triggerAlocacao();
      toast.success(response.data.message || 'Distribuição concluída!', { id: loadingToast });
      console.log('Detalhes da alocação:', response.data.details);
      fetchData(); 
    } catch (error) { // <-- Altere 'error' para '_error' aqui
      toast.error('Falha na distribuição dos pacotes.', { id: loadingToast });
      console.log('Falha ao distribuir os pacotes',error)
    } finally {
      setIsAllocating(false);
    }
  };

  const pendentes = pacotes.filter((p) => p.status === 'PENDING').length;
  const emEntrega = pacotes.filter((p) => p.status === 'IN_TRANSIT').length;
  const entregues = pacotes.filter((p) => p.status === 'DELIVERED').length;
  const dronesDisponiveis = drones.filter((d) => d.status === 'IDLE').length;
  const pacotesPendentes = pacotes.filter((p) => p.status === 'PENDING');

  return (
    <section className="p-8 w-full flex-col gap-10">
      <div className="flex justify-between items-center mb-7">
        <h1 className="text-3xl font-bold opacity-90 text-(--color-text)">
          Dashboard
        </h1>
        {/* BOTÃO PARA DISTRIBUIR OS PACOTES */}
        <button
          onClick={handleAlocacao}
          disabled={isAllocating || pendentes === 0}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isAllocating ? 'Distribuindo...' : 'Distribuir Pedidos'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4 gap-4">
        <Card title="Pedidos Pendentes" icon={<Package />} value={pendentes} infoCard={true} description="Aguardando processamento" />
        <Card title="Em Entrega" icon={<Plane />} value={emEntrega} infoCard={true} description="Drones em movimento" />
        <Card title="Entregues" icon={<PackageCheck />} value={entregues} infoCard={true} description="Total de entregas " />
        <Card title="Drones Disponíveis" icon={<DroneIcon />} value={dronesDisponiveis} infoCard={true} description="Aguardando processamento" />
      </div>
      <aside className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4 mt-5 gap-8 ">
        <Card infoCard={false} style="col-1 col-end-4 ">
          <h2 className="text-base font-semibold opacity-90 ">
            Pedidos Pendentes
          </h2>
          <ul className="pt-4 flex flex-col gap-2 text-sm">
            {pacotesPendentes.length > 0 ? (
              pacotesPendentes.map((pacote) => (
                <li key={pacote.id} className="flex justify-between items-center p-2 bg-(--border-color) rounded-md">
                  <div className="flex flex-col">
                    <span className="font-bold">Pacote #{pacote.id}</span>
                    <span className="text-xs opacity-70">Coord: (X: {pacote.destinationX}, Y: {pacote.destinationY})</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor(pacote.priority)}`}>
                    {translatePriority(pacote.priority)}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-sm opacity-60 mt-4">Nenhum pedido pendente no momento.</p>
            )}
          </ul>
        </Card>
        <Card infoCard={false} style='max-h-70 overflow-y-auto col-1 col-end-4 lg:grid-cols-2 lg:col-4'>
          <h2 className="text-base font-semibold opacity-90">
            Status dos drones
          </h2>
          <ul className="pt-4 flex flex-col gap-3">
            {drones.map((drone) => (
              <li key={drone.id} className="flex justify-between">
                <span className="flex items-center gap-3 justify-between">
                  <div className={`h-3 w-3 rounded-full ${drone.status === 'IDLE' ? 'bg-green-500' : drone.status === 'CHARGING' ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                  <p className='text-sm'>{drone.model} #{drone.id}</p>
                </span>
                <span className="flex items-center gap-2 text-xs">
                  <p className="py-1 px-3 bg-(--border-color) rounded-xl">{translateStatus(drone.status)}</p>
                  <p className="opacity-70">{drone.battery}%</p>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </aside>
    </section>
  );
}