'use client';
import { useSession } from 'next-auth/react';
import { LogoutButton } from '../../shared/components/logout-button';

export default function DashboardPage() {
  const { data: session } = useSession();
  return (
    <main>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <div>
            <p className="text-sm text-gray-500">
              Bienvenido, {session?.user?.name || 'Usuario'}!
            </p>
            <p className="text-sm text-gray-500">
              Correo: {session?.user?.email || 'No disponible'}
            </p>
            <p className="text-sm text-gray-500">
              Rol: {session?.user?.role || 'No disponible'}
            </p>
            <p className='text-sm text-gray-500'> Organization ID: {session?.user?.organizationId || 'No disponible'}</p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
