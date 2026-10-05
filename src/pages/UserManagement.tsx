import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { UserAccount, UserPermissions } from '../types/cloud';
import Modal from '../components/Modal';
import {
  Users, UserCheck, UserX, Shield, Clock,
  CheckCircle2, XCircle, Ban, Trash2, Key, Filter,
  Building, Calendar, Mail, Check, X
} from 'lucide-react';

interface UserManagementProps {
  onNotify: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onNotify }) => {
  const {
    currentUser,
    users,
    approveUser,
    rejectUser,
    blockUser,
    updateUserRole,
    updateUserPermissions,
    deleteUser,
  } = useAuth();

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedUserForPerms, setSelectedUserForPerms] = useState<UserAccount | null>(null);

  const pendingUsers = users.filter((u) => u.status === 'pending');
  const approvedUsers = users.filter((u) => u.status === 'approved');
  const rejectedOrBlocked = users.filter((u) => u.status === 'rejected' || u.status === 'blocked');
  const adminCount = users.filter((u) => u.role === 'admin').length;

  const filteredUsers = users.filter((u) => {
    if (filter === 'pending') return u.status === 'pending';
    if (filter === 'approved') return u.status === 'approved';
    if (filter === 'rejected') return u.status === 'rejected' || u.status === 'blocked';
    return true;
  });

  const handleApprove = (user: UserAccount) => {
    approveUser(user.id);
    onNotify(`Acceso aprobado para ${user.name}. Ya puede ingresar al sistema.`, 'success');
  };

  const handleReject = (user: UserAccount) => {
    rejectUser(user.id);
    onNotify(`Solicitud de acceso de ${user.name} fue rechazada.`, 'warning');
  };

  const handleToggleBlock = (user: UserAccount) => {
    blockUser(user.id);
    const newStatus = user.status === 'blocked' ? 'desbloqueado' : 'bloqueado';
    onNotify(`Usuario ${user.name} ha sido ${newStatus}.`, 'info');
  };

  const handleRoleToggle = (user: UserAccount) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    updateUserRole(user.id, newRole);
    onNotify(`Rol de ${user.name} cambiado a ${newRole === 'admin' ? 'Administrador' : 'Usuario'}.`, 'info');
  };

  const handlePermissionToggle = (key: keyof UserPermissions) => {
    if (!selectedUserForPerms) return;
    const updated = {
      ...selectedUserForPerms.permissions,
      [key]: !selectedUserForPerms.permissions[key],
    };
    updateUserPermissions(selectedUserForPerms.id, updated);
    setSelectedUserForPerms({
      ...selectedUserForPerms,
      permissions: updated,
    });
    onNotify(`Permisos actualizados para ${selectedUserForPerms.name}`, 'success');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/60 to-purple-950/60 p-6 rounded-3xl border border-blue-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="text-purple-400" size={20} />
            <h2 className="text-xl font-bold text-white">Gestión de Usuarios y Permisos</h2>
          </div>
          <p className="text-xs text-slate-300">
            Control de Acceso y Aprobaciones del Administrador
          </p>
        </div>
        {pendingUsers.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-2xl text-xs font-bold animate-pulse">
            <Clock size={16} />
            <span>{pendingUsers.length} solicitud{pendingUsers.length > 1 ? 'es' : ''} pendiente{pendingUsers.length > 1 ? 's' : ''} de aprobación</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Registrados', value: users.length, icon: <Users size={18} />, color: '#3B82F6' },
          { label: 'Pendientes por Aprobar', value: pendingUsers.length, icon: <Clock size={18} />, color: '#F59E0B' },
          { label: 'Usuarios Aprobados', value: approvedUsers.length, icon: <UserCheck size={18} />, color: '#10B981' },
          { label: 'Administradores', value: adminCount, icon: <Shield size={18} />, color: '#8B5CF6' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">{label}</span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, color }}>
                {icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-white/10">
          {[
            { id: 'pending', label: `Pendientes (${pendingUsers.length})`, icon: Clock, badgeColor: 'bg-amber-500' },
            { id: 'approved', label: `Aprobados (${approvedUsers.length})`, icon: UserCheck, badgeColor: 'bg-emerald-500' },
            { id: 'rejected', label: `Rechazados (${rejectedOrBlocked.length})`, icon: UserX, badgeColor: 'bg-red-500' },
            { id: 'all', label: `Todos (${users.length})`, icon: Filter, badgeColor: 'bg-blue-500' },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setFilter(id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                filter === id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="card p-12 text-center">
            <UserCheck size={48} className="mx-auto mb-3 text-slate-500 opacity-40" />
            <p className="text-white font-bold text-base">No hay usuarios en esta categoría</p>
            <p className="text-xs text-slate-400 mt-1">
              Todas las solicitudes de esta sección han sido procesadas.
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`card p-5 transition-all duration-200 border-2 ${
                user.status === 'pending'
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : user.status === 'rejected' || user.status === 'blocked'
                  ? 'border-red-500/20 bg-red-500/5'
                  : 'border-white/10 hover:border-blue-500/30'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* User Info */}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-lg ${
                      user.role === 'admin'
                        ? 'bg-gradient-to-br from-purple-600 to-indigo-600'
                        : 'bg-gradient-to-br from-blue-600 to-cyan-600'
                    }`}
                  >
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-bold text-base">{user.name}</h3>
                      {/* Role Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          user.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {user.role === 'admin' ? '👑 Admin' : '👤 Usuario'}
                      </span>
                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                          user.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : user.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {user.status === 'approved' && <CheckCircle2 size={10} />}
                        {user.status === 'pending' && <Clock size={10} />}
                        {user.status === 'rejected' && <XCircle size={10} />}
                        {user.status === 'blocked' && <Ban size={10} />}
                        {user.status === 'approved' ? 'Aprobado' : user.status === 'pending' ? 'Pendiente' : user.status === 'blocked' ? 'Bloqueado' : 'Rechazado'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail size={12} className="text-slate-500" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building size={12} className="text-slate-500" />
                        {user.department || 'General'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-slate-500" />
                        Solicitado: {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {user.reason && (
                      <p className="text-xs text-slate-300 mt-2 bg-black/20 px-3 py-1.5 rounded-xl border border-white/5 italic">
                        &quot;{user.reason}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
                  {/* Approve button for pending */}
                  {user.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(user)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
                    >
                      <Check size={14} /> Aprobar Acceso
                    </button>
                  )}

                  {/* Reject button for pending */}
                  {user.status === 'pending' && (
                    <button
                      onClick={() => handleReject(user)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold transition-all"
                    >
                      <X size={14} /> Rechazar
                    </button>
                  )}

                  {/* Approve/Re-approve for rejected/blocked */}
                  {(user.status === 'rejected' || user.status === 'blocked') && (
                    <button
                      onClick={() => handleApprove(user)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all"
                    >
                      <CheckCircle2 size={14} /> Dar Acceso
                    </button>
                  )}

                  {/* Permissions Modal trigger */}
                  {user.status === 'approved' && (
                    <button
                      onClick={() => setSelectedUserForPerms(user)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold transition-all"
                    >
                      <Key size={14} /> Permisos
                    </button>
                  )}

                  {/* Toggle Admin Role */}
                  {user.id !== currentUser?.id && user.status === 'approved' && (
                    <button
                      onClick={() => handleRoleToggle(user)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold transition-all"
                    >
                      <Shield size={14} /> {user.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                    </button>
                  )}

                  {/* Block / Unblock */}
                  {user.id !== currentUser?.id && user.status !== 'pending' && (
                    <button
                      onClick={() => handleToggleBlock(user)}
                      className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 border border-white/5 transition-all"
                      title={user.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}
                    >
                      <Ban size={15} />
                    </button>
                  )}

                  {/* Delete user */}
                  {user.id !== currentUser?.id && (
                    <button
                      onClick={() => {
                        deleteUser(user.id);
                        onNotify(`Usuario ${user.name} eliminado`, 'warning');
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-white/5 transition-all"
                      title="Eliminar registro"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Permission Management */}
      <Modal
        isOpen={!!selectedUserForPerms}
        onClose={() => setSelectedUserForPerms(null)}
        title={`Permisos de Módulos: ${selectedUserForPerms?.name}`}
        size="md"
      >
        {selectedUserForPerms && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Activa o desactiva las vistas del Dashboard a las que tiene permiso este usuario.
            </p>

            <div className="space-y-2">
              {[
                { key: 'canViewDashboard', label: 'Dashboard General', desc: 'Métricas, KPIs y resumen cloud' },
                { key: 'canViewPlanning', label: 'Planificación Cloud', desc: 'Crear y consultar propuestas de arquitectura' },
                { key: 'canViewCosts', label: 'Costos y Presupuestos', desc: 'Calculadora de costos y comparativas' },
                { key: 'canViewInfrastructure', label: 'Infraestructura Global', desc: 'Mapa de regiones AWS y estado' },
                { key: 'canViewSecurity', label: 'Seguridad e IAM', desc: 'Puntuación de seguridad y controles' },
                { key: 'canViewNetwork', label: 'Arquitectura de Red', desc: 'Diagrama de red VPC y conectividad' },
                { key: 'canViewServices', label: 'Catálogo de Servicios', desc: 'Catálogo de servicios AWS' },
              ].map(({ key, label, desc }) => {
                const isEnabled = selectedUserForPerms.permissions[key as keyof UserPermissions];
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3.5 rounded-2xl border bg-slate-900/60 transition-all"
                    style={{ borderColor: isEnabled ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.08)' }}
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{label}</p>
                      <p className="text-[11px] text-slate-400">{desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePermissionToggle(key as keyof UserPermissions)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isEnabled ? 'bg-blue-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
