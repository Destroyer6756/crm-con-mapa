import React, { useState } from 'react';
import { suppliers } from '../data/erpData';
import { purchases } from '../data/erpData';
import type { Supplier } from '../types/cloud';
import { Truck, Search, X, MapPin, Phone, Mail, Tag } from 'lucide-react';
import Modal from '../components/Modal';

const Proveedores: React.FC = () => {
  const [search, setSearch] = useState('');
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null);

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  const getSupplierPurchases = (supplierId: string) =>
    purchases.filter((p) => p.supplierId === supplierId);

  const categoryColors: Record<string, string> = {
    'Hardware': '#14B8A6',
    'Software': '#8B5CF6',
    'Cloud Services': '#2563EB',
    'Networking': '#F59E0B',
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          <Truck size={20} className="inline mr-2 text-amber-500" />
          Módulo de Proveedores
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Datos, contactos, historial de compras y estado de cuenta
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Proveedores Activos',  value: suppliers.filter(s => s.status === 'active').length, color: '#F59E0B' },
          { label: 'Crédito Total Recibido', value: `$${suppliers.reduce((s,p)=>s+p.creditLimit,0).toLocaleString()}`, color: '#8B5CF6' },
          { label: 'Saldo Total x Pagar',  value: `$${suppliers.reduce((s,p)=>s+p.balance,0).toLocaleString()}`,      color: '#DC2626' },
          { label: 'Órdenes de Compra',    value: purchases.length, color: '#14B8A6' },
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
          placeholder="Buscar proveedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && <button onClick={() => setSearch('')}><X size={14} style={{ color: 'var(--text-secondary)' }}/></button>}
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((s) => {
          const catColor = categoryColors[s.category] || '#64748B';
          const sPurchases = getSupplierPurchases(s.id);
          return (
            <div key={s.id} className="card p-5 hover:scale-[1.01] transition-transform cursor-pointer"
              onClick={() => setViewSupplier(s)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${catColor}20`, color: catColor }}>
                    {s.code}
                  </span>
                  <h3 className="font-bold text-sm mt-1" style={{ color: 'var(--text-primary)' }}>{s.name}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.contactPerson}</p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold"
                  style={{ background: `${catColor}15`, color: catColor }}>
                  <Tag size={10}/> {s.category}
                </div>
              </div>
              <div className="space-y-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <p className="flex items-center gap-1.5"><Mail size={11}/> {s.email}</p>
                <p className="flex items-center gap-1.5"><Phone size={11}/> {s.phone}</p>
                <p className="flex items-center gap-1.5"><MapPin size={11}/> {s.city}, {s.country}</p>
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t text-xs"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <span>Saldo: <strong className="text-amber-500">${s.balance.toLocaleString()}</strong></span>
                <span>Límite: ${s.creditLimit.toLocaleString()}</span>
                <span>{sPurchases.length} compras</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!viewSupplier} onClose={() => setViewSupplier(null)} title="Detalle del Proveedor" size="lg">
        {viewSupplier && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Código',     value: viewSupplier.code },
                { label: 'Categoría', value: viewSupplier.category },
                { label: 'Email',     value: viewSupplier.email },
                { label: 'Teléfono', value: viewSupplier.phone },
                { label: 'Ciudad',   value: `${viewSupplier.city}, ${viewSupplier.country}` },
                { label: 'RUC',      value: viewSupplier.ruc || 'Internacional' },
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
                <span style={{ color: 'var(--text-secondary)' }}>Crédito otorgado:</span>
                <strong>${viewSupplier.creditLimit.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span style={{ color: 'var(--text-secondary)' }}>Saldo por pagar:</span>
                <strong className="text-amber-500">${viewSupplier.balance.toLocaleString()}</strong>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>HISTORIAL DE COMPRAS</p>
              {getSupplierPurchases(viewSupplier.id).map((p) => (
                <div key={p.id} className="flex justify-between text-sm p-2 rounded-lg mb-1"
                  style={{ background: 'var(--bg-main)' }}>
                  <span className="font-mono text-purple-500">{p.code}</span>
                  <span>${p.total.toLocaleString()}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{p.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Proveedores;
