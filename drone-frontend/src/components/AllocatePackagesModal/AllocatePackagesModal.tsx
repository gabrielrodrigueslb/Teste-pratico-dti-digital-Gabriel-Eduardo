import { useState, useEffect } from 'react';
import { getPedidos, allocateManual } from '@/services/api';
import type { Drone, Pacote } from '@/types/types';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface AllocatePackagesModalProps {
  drone: Drone;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AllocatePackagesModal({ drone, onClose, onSuccess }: AllocatePackagesModalProps) {
  const [pendingPackages, setPendingPackages] = useState<Pacote[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPending = async () => {
      // Usando o filtro que criamos no backend
      const response = await getPedidos({ params: { status: 'PENDING' } });
      setPendingPackages(response.data);
    };
    fetchPending();
  }, []);

  const handleSelectPackage = (packageId: number) => {
    setSelectedPackages(prev => 
      prev.includes(packageId) ? prev.filter(id => id !== packageId) : [...prev, packageId]
    );
  };

  const handleSubmit = async () => {
    if (selectedPackages.length === 0) {
      toast.error('Selecione ao menos um pacote.');
      return;
    }
    setIsSubmitting(true);
    const loadingToast = toast.loading('Alocando pacotes...');
    try {
      await allocateManual(drone.id, selectedPackages);
      toast.success('Pacotes alocados com sucesso!', { id: loadingToast });
      onSuccess();
    } catch (error) {
      const message = error instanceof AxiosError ? error.response?.data?.message : 'Ocorreu um erro inesperado.';
      toast.error(message || 'Falha na alocação.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-4">Alocar Pacotes para Drone #{drone.id}</h2>
      <div className="max-h-60 overflow-y-auto border border-(--border-color) rounded-md p-2 flex flex-col gap-2">
        {pendingPackages.length > 0 ? pendingPackages.map(pkg => (
          <label key={pkg.id} className="flex items-center gap-3 p-2 hover:bg-(--color-background) rounded cursor-pointer">
            <input 
              type="checkbox"
              checked={selectedPackages.includes(pkg.id)}
              onChange={() => handleSelectPackage(pkg.id)}
              className="h-4 w-4"
            />
            <span>Pacote #{pkg.id} (Peso: {pkg.weight}kg)</span>
          </label>
        )) : <p className="text-sm opacity-70 p-4 text-center">Nenhum pacote pendente encontrado.</p>}
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700">Cancelar</button>
        <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800">{isSubmitting ? 'Alocando...' : 'Alocar'}</button>
      </div>
    </div>
  );
}