import React from 'react';
import NetworkDiagram from '../components/NetworkDiagram';
import { networkNodes, networkComponents } from '../data/network';
import StatusBadge from '../components/StatusBadge';
import { Network, Server, Shield, Globe } from 'lucide-react';

const NetworkPage: React.FC = () => {
  const runningNodes = networkNodes.filter((n) => n.status === 'running').length;
  const warningNodes = networkNodes.filter((n) => n.status === 'warning').length;

  return (
    <div className="p-6 space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Componentes', value: networkNodes.length, icon: <Network size={18} />, color: '#2563EB' },
          { label: 'Activos',     value: runningNodes,        icon: <Server size={18} />,  color: '#16A34A' },
          { label: 'Con Alerta',  value: warningNodes,        icon: <Shield size={18} />,  color: '#F59E0B' },
          { label: 'VPC',         value: '1',                 icon: <Globe size={18} />,   color: '#8B5CF6' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20`, color }}>{icon}</div>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* VPC info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {networkComponents.map((comp) => (
          <div key={comp.id} className="card p-4">
            <div className="w-3 h-3 rounded-full mb-2" style={{ background: comp.color }} />
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{comp.label}</p>
          </div>
        ))}
      </div>

      {/* Architecture title */}
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          Diagrama de Arquitectura de Red
        </h3>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 font-semibold">
          Interactivo — haz clic en los nodos
        </span>
      </div>

      {/* Network Diagram */}
      <NetworkDiagram />

      {/* Node status table */}
      <div className="card">
        <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            Estado de Componentes
          </h3>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Componente</th>
                <th>Tipo</th>
                <th>Capa</th>
                <th>Estado</th>
                <th>Conectado a</th>
              </tr>
            </thead>
            <tbody>
              {networkNodes.map((node) => (
                <tr key={node.id}>
                  <td className="font-semibold text-sm">{node.name}</td>
                  <td>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-medium">{node.type}</span>
                  </td>
                  <td>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>L{node.layer}</span>
                  </td>
                  <td>
                    <StatusBadge status={node.status === 'running' ? 'operational' : node.status === 'warning' ? 'warning' : 'error'} />
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {node.connectedTo.length > 0
                        ? node.connectedTo.map((id) => (
                            <span key={id} className="text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded font-medium" style={{ color: 'var(--text-secondary)' }}>
                              {id}
                            </span>
                          ))
                        : <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>—</span>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NetworkPage;
