import React from 'react';
import type { SecurityItem } from '../types/cloud';
import StatusBadge from './StatusBadge';
import { CheckCircle, Clock } from 'lucide-react';

interface SecurityCardProps {
  item: SecurityItem;
}

const SecurityCard: React.FC<SecurityCardProps> = ({ item }) => {
  const scoreColor =
    item.score >= 90 ? '#16A34A' : item.score >= 75 ? '#F59E0B' : '#DC2626';

  return (
    <div className="card p-5 flex flex-col gap-4 animate-fade-in-up">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            {item.title}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {item.description}
          </p>
        </div>
        <StatusBadge status={item.status} />
      </div>

      {/* Score bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Puntuación
          </span>
          <span className="text-lg font-bold" style={{ color: scoreColor }}>
            {item.score}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${item.score}%`, background: scoreColor }}
          />
        </div>
      </div>

      {/* Details */}
      <ul className="space-y-1.5">
        {item.details.map((detail, i) => (
          <li key={i} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
            {detail}
          </li>
        ))}
      </ul>

      {/* Last review */}
      <div className="flex items-center gap-1.5 text-xs pt-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
        <Clock size={12} />
        Revisado: {item.lastReview}
      </div>
    </div>
  );
};

export default SecurityCard;
