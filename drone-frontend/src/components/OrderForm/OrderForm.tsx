import { useState } from 'react';
import { createPedido } from '@/services/api';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface OrderFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function OrderForm({ onClose, onSuccess }: OrderFormProps) {
  const [weight, setWeight] = useState('');
  const [destinationX, setDestinationX] = useState('');
  const [destinationY, setDestinationY] = useState('');
  const [priority, setPriority] = useState<'MEDIUM' | 'HIGH' | 'LOW'>('MEDIUM');
  // O estado 'error' não é mais necessário, o toast cuidará das mensagens
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading('Criando pedido...');

    if (!weight || !destinationX || !destinationY) {
      toast.error('Todos os campos são obrigatórios.', { id: loadingToast });
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Capture a resposta da API para obter o ID do novo pedido
      const response = await createPedido({
        weight: parseFloat(weight),
        destinationX: parseInt(destinationX, 10),
        destinationY: parseInt(destinationY, 10),
        priority: priority,
      });

      toast.success(`Pedido #${response.data.id} criado com sucesso!`, {
        id: loadingToast,
      });
      onSuccess();
    } catch (error) {
      // 2. Defina a mensagem de erro antes de usá-la
      let message = 'Erro ao criar o pedido.';
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else {
        message = 'Ocorreu um erro inesperado.';
      }

      toast.error(message, {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* O seu JSX continua o mesmo, não precisa de alterações */}
      <h2 className="text-xl font-bold mb-4">Criar Novo Pedido</h2>
      
      <div>
        <label htmlFor="weight" className="block text-sm font-medium mb-1">Peso (kg)</label>
        <input
          id="weight"
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full p-2 bg-(--color-background) border border-(--border-color) rounded-md"
          required
        />
      </div>

      <div className="flex gap-4">
        <div>
          <label htmlFor="destinationX" className="block text-sm font-medium mb-1">Coordenada X</label>
          <input
            id="destinationX"
            type="number"
            value={destinationX}
            onChange={(e) => setDestinationX(e.target.value)}
            className="w-full p-2 bg-(--color-background) border border-(--border-color) rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="destinationY" className="block text-sm font-medium mb-1">Coordenada Y</label>
          <input
            id="destinationY"
            type="number"
            value={destinationY}
            onChange={(e) => setDestinationY(e.target.value)}
            className="w-full p-2 bg-(--color-background) border border-(--border-color) rounded-md"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium mb-1">Prioridade</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'MEDIUM' | 'HIGH' | 'LOW')}
          className="w-full p-2 bg-(--color-background) border border-(--border-color) rounded-md"
        >
          <option value="MEDIUM">Média</option>
          <option value="HIGH">Alta</option>
          <option value="LOW">Baixa</option>
        </select>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700">
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800">
          {isSubmitting ? 'Salvando...' : 'Salvar Pedido'}
        </button>
      </div>
    </form>
  );
}