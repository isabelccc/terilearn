import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'admin')) {
      router.push('/login');
    }
  }, [status, session, router]);

  if (status === 'loading' || !session?.user?.role === 'admin') {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
} 