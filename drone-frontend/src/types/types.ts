export interface Drone {
  id: number;
  status: string;
  battery: number;
  model: string;
  maxWeight: number;
  maxDistance: number;
  _count: {
    packages: number;
  };
}
// Interface para os Pacotes
export interface Pacote {
  id: number;
  status: string;
  destinationX: number;
  destinationY: number;
  priority: string;
  weight: number;
  drone: Drone | null;
}