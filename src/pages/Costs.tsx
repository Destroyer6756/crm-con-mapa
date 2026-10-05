import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CostItem } from '../types/cloud';
import { defaultCostItems, calculateCosts, SERVICE_PRICES } from '../data/costs';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { Plus, Edit2, Trash2, Save, X, DollarSign, TrendingUp, Award, Percent } from 'lucide-react';

const COLORS = ['#2563EB','#16A34A','#F59E0B','#8B5CF6','#EC4899','#14B8A6','#F97316','#0EA5E9'];
const SERVICES = Object.keys(SERVICE_PRICES);
const CATEGORIES = ['Compute','Storage','Database','CDN','Networking','Serverless'];

interface CostsProps {
  onNotify: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const emptyItem = (): Omit<CostItem, 'id' | 'monthlyCost' | 'annualCost' | 'color'> => ({
  service: 'EC2',
  category: 'Compute',
  quantity: 1,
  hours: 720,
  unitPrice: SERVICE_PRICES['EC2'],
});

const Costs: React.FC<CostsProps> = ({ onNotify }) => {
  const [items, setItems] = useLocalStorage<CostItem[]>('cloudops-costs', defaultCostItems);
  const [form, setForm] = useState(emptyItem());
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const totalMonthly = useMemo(() => items.reduce((s, i) => s + i.monthlyCost, 0), [items]);
  const totalAnnual  = useMemo(() => totalMonthly * 12, [totalMonthly]);
  const topService   = useMemo(() => [...items].sort((a, b) => b.monthlyCost - a.monthlyCost)[0], [items]);
  const pieData      = useMemo(() =>
    items.map((i, idx) => ({ name: i.service, value: i.monthlyCost, color: i.color || COLORS[idx % COLORS.length] })),
    [items],
  );

  const handleServiceChange = (svc: string) => {
    setForm((f) => ({ ...f, service: svc, unitPrice: SERVICE_PRICES[svc] ?? 0.05 }));
  };

  const handleSave = () => {
    if (!form.service) { onNotify('Selecciona un servicio', 'error'); return; }
    const { monthlyCost, annualCost } = calculateCosts(form);
    const color = COLORS[items.length % COLORS.length];
    if (editId) {
      setItems((is) => is.map((i) => i.id === editId ? { ...form, id: editId, monthlyCost, annualCost, color: i.color } : i));
      onNotify('Servicio actualizado', 'success');
    } else {
      const newItem: CostItem = { ...form, id: `cost-${Date.now()}`, monthlyCost, annualCost, color };
      setItems((is) => [...is, newItem]);
      onNotify('Servicio agregado', 'success');
    }
    setForm(emptyItem());
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (item: CostItem) => {
    setForm({ service: item.service, category: item.category, quantity: item.quantity, hours: item.hours, unitPrice: item.unitPrice });
    setEditId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    setItems((is) => is.filter((i) => i.id !== id));
    onNotify('Servicio eliminado', 'warning');
  };

  const preview = useMemo(() => calculateCosts(form), [form]);

  const inputClass = "w-full px-3 py-2 rounded-xl border text-sm outline-none transition-colors focus:border-blue-500";
  const inputStyle = { background: 'var(--bg-main)', borderColor: 'var(--border)', color: 'var(--text-primary)' };

  return (
    <div className="p-6 space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Costo Mensual', value: `$${totalMonthly.toFixed(2)}`, icon: <DollarSign size={18} />, color: '#F59E0B', sub: 'Total estimado' },
          { label: 'Costo Anual',   value: `$${totalAnnual.toFixed(2)}`,   icon: <TrendingUp size={18} />,  color: '#2563EB', sub: 'Proyección ×12' },
          { label: 'Servicio Mayor', value: topService?.service ?? '-',    icon: <Award size={18} />,       color: '#DC2626', sub: `$${topService?.monthlyCost.toFixed(2) ?? '0'}/mes` },
          { label: 'Servicios',      value: items.length,                   icon: <Percent size={18} />,     color: '#16A34A', sub: 'Activos' },
        ].map(({ label, value, icon, color, sub }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, color }}>
                {icon}
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Add/Edit form */}
      <div className="flex justify-end">
        <button
          onClick={() => { setForm(emptyItem()); setEditId(null); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus size={16} /> Agregar Servicio
        </button>
      </div>

      {showForm && (
        <div className="card p-6 animate-fade-in-up">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
            {editId ? 'Editar Servicio' : 'Agregar Servicio'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Servicio</label>
              <select className={inputClass} style={inputStyle} value={form.service} onChange={(e) => handleServiceChange(e.target.value)}>
                {SERVICES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Categoría</label>
              <select className={inputClass} style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Cantidad</label>
              <input type="number" className={inputClass} style={inputStyle} value={form.quantity} min={1}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Horas/mes</label>
              <input type="number" className={inputClass} style={inputStyle} value={form.hours} min={1} max={744}
                onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Precio/hr ($)</label>
              <input type="number" className={inputClass} style={inputStyle} value={form.unitPrice} step={0.0001} min={0}
                onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })} />
            </div>
          </div>

          {/* Live preview */}
          <div className="mt-4 p-4 rounded-xl flex gap-6" style={{ background: 'var(--bg-main)' }}>
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-secondary)' }}>Costo Mensual</p>
              <p className="text-xl font-bold text-blue-500">${preview.monthlyCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-secondary)' }}>Costo Anual</p>
              <p className="text-xl font-bold text-blue-500">${preview.annualCost.toFixed(2)}</p>
            </div>
            <div className="ml-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
              <p>Fórmula: {form.quantity} × {form.hours}h × ${form.unitPrice.toFixed(6)}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors">
              <Save size={15} /> Guardar
            </button>
            <button onClick={() => { setForm(emptyItem()); setEditId(null); setShowForm(false); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              <X size={15} /> Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Distribución de Costos</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" paddingAngle={3} label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [`$${Number(v ?? 0).toFixed(2)}`, 'Mensual']} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Comparativa Mensual/Anual</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={items}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="service" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} formatter={(v: any) => [`$${Number(v ?? 0).toFixed(2)}`, '']} />
              <Legend />
              <Bar dataKey="monthlyCost" name="Mensual" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Categoría</th>
                <th>Cantidad</th>
                <th>Horas</th>
                <th>Precio/hr</th>
                <th>Mensual</th>
                <th>Anual</th>
                <th>%</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span className="font-semibold text-sm">{item.service}</span>
                    </div>
                  </td>
                  <td><span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${item.color}15`, color: item.color }}>{item.category}</span></td>
                  <td>{item.quantity}</td>
                  <td>{item.hours}</td>
                  <td>${item.unitPrice.toFixed(6)}</td>
                  <td className="font-semibold">${item.monthlyCost.toFixed(2)}</td>
                  <td className="font-semibold">${item.annualCost.toFixed(2)}</td>
                  <td className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {totalMonthly > 0 ? ((item.monthlyCost / totalMonthly) * 100).toFixed(1) : 0}%
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg hover:bg-amber-500/10 text-amber-500 transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total row */}
        <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>TOTAL</span>
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Mensual</p>
              <p className="text-lg font-bold text-blue-500">${totalMonthly.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Anual</p>
              <p className="text-lg font-bold text-blue-500">${totalAnnual.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Costs;
