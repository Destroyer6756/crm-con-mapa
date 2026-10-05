import React from 'react';
import type { Notification } from '../types/cloud';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface NotificationToastProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const ICONS = {
  success: <CheckCircle size={18} className="text-green-400" />,
  error:   <XCircle size={18} className="text-red-400" />,
  warning: <AlertTriangle size={18} className="text-amber-400" />,
  info:    <Info size={18} className="text-blue-400" />,
};

const COLORS = {
  success: '#16A34A',
  error:   '#DC2626',
  warning: '#F59E0B',
  info:    '#2563EB',
};

const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-xs w-full">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="animate-notif-in flex items-start gap-3 p-4 rounded-2xl shadow-2xl border"
          style={{
            background: 'var(--card)',
            borderLeft: `3px solid ${COLORS[n.type]}`,
            borderTop: '1px solid var(--border)',
            borderRight: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {ICONS[n.type]}
          <p className="flex-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {n.message}
          </p>
          <button
            onClick={() => onRemove(n.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
