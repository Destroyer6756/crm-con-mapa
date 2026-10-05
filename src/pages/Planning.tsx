import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CloudProposal } from '../types/cloud';
import Modal from '../components/Modal';
import {
  Plus, Edit2, Trash2, Eye, Save, X, CloudLightning,
  Users, Globe, Layers
} from 'lucide-react';

const AWS_SERVICES_LIST = [
  'EC2', 'S3', 'RDS', 'Lambda', 'CloudFront', 'Route 53',
  'VPC', 'IAM', 'CloudWatch', 'SNS', 'SQS', 'EKS', 'DynamoDB',
];
const APP_TYPES = ['Web App', 'API REST', 'E-commerce', 'SaaS', 'Big Data', 'Machine Learning', 'IoT', 'Mobile Backend'];
const REGIONS   = ['us-east-1', 'us-east-2', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-northeast-1', 'sa-east-1'];
const AVAIL     = ['99.9% (Standard)', '99.95% (High)', '99.99% (Enterprise)', '99.999% (Mission Critical)'];
const OBJECTIVES = ['Migración desde on-premise', 'Cloud nativo', 'Expansión geográfica', 'Reducción de costos', 'Escalabilidad', 'DR/BCP'];

const emptyForm = (): Omit<CloudProposal, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '',
  appType: APP_TYPES[0],
  description: '',
  region: REGIONS[0],
  estimatedUsers: 1000,
  availabilityLevel: AVAIL[0],
  selectedServices: [],
  migrationObjective: OBJECTIVES[0],
});

interface PlanningProps {
  onNotify: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const Planning: React.FC<PlanningProps> = ({ onNotify }) => {
  const [proposals, setProposals] = useLocalStorage<CloudProposal[]>('cloudops-proposals', []);
  const [form, setForm] = useState(emptyForm());
  const [editId, setEditId] = useState<string | null>(null);
  const [viewProposal, setViewProposal] = useState<CloudProposal | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleServiceToggle = (svc: string) => {
    setForm((f) => ({
      ...f,
      selectedServices: f.selectedServices.includes(svc)
        ? f.selectedServices.filter((s) => s !== svc)
        : [...f.selectedServices, svc],
    }));
  };

  const handleSave = () => {
    if (!form.name.trim()) { onNotify('El nombre de la solución es obligatorio', 'error'); return; }
    if (form.selectedServices.length === 0) { onNotify('Selecciona al menos un servicio', 'error'); return; }

    const now = new Date().toISOString();
    if (editId) {
      setProposals((ps) =>
        ps.map((p) => p.id === editId ? { ...form, id: editId, createdAt: p.createdAt, updatedAt: now } : p),
      );
      onNotify('Propuesta actualizada correctamente', 'success');
    } else {
      const newProposal: CloudProposal = {
        ...form,
        id: `prop-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      setProposals((ps) => [...ps, newProposal]);
      onNotify('Propuesta guardada correctamente', 'success');
    }
    setForm(emptyForm());
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (p: CloudProposal) => {
    setForm({
      name: p.name, appType: p.appType, description: p.description,
      region: p.region, estimatedUsers: p.estimatedUsers,
      availabilityLevel: p.availabilityLevel, selectedServices: p.selectedServices,
      migrationObjective: p.migrationObjective,
    });
    setEditId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    setProposals((ps) => ps.filter((p) => p.id !== id));
    onNotify('Propuesta eliminada', 'warning');
  };

  const inputClass = "w-full px-3 py-2 rounded-xl border text-sm outline-none transition-colors focus:border-blue-500";
  const inputStyle = { background: 'var(--bg-main)', borderColor: 'var(--border)', color: 'var(--text-primary)' };

  return (
    <div className="p-6 space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Propuestas Cloud
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {proposals.length} propuesta{proposals.length !== 1 ? 's' : ''} guardada{proposals.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyForm()); setEditId(null); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus size={16} /> Nueva Propuesta
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 animate-fade-in-up">
          <h3 className="font-bold text-base mb-5" style={{ color: 'var(--text-primary)' }}>
            {editId ? 'Editar Propuesta' : 'Nueva Propuesta Cloud'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Nombre de la Solución *
              </label>
              <input className={inputClass} style={inputStyle} value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Plataforma E-commerce AWS" />
            </div>

            {/* Tipo de app */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Tipo de Aplicación
              </label>
              <select className={inputClass} style={inputStyle} value={form.appType}
                onChange={(e) => setForm({ ...form, appType: e.target.value })}>
                {APP_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Descripción
              </label>
              <textarea className={inputClass} style={inputStyle} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3} placeholder="Describe la solución cloud propuesta..." />
            </div>

            {/* Región */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Región AWS
              </label>
              <select className={inputClass} style={inputStyle} value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}>
                {REGIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>

            {/* Usuarios */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Usuarios Estimados
              </label>
              <input type="number" className={inputClass} style={inputStyle}
                value={form.estimatedUsers}
                onChange={(e) => setForm({ ...form, estimatedUsers: Number(e.target.value) })}
                min={1} />
            </div>

            {/* Disponibilidad */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Nivel de Disponibilidad
              </label>
              <select className={inputClass} style={inputStyle} value={form.availabilityLevel}
                onChange={(e) => setForm({ ...form, availabilityLevel: e.target.value })}>
                {AVAIL.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>

            {/* Objetivo */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Objetivo de Migración
              </label>
              <select className={inputClass} style={inputStyle} value={form.migrationObjective}
                onChange={(e) => setForm({ ...form, migrationObjective: e.target.value })}>
                {OBJECTIVES.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>

            {/* Services */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Servicios AWS *
              </label>
              <div className="flex flex-wrap gap-2">
                {AWS_SERVICES_LIST.map((svc) => {
                  const selected = form.selectedServices.includes(svc);
                  return (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => handleServiceToggle(svc)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                        selected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                          : 'border-transparent hover:border-blue-500/50'
                      }`}
                      style={!selected ? { background: 'var(--bg-main)', color: 'var(--text-secondary)' } : {}}
                    >
                      {svc}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20"
            >
              <Save size={15} /> Guardar Propuesta
            </button>
            <button
              onClick={() => { setForm(emptyForm()); setEditId(null); setShowForm(false); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <X size={15} /> Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Proposals table */}
      {proposals.length === 0 ? (
        <div className="card p-12 text-center">
          <CloudLightning size={48} className="mx-auto mb-4 text-blue-400 opacity-50" />
          <p className="font-semibold text-lg mb-1" style={{ color: 'var(--text-secondary)' }}>
            No hay propuestas aún
          </p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Crea tu primera propuesta Cloud para comenzar.
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Región</th>
                  <th>Usuarios</th>
                  <th>Servicios</th>
                  <th>Disponibilidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <p className="font-semibold text-sm">{p.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-medium">
                        {p.appType}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Globe size={13} className="text-blue-500" />
                        <span className="text-sm">{p.region}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Users size={13} style={{ color: 'var(--text-secondary)' }} />
                        {p.estimatedUsers.toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {p.selectedServices.slice(0, 3).map((s) => (
                          <span key={s} className="text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-medium" style={{ color: 'var(--text-secondary)' }}>
                            {s}
                          </span>
                        ))}
                        {p.selectedServices.length > 3 && (
                          <span className="text-xs text-blue-500 font-medium">+{p.selectedServices.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {p.availabilityLevel.split(' ')[0]}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewProposal(p)}
                          className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-colors">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => handleEdit(p)}
                          className="p-1.5 rounded-lg hover:bg-amber-500/10 text-amber-500 transition-colors">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View modal */}
      <Modal isOpen={!!viewProposal} onClose={() => setViewProposal(null)} title="Detalle de Propuesta" size="md">
        {viewProposal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Nombre', value: viewProposal.name, icon: <Layers size={14} /> },
                { label: 'Tipo', value: viewProposal.appType, icon: <CloudLightning size={14} /> },
                { label: 'Región', value: viewProposal.region, icon: <Globe size={14} /> },
                { label: 'Usuarios Est.', value: viewProposal.estimatedUsers.toLocaleString(), icon: <Users size={14} /> },
              ].map(({ label, value, icon }) => (
                <div key={label} className="p-3 rounded-xl" style={{ background: 'var(--bg-main)' }}>
                  <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                    {icon} {label}
                  </div>
                  <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>
            {viewProposal.description && (
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Descripción</p>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{viewProposal.description}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Servicios Seleccionados</p>
              <div className="flex flex-wrap gap-2">
                {viewProposal.selectedServices.map((s) => (
                  <span key={s} className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full font-medium">{s}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Disponibilidad</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{viewProposal.availabilityLevel}</p>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Objetivo</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{viewProposal.migrationObjective}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Planning;
