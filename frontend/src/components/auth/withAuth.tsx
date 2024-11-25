// frontend/src/components/auth/withAuth.tsx
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';

export const withAuth = (WrappedComponent: React.ComponentType, allowedRoles?: string[]) => {
  return function WithAuthComponent(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      router.replace('/login');
      return null;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace('/unauthorized');
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};