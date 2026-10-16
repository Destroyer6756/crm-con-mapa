import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { financeTransactions, bankAccounts } from '../data/erpData';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Search, X } from 'lucide-react';

const Finanzas: React.FC = () => {
  const [tab, setTab] = useState<'resumen' | 'transacciones' | 'bancos'>('resumen');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'ingreso' | 'egreso'>('all');

  const totals = useMemo(() => {
    const incomes  = financeTransactions.filter(t => t.type === 'ingreso').reduce((s, t) => s + t.amount, 0);
    const expenses = financeTransactions.filter(t => t.type === 'egreso').reduce((s, t) => s + t.amount, 0);
    return { incomes, expenses, utility: incomes - expenses };
  }, []);

  const totalBanks = bankAccounts.reduce((s, b) => s + b.balance, 0);

  const filteredTx = financeTransactions.filter((t) => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.reference.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    return matchSearch && matchType;
  });

  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    financeTransactions.forEach((t) => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, []);

  const monthlyData = [
    { month: 'Jul', ingresos: 8200,  egresos: 15000 },
    { month: 'Ago', ingresos: 12500, egresos: 18000 },
    { month: 'Sep', ingresos: 14000, egresos: 16000 },
    { month: 'Oct', ingresos: 13180, egresos: 28428 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          <DollarSign size={20} className="inline mr-2 text-green-500" />
          Módulo de Finanzas
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Cuentas por cobrar/pagar, caja, bancos, ingresos, egresos y reportes
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Ingresos',    value: `$${totals.incomes.toLocaleString()}`,  color: '#16A34A', Icon: TrendingUp },
          { label: 'Total Egresos',     value: `$${totals.expenses.toLocaleString()}`, color: '#DC2626', Icon: TrendingDown },
          { label: 'Utilidad Neta',     value: `$${totals.utility.toLocaleString()}`,  color: '#2563EB', Icon: DollarSign },
          { label: 'Saldo en Bancos',   value: `$${totalBanks.toLocaleString()}`,      color: '#8B5CF6', Icon: CreditCard },
        ].map(({ label, value, color, Icon }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}20`, color }}>
              <Icon size={18}/>
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
              <p className="text-lg font-black" style={{ color }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['resumen', 'transacciones', 'bancos'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize"
            style={{
              background: tab === t ? '#16A34A' : 'var(--bg-main)',
              color: tab === t ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${tab === t ? '#16A34A' : 'var(--border)'}`,
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Resumen */}
      {tab === 'resumen' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
              Ingresos vs Egresos Mensuales
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colEgresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}/>
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`}/>
                <Tooltip
                  formatter={(v: any, name: string) => [`$${Number(v).toLocaleString()}`, name]}
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="ingresos" stroke="#16A34A" fill="url(#colIngresos)" strokeWidth={2} name="Ingresos"/>
                <Area type="monotone" dataKey="egresos"  stroke="#DC2626" fill="url(#colEgresos)"  strokeWidth={2} name="Egresos"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-5">
            <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
              Distribución por Categoría
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false}/>
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`}/>
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} width={90}/>
                <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`]} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}/>
                <Bar dataKey="value" radius={[0,4,4,0]} name="Monto">
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={['#2563EB','#16A34A','#DC2626','#F59E0B','#8B5CF6','#14B8A6'][i % 6]}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Transacciones */}
      {tab === 'transacciones' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-48 border rounded-xl px-3 py-2"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-main)' }}>
              <Search size={15} style={{ color: 'var(--text-secondary)' }}/>
              <input
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: 'var(--text-primary)' }}
                placeholder="Buscar transacción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && <button onClick={() => setSearch('')}><X size={14} style={{ color: 'var(--text-secondary)' }}/></button>}
            </div>
            {(['all', 'ingreso', 'egreso'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                style={{
                  borderColor: typeFilter === f ? (f === 'ingreso' ? '#16A34A' : f === 'egreso' ? '#DC2626' : '#2563EB') : 'var(--border)',
                  background:  typeFilter === f ? (f === 'ingreso' ? '#16A34A15' : f === 'egreso' ? '#DC262615' : '#2563EB15') : 'var(--bg-main)',
                  color:       typeFilter === f ? (f === 'ingreso' ? '#16A34A' : f === 'egreso' ? '#DC2626' : '#2563EB') : 'var(--text-secondary)',
                }}
              >
                {f === 'all' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="card">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Categoría</th>
                    <th>Descripción</th>
                    <th>Referencia</th>
                    <th>Cuenta</th>
                    <th>Monto</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTx.map((t) => (
                    <tr key={t.id}>
                      <td><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.date}</span></td>
                      <td>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          t.type === 'ingreso' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.category}</span></td>
                      <td><span className="text-sm">{t.description}</span></td>
                      <td><span className="font-mono text-xs text-blue-500">{t.reference}</span></td>
                      <td><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.account}</span></td>
                      <td>
                        <span className={`font-bold ${t.type === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>
                          {t.type === 'ingreso' ? '+' : '-'}${t.amount.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          t.status === 'procesado' ? 'bg-green-500/10 text-green-500' :
                          t.status === 'pendiente' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {t.status}
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

      {/* Bancos */}
      {tab === 'bancos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bankAccounts.map((b, i) => {
            const colors = ['#2563EB', '#16A34A', '#8B5CF6'];
            const color = colors[i % colors.length];
            return (
              <div key={b.id} className="card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}20`, color }}>
                    <CreditCard size={20}/>
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{b.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{b.bank}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Número</span>
                    <span className="font-mono">{b.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Tipo</span>
                    <span className="capitalize">{b.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Moneda</span>
                    <span>{b.currency}</span>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-xl" style={{ background: `${color}10` }}>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-secondary)' }}>Saldo Disponible</p>
                  <p className="text-2xl font-black" style={{ color }}>
                    ${b.balance.toLocaleString('es', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Finanzas;
