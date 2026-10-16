import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ShoppingCart, Package, Users,
  Truck, DollarSign, FileText, BarChart3,
  CalendarCheck, Shield, Menu, X, ChevronRight, Zap,
  LogOut, Clock, ChevronDown,
} from 'lucide-react';

interface NavGroup {
  label: string;
  color?: string;
  items: {
    to: string;
    label: string;
    Icon: React.ComponentType<any>;
    permission?: keyof ReturnType<typeof useAuth>['currentUser'] extends null ? never : any;
    adminOnly?: boolean;
  }[];
}

const Sidebar: React.FC = () => {
  const { currentUser, pendingCount, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const isAdmin = currentUser?.role === 'admin';

  const navGroups: NavGroup[] = [
    {
      label: 'Principal',
      items: [
        { to: '/erp-dashboard', label: 'Dashboard ERP', Icon: LayoutDashboard },
      ],
    },
    {
      label: 'Operaciones',
      items: [
        { to: '/ventas',      label: 'Ventas',      Icon: ShoppingCart },
        { to: '/compras',     label: 'Compras',     Icon: Package },
        { to: '/inventario',  label: 'Inventario',  Icon: Package },
        { to: '/clientes',    label: 'Clientes',    Icon: Users },
        { to: '/proveedores', label: 'Proveedores', Icon: Truck },
      ],
    },
    {
      label: 'Finanzas & Docs',
      items: [
        { to: '/finanzas',    label: 'Finanzas',    Icon: DollarSign },
        { to: '/documentos',  label: 'Documentos',  Icon: FileText },
      ],
    },
    {
      label: 'Análisis',
      items: [
        { to: '/reportes',      label: 'Reportes',        Icon: BarChart3 },
        { to: '/erp-planning',  label: 'Planificación',   Icon: CalendarCheck },
      ],
    },
    {
      label: 'Administración',
      color: '#8B5CF6',
      items: [
        { to: '/administracion', label: 'Gestión y Control', Icon: Shield, adminOnly: true },
        { to: '/users',          label: 'Gestión Usuarios',  Icon: Users, adminOnly: true },
      ],
    },
  ];

  const toggleGroup = (label: string) => {
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const content = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10 flex-shrink-0">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-black text-sm leading-tight">ERP Enterprise</p>
          <p className="text-purple-400 text-[10px] font-semibold">Cloud · AWS · v2.0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if (item.adminOnly) return isAdmin;
            return true;
          });
          if (visibleItems.length === 0) return null;
          const isGroupCollapsed = collapsed[group.label];

          return (
            <div key={group.label} className="mb-2">
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center justify-between w-full px-3 py-1.5 mb-1"
              >
                <span className="text-[10px] font-extrabold uppercase tracking-widest"
                  style={{ color: group.color || '#475569' }}>
                  {group.label}
                </span>
                <ChevronDown
                  size={12}
                  style={{ color: group.color || '#475569' }}
                  className={`transition-transform ${isGroupCollapsed ? '-rotate-90' : ''}`}
                />
              </button>
              {!isGroupCollapsed && (
                <div className="space-y-0.5">
                  {visibleItems.map(({ to, label, Icon, adminOnly }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        `sidebar-item ${isActive ? 'active' : ''}`
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon size={17} style={adminOnly ? { color: '#8B5CF6' } : {}} />
                      <span className="flex-1 text-sm">{label}</span>
                      {to === '/users' && pendingCount > 0 && (
                        <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                          <Clock size={9} /> {pendingCount}
                        </span>
                      )}
                      <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="px-4 py-4 border-t border-white/10 space-y-2 flex-shrink-0">
        {currentUser && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md ${
                isAdmin
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600'
                  : 'bg-gradient-to-br from-blue-500 to-cyan-600'
              }`}
            >
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className={`text-[9px] font-extrabold px-1.5 rounded uppercase ${
                    isAdmin ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {isAdmin ? 'ADMIN' : 'USUARIO'}
                </span>
                <span className="text-[9px] text-emerald-400 font-semibold">• ACTIVO</span>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-white/5 transition-all"
        >
          <LogOut size={14} />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - mobile */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-60 z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: '#0F172A' }}
      >
        {content}
      </aside>

      {/* Sidebar - desktop */}
      <aside
        className="hidden lg:flex flex-col w-60 min-h-screen flex-shrink-0"
        style={{ background: '#0F172A' }}
      >
        {content}
      </aside>
    </>
  );
};

export default Sidebar;
