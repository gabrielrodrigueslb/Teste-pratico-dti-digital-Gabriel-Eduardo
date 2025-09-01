import {
  LayoutDashboard,
  Package,
  Drone,
} from 'lucide-react';
import { NavLink } from 'react-router-dom'; // 1. IMPORTE O NAVLINK

export default function Navbar() {
  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Gestão de Pedidos',
      href: '/orders',
      icon: Package,
    },
    {
      name: 'Gestão de Drones',
      href: '/drones',
      icon: Drone,
    },
  ];
  return (
    <>
      <nav className="h-screen bg-(--color-foreground) flex flex-col items-center py-8 px-4 gap-5">
        <span className="max-w-14 max-h-14 block">
          <img
            className="w-full h-full rounded-xl"
            src="/dti-drone.svg"
            alt="Drone dti"
          />
        </span>

        <ul className="flex flex-col gap-3 pt-5 border-t-3 border-(--color-background)">
          {navigation.map((item) => (
            // 2. SUBSTITUA A <li> POR NAVLINK
            <li key={item.name}>
              <NavLink
                to={item.href}
                title={item.name} // Dica: Adiciona um tooltip com o nome do ícone
                className={({ isActive }) =>
                  `block p-4.5 rounded-xl cursor-pointer transition-colors duration-200 
                   ${isActive ? 'bg-blue-500 text-white' : 'bg-(--color-background) hover:bg-gray-700'}`
                }
              >
                <item.icon className="w-6 h-6 opacity-80" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}