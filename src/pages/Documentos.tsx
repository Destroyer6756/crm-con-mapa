import React, { useState } from 'react';
import { erpDocuments } from '../data/erpData';
import type { ERPDocument, DocumentType } from '../types/cloud';
import { FileText, Search, X, Download, Eye, Tag, Cloud, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import Modal from '../components/Modal';

const TYPE_COLORS: Record<DocumentType, string> = {
  factura:     '#2563EB',
  contrato:    '#8B5CF6',
  orden:       '#F59E0B',
  comprobante: '#14B8A6',
  archivo:     '#64748B',
};

const TYPE_ICONS: Record<DocumentType, React.ReactNode> = {
  factura:     <FileText size={16}/>,
  contrato:    <FileText size={16}/>,
  orden:       <FileText size={16}/>,
  comprobante: <FileText size={16}/>,
  archivo:     <FileText size={16}/>,
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes/1024).toFixed(0)} KB`;
  return `${(bytes/1048576).toFixed(1)} MB`;
};

const Documentos: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [viewDoc, setViewDoc] = useState<ERPDocument | null>(null);

  const filtered = erpDocuments.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.entityName.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || d.type === typeFilter;
    return matchSearch && matchType;
  });

  const TYPES: DocumentType[] = ['factura', 'contrato', 'orden', 'comprobante', 'archivo'];
  const totalSize = erpDocuments.reduce((s, d) => s + d.fileSize, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          <FileText size={20} className="inline mr-2 text-blue-500" />
          Módulo de Documentos
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Facturas, contratos, órdenes, comprobantes y archivos · Integrado con Amazon S3
        </p>
      </div>

      {/* S3 Storage Banner */}
      <div className="card p-4 border border-blue-500/30 flex items-center gap-4"
        style={{ background: 'rgba(37,99,235,0.05)' }}>
        <Cloud size={24} className="text-blue-500 flex-shrink-0"/>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Storage Adapter — Amazon S3 Compatible
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Actualmente en modo local. Para producción, configura <code className="text-blue-400">AWS_S3_BUCKET</code> y <code className="text-blue-400">AWS_REGION</code> en .env.production
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-green-500 flex-shrink-0">
          <CheckCircle2 size={14}/> Adaptador configurado
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Documentos', value: erpDocuments.length, color: '#2563EB' },
          { label: 'Tamaño Total',     value: formatBytes(totalSize), color: '#8B5CF6' },
          { label: 'Facturas',         value: erpDocuments.filter(d => d.type === 'factura').length, color: '#16A34A' },
          { label: 'Contratos',        value: erpDocuments.filter(d => d.type === 'contrato').length, color: '#F59E0B' },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-4">
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{kpi.label}</p>
            <p className="text-xl font-black" style={{ color: kpi.color }}>{kpi.value}</p>
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
            placeholder="Buscar documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch('')}><X size={14} style={{ color: 'var(--text-secondary)' }}/></button>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', ...TYPES] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize"
              style={{
                borderColor: typeFilter === t ? (TYPE_COLORS[t as DocumentType] || '#2563EB') : 'var(--border)',
                background:  typeFilter === t ? `${TYPE_COLORS[t as DocumentType] || '#2563EB'}15` : 'var(--bg-main)',
                color:       typeFilter === t ? (TYPE_COLORS[t as DocumentType] || '#2563EB') : 'var(--text-secondary)',
              }}
            >
              {t === 'all' ? 'Todos' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((doc) => {
          const color = TYPE_COLORS[doc.type];
          return (
            <div key={doc.id} className="card p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}20`, color }}>
                  {TYPE_ICONS[doc.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{doc.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{doc.description}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: `${color}15`, color }}>
                  {doc.type}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span>📎 {doc.entityName}</span>
                <span>📦 {formatBytes(doc.fileSize)}</span>
                <span>👤 {doc.uploadedBy.split('@')[0]}</span>
              </div>
              {doc.s3Key && (
                <div className="flex items-center gap-1 text-[10px] bg-blue-500/5 border border-blue-500/20 px-2 py-1 rounded-lg">
                  <Lock size={9} className="text-blue-500"/>
                  <span className="font-mono text-blue-500 truncate">{doc.s3Key}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {doc.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => setViewDoc(doc)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-500/10 text-blue-500 transition-colors"
                >
                  <Eye size={12}/> Ver
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-500/10 text-green-500 transition-colors"
                >
                  <Download size={12}/> Descargar
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 card p-12 text-center">
            <AlertCircle size={40} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-secondary)' }}/>
            <p style={{ color: 'var(--text-secondary)' }}>No se encontraron documentos</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!viewDoc} onClose={() => setViewDoc(null)} title="Detalle del Documento" size="md">
        {viewDoc && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Nombre',      value: viewDoc.name },
                { label: 'Tipo',        value: viewDoc.type },
                { label: 'Entidad',     value: viewDoc.entityName },
                { label: 'Tipo Entidad',value: viewDoc.entityType },
                { label: 'Subido por',  value: viewDoc.uploadedBy },
                { label: 'Fecha',       value: new Date(viewDoc.uploadedAt).toLocaleDateString() },
                { label: 'Tamaño',      value: formatBytes(viewDoc.fileSize) },
                { label: 'MIME Type',   value: viewDoc.mimeType },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl" style={{ background: 'var(--bg-main)' }}>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                </div>
              ))}
            </div>
            {viewDoc.s3Key && (
              <div className="p-3 rounded-xl border border-blue-500/30" style={{ background: 'rgba(37,99,235,0.05)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Cloud size={14} className="text-blue-500"/>
                  <span className="text-xs font-bold text-blue-500">S3 Key (ruta en Amazon S3)</span>
                </div>
                <code className="text-xs text-blue-400">{viewDoc.s3Key}</code>
              </div>
            )}
            <p className="text-xs p-3 rounded-xl" style={{ background: 'var(--bg-main)', color: 'var(--text-secondary)' }}>
              📝 {viewDoc.description}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Documentos;
