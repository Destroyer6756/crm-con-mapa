import React, { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { defaultCostItems, monthlyEvolution } from '../data/costs';
import { awsRegions } from '../data/regions';
import { securityItems } from '../data/security';
import {
  Cloud, DollarSign, Globe, Shield, Server,
  Activity, CheckCircle, TrendingUp
} from 'lucide-react';

const Dashboard: React.FC = () => {
  // Computed KPIs from mock data
  const totalMonthlyCost = useMemo(
    () => defaultCostItems.reduce((s, i) => s + i.monthlyCost, 0),
    [],
  );
  const totalAnnualCost = totalMonthlyCost * 12;
  const totalResources  = useMemo(() => awsRegions.reduce((s, r) => s + r.resources, 0), []);
  const activeRegions   = useMemo(() => awsRegions.filter((r) => r.status === 'operational').length, []);
  const avgSecurity     = useMemo(
    () => Math.round(securityItems.reduce((s, i) => s + i.score, 0) / securityItems.length),
    [],
  );

  const pieData = defaultCostItems.map((item) => ({
    name: item.service,
    value: item.monthlyCost,
    color: item.color,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard
          label="Servicios Cloud"
          value={24}
          icon={<Cloud size={18} />}
          color="#2563EB"
          trend={8}
          subtitle="Servicios activos"
          delay={0}
        />
        <StatCard
          label="Región Principal"
          value="us-east-1"
          icon={<Globe size={18} />}
          color="#8B5CF6"
          subtitle="North Virginia"
          delay={50}
        />
        <StatCard
          label="Costo Mensual"
          value={`$${totalMonthlyCost.toFixed(0)}`}
          icon={<DollarSign size={18} />}
          color="#F59E0B"
          trend={3.2}
          subtitle="Este mes"
          delay={100}
        />
        <StatCard
          label="Costo Anual"
          value={`$${totalAnnualCost.toFixed(0)}`}
          icon={<TrendingUp size={18} />}
          color="#EC4899"
          subtitle="Proyección anual"
          delay={150}
        />
        <StatCard
          label="Recursos"
          value={totalResources}
          icon={<Server size={18} />}
          color="#14B8A6"
          subtitle="Total desplegados"
          delay={200}
        />
        <StatCard
          label="Seguridad"
          value={`${avgSecurity}%`}
          icon={<Shield size={18} />}
          color="#16A34A"
          trend={2}
          subtitle="Nivel de protección"
          delay={250}
        />
        <StatCard
          label="Arquitectura"
          value="Operativa"
          icon={<Activity size={18} />}
          color="#2563EB"
          subtitle={`${activeRegions} regiones activas`}
          delay={300}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly evolution */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
            Evolución de Costos Mensual
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyEvolution}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                formatter={(v: any) => [`$${Number(v ?? 0).toFixed(0)}`, '']}
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
              />
              <Legend />
              <Area type="monotone" dataKey="total" stroke="#2563EB" fill="url(#colorTotal)" strokeWidth={2} name="Total" />
              <Area type="monotone" dataKey="EC2" stroke="#16A34A" fill="none" strokeWidth={1.5} name="EC2" />
              <Area type="monotone" dataKey="RDS" stroke="#F59E0B" fill="none" strokeWidth={1.5} name="RDS" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie distribution */}
        <div className="card p-5">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
            Distribución de Costos
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => [`$${Number(v ?? 0).toFixed(2)}`, 'Costo']} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                </div>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  ${item.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regions and Security Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active regions table */}
        <div className="card p-5">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
            Regiones Activas
          </h3>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Región</th>
                  <th>Recursos</th>
                  <th>Costo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {awsRegions.filter((r) => !r.isUserOrigin).slice(0, 6).map((region) => (
                  <tr key={region.id}>
                    <td>
                      <div>
                        <p className="font-semibold text-sm">{region.code}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{region.name}</p>
                      </div>
                    </td>
                    <td className="font-medium">{region.resources}</td>
                    <td className="font-medium">${region.monthlyCost}</td>
                    <td><StatusBadge status={region.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security overview */}
        <div className="card p-5">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
            Resumen de Seguridad
          </h3>
          <div className="space-y-3">
            {securityItems.slice(0, 5).map((item) => {
              const color = item.score >= 90 ? '#16A34A' : item.score >= 75 ? '#F59E0B' : '#DC2626';
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <CheckCircle size={14} style={{ color, flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {item.title}
                      </span>
                      <span className="text-xs font-bold" style={{ color }}>
                        {item.score}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.score}%`, background: color }} />
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cost breakdown bar chart */}
      <div className="card p-5">
        <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
          Desglose de Costos por Servicio
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={defaultCostItems} margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="service" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              formatter={(v: any) => [`$${Number(v ?? 0).toFixed(2)}`, 'Costo mensual']}
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
            />
            <Bar dataKey="monthlyCost" radius={[6, 6, 0, 0]} name="Costo Mensual">
              {defaultCostItems.map((item, i) => (
                <Cell key={i} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
