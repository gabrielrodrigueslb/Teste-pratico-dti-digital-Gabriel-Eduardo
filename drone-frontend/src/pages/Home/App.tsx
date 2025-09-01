import { useEffect, useState } from 'react';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import Navbar from '@/components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 segundos
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <main className="flex max-h-screen">
          <Navbar />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          <section className="content p-8 w-full flex-col gap-10 overflow-y-scroll">
            <Outlet />
          </section>
        </main>
      )}
    </>
  );
}
