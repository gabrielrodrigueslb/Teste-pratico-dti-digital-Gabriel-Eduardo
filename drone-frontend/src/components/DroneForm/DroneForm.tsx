import { useState, useEffect } from 'react';
import { createDrone, updateDrone } from '@/services/api';
import type { Drone } from '@/types/types';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface DroneFormProps {
  droneToEdit?: Drone | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DroneForm({ droneToEdit, onClose, onSuccess }: DroneFormProps) {
  const [model, setModel] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
  const [maxDistance, setMaxDistance] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!droneToEdit;

  useEffect(() => {
    if (isEditing) {
      setModel(droneToEdit.model);
      setMaxWeight(String(droneToEdit.maxWeight));
      setMaxDistance(String(droneToEdit.maxDistance));
    }
  }, [isEditing, droneToEdit]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading(isEditing ? 'Atualizando drone...' : 'Criando drone...');

    const droneData = {
      model,
      maxWeight: parseFloat(maxWeight),
      maxDistance: parseFloat(maxDistance),
    };

    try {
      if (isEditing) {
        await updateDrone(droneToEdit.id, droneData);
        toast.success(`Drone #${droneToEdit.id} atualizado com sucesso!`, { id: loadingToast });
      } else {
        const response = await createDrone(droneData);
        toast.success(`Drone #${response.data.id} criado com sucesso!`, { id: loadingToast });
      }
      onSuccess();
    } catch (error) {
      const message = error instanceof AxiosError ? error.response?.data?.message : 'Ocorreu um erro inesperado.';
      toast.error(message || 'Falha na operação.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-4">{isEditing ? 'Editar Drone' : 'Adicionar Novo Drone'}</h2>
      <div>
        <label htmlFor="model" className="block text-sm font-medium mb-1">Modelo</label>
        <input id="model" type="text" value={model} onChange={(e) => setModel(e.target.value)} className="w-full p-2 bg-(--color-background) border border-(--border-color) rounded-md" required />
      </div>
      <div className="flex gap-4">
        <div>
          <label htmlFor="maxWeight" className="block text-sm font-medium mb-1">Capacidade (kg)</label>
          <input id="maxWeight" type="number" step="0.1" value={maxWeight} onChange={(e) => setMaxWeight(e.target.value)} className="w-full p-2 bg-(--color-background) border border-(--border-color) rounded-md" required />
        </div>
        <div>
          <label htmlFor="maxDistance" className="block text-sm font-medium mb-1">Alcance (km)</label>
          <input id="maxDistance" type="number" step="0.1" value={maxDistance} onChange={(e) => setMaxDistance(e.target.value)} className="w-full p-2 bg-(--color-background) border border-(--border-color) rounded-md" required />
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800">{isSubmitting ? 'Salvando...' : 'Salvar'}</button>
      </div>
    </form>
  );
}