import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { AWSRegion, CloudRoute } from '../types/cloud';
import { awsRegions } from '../data/regions';
import { cloudRoutes } from '../data/routes';
import StatusBadge from './StatusBadge';
import {
  Server, DollarSign, Activity, Users, Globe, X,
  Wifi, Filter, Eye, EyeOff
} from 'lucide-react';

// ── Status Colors ──────────────────────────────────────────
const REGION_COLORS: Record<string, string> = {
  operational: '#22C55E',
  warning:     '#F59E0B',
  error:       '#EF4444',
};
const ROUTE_COLORS: Record<string, string> = {
  active:  '#3B82F6',
  warning: '#F59E0B',
  error:   '#EF4444',
};

// ── Animated Traffic Packets ───────────────────────────────
interface PacketProps {
  from: [number, number];
  to: [number, number];
  color: string;
  delay: number;
}

const AnimatedPacket: React.FC<PacketProps> = ({ from, to, color, delay }) => {
  const [progress, setProgress] = useState(0);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 3000 + delay;

  useEffect(() => {
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current + delay) % DURATION;
      setProgress(elapsed / DURATION);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [delay, DURATION]);

  const lat = from[0] + (to[0] - from[0]) * progress;
  const lng = from[1] + (to[1] - from[1]) * progress;
  const opacity = progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1;

  return (
    <CircleMarker
      center={[lat, lng]}
      radius={4}
      pathOptions={{ color: 'white', fillColor: color, fillOpacity: opacity, weight: 1.5, opacity }}
    />
  );
};

// ── Region Detail Panel ────────────────────────────────────
interface RegionPanelProps {
  region: AWSRegion;
  onClose: () => void;
}

const RegionPanel: React.FC<RegionPanelProps> = ({ region, onClose }) => (
  <div
    className="animate-slide-right absolute top-4 right-4 z-[400] w-80 rounded-2xl border shadow-2xl overflow-hidden"
    style={{ background: 'rgba(15,23,42,0.97)', borderColor: 'rgba(255,255,255,0.1)' }}
  >
    {/* Header */}
    <div className="p-5 border-b border-white/10">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
              AWS Region
            </span>
            {region.isUserOrigin && (
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-semibold">
                Origen
              </span>
            )}
          </div>
          <h3 className="text-white text-xl font-bold">{region.code}</h3>
          <p className="text-slate-400 text-sm">{region.name}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white transition-colors mt-1"
        >
          <X size={18} />
        </button>
      </div>
    </div>

    {/* Details */}
    <div className="p-5 space-y-4">
      {/* Status & Location */}
      <div className="flex items-center justify-between">
        <StatusBadge status={region.status} size="md" />
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Globe size={12} />
          {region.location}
        </div>
      </div>

      {/* Services */}
      <div>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Servicios</p>
        <div className="flex flex-wrap gap-1.5">
          {region.services.map((s) => (
            <span key={s} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-medium">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: <Server size={14} />, label: 'Recursos', value: region.resources },
          { icon: <Users size={14} />, label: 'Usuarios', value: region.users.toLocaleString() },
          { icon: <DollarSign size={14} />, label: 'Costo/mes', value: `$${region.monthlyCost}` },
          { icon: <Activity size={14} />, label: 'Latencia', value: `${region.avgLatency} ms` },
        ].map(({ icon, label, value }) => (
          <div key={label} className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              {icon}
              {label}
            </div>
            <p className="text-white font-bold text-base">{value}</p>
          </div>
        ))}
      </div>

      {/* Availability */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-400 font-semibold">Disponibilidad</span>
          <span className="text-green-400 font-bold text-sm">{region.availability}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-green-400 transition-all duration-1000"
            style={{ width: `${region.availability}%` }}
          />
        </div>
      </div>
    </div>
  </div>
);



// ── Main WorldMap ──────────────────────────────────────────
const WorldMap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<AWSRegion | null>(null);
  const [showTraffic, setShowTraffic] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'operational' | 'warning' | 'error'>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [showAllRoutes, setShowAllRoutes] = useState(true);

  const filteredRegions = awsRegions.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (serviceFilter !== 'all' && !r.services.includes(serviceFilter)) return false;
    return true;
  });

  const filteredRegionIds = new Set(filteredRegions.map((r) => r.code));

  const filteredRoutes: CloudRoute[] = showAllRoutes
    ? cloudRoutes
    : cloudRoutes.filter(
        (route) => filteredRegionIds.has(route.originCode) && filteredRegionIds.has(route.destinationCode),
      );

  const getRegionByCode = (code: string) => awsRegions.find((r) => r.code === code);

  return (
    <div className="relative w-full h-full" style={{ minHeight: '560px' }}>
      {/* Controls */}
      <div
        className="absolute top-4 left-4 z-[500] flex flex-col gap-2"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="rounded-xl border p-3 shadow-xl" style={{ background: 'rgba(15,23,42,0.95)', borderColor: 'rgba(255,255,255,0.1)' }}>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Filter size={11} /> Filtros
          </p>

          {/* Status filter */}
          <div className="mb-2">
            <p className="text-xs text-slate-500 mb-1">Estado</p>
            <div className="flex flex-col gap-1">
              {(['all', 'operational', 'warning', 'error'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg text-left transition-all ${statusFilter === s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/10'}`}
                >
                  {s === 'all' ? 'Todos' : s === 'operational' ? 'Operativo' : s === 'warning' ? 'Advertencia' : 'Error'}
                </button>
              ))}
            </div>
          </div>

          {/* Service filter */}
          <div className="mb-2">
            <p className="text-xs text-slate-500 mb-1">Servicio</p>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full text-xs px-2 py-1.5 rounded-lg bg-white/10 text-slate-300 border border-white/10 outline-none"
            >
              <option value="all">Todos</option>
              {['EC2', 'S3', 'RDS', 'CloudFront', 'Route 53', 'VPC'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Toggle buttons */}
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => setShowTraffic(!showTraffic)}
              className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg transition-all ${showTraffic ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:bg-white/10'}`}
            >
              {showTraffic ? <Eye size={11} /> : <EyeOff size={11} />}
              Mostrar tráfico
            </button>
            <button
              onClick={() => setShowAllRoutes(!showAllRoutes)}
              className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg transition-all ${showAllRoutes ? 'bg-blue-500/20 text-blue-300' : 'text-slate-400 hover:bg-white/10'}`}
            >
              <Wifi size={11} />
              Todas las rutas
            </button>
            <button
              onClick={() => { setStatusFilter('all'); setServiceFilter('all'); setShowAllRoutes(true); }}
              className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:bg-white/10 transition-all"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div
        className="absolute bottom-4 left-4 z-[500] rounded-xl border p-3 shadow-xl"
        style={{ background: 'rgba(15,23,42,0.95)', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Leyenda</p>
        <div className="space-y-1.5">
          {[
            { color: '#22C55E', label: 'Región operativa', type: 'dot' },
            { color: '#F59E0B', label: 'Región con advertencia', type: 'dot' },
            { color: '#EF4444', label: 'Región con error', type: 'dot' },
            { color: '#A855F7', label: 'Punto de origen (Lima)', type: 'dot' },
            { color: '#3B82F6', label: 'Ruta activa', type: 'line' },
            { color: '#F59E0B', label: 'Ruta con alerta', type: 'line' },
          ].map(({ color, label, type }) => (
            <div key={label} className="flex items-center gap-2">
              {type === 'dot' ? (
                <div className="w-3 h-3 rounded-full" style={{ background: color }} />
              ) : (
                <div className="w-5 h-0.5 rounded" style={{ background: color }} />
              )}
              <span className="text-xs text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Region detail panel */}
      {selectedRegion && (
        <RegionPanel region={selectedRegion} onClose={() => setSelectedRegion(null)} />
      )}

      {/* Leaflet Map */}
      <MapContainer
        center={[20, 10]}
        zoom={2}
        minZoom={2}
        maxZoom={7}
        style={{ width: '100%', height: '100%', minHeight: '560px', borderRadius: '12px' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=""
        />

        {/* Routes */}
        {filteredRoutes.map((route) => {
          const originRegion = getRegionByCode(route.originCode);
          const destRegion = getRegionByCode(route.destinationCode);
          if (!originRegion || !destRegion) return null;

          const positions: [number, number][] = [
            [originRegion.lat, originRegion.lng],
            [destRegion.lat, destRegion.lng],
          ];

          return (
            <React.Fragment key={route.id}>
              <Polyline
                positions={positions}
                pathOptions={{
                  color: ROUTE_COLORS[route.status],
                  weight: 1.5,
                  opacity: 0.6,
                  dashArray: route.status === 'warning' ? '8 4' : undefined,
                }}
              >
                <Tooltip sticky>
                  <div className="text-xs">
                    <p className="font-bold text-blue-300 mb-1">{route.origin} → {route.destination}</p>
                    <p>Latencia: <b>{route.latency}</b></p>
                    <p>Tráfico: <b>{route.traffic}</b></p>
                    <p>Protocolo: {route.protocol}</p>
                    <p>Estado: <b style={{ color: ROUTE_COLORS[route.status] }}>{route.status}</b></p>
                    <p>Servicios: {route.services.join(', ')}</p>
                  </div>
                </Tooltip>
              </Polyline>

              {/* Animated traffic packets */}
              {showTraffic && route.status === 'active' && (
                <>
                  <AnimatedPacket
                    from={[originRegion.lat, originRegion.lng]}
                    to={[destRegion.lat, destRegion.lng]}
                    color={ROUTE_COLORS[route.status]}
                    delay={0}
                  />
                  <AnimatedPacket
                    from={[originRegion.lat, originRegion.lng]}
                    to={[destRegion.lat, destRegion.lng]}
                    color={ROUTE_COLORS[route.status]}
                    delay={1500}
                  />
                </>
              )}
            </React.Fragment>
          );
        })}

        {/* Region markers */}
        {filteredRegions.map((region) => {
          const color = region.isUserOrigin ? '#A855F7' : REGION_COLORS[region.status];
          return (
            <CircleMarker
              key={region.id}
              center={[region.lat, region.lng]}
              radius={region.isUserOrigin ? 8 : 10}
              pathOptions={{
                color: 'white',
                weight: 2,
                fillColor: color,
                fillOpacity: 0.9,
              }}
              eventHandlers={{
                click: () => setSelectedRegion(region),
              }}
            >
              <Tooltip direction="top" offset={[0, -12]}>
                <div className="text-xs">
                  <p className="font-bold text-white">{region.name}</p>
                  <p className="text-slate-300">{region.code}</p>
                  <p>Recursos: <b>{region.resources}</b></p>
                  <p>Costo: <b>${region.monthlyCost}/mes</b></p>
                  <p style={{ color }}>● {region.status}</p>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default WorldMap;
