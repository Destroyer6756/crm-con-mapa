import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, MapPin, ChevronDown, LogOut, Users } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':      'Dashboard',
  '/planning':       'Planificación Cloud',
  '/costs':          'Costos y Economía Cloud',
  '/infrastructure': 'Infraestructura Global',
  '/security':       'Seguridad',
  '/network':        'Arquitectura de Red',
  '/services':       'Servicios AWS',
  '/users':          'Gestión de Usuarios y Permisos',
};

const REGIONS = ['us-east-1', 'us-east-2', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-northeast-1'];

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, notificationCount = 3 }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, pendingCount, logout } = useAuth();

  const [search, setSearch] = useState('');
  const [regionOpen, setRegionOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useLocalStorage('cloudops-region', 'us-east-1');

  const title = PAGE_TITLES[location.pathname] ?? 'CloudOps';
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4 border-b transition-colors duration-300"
      style={{
        background: darkMode ? 'rgba(15,23,42,0.95)' : 'rgba(248,250,252,0.95)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold truncate flex items-center gap-2.5" style={{ color: 'var(--text-primary)' }}>
          {title}
          {location.pathname === '/users' && (
            <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
              👑 Panel Admin
            </span>
          )}
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          CloudOps Dashboard — Cloud Foundations
        </p>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border w-64"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <Search size={15} style={{ color: 'var(--text-secondary)' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar servicio, región..."
          className="bg-transparent text-sm outline-none flex-1"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      {/* Region selector */}
      <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors hover:border-blue-500"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          onClick={() => setRegionOpen(!regionOpen)}
        >
          <MapPin size={14} className="text-blue-500" />
          <span className="hidden sm:block">{selectedRegion}</span>
          <ChevronDown size={14} className={`transition-transform ${regionOpen ? 'rotate-180' : ''}`} />
        </button>
        {regionOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-xl z-50 overflow-hidden"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            {REGIONS.map((r) => (
              <button
                key={r}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-500/10 transition-colors"
                style={{ color: r === selectedRegion ? '#2563EB' : 'var(--text-primary)' }}
                onClick={() => { setSelectedRegion(r); setRegionOpen(false); }}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notifications / Pending Admin requests */}
      {isAdmin ? (
        <button
          onClick={() => navigate('/users')}
          className="relative w-9 h-9 rounded-xl border flex items-center justify-center transition-colors hover:border-purple-500"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          title="Gestión de Solicitudes de Usuarios"
        >
          <Users size={17} className="text-purple-400" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>
      ) : (
        <button className="relative w-9 h-9 rounded-xl border flex items-center justify-center transition-colors hover:border-blue-500"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <Bell size={17} style={{ color: 'var(--text-secondary)' }} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              {notificationCount}
            </span>
          )}
        </button>
      )}

      {/* Dark mode */}
      <button
        onClick={toggleDarkMode}
        className="w-9 h-9 rounded-xl border flex items-center justify-center transition-all hover:border-blue-500 hover:bg-blue-500/10"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        aria-label="Toggle dark mode"
      >
        {darkMode
          ? <Sun size={17} className="text-amber-400" />
          : <Moon size={17} style={{ color: 'var(--text-secondary)' }} />
        }
      </button>

      {/* User avatar & dropdown */}
      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2.5 pl-2 py-1 pr-1.5 rounded-xl transition-all hover:bg-white/5"
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md ${
              isAdmin
                ? 'bg-gradient-to-br from-purple-600 to-indigo-600'
                : 'bg-gradient-to-br from-blue-500 to-cyan-600'
            }`}
          >
            {currentUser ? currentUser.name.slice(0, 2).toUpperCase() : 'CZ'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
              {currentUser?.name || 'Usuario'}
            </p>
            <p className="text-[10px] text-purple-400 font-semibold leading-tight">
              {isAdmin ? '👑 Administrador' : '👤 Operador'}
            </p>
          </div>
          <ChevronDown size={14} className="text-slate-400 hidden md:block" />
        </button>

        {userMenuOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-56 rounded-2xl border shadow-2xl z-50 p-2 overflow-hidden animate-fade-in-up"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="p-3 border-b border-white/10 mb-1">
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{currentUser?.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isAdmin ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {isAdmin ? 'Administrador' : 'Usuario'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  Aprobado
                </span>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => { navigate('/users'); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-purple-300 hover:bg-purple-500/10 transition-colors"
              >
                <Users size={14} /> Gestión de Usuarios ({pendingCount})
              </button>
            )}

            <button
              onClick={() => { logout(); setUserMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-red-400 hover:bg-red-500/10 transition-colors mt-1"
            >
              <LogOut size={14} /> Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
