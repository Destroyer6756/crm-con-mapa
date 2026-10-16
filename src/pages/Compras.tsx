import React, { useState } from 'react';
import { purchases as initialPurchases } from '../data/erpData';
import type { Purchase, PurchaseStatus } from '../types/cloud';
import { Package, Eye, Search, X, ChevronDown } from 'lucide-react';
import Modal from '../components/Modal';

const STATUS_COLORS: Record<PurchaseStatus, string> = {
  solicitud: '#64748B',
  orden:     '#2563EB',
  recibido:  '#14B8A6',
  facturado: '#F59E0B',
  pagado:    '#16A34A',
  cancelado: '#DC2626',
};

const PURCHASE_STATUSES: PurchaseStatus[] = ['solicitud', 'orden', 'recibido', 'facturado', 'pagado', 'cancelado'];

const Compras: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | 'all'>('all');
  const [viewPurchase, setViewPurchase] = useState<Purchase | null>(null);

  const filtered = purchases.filter((p) => {
    const matchSearch = p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalCompras   = purchases.reduce((s, p) => s + p.total, 0);
  const totalPagado    = purchases.reduce((s, p) => s + p.paid, 0);
  const totalPendiente = purchases.reduce((s, p) => s + p.balance, 0);

  const handleStatusChange = (id: string, newStatus: PurchaseStatus) => {
    setPurchases((prev) => prev.map((p) => p.id === id ? { ...p, status: newStatus } : p));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            <Package size={20} className="inline mr-2 text-purple-500" />
            Módulo de Compras
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Solicitudes, órdenes, recepción, facturas y pagos a proveedores
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Compras',   value: `$${totalCompras.toLocaleString()}`,   color: '#8B5CF6' },
          { label: 'Total Pagado',    value: `$${totalPagado.toLocaleString()}`,    color: '#16A34A' },
          { label: 'Saldo Pendiente', value: `$${totalPendiente.toLocaleString()}`, color: '#F59E0B' },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-4">
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{kpi.label}</p>
            <p className="text-2xl font-black" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48 border rounded-xl px-3 py-2"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-main)' }}>
          <Search size={15} style={{ color: 'var(--text-secondary)' }}/>
          <input
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: 'var(--text-primary)' }}
            placeholder="Buscar por código o proveedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch('')}><X size={14} style={{ color: 'var(--text-secondary)' }}/></button>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', ...PURCHASE_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
              style={{
                borderColor: statusFilter === s ? (STATUS_COLORS[s as PurchaseStatus] || '#8B5CF6') : 'var(--border)',
                background:  statusFilter === s ? `${STATUS_COLORS[s as PurchaseStatus] || '#8B5CF6'}15` : 'var(--bg-main)',
                color:       statusFilter === s ? (STATUS_COLORS[s as PurchaseStatus] || '#8B5CF6') : 'var(--text-secondary)',
              }}
            >
              {s === 'all' ? 'Todos' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Proveedor</th>
                <th>Fecha</th>
                <th>Vencimiento</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Pagado</th>
                <th>Saldo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={11} className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>Sin resultados</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id}>
                  <td><span className="font-mono text-xs text-purple-500">{p.code}</span></td>
                  <td><span className="text-sm font-medium">{p.supplierName}</span></td>
                  <td><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.date}</span></td>
                  <td><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.dueDate}</span></td>
                  <td>${p.subtotal.toLocaleString()}</td>
                  <td>${p.tax.toFixed(2)}</td>
                  <td className="font-bold">${p.total.toLocaleString()}</td>
                  <td className="text-green-500 font-semibold">${p.paid.toLocaleString()}</td>
                  <td className={`font-semibold ${p.balance > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                    ${p.balance.toLocaleString()}
                  </td>
                  <td>
                    <div className="relative group">
                      <button
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-semibold"
                        style={{ background: `${STATUS_COLORS[p.status]}20`, color: STATUS_COLORS[p.status] }}
                      >
                        {p.status} <ChevronDown size={10}/>
                      </button>
                      <div className="absolute z-10 hidden group-hover:block right-0 mt-1 bg-white dark:bg-slate-800 border rounded-xl shadow-xl"
                        style={{ borderColor: 'var(--border)' }}>
                        {PURCHASE_STATUSES.map((st) => (
                          <button
                            key={st}
                            className="block w-full text-left px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
                            style={{ color: STATUS_COLORS[st] }}
                            onClick={() => handleStatusChange(p.id, st)}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td>
                    <button onClick={() => setViewPurchase(p)} className="p-1.5 rounded-lg hover:bg-purple-500/10 text-purple-500 transition-colors">
                      <Eye size={15}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!viewPurchase} onClose={() => setViewPurchase(null)} title={`Compra ${viewPurchase?.code}`} size="lg">
        {viewPurchase && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Proveedor',   value: viewPurchase.supplierName },
                { label: 'Fecha',       value: viewPurchase.date },
                { label: 'Vencimiento', value: viewPurchase.dueDate },
                { label: 'Estado',      value: viewPurchase.status },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl" style={{ background: 'var(--bg-main)' }}>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>DETALLE</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <th className="text-left pb-2">Producto</th>
                    <th className="text-right pb-2">Cant.</th>
                    <th className="text-right pb-2">Precio</th>
                    <th className="text-right pb-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {viewPurchase.details.map((d) => (
                    <tr key={d.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="py-2">{d.productName}</td>
                      <td className="py-2 text-right">{d.quantity}</td>
                      <td className="py-2 text-right">${d.unitPrice}</td>
                      <td className="py-2 text-right font-semibold">${d.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end text-sm border-t pt-3 space-y-1 flex-col items-end" style={{ borderColor: 'var(--border)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Subtotal: <strong>${viewPurchase.subtotal}</strong></p>
              <p style={{ color: 'var(--text-secondary)' }}>IVA: <strong>${viewPurchase.tax.toFixed(2)}</strong></p>
              <p className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>Total: ${viewPurchase.total.toLocaleString()}</p>
              <p className="text-green-500 font-semibold">Pagado: ${viewPurchase.paid.toLocaleString()}</p>
              {viewPurchase.balance > 0 && <p className="text-amber-500 font-semibold">Saldo: ${viewPurchase.balance.toLocaleString()}</p>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Compras;
