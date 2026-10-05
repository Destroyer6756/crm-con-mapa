import React, { useState, useMemo } from 'react';
import { awsServices, serviceCategories } from '../data/awsServices';
import ServiceCard from '../components/ServiceCard';
import { Search, Filter } from 'lucide-react';

const Services: React.FC = () => {
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('Todos');
  const [statusFilter, setStatus] = useState('Todos');

  const filtered = useMemo(() => {
    return awsServices.filter((s) => {
      const matchSearch   = s.name.toLowerCase().includes(search.toLowerCase())
        || s.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'Todos' || s.category === category;
      const matchStatus   = statusFilter === 'Todos' || s.status === statusFilter.toLowerCase();
      return matchSearch && matchCategory && matchStatus;
    });
  }, [search, category, statusFilter]);

  const counts = useMemo(() => ({
    active:      awsServices.filter((s) => s.status === 'active').length,
    inactive:    awsServices.filter((s) => s.status === 'inactive').length,
    maintenance: awsServices.filter((s) => s.status === 'maintenance').length,
  }), []);

  return (
    <div className="p-6 space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',        value: awsServices.length, color: '#2563EB' },
          { label: 'Activos',      value: counts.active,      color: '#16A34A' },
          { label: 'Inactivos',    value: counts.inactive,    color: '#64748B' },
          { label: 'Mantenimiento',value: counts.maintenance, color: '#8B5CF6' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4">
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filters bar */}
      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border flex-1"
          style={{ background: 'var(--bg-main)', borderColor: 'var(--border)' }}>
          <Search size={15} style={{ color: 'var(--text-secondary)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar servicio..."
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <Filter size={15} style={{ color: 'var(--text-secondary)' }} />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border text-sm outline-none focus:border-blue-500"
            style={{ background: 'var(--bg-main)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            {serviceCategories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border text-sm outline-none focus:border-blue-500"
          style={{ background: 'var(--bg-main)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          {['Todos', 'Active', 'Inactive', 'Maintenance'].map((s) => <option key={s}>{s}</option>)}
        </select>

        <button
          onClick={() => { setSearch(''); setCategory('Todos'); setStatus('Todos'); }}
          className="px-3 py-2 rounded-xl border text-sm font-medium transition-colors hover:border-blue-500"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          Limpiar
        </button>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {serviceCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              category === cat
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                : 'border-transparent hover:border-blue-500/50'
            }`}
            style={category !== cat ? { background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-secondary)' } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Mostrando {filtered.length} de {awsServices.length} servicios
      </p>

      {/* Services grid */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Search size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--text-secondary)' }} />
          <p className="font-semibold text-lg" style={{ color: 'var(--text-secondary)' }}>
            No se encontraron servicios
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Intenta con otros filtros de búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((service, i) => (
            <ServiceCard key={service.id} service={service} delay={i * 40} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
