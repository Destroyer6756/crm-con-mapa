import React, { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import SecurityCard from '../components/SecurityCard';
import StatusBadge from '../components/StatusBadge';
import { securityItems, iamSummary, sharedResponsibilityModel } from '../data/security';
import { Shield, Users, Key, Lock, Database, HardDrive, AlertTriangle, CheckCircle } from 'lucide-react';

const Security: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'iam' | 'responsibility'>('overview');

  const avgScore = Math.round(securityItems.reduce((s, i) => s + i.score, 0) / securityItems.length);
  const goodCount    = securityItems.filter((i) => i.status === 'good').length;
  const reviewCount  = securityItems.filter((i) => i.status === 'review').length;
  const criticalCount = securityItems.filter((i) => i.status === 'critical').length;

  const radarData = securityItems.map((item) => ({
    subject: item.title,
    score: item.score,
    fullMark: 100,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Score header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: '#16A34A20' }}
            >
              <Shield size={30} className="text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Postura de Seguridad
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Evaluación global del estado de seguridad Cloud
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-black text-green-500">{avgScore}%</div>
            <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-secondary)' }}>
              Seguridad Global
            </p>
          </div>
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Correcto',           count: goodCount,    icon: <CheckCircle size={18} />,   color: '#16A34A' },
            { label: 'Requiere Revisión',  count: reviewCount,  icon: <AlertTriangle size={18} />, color: '#F59E0B' },
            { label: 'Crítico',            count: criticalCount,icon: <Shield size={18} />,         color: '#DC2626' },
          ].map(({ label, count, icon, color }) => (
            <div key={label} className="rounded-xl p-4 text-center" style={{ background: `${color}10` }}>
              <div className="flex justify-center mb-1" style={{ color }}>{icon}</div>
              <p className="text-2xl font-bold" style={{ color }}>{count}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['overview', 'iam', 'responsibility'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                : 'border'
            }`}
            style={activeTab !== tab ? { borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}
          >
            {tab === 'overview' ? 'Controles' : tab === 'iam' ? 'IAM & Identidad' : 'Responsabilidad Compartida'}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Radar chart */}
          <div className="card p-5">
            <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
              Radar de Seguridad
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
                <Radar name="Puntuación" dataKey="score" stroke="#16A34A" fill="#16A34A" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Security cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityItems.map((item) => (
              <SecurityCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* IAM tab */}
      {activeTab === 'iam' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Usuarios IAM',       value: iamSummary.users,         icon: <Users size={18} />,    color: '#2563EB' },
              { label: 'Roles',              value: iamSummary.roles,          icon: <Key size={18} />,     color: '#8B5CF6' },
              { label: 'Políticas',          value: iamSummary.policies,       icon: <Lock size={18} />,    color: '#F59E0B' },
              { label: 'MFA Habilitado',     value: `${iamSummary.mfaEnabled}/${iamSummary.mfaTotal}`,
                icon: <Shield size={18} />,   color: '#16A34A' },
              { label: 'Buckets Cifrados',   value: `${iamSummary.encryptedBuckets}/${iamSummary.totalBuckets}`,
                icon: <Database size={18} />, color: '#14B8A6' },
              { label: 'Backups Config.',    value: `${iamSummary.backupsConfigured}/${iamSummary.totalBackups}`,
                icon: <HardDrive size={18} />,color: '#EC4899' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, color }}>{icon}</div>
                </div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* MFA progress */}
          <div className="card p-5">
            <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
              Estado de MFA por usuarios
            </h3>
            <div className="space-y-3">
              {[
                { name: 'admin@cloudops.io',    mfa: true },
                { name: 'dev1@cloudops.io',     mfa: true },
                { name: 'dev2@cloudops.io',     mfa: true },
                { name: 'ops@cloudops.io',      mfa: true },
                { name: 'analyst@cloudops.io',  mfa: false },
                { name: 'readonly@cloudops.io', mfa: false },
              ].map(({ name, mfa }) => (
                <div key={name} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{name}</span>
                  </div>
                  <StatusBadge status={mfa ? 'good' : 'review'} label={mfa ? 'MFA Activo' : 'Sin MFA'} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shared Responsibility tab */}
      {activeTab === 'responsibility' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Shield size={20} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Responsabilidad AWS</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Seguridad DE la nube</p>
              </div>
            </div>
            <ul className="space-y-3">
              {sharedResponsibilityModel.awsResponsibilities.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-blue-500 flex-shrink-0" />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 rounded-xl bg-blue-500/10">
              <p className="text-xs text-blue-500 font-semibold">
                AWS garantiza la seguridad física y lógica de toda la infraestructura subyacente.
              </p>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Users size={20} className="text-green-500" />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Responsabilidad del Cliente</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Seguridad EN la nube</p>
              </div>
            </div>
            <ul className="space-y-3">
              {sharedResponsibilityModel.clientResponsibilities.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 rounded-xl bg-green-500/10">
              <p className="text-xs text-green-500 font-semibold">
                El cliente es responsable de todo lo que se despliega y configura en la nube.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Security;
