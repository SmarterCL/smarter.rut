import { useEffect } from 'react';
import { useRouter } from 'next/router';

const DashboardIndex = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirigir al estado por defecto
    router.push('/dashboard/status');
  }, []);

  return null; // No renderizar nada mientras se redirige
};

export default DashboardIndex;