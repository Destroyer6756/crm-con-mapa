import React, { useState } from 'react';
import { customers } from '../data/erpData';
import { sales } from '../data/erpData';
import type { Customer } from '../types/cloud';
import { Users, Eye, Search, X, MapPin, Phone, Mail, CreditCard } from 'lucide-react';
import Modal from '../components/Modal';

const Clientes: React.FC = () => {
  const [search, setSearch] = useState('');
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const getCustomerSales = (customerId: string) =>
    sales.filter((s) => s.customerId === customerId);

  const creditUsedPct = (c: Customer) =>
    c.creditLimit > 0 ? Math.min(100, Math.round((c.balance / c.creditLimit) * 100)) : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          <Users size={20} className="inline mr-2 text-blue-500" />
          Módulo de Clientes
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Datos, contactos, historial, créditos y estado de cuenta
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Clientes Activos', value: customers.filter(c => c.status === 'active').length, color: '#2563EB' },
          { label: 'Total Crédito Otorgado', value: `$${customers.reduce((s,c)=>s+c.creditLimit,0).toLocaleString()}`, color: '#8B5CF6' },
          { label: 'Saldo Total x Cobrar',   value: `$${customers.reduce((s,c)=>s+c.balance,0).toLocaleString()}`,      color: '#F59E0B' },
          { label: 'Ventas Registradas',      value: sales.length, color: '#16A34A' },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-4">
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{kpi.label}</p>
            <p className="text-xl font-black" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 border rounded-xl px-3 py-2 max-w-sm"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-main)' }}>
        <Search size={15} style={{ color: 'var(--text-secondary)' }}/>
        <input
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: 'var(--text-primary)' }}
          placeholder="Buscar por nombre, código o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && <button onClick={() => setSearch('')}><X size={14} style={{ color: 'var(--text-secondary)' }}/></button>}
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const pct = creditUsedPct(c);
          const color = pct > 80 ? '#DC2626' : pct > 50 ? '#F59E0B' : '#16A34A';
          const cSales = getCustomerSales(c.id);
          return (
            <div key={c.id} className="card p-5 space-y-3 hover:scale-[1.01] transition-transform cursor-pointer"
              onClick={() => setViewCustomer(c)}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">{c.code}</span>
                  <h3 className="font-bold text-sm mt-1" style={{ color: 'var(--text-primary)' }}>{c.name}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{c.contactPerson}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  c.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-500'
                }`}>
                  {c.status}
                </span>
              </div>
              <div className="space-y-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <p className="flex items-center gap-1.5"><Mail size={11}/> {c.email}</p>
                <p className="flex items-center gap-1.5"><Phone size={11}/> {c.phone}</p>
                <p className="flex items-center gap-1.5"><MapPin size={11}/> {c.city}, {c.country}</p>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    <CreditCard size={10}/> Crédito usado
                  </span>
                  <span className="font-bold" style={{ color }}>{pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }}/>
                </div>
                <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                  <span>Saldo: <strong className="text-amber-500">${c.balance.toLocaleString()}</strong></span>
                  <span>Límite: ${c.creditLimit.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between text-[10px] pt-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <span>{cSales.length} ventas registradas</span>
                <span>Desde {c.createdAt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!viewCustomer} onClose={() => setViewCustomer(null)} title="Detalle del Cliente" size="lg">
        {viewCustomer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Código',   value: viewCustomer.code },
                { label: 'RUC',      value: viewCustomer.ruc || 'N/A' },
                { label: 'Email',    value: viewCustomer.email },
                { label: 'Teléfono',value: viewCustomer.phone },
                { label: 'Ciudad',  value: `${viewCustomer.city}, ${viewCustomer.country}` },
                { label: 'Dirección',value: viewCustomer.address },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl" style={{ background: 'var(--bg-main)' }}>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl" style={{ background: 'var(--bg-main)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>ESTADO DE CUENTA</p>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Límite de crédito:</span>
                <strong>${viewCustomer.creditLimit.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span style={{ color: 'var(--text-secondary)' }}>Saldo deudor:</span>
                <strong className="text-amber-500">${viewCustomer.balance.toLocaleString()}</strong>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>HISTORIAL DE VENTAS</p>
              {getCustomerSales(viewCustomer.id).map((s) => (
                <div key={s.id} className="flex justify-between text-sm p-2 rounded-lg mb-1"
                  style={{ background: 'var(--bg-main)' }}>
                  <span className="font-mono text-blue-500">{s.code}</span>
                  <span>${s.total.toLocaleString()}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{s.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Clientes;
