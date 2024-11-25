// frontend/src/components/layout/MainLayout.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const navigation = {
    waiter: [
      { name: 'Orders', href: '/orders' },
      { name: 'New Order', href: '/orders/new' },
      { name: 'Tables', href: '/tables' },
    ],
    kitchen: [
      { name: 'Kitchen Orders', href: '/kitchen' },
    ],
    admin: [
      { name: 'Dashboard', href: '/admin' },
      { name: 'Products', href: '/admin/products' },
      { name: 'Reports', href: '/admin/reports' },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold">Restaurant POS</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {user && navigation[user.role]?.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`${
                      router.pathname === item.href
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              {user && (
                <button
                  onClick={logout}
                  className="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-900"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};