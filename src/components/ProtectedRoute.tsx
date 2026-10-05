import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserPermissions } from '../types/cloud';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredPermission?: keyof UserPermissions;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  requiredPermission,
}) => {
  const { currentUser } = useAuth();

  // 1. Not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 2. Not approved by admin
  if (currentUser.status !== 'approved') {
    return <Navigate to="/login" replace />;
  }

  // 3. Requires Admin role
  if (requireAdmin && currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Requires specific module permission set by Admin
  if (requiredPermission && currentUser.permissions && !currentUser.permissions[requiredPermission]) {
    return (
      <div className="p-8 text-center animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Acceso Restringido por el Administrador</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          No tienes permisos para visualizar este módulo. Solicitale al Administrador del sistema que habilite tus permisos para esta vista.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
