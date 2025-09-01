import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './pages/Home/App.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Orders from './pages/Orders/Orders.tsx';
import Drones from './pages/Drones/Drones.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/orders',
        element: <Orders />,
      },
      {
        path: '/drones',
        element: <Drones />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>,
);
