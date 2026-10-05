import React from 'react';
import type { SecurityStatus } from '../types/cloud';

interface StatusBadgeProps {
  status: SecurityStatus | 'operational' | 'warning' | 'error' | 'active' | 'inactive' | 'maintenance' | 'running' | 'stopped';
  label?: string;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG = {
  operational: { color: '#16A34A', bg: '#16A34A20', label: 'Operativo' },
  running:     { color: '#16A34A', bg: '#16A34A20', label: 'Running' },
  active:      { color: '#16A34A', bg: '#16A34A20', label: 'Activo' },
  good:        { color: '#16A34A', bg: '#16A34A20', label: 'Correcto' },
  warning:     { color: '#F59E0B', bg: '#F59E0B20', label: 'Advertencia' },
  review:      { color: '#F59E0B', bg: '#F59E0B20', label: 'Revisar' },
  error:       { color: '#DC2626', bg: '#DC262620', label: 'Error' },
  critical:    { color: '#DC2626', bg: '#DC262620', label: 'Crítico' },
  stopped:     { color: '#DC2626', bg: '#DC262620', label: 'Detenido' },
  inactive:    { color: '#64748B', bg: '#64748B20', label: 'Inactivo' },
  maintenance: { color: '#8B5CF6', bg: '#8B5CF620', label: 'Mantenimiento' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'sm' }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.inactive;
  const displayLabel = label ?? cfg.label;
  const fontSize = size === 'sm' ? '11px' : '13px';
  const padding = size === 'sm' ? '2px 8px' : '4px 12px';

  return (
    <span
      className="inline-flex items-center gap-1.5 font-semibold rounded-full"
      style={{ background: cfg.bg, color: cfg.color, fontSize, padding }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: cfg.color }} />
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
