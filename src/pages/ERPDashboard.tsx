import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  ShoppingCart, Package, Users, TrendingUp, DollarSign,
  AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight,
  Shield, Activity, Layers, BarChart3,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { customers, suppliers, products, sales, purchases,
  financeTransactions, bankAccounts, monthlySalesData } from '../data/erpData';
import { PROJECT_PHASES, SECURITY_CONTROLS, calculateSecurityScore } from '../data/planningPhases';

const ERPDashboard: React.FC = () => {
  const securityScore = useMemo(() => calculateSecurityScore(SECURITY_CONTROLS), []);

  const planningPct = useMemo(() => {
    const total = PROJECT_PHASES.reduce((s, p) => s + p.progress, 0);
    return Math.round(total / PROJECT_PHASES.length);
  }, []);

  const completedPhases = PROJECT_PHASES.filter((p) => p.status === 'completada').length;

  // KPIs
  const totalSales = useMemo(() => sales.reduce((s, v) => s + v.total, 0), []);
  const totalPurchases = useMemo(() => purchases.reduce((s, v) => s + v.total, 0), []);
  const totalCxC = useMemo(() => sales.reduce((s, v) => s + v.balance, 0), []);
  const totalCxP = useMemo(() => purchases.reduce((s, v) => s + v.balance, 0), []);
  const totalBankBalance = useMemo(() => bankAccounts.reduce((s, b) => s + b.balance, 0), []);
  const lowStockProducts = useMemo(() => products.filter((p) => p.stock <= p.minStock).length, []);

  const incomes  = financeTransactions.filter((t) => t.type === 'ingreso').reduce((s, t) => s + t.amount, 0);
  const expenses = financeTransactions.filter((t) => t.type === 'egreso').reduce((s, t) => s + t.amount, 0);
  const utility  = incomes - expenses;

  const pieData = [
    { name: 'Ingresos',  value: incomes,   color: '#16A34A' },
    { name: 'Egresos',   value: expenses,  color: '#DC2626' },
    { name: 'Utilidad',  value: utility,   color: '#2563EB' },
  ];

  const recentSales = sales.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard label="Ventas Totales"    value={`$${(totalSales/1000).toFixed(1)}K`} icon={<ShoppingCart size={18}/>} color="#2563EB" trend={8.5}  subtitle="Este mes" delay={0}   />
        <StatCard label="Compras Totales"   value={`$${(totalPurchases/1000).toFixed(1)}K`} icon={<Package size={18}/>} color="#8B5CF6" trend={3.2}  subtitle="Este mes" delay={50}  />
        <StatCard label="Cuentas x Cobrar" value={`$${(totalCxC/1000).toFixed(1)}K`}   icon={<ArrowUpRight size={18}/>} color="#F59E0B" subtitle="Pendiente cobro" delay={100} />
        <StatCard label="Cuentas x Pagar"  value={`$${(totalCxP/1000).toFixed(1)}K`}   icon={<ArrowDownRight size={18}/>} color="#EC4899" subtitle="Pendiente pago" delay={150}/>
        <StatCard label="Saldo Bancos"      value={`$${(totalBankBalance/1000).toFixed(1)}K`} icon={<DollarSign size={18}/>} color="#14B8A6" trend={1.8}  subtitle="Total cuentas" delay={200}/>
        <StatCard label="% Seguridad"       value={`${securityScore.percentage}%`}       icon={<Shield size={18}/>} color="#16A34A" trend={0}    subtitle={`${securityScore.implementedControls}/8 controles`} delay={250}/>
        <StatCard label="% Planificación"   value={`${planningPct}%`}                    icon={<Activity size={18}/>} color="#2563EB" subtitle={`${completedPhases}/12 fases`} delay={300}/>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales evolution */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
            Evolución Ventas vs Compras (últimos 6 meses)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlySalesData}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCompras" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}/>
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`}/>
              <Tooltip
                formatter={(v: any, name: string) => [`$${Number(v).toLocaleString()}`, name]}
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
              />
              <Legend/>
              <Area type="monotone" dataKey="ventas"   stroke="#2563EB" fill="url(#colorVentas)"  strokeWidth={2} name="Ventas"/>
              <Area type="monotone" dataKey="compras"  stroke="#8B5CF6" fill="url(#colorCompras)" strokeWidth={2} name="Compras"/>
              <Area type="monotone" dataKey="utilidad" stroke="#16A34A" fill="none"               strokeWidth={2} name="Utilidad" strokeDasharray="4 2"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Finance pie */}
        <div className="card p-5">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
            Distribución Financiera
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {pieData.map((e, i) => <Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, '']} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }}/>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                </div>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  ${item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Planning + Security + Recent Sales Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planning vs Security */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-blue-500"/>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Planificación vs Seguridad
            </h3>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Avance Planificación', value: planningPct, color: '#2563EB', sub: `${completedPhases}/12 fases` },
              { label: '% Seguridad Sistema',  value: securityScore.percentage, color: '#8B5CF6', sub: `${securityScore.implementedControls}/8 controles` },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span className="text-sm font-black" style={{ color: item.color }}>{item.value}%</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${item.value}%`, background: item.color }}/>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.sub}</p>
              </div>
            ))}
            <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <BarChart width={220} height={80} data={[
                { name: 'Planif.', value: planningPct, fill: '#2563EB' },
                { name: 'Segur.', value: securityScore.percentage, fill: '#8B5CF6' },
              ]}>
                <Bar dataKey="value" radius={[4,4,0,0]}>
                  {[{ fill: '#2563EB' }, { fill: '#8B5CF6' }].map((e, i) => <Cell key={i} fill={e.fill}/>)}
                </Bar>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false}/>
                <YAxis hide domain={[0, 100]}/>
                <Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: 12 }}/>
              </BarChart>
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
            Ventas Recientes
          </h3>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Saldo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((s) => (
                  <tr key={s.id}>
                    <td><span className="text-xs font-mono text-blue-500">{s.code}</span></td>
                    <td><span className="text-sm font-medium">{s.customerName}</span></td>
                    <td><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.date}</span></td>
                    <td><span className="font-semibold">${s.total.toLocaleString()}</span></td>
                    <td>
                      <span className={`font-semibold text-sm ${s.balance > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                        ${s.balance.toLocaleString()}
                      </span>
                    </td>
                    <td><StatusBadge status={s.status as any}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Low Stock Alert */}
        {lowStockProducts > 0 && (
          <div className="card p-4 border border-amber-500/30" style={{ background: 'rgba(245,158,11,0.05)' }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-amber-500"/>
              <span className="text-sm font-bold text-amber-500">Stock Crítico</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {lowStockProducts} producto(s) con stock bajo o igual al mínimo
            </p>
          </div>
        )}
        {/* Accounts Receivable Alert */}
        {totalCxC > 0 && (
          <div className="card p-4 border border-blue-500/30" style={{ background: 'rgba(37,99,235,0.05)' }}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-blue-500"/>
              <span className="text-sm font-bold text-blue-500">Cuentas x Cobrar</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              ${totalCxC.toLocaleString()} pendientes de cobro de {sales.filter(s => s.balance > 0).length} ventas
            </p>
          </div>
        )}
        {/* Security Level */}
        <div className="card p-4 border border-green-500/30" style={{ background: 'rgba(22,163,74,0.05)' }}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-green-500"/>
            <span className="text-sm font-bold text-green-500">Seguridad del Sistema</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {securityScore.implementedControls} de {securityScore.totalControls} controles implementados · {securityScore.percentage}% seguridad
          </p>
        </div>
      </div>
    </div>
  );
};

export default ERPDashboard;
