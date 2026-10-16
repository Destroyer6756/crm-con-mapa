import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';
import { sales, purchases, products, customers, financeTransactions } from '../data/erpData';
import { PROJECT_PHASES, SECURITY_CONTROLS, calculateSecurityScore } from '../data/planningPhases';
import { BarChart3, TrendingUp, ShoppingCart, Package, Users, Shield, Activity } from 'lucide-react';

const Reportes: React.FC = () => {
  const securityScore = useMemo(() => calculateSecurityScore(SECURITY_CONTROLS), []);

  const planningPct = useMemo(() => {
    const total = PROJECT_PHASES.reduce((s, p) => s + p.progress, 0);
    return Math.round(total / PROJECT_PHASES.length);
  }, []);

  const salesByStatus = useMemo(() => {
    const groups: Record<string, number> = {};
    sales.forEach((s) => { groups[s.status] = (groups[s.status] || 0) + 1; });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, []);

  const purchaseByStatus = useMemo(() => {
    const groups: Record<string, number> = {};
    purchases.forEach((p) => { groups[p.status] = (groups[p.status] || 0) + 1; });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, []);

  const incomes  = financeTransactions.filter(t => t.type === 'ingreso').reduce((s, t) => s + t.amount, 0);
  const expenses = financeTransactions.filter(t => t.type === 'egreso').reduce((s, t) => s + t.amount, 0);

  const TOP_PRODUCTS = products.slice(0, 5).map((p) => ({
    name: p.name.slice(0, 18),
    stock: p.stock,
    min: p.minStock,
  }));

  const STATUS_COLORS: Record<string, string> = {
    cotizacion: '#64748B',
    pendiente:  '#F59E0B',
    confirmado: '#2563EB',
    entregado:  '#16A34A',
    cancelado:  '#DC2626',
    solicitud:  '#64748B',
    orden:      '#2563EB',
    recibido:   '#14B8A6',
    facturado:  '#F59E0B',
    pagado:     '#16A34A',
  };

  const securityBarData = SECURITY_CONTROLS.map((c, i) => ({
    name: `C${i+1}`,
    value: c.implemented ? 100 : 0,
    implemented: c.implemented,
    fullName: c.name,
  }));

  const planningBarData = PROJECT_PHASES.map((p) => ({
    name: `F${p.number}`,
    value: p.progress,
    status: p.status,
    fullName: p.name,
  }));

  const STATUS_PHASE_COLORS: Record<string, string> = {
    completada: '#16A34A',
    en_progreso: '#F59E0B',
    pendiente: '#64748B',
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          <BarChart3 size={20} className="inline mr-2 text-blue-500" />
          Módulo de Reportes
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Reportes operativos y analíticos del ERP EnterpriseCloud
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Ventas',   value: `$${sales.reduce((s,v)=>s+v.total,0).toLocaleString()}`, color: '#2563EB', Icon: ShoppingCart },
          { label: 'Total Compras',  value: `$${purchases.reduce((s,p)=>s+p.total,0).toLocaleString()}`, color: '#8B5CF6', Icon: Package },
          { label: 'Clientes',       value: customers.length, color: '#14B8A6', Icon: Users },
          { label: 'Ingresos',       value: `$${incomes.toLocaleString()}`, color: '#16A34A', Icon: TrendingUp },
          { label: '% Planificación',value: `${planningPct}%`, color: '#2563EB', Icon: Activity },
          { label: '% Seguridad',    value: `${securityScore.percentage}%`, color: '#8B5CF6', Icon: Shield },
        ].map(({ label, value, color, Icon }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} style={{ color }}/>
              <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
            </div>
            <p className="text-lg font-black" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Ventas + Compras status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
            Ventas por Estado
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesByStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}/>
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} allowDecimals={false}/>
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}/>
              <Bar dataKey="value" radius={[4,4,0,0]} name="Ventas">
                {salesByStatus.map((e, i) => <Cell key={i} fill={STATUS_COLORS[e.name] || '#64748B'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
            Compras por Estado
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={purchaseByStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}/>
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} allowDecimals={false}/>
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}/>
              <Bar dataKey="value" radius={[4,4,0,0]} name="Compras">
                {purchaseByStatus.map((e, i) => <Cell key={i} fill={STATUS_COLORS[e.name] || '#64748B'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Planificación + Seguridad charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
            Avance por Fase de Planificación
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={planningBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}/>
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} domain={[0,100]} tickFormatter={v => `${v}%`}/>
              <Tooltip
                formatter={(v: any) => [`${v}%`, 'Avance']}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
              />
              <Bar dataKey="value" radius={[4,4,0,0]} name="Avance">
                {planningBarData.map((e, i) => <Cell key={i} fill={STATUS_PHASE_COLORS[e.status] || '#64748B'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
            Controles de Seguridad Implementados
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={securityBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}/>
              <YAxis hide domain={[0,100]}/>
              <Tooltip
                formatter={(v: any) => [v === 100 ? '✅ Implementado' : '❌ Pendiente', 'Estado']}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
              />
              <Bar dataKey="value" radius={[4,4,0,0]} name="Estado">
                {securityBarData.map((e, i) => <Cell key={i} fill={e.implemented ? '#16A34A' : '#DC2626'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <span className="text-2xl font-black text-purple-500">{securityScore.percentage}%</span>
            <span className="text-xs ml-2" style={{ color: 'var(--text-secondary)' }}>de seguridad alcanzado</span>
          </div>
        </div>
      </div>

      {/* Stock Report */}
      <div className="card p-5">
        <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
          Reporte de Stock — Top 5 Productos
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={TOP_PRODUCTS}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}/>
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}/>
            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}/>
            <Bar dataKey="stock" fill="#14B8A6" radius={[4,4,0,0]} name="Stock Actual"/>
            <Bar dataKey="min"   fill="#F59E0B" radius={[4,4,0,0]} name="Stock Mínimo"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Reportes;
