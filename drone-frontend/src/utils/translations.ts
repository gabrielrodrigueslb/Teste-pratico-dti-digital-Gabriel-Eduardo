const statusMap: { [key: string]: string } = {
  IDLE: 'Disponível',
  IN_FLIGHT: 'Em Voo',
  CHARGING: 'Carregando',
  LOADING: 'Carregando Pacotes',
  DELIVERING: 'Entregando',
  RETURNING: 'Retornando',
  PENDING: 'Pendente',
  IN_TRANSIT: 'Em Trânsito',
  DELIVERED: 'Entregue'
};

export function translateStatus(status: string): string {
  return statusMap[status] || status;
}

const priorityMap: { [key: string]: string } = {
  HIGH: 'Alta',
  MEDIUM: 'Média',
  LOW: 'Baixa',
};

export function translatePriority(priority: string): string {
  return priorityMap[priority] || priority;
}

// Função para definir uma cor baseada na prioridade
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-500 text-white';
    case 'MEDIUM':
      return 'bg-yellow-500 text-black';
    case 'LOW':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-400 text-black';
  }
}