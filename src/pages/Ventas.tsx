import React, { useState } from 'react';
import { sales as initialSales } from '../data/erpData';
import type { Sale, SaleStatus } from '../types/cloud';
import {
  ShoppingCart, Plus, Eye, Edit2, FileText, Search,
  ChevronDown, X, CheckCircle2,
} from 'lucide-react';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

const STATUS_COLORS: Record<SaleStatus, string> = {
  cotizacion: '#64748B',
  pendiente:  '#F59E0B',
  confirmado: '#2563EB',
  entregado:  '#16A34A',
  cancelado:  '#DC2626',
};

const SALE_STATUSES: SaleStatus[] = ['cotizacion', 'pendiente', 'confirmado', 'entregado', 'cancelado'];

const Ventas: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<SaleStatus | 'all'>('all');
  const [viewSale, setViewSale] = useState<Sale | null>(null);

  const filtered = sales.filter((s) => {
    const matchSearch = s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalVentas  = sales.reduce((sum, s) => sum + s.total, 0);
  const totalCobrado = sales.reduce((sum, s) => sum + s.paid, 0);
  const totalPendiente = sales.reduce((sum, s) => sum + s.balance, 0);

  const handleStatusChange = (saleId: string, newStatus: SaleStatus) => {
    setSales((prev) => prev.map((s) => s.id === saleId ? { ...s, status: newStatus } : s));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            <ShoppingCart size={20} className="inline mr-2 text-blue-500" />
            Módulo de Ventas
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Cotizaciones, pedidos, comprobantes y pagos
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Facturado', value: `$${totalVentas.toLocaleString()}`, color: '#2563EB' },
          { label: 'Total Cobrado',   value: `$${totalCobrado.toLocaleString()}`, color: '#16A34A' },
          { label: 'Por Cobrar',      value: `$${totalPendiente.toLocaleString()}`, color: '#F59E0B' },
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
            placeholder="Buscar por código o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch('')}><X size={14} style={{ color: 'var(--text-secondary)' }}/></button>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', ...SALE_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
              style={{
                borderColor: statusFilter === s ? (STATUS_COLORS[s as SaleStatus] || '#2563EB') : 'var(--border)',
                background:  statusFilter === s ? `${STATUS_COLORS[s as SaleStatus] || '#2563EB'}15` : 'var(--bg-main)',
                color:       statusFilter === s ? (STATUS_COLORS[s as SaleStatus] || '#2563EB') : 'var(--text-secondary)',
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
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Vencimiento</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Cobrado</th>
                <th>Saldo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={11} className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>Sin resultados</td></tr>
              ) : filtered.map((s) => (
                <tr key={s.id}>
                  <td><span className="font-mono text-xs text-blue-500">{s.code}</span></td>
                  <td><span className="text-sm font-medium">{s.customerName}</span></td>
                  <td><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.date}</span></td>
                  <td><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.dueDate}</span></td>
                  <td>${s.subtotal.toLocaleString()}</td>
                  <td>${s.tax.toFixed(2)}</td>
                  <td className="font-bold">${s.total.toLocaleString()}</td>
                  <td className="text-green-500 font-semibold">${s.paid.toLocaleString()}</td>
                  <td className={`font-semibold ${s.balance > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                    ${s.balance.toLocaleString()}
                  </td>
                  <td>
                    <div className="relative group">
                      <button
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-semibold"
                        style={{ background: `${STATUS_COLORS[s.status]}20`, color: STATUS_COLORS[s.status] }}
                      >
                        {s.status} <ChevronDown size={10}/>
                      </button>
                      <div className="absolute z-10 hidden group-hover:block right-0 mt-1 bg-white dark:bg-slate-800 border rounded-xl shadow-xl"
                        style={{ borderColor: 'var(--border)' }}>
                        {SALE_STATUSES.map((st) => (
                          <button
                            key={st}
                            className="block w-full text-left px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700"
                            style={{ color: STATUS_COLORS[st] }}
                            onClick={() => handleStatusChange(s.id, st)}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => setViewSale(s)}
                      className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-colors"
                    >
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
      <Modal isOpen={!!viewSale} onClose={() => setViewSale(null)} title={`Venta ${viewSale?.code}`} size="lg">
        {viewSale && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Cliente',       value: viewSale.customerName },
                { label: 'Fecha',         value: viewSale.date },
                { label: 'Vencimiento',   value: viewSale.dueDate },
                { label: 'Estado',        value: viewSale.status },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl" style={{ background: 'var(--bg-main)' }}>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>DETALLE DE PRODUCTOS</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <th className="text-left pb-2">Producto</th>
                    <th className="text-right pb-2">Cant.</th>
                    <th className="text-right pb-2">Precio</th>
                    <th className="text-right pb-2">Descuento</th>
                    <th className="text-right pb-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {viewSale.details.map((d) => (
                    <tr key={d.id} className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <td className="py-2">{d.productName}</td>
                      <td className="py-2 text-right">{d.quantity}</td>
                      <td className="py-2 text-right">${d.unitPrice}</td>
                      <td className="py-2 text-right text-amber-500">${d.discount}</td>
                      <td className="py-2 text-right font-semibold">${d.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-4 text-sm border-t pt-3" style={{ borderColor: 'var(--border)' }}>
              <div className="text-right space-y-1">
                <p style={{ color: 'var(--text-secondary)' }}>Subtotal: <strong>${viewSale.subtotal}</strong></p>
                <p style={{ color: 'var(--text-secondary)' }}>IVA: <strong>${viewSale.tax.toFixed(2)}</strong></p>
                <p className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>Total: ${viewSale.total.toLocaleString()}</p>
                <p className="text-green-500 font-semibold">Cobrado: ${viewSale.paid.toLocaleString()}</p>
                {viewSale.balance > 0 && <p className="text-amber-500 font-semibold">Saldo: ${viewSale.balance.toLocaleString()}</p>}
              </div>
            </div>
            {viewSale.notes && (
              <p className="text-xs p-3 rounded-xl" style={{ background: 'var(--bg-main)', color: 'var(--text-secondary)' }}>
                📝 {viewSale.notes}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Ventas;
