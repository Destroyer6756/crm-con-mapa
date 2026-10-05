import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  color?: string;
  trend?: number;
  subtitle?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  label, value, unit, icon, color = '#2563EB', trend, subtitle, delay = 0
}) => {
  return (
    <div
      className="card p-5 flex flex-col gap-3 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20`, color }}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {value}
        </span>
        {unit && (
          <span className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        {subtitle && (
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {subtitle}
          </span>
        )}
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
