import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadialBarChart, RadialBar, Legend,
} from 'recharts';
import { auditLogs } from '../data/erpData';
import { PROJECT_PHASES, SECURITY_CONTROLS, calculateSecurityScore } from '../data/planningPhases';
import {
  Shield, Activity, CheckCircle2, XCircle, Clock, Users,
  BarChart3, Link, Eye, AlertTriangle, Info, Lock, Server,
} from 'lucide-react';

const Administracion: React.FC = () => {
  const [tab, setTab] = useState<'gestion' | 'auditoria' | 'usuarios'>('gestion');

  const securityScore = useMemo(() => calculateSecurityScore(SECURITY_CONTROLS), []);

  const planningProgress = useMemo(() => {
    const completed  = PROJECT_PHASES.filter((p) => p.status === 'completada').length;
    const inProgress = PROJECT_PHASES.filter((p) => p.status === 'en_progreso').length;
    const pending    = PROJECT_PHASES.filter((p) => p.status === 'pendiente').length;
    const totalPct   = Math.round(PROJECT_PHASES.reduce((s, p) => s + p.progress, 0) / PROJECT_PHASES.length);
    return { completed, inProgress, pending, totalPct };
  }, []);

  // Gauge data for radial chart
  const gaugeData = [
    { name: '% Planificación', value: planningProgress.totalPct, fill: '#2563EB' },
    { name: '% Seguridad',     value: securityScore.percentage,  fill: '#8B5CF6' },
  ];

  // Bar chart comparing both indicators
  const compareData = [
    { name: 'Avance\nPlanificación', planificacion: planningProgress.totalPct, seguridad: 0 },
    { name: 'Nivel\nSeguridad',      planificacion: 0, seguridad: securityScore.percentage },
  ];

  const fase8 = PROJECT_PHASES.find((p) => p.number === 8)!;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            <Shield size={20} className="inline mr-2 text-purple-500" />
            Administración — Gestión y Control
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Panel de control central del ERP · Usuarios, roles, permisos, auditoría y % de seguridad
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'gestion',   label: '📊 Gestión y Control', color: '#8B5CF6' },
          { key: 'auditoria', label: '🔍 Auditoría',         color: '#F59E0B' },
          { key: 'usuarios',  label: '👥 Usuarios y Roles',  color: '#2563EB' },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: tab === key ? color : 'var(--bg-main)',
              color: tab === key ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${tab === key ? color : 'var(--border)'}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════
          PANEL DE GESTIÓN Y CONTROL
          ══════════════════════════════════════════════ */}
      {tab === 'gestion' && (
        <div className="space-y-6">
          {/* Hero — Two Main Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Planificación Indicator */}
            <div className="card p-6 border-2 border-blue-500/30"
              style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(37,99,235,0.02))' }}>
              <div className="flex items-center gap-2 mb-4">
                <Activity size={18} className="text-blue-500"/>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Avance de Planificación del Proyecto
                </h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 flex-shrink-0">
                  {/* SVG Gauge */}
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="10"/>
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="#2563EB" strokeWidth="10"
                      strokeDasharray={`${planningProgress.totalPct * 2.513} 251.3`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 1.5s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-blue-500">{planningProgress.totalPct}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Total de Fases',     value: 12,                          color: 'var(--text-primary)' },
                    { label: 'Completadas',         value: planningProgress.completed,  color: '#16A34A' },
                    { label: 'En Progreso',         value: planningProgress.inProgress, color: '#F59E0B' },
                    { label: 'Pendientes',          value: planningProgress.pending,    color: '#64748B' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center justify-between gap-6">
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                      <span className="text-sm font-black" style={{ color }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Security % Indicator */}
            <div className="card p-6 border-2 border-purple-500/30"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(139,92,246,0.02))' }}>
              <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-purple-500"/>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                  % de Seguridad del Sistema
                </h3>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="10"/>
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="#8B5CF6" strokeWidth="10"
                      strokeDasharray={`${securityScore.percentage * 2.513} 251.3`}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dasharray 1.5s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-purple-500">{securityScore.percentage}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between gap-6">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total Controles</span>
                    <span className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>{securityScore.totalControls}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Implementados</span>
                    <span className="text-sm font-black text-green-500">{securityScore.implementedControls}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Pendientes</span>
                    <span className="text-sm font-black text-red-500">{securityScore.totalControls - securityScore.implementedControls}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Fórmula</span>
                    <span className="text-xs font-bold text-purple-500">({securityScore.implementedControls}/8) × 100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Banner */}
          <div className="card p-5 border border-purple-500/40"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(37,99,235,0.05))' }}>
            <div className="flex items-center gap-3 mb-4">
              <Link size={18} className="text-purple-500"/>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                Conexión: Módulo Planificación → Panel de Gestión y Control
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg-main)' }}>
                <div className="flex items-center gap-2 mb-1 text-blue-500">
                  <Activity size={14}/> <span className="font-bold text-xs">Planificación</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <strong>{planningProgress.completed}</strong> de 12 fases completadas = <strong className="text-blue-500">{planningProgress.totalPct}%</strong> de avance global del proyecto
                </p>
              </div>
              <div className="p-3 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-1">🔗</div>
                  <p className="text-[10px] font-bold" style={{ color: 'var(--text-secondary)' }}>FASE 8 Seguridad</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>vincula tareas a controles</p>
                </div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg-main)' }}>
                <div className="flex items-center gap-2 mb-1 text-purple-500">
                  <Shield size={14}/> <span className="font-bold text-xs">Gestión y Control</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <strong>{securityScore.implementedControls}</strong> de 8 controles implementados = <strong className="text-purple-500">{securityScore.percentage}%</strong> de seguridad del sistema
                </p>
              </div>
            </div>
          </div>

          {/* Comparative Chart */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-blue-500"/>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                Gráfico Comparativo: Avance de Planificación vs Nivel de Seguridad
              </h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Bar Chart */}
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: 'Avance Planificación', value: planningProgress.totalPct,    fill: '#2563EB' },
                  { name: '% Seguridad Sistema',  value: securityScore.percentage,     fill: '#8B5CF6' },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} width={100}/>
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickFormatter={v => `${v}%`}/>
                  <Tooltip
                    formatter={(v: any) => [`${v}%`]}
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                  />
                  <Bar dataKey="value" radius={[8,8,0,0]} maxBarSize={80}>
                    {[{ fill: '#2563EB' }, { fill: '#8B5CF6' }].map((e, i) => <Cell key={i} fill={e.fill}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Legend / Summary */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl border-2 border-blue-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-blue-500">Avance de Planificación</span>
                    <span className="text-2xl font-black text-blue-500">{planningProgress.totalPct}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full bg-blue-500 transition-all duration-1000"
                      style={{ width: `${planningProgress.totalPct}%` }}/>
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {planningProgress.completed} fases completadas de 12 totales
                  </p>
                </div>
                <div className="p-4 rounded-2xl border-2 border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-purple-500">% Seguridad del Sistema</span>
                    <span className="text-2xl font-black text-purple-500">{securityScore.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full bg-purple-500 transition-all duration-1000"
                      style={{ width: `${securityScore.percentage}%` }}/>
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    ({securityScore.implementedControls} ÷ 8) × 100 = {securityScore.percentage}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Controls Detail */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={16} className="text-purple-500"/>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                Controles de Seguridad — Base del Cálculo de % de Seguridad
              </h3>
              <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500">
                GET /api/v1/security-score
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SECURITY_CONTROLS.map((ctrl, idx) => (
                <div
                  key={ctrl.id}
                  className="flex items-start gap-3 p-4 rounded-xl border"
                  style={{
                    borderColor: ctrl.implemented ? '#16A34A30' : '#DC262630',
                    background:  ctrl.implemented ? 'rgba(22,163,74,0.04)' : 'rgba(220,38,38,0.04)',
                  }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black"
                    style={{
                      background: ctrl.implemented ? '#16A34A20' : '#DC262620',
                      color:      ctrl.implemented ? '#16A34A'   : '#DC2626',
                    }}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{ctrl.name}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{ctrl.description}</p>
                    {ctrl.evidence && (
                      <p className="text-[10px] mt-1 font-mono"
                        style={{ color: ctrl.implemented ? '#16A34A' : 'var(--text-secondary)' }}>
                        {ctrl.evidence}
                      </p>
                    )}
                    {ctrl.verificationDate && (
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        Verificado: {ctrl.verificationDate}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {ctrl.implemented
                      ? <CheckCircle2 size={18} className="text-green-500"/>
                      : <XCircle size={18} className="text-red-500"/>
                    }
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl border border-purple-500/30"
              style={{ background: 'rgba(139,92,246,0.06)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Info size={14} className="text-purple-500"/>
                <span className="text-xs font-bold text-purple-500">Fórmula del Cálculo</span>
              </div>
              <p className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
                % Seguridad = (controles_implementados / total_controles) × 100
              </p>
              <p className="text-sm font-mono mt-1" style={{ color: 'var(--text-primary)' }}>
                = ({securityScore.implementedControls} / {securityScore.totalControls}) × 100 ={' '}
                <strong className="text-purple-500">{securityScore.percentage}%</strong>
              </p>
            </div>
          </div>

          {/* FASE 8 Tasks linked to controls */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Link size={16} className="text-blue-500"/>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                FASE 8 — Tareas Vinculadas a Controles de Seguridad
              </h3>
            </div>
            <div className="space-y-2">
              {fase8.tasks.map((task) => {
                const ctrl = task.securityControlId
                  ? SECURITY_CONTROLS.find((c) => c.id === task.securityControlId)
                  : undefined;
                return (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'var(--bg-main)' }}>
                    <CheckCircle2 size={14} className="text-green-500 flex-shrink-0"/>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{task.name}</p>
                      <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{task.description}</p>
                    </div>
                    {ctrl && (
                      <span className="text-[10px] px-2 py-1 rounded-lg bg-purple-500/10 text-purple-500 font-semibold flex-shrink-0">
                        → {ctrl.id.toUpperCase()}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          AUDITORÍA
          ══════════════════════════════════════════════ */}
      {tab === 'auditoria' && (
        <div className="space-y-4">
          <div className="card p-4 border border-amber-500/30"
            style={{ background: 'rgba(245,158,11,0.05)' }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500"/>
              <span className="text-xs font-bold text-amber-500">Sistema de Auditoría Activo</span>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Se registra automáticamente: usuario, acción, módulo, registro afectado, IP, fecha/hora y resultado.
              Flujo: Usuario → Acción → Módulo → Registro → Fecha/Hora → Resultado → Auditoría
            </p>
          </div>
          <div className="card">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Usuario</th>
                    <th>Acción</th>
                    <th>Módulo</th>
                    <th>Descripción</th>
                    <th>IP</th>
                    <th>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {[...auditLogs].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).map((log) => (
                    <tr key={log.id}>
                      <td>
                        <span className="text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </td>
                      <td><span className="text-xs font-semibold">{log.userName}</span></td>
                      <td>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                          {log.action}
                        </span>
                      </td>
                      <td><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{log.module}</span></td>
                      <td><span className="text-xs">{log.description}</span></td>
                      <td><span className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>{log.ipAddress || '—'}</span></td>
                      <td>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          log.result === 'success'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {log.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          USUARIOS Y ROLES
          ══════════════════════════════════════════════ */}
      {tab === 'usuarios' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Roles del Sistema', items: ['admin — Acceso total', 'user — Acceso restringido'], color: '#8B5CF6', Icon: Users },
              { label: 'Seguridad de Acceso', items: ['JWT Token Auth', 'RBAC Permissions', 'ProtectedRoute middleware', 'Mínimo privilegio'], color: '#16A34A', Icon: Lock },
              { label: 'Flujo de Seguridad',  items: ['Usuario → Login', 'Validación → Token/Sesión', 'Rol → Permiso', 'Módulo/Operación'], color: '#2563EB', Icon: Server },
            ].map(({ label, items, color, Icon }) => (
              <div key={label} className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={16} style={{ color }}/>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</h3>
                </div>
                <ul className="space-y-1.5">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={11} style={{ color, flexShrink: 0 }}/>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="card p-5">
            <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
              Permisos por Módulo (Principio de Mínimo Privilegio)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                'canViewDashboard', 'canViewPlanning', 'canViewSales', 'canViewPurchases',
                'canViewInventory', 'canViewCustomers', 'canViewSuppliers', 'canViewFinances',
                'canViewDocuments', 'canViewAdministration', 'canViewReports',
                'canViewCosts', 'canViewInfrastructure', 'canViewSecurity',
              ].map((perm) => (
                <div key={perm} className="flex items-center gap-2 p-2 rounded-xl"
                  style={{ background: 'var(--bg-main)' }}>
                  <CheckCircle2 size={12} className="text-green-500 flex-shrink-0"/>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                    {perm}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Administracion;
