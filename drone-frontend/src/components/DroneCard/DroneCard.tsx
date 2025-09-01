import { BatteryFull, Gauge, Weight, Pencil, PlaneTakeoff, Package } from 'lucide-react';
import { translateStatus } from '@/utils/translations';
import type { Drone } from '@/types/types';

interface DroneCardProps {
  drone: Drone;
  onEdit: (drone: Drone) => void;
  onAllocate: (drone: Drone) => void;
}

export default function DroneCard({ drone, onEdit, onAllocate }: DroneCardProps) {
  const isIdle = drone.status === 'IDLE';

  return (
    <div className="bg-(--color-foreground) p-4 rounded-lg flex flex-col gap-4 shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">{drone.model}</h3>
          <p className="text-xs opacity-60">ID: #{drone.id}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isIdle ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
          {translateStatus(drone.status)}
        </span>
      </div>

        <div className='flex items-center justify-center gap-2 p-2 bg-blue-500/20 text-blue-300 rounded-md'>
          <Package size={18} />
          <span className='font-bold text-sm'>{drone._count.packages} Pacote(s) a bordo</span>
        </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm text-center border-t border-b border-(--border-color) py-4">
        <div className="flex flex-col items-center gap-1">
          <BatteryFull size={20} className="opacity-70" />
          <span className="font-semibold">{drone.battery}%</span>
          <span className="text-xs opacity-60">Bateria</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Weight size={20} className="opacity-70" />
          <span className="font-semibold">{drone.maxWeight} kg</span>
          <span className="text-xs opacity-60">Capacidade</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Gauge size={20} className="opacity-70" />
          <span className="font-semibold">{drone.maxDistance} km</span>
          <span className="text-xs opacity-60">Alcance</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => onEdit(drone)} className="flex-1 flex items-center justify-center gap-2 p-2 bg-gray-600 hover:bg-gray-700 rounded-md text-sm transition-colors">
          <Pencil size={16} /> Editar
        </button>
        <button
          onClick={() => onAllocate(drone)}
          disabled={!isIdle}
          className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-500 hover:bg-blue-600 rounded-md text-sm transition-colors disabled:bg-gray-800 disabled:cursor-not-allowed"
        >
          <PlaneTakeoff size={16} /> Alocar Pacotes
        </button>
      </div>
    </div>
  );
}