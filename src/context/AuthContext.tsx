import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserAccount, UserRole, UserPermissions } from '../types/cloud';

const DEFAULT_PERMISSIONS: UserPermissions = {
  canViewDashboard: true,
  canViewPlanning: true,
  canViewCosts: true,
  canViewInfrastructure: true,
  canViewSecurity: true,
  canViewNetwork: true,
  canViewServices: true,
};

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-admin-1',
    name: 'Administrador Principal',
    email: 'admin@cloudops.com',
    passwordHash: 'admin123',
    role: 'admin',
    status: 'approved',
    department: 'Cloud Platform Engineering',
    reason: 'Administrador Global del Sistema',
    createdAt: '2026-01-10T10:00:00Z',
    approvedAt: '2026-01-10T10:00:00Z',
    approvedBy: 'Sistema',
    permissions: { ...DEFAULT_PERMISSIONS },
  },
  {
    id: 'usr-user-1',
    name: 'Carlos Zambrano',
    email: 'operador@cloudops.com',
    passwordHash: 'user123',
    role: 'user',
    status: 'approved',
    department: 'Operaciones IT',
    reason: 'Gestión de infraestructura y servicios cloud',
    createdAt: '2026-02-01T14:30:00Z',
    approvedAt: '2026-02-01T15:00:00Z',
    approvedBy: 'admin@cloudops.com',
    permissions: { ...DEFAULT_PERMISSIONS },
  },
  {
    id: 'usr-pending-1',
    name: 'Ana López',
    email: 'ana.solicitante@cloudops.com',
    passwordHash: 'user123',
    role: 'user',
    status: 'pending',
    department: 'DevOps & CI/CD',
    reason: 'Despliegue y monitoreo de clústeres EKS en AWS',
    createdAt: '2026-10-01T09:15:00Z',
    permissions: { ...DEFAULT_PERMISSIONS },
  },
  {
    id: 'usr-pending-2',
    name: 'Miguel Torres',
    email: 'miguel.analista@cloudops.com',
    passwordHash: 'user123',
    role: 'user',
    status: 'pending',
    department: 'Finanzas Cloud',
    reason: 'Auditoría mensual de presupuestos y costos por región',
    createdAt: '2026-10-02T08:45:00Z',
    permissions: { ...DEFAULT_PERMISSIONS },
  },
];

interface AuthResult {
  success: boolean;
  message: string;
  user?: UserAccount;
}

interface AuthContextType {
  currentUser: UserAccount | null;
  users: UserAccount[];
  pendingCount: number;
  login: (email: string, pass: string) => AuthResult;
  register: (name: string, email: string, pass: string, dept: string, reason: string) => AuthResult;
  logout: () => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  blockUser: (userId: string) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  updateUserPermissions: (userId: string, permissions: Partial<UserPermissions>) => void;
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load stored users or fallback to INITIAL_USERS
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('cloudops-users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_USERS;
  });

  // Load current logged in user
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('cloudops-current-user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Default logged in as Admin for instant preview if needed, or null to demand login
    return INITIAL_USERS[0];
  });

  // Sync users to localStorage
  useEffect(() => {
    localStorage.setItem('cloudops-users', JSON.stringify(users));
  }, [users]);

  // Sync current user state
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cloudops-current-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cloudops-current-user');
    }
  }, [currentUser]);

  // Maintain fresh current user status if modified by admin
  useEffect(() => {
    if (currentUser) {
      const fresh = users.find((u) => u.id === currentUser.id);
      if (fresh) {
        if (fresh.status !== currentUser.status || fresh.role !== currentUser.role) {
          setCurrentUser(fresh);
        }
      }
    }
  }, [users, currentUser]);

  const pendingCount = users.filter((u) => u.status === 'pending').length;

  const login = (email: string, pass: string): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();
    const target = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!target) {
      return { success: false, message: 'Usuario no encontrado. Verifica tu correo electrónico.' };
    }

    if (target.passwordHash && target.passwordHash !== pass) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }

    // CHECK APPROVAL STATUS!
    if (target.status === 'pending') {
      return {
        success: false,
        message: '⏳ Tu cuenta está pendiente de aprobación por el Administrador. Solo podrás ingresar una vez que el Administrador autorice tu acceso.',
      };
    }

    if (target.status === 'rejected') {
      return {
        success: false,
        message: '❌ Tu solicitud de acceso fue rechazada por el Administrador.',
      };
    }

    if (target.status === 'blocked') {
      return {
        success: false,
        message: '🚫 Tu cuenta ha sido bloqueada por el Administrador del sistema.',
      };
    }

    // Status is 'approved'
    setCurrentUser(target);
    return {
      success: true,
      message: `¡Bienvenido de nuevo, ${target.name}!`,
      user: target,
    };
  };

  const register = (
    name: string,
    email: string,
    pass: string,
    dept: string,
    reason: string
  ): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'El correo electrónico ya está registrado en el sistema.' };
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      passwordHash: pass,
      role: 'user',
      status: 'pending', // MUST BE APPROVED BY ADMIN!
      department: dept.trim() || 'General',
      reason: reason.trim() || 'Solicitud de acceso al Dashboard CloudOps',
      createdAt: new Date().toISOString(),
      permissions: { ...DEFAULT_PERMISSIONS },
    };

    setUsers((prev) => [newUser, ...prev]);
    return {
      success: true,
      message: '✅ Solicitud de acceso enviada con éxito. Tu cuenta debe ser APROBADA por el Administrador antes de que puedas ingresar.',
    };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const approveUser = (userId: string) => {
    const now = new Date().toISOString();
    const adminEmail = currentUser?.email || 'admin@cloudops.com';

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: 'approved', approvedAt: now, approvedBy: adminEmail }
          : u
      )
    );
  };

  const rejectUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'rejected' } : u))
    );
  };

  const blockUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'blocked' ? 'approved' : 'blocked' }
          : u
      )
    );
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
  };

  const updateUserPermissions = (userId: string, perms: Partial<UserPermissions>) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, permissions: { ...u.permissions, ...perms } }
          : u
      )
    );
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        pendingCount,
        login,
        register,
        logout,
        approveUser,
        rejectUser,
        blockUser,
        updateUserRole,
        updateUserPermissions,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
