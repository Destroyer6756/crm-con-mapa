import React, { useMemo } from 'react';
import WorldMap from '../components/WorldMap';
import StatusBadge from '../components/StatusBadge';
import { awsRegions } from '../data/regions';
import { cloudRoutes } from '../data/routes';
import { Globe, Server, Activity, Wifi, TrendingUp } from 'lucide-react';

const Infrastructure: React.FC = () => {
  const activeRegions      = useMemo(() => awsRegions.filter((r) => r.status === 'operational').length, []);
  const warningRegions     = useMemo(() => awsRegions.filter((r) => r.status === 'warning').length, []);
  const totalResources     = useMemo(() => awsRegions.reduce((s, r) => s + r.resources, 0), []);
  const totalCost          = useMemo(() => awsRegions.reduce((s, r) => s + r.monthlyCost, 0), []);
  const totalTraffic       = useMemo(() => '8.4 TB', []);
  const availability       = useMemo(() => '99.95%', []);

  return (
    <div className="p-6 space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Regiones Activas',     value: awsRegions.filter(r=>!r.isUserOrigin).length, icon: <Globe size={16} />,    color: '#2563EB' },
          { label: 'Operativas',           value: activeRegions,                                 icon: <Activity size={16} />, color: '#16A34A' },
          { label: 'Con Alerta',           value: warningRegions,                                icon: <Activity size={16} />, color: '#F59E0B' },
          { label: 'Rutas Activas',        value: cloudRoutes.length,                            icon: <Wifi size={16} />,     color: '#8B5CF6' },
          { label: 'Tráfico Global',       value: totalTraffic,                                  icon: <TrendingUp size={16} />,color: '#14B8A6' },
          { label: 'Disponibilidad',       value: availability,                                  icon: <Server size={16} />,   color: '#16A34A' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20`, color }}>{icon}</div>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* World Map */}
      <div className="card p-1 overflow-hidden" style={{ height: '600px' }}>
        <WorldMap />
      </div>

      {/* Region Table */}
      <div className="card">
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            Tabla de Regiones
          </h3>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Total recursos: {totalResources} · Costo total: ${totalCost}/mes
          </span>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Región</th>
                <th>Ubicación</th>
                <th>Servicios</th>
                <th>Recursos</th>
                <th>Usuarios</th>
                <th>Latencia</th>
                <th>Estado</th>
                <th>Costo/mes</th>
                <th>Disponibilidad</th>
              </tr>
            </thead>
            <tbody>
              {awsRegions.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div>
                      <p className="font-bold text-sm">{r.code}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{r.name}</p>
                    </div>
                  </td>
                  <td className="text-sm">{r.location}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {r.services.slice(0, 3).map((s) => (
                        <span key={s} className="text-xs bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded font-medium">{s}</span>
                      ))}
                      {r.services.length > 3 && <span className="text-xs text-blue-500">+{r.services.length - 3}</span>}
                    </div>
                  </td>
                  <td className="font-semibold">{r.resources}</td>
                  <td>{r.users.toLocaleString()}</td>
                  <td>
                    <span className={`font-semibold ${r.avgLatency < 100 ? 'text-green-500' : r.avgLatency < 150 ? 'text-amber-500' : 'text-red-500'}`}>
                      {r.avgLatency} ms
                    </span>
                  </td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className="font-semibold">${r.monthlyCost}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 w-20 overflow-hidden">
                        <div className="h-full rounded-full bg-green-400" style={{ width: `${r.availability}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-green-500">{r.availability}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Routes table */}
      <div className="card">
        <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Rutas de Infraestructura</h3>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Origen</th>
                <th>Destino</th>
                <th>Latencia</th>
                <th>Tráfico</th>
                <th>Protocolo</th>
                <th>Ancho de banda</th>
                <th>Servicios</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {cloudRoutes.map((route) => (
                <tr key={route.id}>
                  <td>
                    <div>
                      <p className="font-semibold text-sm">{route.origin}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{route.originCode}</p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="font-semibold text-sm">{route.destination}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{route.destinationCode}</p>
                    </div>
                  </td>
                  <td>
                    <span className={`font-semibold ${parseInt(route.latency) < 100 ? 'text-green-500' : 'text-amber-500'}`}>
                      {route.latency}
                    </span>
                  </td>
                  <td>{route.traffic}</td>
                  <td className="text-xs" style={{ color: 'var(--text-secondary)' }}>{route.protocol}</td>
                  <td>{route.bandwidth}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {route.services.slice(0,2).map((s) => (
                        <span key={s} className="text-xs bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td><StatusBadge status={route.status === 'active' ? 'operational' : route.status === 'warning' ? 'warning' : 'error'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;
