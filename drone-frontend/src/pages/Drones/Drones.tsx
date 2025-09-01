import { useEffect, useState, useCallback } from 'react';
import { getDrones } from '@/services/api';
import type { Drone } from '@/types/types';
import DroneCard from '@/components/DroneCard/DroneCard';
import DroneForm from '@/components/DroneForm/DroneForm';
import AllocatePackagesModal from '@/components/AllocatePackagesModal/AllocatePackagesModal';

export default function Drones() {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para controlar os modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await getDrones();
      setDrones(response.data);
    } catch (error) {
      console.error("Erro ao buscar drones:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Funções para abrir os modais
  const handleOpenCreateModal = () => {
    setSelectedDrone(null);
    setIsFormModalOpen(true);
  };
  
  const handleOpenEditModal = (drone: Drone) => {
    setSelectedDrone(drone);
    setIsFormModalOpen(true);
  };
  
  const handleOpenAllocateModal = (drone: Drone) => {
    setSelectedDrone(drone);
    setIsAllocateModalOpen(true);
  };
  
  // Função de sucesso para fechar modais e recarregar dados
  const handleSuccess = () => {
    setIsFormModalOpen(false);
    setIsAllocateModalOpen(false);
    fetchData();
  };

  if (loading) {
    return <div className="p-8"><p>Carregando drones...</p></div>;
  }

  return (
    <>
      <section className="p-8 w-full">
        <div className="flex justify-between items-center mb-7">
          <h1 className="text-3xl font-bold opacity-90 text-(--color-text)">Gestão de Drones</h1>
          <button onClick={handleOpenCreateModal} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Adicionar Drone
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drones.map(drone => (
            <DroneCard
              key={drone.id}
              drone={drone}
              onEdit={handleOpenEditModal}
              onAllocate={handleOpenAllocateModal}
            />
          ))}
        </div>
      </section>

      {/* Modal de Adicionar/Editar Drone */}
      {isFormModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <DroneForm 
              onClose={() => setIsFormModalOpen(false)}
              onSuccess={handleSuccess}
              droneToEdit={selectedDrone}
            />
          </div>
        </div>
      )}

      {/* Modal de Alocar Pacotes */}
      {isAllocateModalOpen && selectedDrone && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <AllocatePackagesModal 
              onClose={() => setIsAllocateModalOpen(false)}
              onSuccess={handleSuccess}
              drone={selectedDrone}
            />
          </div>
        </div>
      )}
    </>
  );
}