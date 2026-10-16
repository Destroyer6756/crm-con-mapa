import React, { useState } from 'react';
import { products, warehouses, inventoryMovements } from '../data/erpData';
import { AlertTriangle, Package, Warehouse, ArrowUpDown, Search, X } from 'lucide-react';

const Inventario: React.FC = () => {
  const [tab, setTab] = useState<'productos' | 'almacenes' | 'kardex'>('productos');
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = products.filter((p) => p.stock <= p.minStock);

  const stockPct = (used: number, cap: number) => Math.min(100, Math.round((used / cap) * 100));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          <Package size={20} className="inline mr-2 text-teal-500" />
          Módulo de Inventario
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Productos, almacenes, stock, kardex y transferencias
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Productos Activos', value: products.filter(p => p.status === 'active').length, color: '#14B8A6' },
          { label: 'Stock Crítico',     value: lowStock.length, color: '#DC2626' },
          { label: 'Almacenes',         value: warehouses.length, color: '#8B5CF6' },
          { label: 'Movimientos',       value: inventoryMovements.length, color: '#F59E0B' },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-4">
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{kpi.label}</p>
            <p className="text-2xl font-black" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="card p-4 border border-amber-500/40 flex items-center gap-3"
          style={{ background: 'rgba(245,158,11,0.06)' }}>
          <AlertTriangle size={18} className="text-amber-500 flex-shrink-0"/>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            <strong className="text-amber-500">{lowStock.length} productos</strong> con stock en nivel crítico:{' '}
            {lowStock.map((p) => p.name).join(', ')}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {(['productos', 'almacenes', 'kardex'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize"
            style={{
              background: tab === t ? '#14B8A6' : 'var(--bg-main)',
              color: tab === t ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${tab === t ? '#14B8A6' : 'var(--border)'}`,
            }}
          >
            {t === 'kardex' ? 'Kardex' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === 'productos' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border rounded-xl px-3 py-2 max-w-sm"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-main)' }}>
            <Search size={15} style={{ color: 'var(--text-secondary)' }}/>
            <input
              className="flex-1 text-sm outline-none bg-transparent"
              style={{ color: 'var(--text-primary)' }}
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && <button onClick={() => setSearch('')}><X size={14} style={{ color: 'var(--text-secondary)' }}/></button>}
          </div>
          <div className="card">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Mín / Máx</th>
                    <th>Precio Venta</th>
                    <th>Precio Compra</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const isLow = p.stock <= p.minStock;
                    return (
                      <tr key={p.id}>
                        <td><span className="font-mono text-xs text-teal-500">{p.code}</span></td>
                        <td>
                          <div>
                            <p className="text-sm font-semibold">{p.name}</p>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.description.slice(0, 40)}...</p>
                          </div>
                        </td>
                        <td>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}>
                            {p.categoryName}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-sm ${isLow ? 'text-red-500' : 'text-green-500'}`}>
                              {p.stock}
                            </span>
                            {isLow && <AlertTriangle size={12} className="text-amber-500"/>}
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.unit}</span>
                          </div>
                        </td>
                        <td>
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {p.minStock} / {p.maxStock}
                          </span>
                        </td>
                        <td className="font-semibold">${p.unitPrice.toFixed(2)}</td>
                        <td className="text-purple-500">${p.purchasePrice.toFixed(2)}</td>
                        <td>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            p.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-500'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Warehouses Tab */}
      {tab === 'almacenes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {warehouses.map((wh) => {
            const pct = stockPct(wh.used, wh.capacity);
            const color = pct > 85 ? '#DC2626' : pct > 60 ? '#F59E0B' : '#16A34A';
            return (
              <div key={wh.id} className="card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}20`, color }}>
                    <Warehouse size={20}/>
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{wh.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{wh.location}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Capacidad</span>
                    <span className="font-semibold">{wh.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Utilizado</span>
                    <span className="font-semibold">{wh.used}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: color }}/>
                    </div>
                    <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Kardex Tab */}
      {tab === 'kardex' && (
        <div className="card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Stock Anterior</th>
                  <th>Stock Nuevo</th>
                  <th>Referencia</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {inventoryMovements.map((m) => {
                  const typeColor = m.type === 'entrada' ? '#16A34A' : m.type === 'salida' ? '#DC2626' : '#F59E0B';
                  return (
                    <tr key={m.id}>
                      <td><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.date}</span></td>
                      <td><span className="text-sm font-medium">{m.productName}</span></td>
                      <td>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full capitalize"
                          style={{ background: `${typeColor}20`, color: typeColor }}>
                          {m.type}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <ArrowUpDown size={12} style={{ color: typeColor }}/>
                          <span className="font-bold" style={{ color: typeColor }}>
                            {m.type === 'salida' ? '-' : '+'}{Math.abs(m.quantity)}
                          </span>
                        </div>
                      </td>
                      <td className="text-sm">{m.previousStock}</td>
                      <td className="text-sm font-bold">{m.newStock}</td>
                      <td><span className="font-mono text-xs text-blue-500">{m.reference}</span></td>
                      <td><span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.reason}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventario;
