import React, { useState, useMemo } from 'react';
import {
  PROJECT_PHASES,
  SECURITY_CONTROLS,
  calculateSecurityScore,
} from '../data/planningPhases';
import type { ProjectPhase, PhaseStatus } from '../types/cloud';
import {
  CheckCircle2, Clock, AlertCircle, BarChart3,
  Shield, ChevronDown, ChevronRight, Calendar,
  Target, Layers, Link, TrendingUp, Activity,
} from 'lucide-react';

const statusColor: Record<PhaseStatus, string> = {
  completada:  '#16A34A',
  en_progreso: '#F59E0B',
  pendiente:   '#64748B',
};
const statusLabel: Record<PhaseStatus, string> = {
  completada:  'Completada',
  en_progreso: 'En Progreso',
  pendiente:   'Pendiente',
};
const StatusIcon: React.FC<{ status: PhaseStatus; size?: number }> = ({ status, size = 14 }) => {
  if (status === 'completada')  return <CheckCircle2 size={size} style={{ color: statusColor.completada }} />;
  if (status === 'en_progreso') return <Clock        size={size} style={{ color: statusColor.en_progreso }} />;
  return <AlertCircle size={size} style={{ color: statusColor.pendiente }} />;
};

type ViewMode = 'gantt' | 'kanban';

const ERPPlanning: React.FC = () => {
  const [view, setView] = useState<ViewMode>('gantt');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['fase-8']));
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase | null>(null);

  const securityScore = useMemo(() => calculateSecurityScore(SECURITY_CONTROLS), []);

  const planningProgress = useMemo(() => {
    const completed  = PROJECT_PHASES.filter((p) => p.status === 'completada').length;
    const inProgress = PROJECT_PHASES.filter((p) => p.status === 'en_progreso').length;
    const pending    = PROJECT_PHASES.filter((p) => p.status === 'pendiente').length;
    const totalPct   = PROJECT_PHASES.reduce((s, p) => s + p.progress, 0) / PROJECT_PHASES.length;
    return { completed, inProgress, pending, totalPct: Math.round(totalPct) };
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const kanbanGroups: Record<PhaseStatus, ProjectPhase[]> = {
    completada:  PROJECT_PHASES.filter((p) => p.status === 'completada'),
    en_progreso: PROJECT_PHASES.filter((p) => p.status === 'en_progreso'),
    pendiente:   PROJECT_PHASES.filter((p) => p.status === 'pendiente'),
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Módulo de Planificación — ERP EnterpriseCloud
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            12 Fases del proyecto · Vista Gantt / Kanban
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('gantt')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              view === 'gantt'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'border'
            }`}
            style={view !== 'gantt' ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}
          >
            <BarChart3 size={15} /> Gantt
          </button>
          <button
            onClick={() => setView('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              view === 'kanban'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'border'
            }`}
            style={view !== 'kanban' ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}
          >
            <Layers size={15} /> Kanban
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Avance del Proyecto', value: `${planningProgress.totalPct}%`, icon: <TrendingUp size={18} />, color: '#2563EB' },
          { label: 'Fases Completadas',   value: `${planningProgress.completed} / 12`,  icon: <CheckCircle2 size={18} />, color: '#16A34A' },
          { label: 'En Progreso',          value: planningProgress.inProgress, icon: <Activity size={18} />, color: '#F59E0B' },
          { label: '% Seguridad Sistema', value: `${securityScore.percentage}%`, icon: <Shield size={18} />, color: '#8B5CF6' },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-4 flex items-center gap-4 animate-fade-in-up">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${kpi.color}20`, color: kpi.color }}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Progress Bar */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Progreso Global del Proyecto
          </span>
          <span className="text-sm font-bold text-blue-500">{planningProgress.totalPct}%</span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${planningProgress.totalPct}%`,
              background: 'linear-gradient(90deg, #2563EB, #8B5CF6)',
            }}
          />
        </div>
        <div className="flex gap-6 mt-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> {planningProgress.completed} completadas</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> {planningProgress.inProgress} en progreso</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500 inline-block" /> {planningProgress.pending} pendientes</span>
        </div>
      </div>

      {/* Security Score Connection Banner */}
      <div className="card p-5 border-2 border-purple-500/30" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.05), rgba(37,99,235,0.05))' }}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Link size={16} className="text-purple-500" />
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              Conexión: Planificación → Gestión y Control
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-xl">
              <Target size={14} className="text-blue-500" />
              <span className="text-xs font-semibold text-blue-500">
                FASE 8 Seguridad → {securityScore.implementedControls}/{securityScore.totalControls} controles
              </span>
            </div>
            <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1.5 rounded-xl">
              <Shield size={14} className="text-purple-500" />
              <span className="text-xs font-semibold text-purple-500">
                % Seguridad: {securityScore.percentage}% implementado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gantt / Kanban View */}
      {view === 'gantt' ? (
        <div className="card overflow-hidden">
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Vista Gantt — 12 Fases del Proyecto</h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {PROJECT_PHASES.map((phase) => {
              const isExpanded = expanded.has(phase.id);
              const isPhase8 = phase.number === 8;
              return (
                <div key={phase.id}>
                  {/* Phase Row */}
                  <div
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-opacity-50 transition-colors ${isPhase8 ? 'border-l-4 border-purple-500' : ''}`}
                    style={{ background: isPhase8 ? 'rgba(139,92,246,0.04)' : undefined }}
                    onClick={() => toggleExpand(phase.id)}
                  >
                    <span className="text-xs font-black w-8 text-center flex-shrink-0"
                      style={{ color: statusColor[phase.status] }}>
                      F{phase.number}
                    </span>
                    <StatusIcon status={phase.status} size={16} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {phase.name}
                        </span>
                        {isPhase8 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-500">
                            SEGURIDAD
                          </span>
                        )}
                      </div>
                      {/* Progress bar */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${phase.progress}%`, background: statusColor[phase.status] }}
                          />
                        </div>
                        <span className="text-xs font-bold w-8 text-right flex-shrink-0"
                          style={{ color: statusColor[phase.status] }}>
                          {phase.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-xs flex-shrink-0"
                      style={{ color: 'var(--text-secondary)' }}>
                      <Calendar size={12} />
                      <span>{phase.estimatedStart} → {phase.estimatedEnd}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={{ background: `${statusColor[phase.status]}20`, color: statusColor[phase.status] }}>
                      {statusLabel[phase.status]}
                    </span>
                    {isExpanded
                      ? <ChevronDown size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                      : <ChevronRight size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                    }
                  </div>

                  {/* Tasks (expanded) */}
                  {isExpanded && (
                    <div className="ml-8 pb-3 space-y-2" style={{ borderTop: '1px dashed var(--border)' }}>
                      {phase.tasks.map((task) => {
                        const ctrl = task.securityControlId
                          ? SECURITY_CONTROLS.find((c) => c.id === task.securityControlId)
                          : undefined;
                        return (
                          <div key={task.id}
                            className="flex items-start gap-3 px-4 py-2.5 mx-2 mt-2 rounded-xl"
                            style={{ background: 'var(--bg-main)' }}
                          >
                            <StatusIcon status={task.status} size={13} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                                  {task.name}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                                  style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}>
                                  {task.assignedModule}
                                </span>
                                {ctrl && (
                                  <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-500 font-bold">
                                    <Shield size={9} /> {ctrl.name}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                {task.description}
                              </p>
                            </div>
                            {task.estimatedHours && (
                              <span className="text-[10px] font-medium flex-shrink-0"
                                style={{ color: 'var(--text-secondary)' }}>
                                {task.estimatedHours}h
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Kanban */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {(['completada', 'en_progreso', 'pendiente'] as PhaseStatus[]).map((status) => (
            <div key={status}>
              <div className="flex items-center gap-2 mb-3">
                <StatusIcon status={status} size={16} />
                <span className="text-sm font-bold" style={{ color: statusColor[status] }}>
                  {statusLabel[status]}
                </span>
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${statusColor[status]}20`, color: statusColor[status] }}>
                  {kanbanGroups[status].length}
                </span>
              </div>
              <div className="space-y-3">
                {kanbanGroups[status].map((phase) => (
                  <div
                    key={phase.id}
                    className="card p-4 cursor-pointer hover:scale-[1.01] transition-transform"
                    style={phase.number === 8 ? { borderLeft: '3px solid #8B5CF6' } : {}}
                    onClick={() => setSelectedPhase(selectedPhase?.id === phase.id ? null : phase)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black px-2 py-0.5 rounded-lg"
                        style={{ background: `${statusColor[status]}20`, color: statusColor[status] }}>
                        F{phase.number}
                      </span>
                      <span className="text-sm font-bold flex-1" style={{ color: 'var(--text-primary)' }}>
                        {phase.name}
                      </span>
                    </div>
                    <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {phase.description.slice(0, 80)}...
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${phase.progress}%`, background: statusColor[status] }} />
                      </div>
                      <span className="text-xs font-bold" style={{ color: statusColor[status] }}>
                        {phase.progress}%
                      </span>
                    </div>
                    {phase.number === 8 && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-purple-500">
                        <Shield size={10} /> Vinculada a {securityScore.totalControls} controles de seguridad
                      </div>
                    )}
                    <div className="mt-2 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                      {phase.tasks.length} tareas · {phase.relatedModule}
                    </div>
                    {/* Expanded tasks */}
                    {selectedPhase?.id === phase.id && (
                      <div className="mt-3 space-y-1.5 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                        {phase.tasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-2">
                            <StatusIcon status={task.status} size={11} />
                            <span className="text-[11px]" style={{ color: 'var(--text-primary)' }}>{task.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FASE 8 Security Controls Detail */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-purple-500" />
          <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            FASE 8 — Controles de Seguridad (Base del % de Seguridad)
          </h3>
          <span className="ml-auto text-sm font-black text-purple-500">{securityScore.percentage}%</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SECURITY_CONTROLS.map((ctrl, idx) => (
            <div key={ctrl.id}
              className="flex items-start gap-3 p-3 rounded-xl border"
              style={{
                borderColor: ctrl.implemented ? '#16A34A30' : '#DC262630',
                background: ctrl.implemented ? 'rgba(22,163,74,0.05)' : 'rgba(220,38,38,0.05)',
              }}
            >
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black"
                style={{ background: ctrl.implemented ? '#16A34A20' : '#DC262620', color: ctrl.implemented ? '#16A34A' : '#DC2626' }}>
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{ctrl.name}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{ctrl.evidence}</p>
              </div>
              <CheckCircle2 size={15} style={{ color: ctrl.implemented ? '#16A34A' : '#64748B', flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ERPPlanning;
