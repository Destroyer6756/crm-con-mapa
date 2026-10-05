import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Cloud, DollarSign, Globe, Shield,
  Network, Boxes, Menu, X, ChevronRight, Zap, Users, LogOut, Clock
} from 'lucide-react';

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  const { currentUser, pendingCount, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const permissions = currentUser?.permissions;
  const isAdmin = currentUser?.role === 'admin';

  const navItems = [
    { to: '/dashboard',       label: 'Dashboard',          icon: LayoutDashboard, visible: permissions?.canViewDashboard ?? true },
    { to: '/planning',        label: 'Planificación Cloud', icon: Cloud,           visible: permissions?.canViewPlanning ?? true },
    { to: '/costs',           label: 'Costos',              icon: DollarSign,      visible: permissions?.canViewCosts ?? true },
    { to: '/infrastructure',  label: 'Infraestructura',     icon: Globe,           visible: permissions?.canViewInfrastructure ?? true },
    { to: '/security',        label: 'Seguridad',           icon: Shield,          visible: permissions?.canViewSecurity ?? true },
    { to: '/network',         label: 'Arquitectura de Red', icon: Network,         visible: permissions?.canViewNetwork ?? true },
    { to: '/services',        label: 'Servicios AWS',       icon: Boxes,           visible: permissions?.canViewServices ?? true },
  ];

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-base leading-tight">CloudOps</p>
          <p className="text-blue-400 text-xs font-medium">Dashboard v2.0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">
          Navegación
        </p>

        {/* Regular Menu Items */}
        {navItems
          .filter((item) => item.visible)
          .map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}

        {/* Admin User Management Item */}
        {isAdmin && (
          <>
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest px-3 mt-6 mb-2">
              Administración
            </p>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <Users size={18} className="text-purple-400" />
              <span className="flex-1">Gestión Usuarios</span>
              {pendingCount > 0 && (
                <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <Clock size={10} /> {pendingCount}
                </span>
              )}
            </NavLink>
          </>
        )}
      </nav>

      {/* User Footer Profile & Logout */}
      <div className="px-4 py-4 border-t border-white/10 space-y-2">
        {currentUser && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-md ${
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
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                    isAdmin ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {isAdmin ? 'ADMIN' : 'USUARIO'}
                </span>
                <span className="text-[9px] text-emerald-400 font-semibold">• APROBADO</span>
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
        className={`lg:hidden fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: '#0F172A' }}
      >
        {content}
      </aside>

      {/* Sidebar - desktop */}
      <aside
        className="hidden lg:flex flex-col w-64 min-h-screen flex-shrink-0"
        style={{ background: '#0F172A' }}
      >
        {content}
      </aside>
    </>
  );
};

export default Sidebar;
