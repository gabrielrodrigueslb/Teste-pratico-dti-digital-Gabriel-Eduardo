import { useEffect, useState, useMemo, useCallback } from 'react';
import { getPedidos } from '@/services/api.ts';
import {
  translatePriority,
  getPriorityColor,
  translateStatus,
} from '@/utils/translations';
import NovoPedidoForm from '@/components/OrderForm/OrderForm';
import { ArrowUpDown } from 'lucide-react';
import type { Pacote, Drone } from '@/types/types';

type SortConfig = {
  key: keyof Pacote;
  direction: 'ascending' | 'descending';
};

export default function Pedidos() {
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'id',
    direction: 'ascending',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await getPedidos();
      setPacotes(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSuccess = () => {
    fetchData(); // Atualiza a lista de pedidos
    setIsModalOpen(false); // Fecha o modal
  };

  const sortedAndFilteredPacotes = useMemo(() => {
    let filtered = [...pacotes];

    //  Aplica o filtro de status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Aplica a ordenação
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [pacotes, statusFilter, sortConfig]);

  // Função para lidar com o clique no cabeçalho da tabela
  const requestSort = (key: keyof Pacote) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <div className="p-8">
        <p>Carregando pedidos...</p>
      </div>
    );
  }

  return (

    <section className="p-8 w-full flex flex-col">
      <div className="flex justify-between items-center mb-7">
        <h1 className="text-3xl font-bold opacity-90 text-(--color-text)">
          Gestão de Pedidos
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Novo Pedido
        </button>
      </div>

      {/* BOTÕES DE FILTRO */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-4 py-2 rounded-lg text-sm ${
            statusFilter === 'ALL'
              ? 'bg-blue-500 text-white'
              : 'bg-(--color-foreground)'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setStatusFilter('PENDING')}
          className={`px-4 py-2 rounded-lg text-sm ${
            statusFilter === 'PENDING'
              ? 'bg-blue-500 text-white'
              : 'bg-(--color-foreground)'
          }`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setStatusFilter('IN_TRANSIT')}
          className={`px-4 py-2 rounded-lg text-sm ${
            statusFilter === 'IN_TRANSIT'
              ? 'bg-blue-500 text-white'
              : 'bg-(--color-foreground)'
          }`}
        >
          Em Trânsito
        </button>
        <button
          onClick={() => setStatusFilter('DELIVERED')}
          className={`px-4 py-2 rounded-lg text-sm ${
            statusFilter === 'DELIVERED'
              ? 'bg-blue-500 text-white'
              : 'bg-(--color-foreground)'
          }`}
        >
          Entregues
        </button>
      </div>

      <div className="bg-(--color-foreground) rounded-lg p-4 overflow-x-auto">
        <table className="w-full text-left text-sm ">
          <thead>
            <tr className="border-b-2 border-(--border-color)">
              <th className="p-4 cursor-pointer" onClick={() => requestSort('id')}>
                <div className="flex items-center gap-2">ID <ArrowUpDown size={14} /></div>
              </th>
              <th className="p-4 cursor-pointer" onClick={() => requestSort('status')}>
                <div className="flex items-center gap-2">Status <ArrowUpDown size={14} /></div>
              </th>
              <th className="p-4 cursor-pointer" onClick={() => requestSort('priority')}>
                <div className="flex items-center gap-2">Prioridade <ArrowUpDown size={14} /></div>
              </th>
              <th className="p-4 cursor-pointer" onClick={() => requestSort('weight')}>
                <div className="flex items-center gap-2">Peso (kg) <ArrowUpDown size={14} /></div>
              </th>
              <th className="p-4">Coordenadas (X, Y)</th>
              <th className="p-4">Drone Responsável</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredPacotes.map((pacote) => (
              <tr key={pacote.id} className="border-b border-(--border-color) hover:bg-(--color-background)">
                <td className="p-4 font-medium">#{pacote.id}</td>
                <td className="p-4">{translateStatus(pacote.status)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(pacote.priority)}`}>
                    {translatePriority(pacote.priority)}
                  </span>
                </td>
                <td className="p-4">{pacote.weight.toFixed(2)}</td>
                <td className="p-4">({pacote.destinationX}, {pacote.destinationY})</td>
                <td className="p-4 opacity-70">
                  {pacote.status === 'IN_TRANSIT' && pacote.drone ? `${pacote.drone.model} #${pacote.drone.id}` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedAndFilteredPacotes.length === 0 && (
          <p className="text-center p-8">Nenhum pedido encontrado com os filtros selecionados.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <NovoPedidoForm
              onClose={() => setIsModalOpen(false)}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      )}
    </section>
  );
}