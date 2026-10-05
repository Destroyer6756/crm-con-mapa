import React, { useState } from 'react';
import { networkNodes, securityGroups } from '../data/network';
import type { NetworkNode } from '../types/cloud';
import {
  Globe, Globe2, Zap, ArrowRightLeft, Scale, Server, Database,
  X, Shield
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Globe: <Globe size={20} />,
  Globe2: <Globe2 size={20} />,
  Zap: <Zap size={20} />,
  ArrowRightLeft: <ArrowRightLeft size={20} />,
  Scale: <Scale size={20} />,
  Server: <Server size={20} />,
  Database: <Database size={20} />,
};

const STATUS_COLORS: Record<string, { bg: string; border: string; glow: string }> = {
  running: { bg: '#16A34A20', border: '#16A34A', glow: '0 0 20px #16A34A40' },
  warning: { bg: '#F59E0B20', border: '#F59E0B', glow: '0 0 20px #F59E0B40' },
  stopped: { bg: '#DC262620', border: '#DC2626', glow: '0 0 20px #DC262640' },
};

interface NodeBoxProps {
  node: NetworkNode;
  onClick: (node: NetworkNode) => void;
}

const NodeBox: React.FC<NodeBoxProps> = ({ node, onClick }) => {
  const colors = STATUS_COLORS[node.status] ?? STATUS_COLORS.running;

  return (
    <div
      className="absolute cursor-pointer transition-all duration-200 hover:scale-105 hover:z-10"
      style={{
        left: `${node.position.x}%`,
        top: `${node.position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={() => onClick(node)}
    >
      <div
        className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border-2 min-w-[100px] text-center shadow-lg transition-all duration-200 hover:shadow-xl"
        style={{
          background: colors.bg,
          borderColor: colors.border,
          boxShadow: colors.glow,
        }}
      >
        <div style={{ color: colors.border }}>
          {ICON_MAP[node.icon] ?? <Server size={20} />}
        </div>
        <span className="text-xs font-bold text-white leading-tight">{node.name}</span>
        <div
          className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
          style={{ background: `${colors.border}30`, color: colors.border }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors.border }} />
          {node.status}
        </div>
      </div>
    </div>
  );
};

// ── Connection Lines SVG ───────────────────────────────────
const ConnectionLines: React.FC = () => {
  // Define connections between nodes as percentage positions
  const connections: [string, string][] = [
    ['internet', 'route53'],
    ['route53', 'cloudfront'],
    ['cloudfront', 'igw'],
    ['igw', 'alb'],
    ['alb', 'ec2-1'],
    ['alb', 'ec2-2'],
    ['ec2-1', 'rds'],
    ['ec2-2', 'rds'],
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <defs>
        <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#3B82F6" opacity="0.7" />
        </marker>
      </defs>
      {connections.map(([fromId, toId], idx) => {
        const from = networkNodes.find((n) => n.id === fromId);
        const to = networkNodes.find((n) => n.id === toId);
        if (!from || !to) return null;

        const x1 = from.position.x;
        const y1 = from.position.y;
        const x2 = to.position.x;
        const y2 = to.position.y;

        // Control point for curve
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2 - 3;

        return (
          <g key={`${fromId}-${toId}`}>
            <path
              d={`M ${x1}% ${y1}% Q ${cx}% ${cy}% ${x2}% ${y2}%`}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              markerEnd="url(#arrow-blue)"
            />
            {/* Animated dot */}
            <circle r="3" fill="#60A5FA" opacity="0.8">
              <animateMotion
                dur={`${2.5 + (idx % 3) * 0.5}s`}
                repeatCount="indefinite"
                path={`M ${x1}% ${y1}% Q ${cx}% ${cy}% ${x2}% ${y2}%`}
              />
            </circle>
          </g>
        );
      })}
    </svg>
  );
};

// ── Detail Panel ───────────────────────────────────────────
interface DetailPanelProps {
  node: NetworkNode;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ node, onClose }) => (
  <div
    className="animate-slide-right absolute top-4 right-4 z-50 w-72 rounded-2xl border shadow-2xl overflow-hidden"
    style={{ background: 'rgba(15,23,42,0.97)', borderColor: 'rgba(255,255,255,0.1)' }}
  >
    <div className="p-4 border-b border-white/10 flex items-center justify-between">
      <div>
        <h3 className="text-white font-bold text-base">{node.name}</h3>
        <p className="text-slate-400 text-xs">{node.type}</p>
      </div>
      <button onClick={onClose} className="text-slate-500 hover:text-white">
        <X size={16} />
      </button>
    </div>
    <div className="p-4 space-y-2">
      {Object.entries(node.details).map(([k, v]) => (
        <div key={k} className="flex items-center justify-between text-xs">
          <span className="text-slate-400">{k}</span>
          <span className="text-white font-semibold">{v}</span>
        </div>
      ))}
    </div>
    <div className="px-4 pb-4">
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Conectado a:</p>
      <div className="flex flex-wrap gap-1.5">
        {node.connectedTo.length > 0
          ? node.connectedTo.map((id) => (
            <span key={id} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
              {id}
            </span>
          ))
          : <span className="text-xs text-slate-500">Sin conexiones salientes</span>
        }
      </div>
    </div>
  </div>
);

// ── Main NetworkDiagram ────────────────────────────────────
const NetworkDiagram: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  return (
    <div className="relative w-full" style={{ minHeight: '600px' }}>
      {/* Background diagram area */}
      <div
        className="relative w-full rounded-2xl border overflow-hidden"
        style={{ minHeight: '600px', background: '#0A1628', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* VPC boundary */}
        <div
          className="absolute rounded-2xl border-2 border-dashed"
          style={{
            left: '5%',
            top: '38%',
            width: '90%',
            height: '57%',
            borderColor: 'rgba(139,92,246,0.4)',
            background: 'rgba(139,92,246,0.04)',
          }}
        >
          <span className="absolute -top-3 left-4 text-xs font-bold text-purple-400 bg-[#0A1628] px-2">
            VPC: vpc-cloudops-prod (10.0.0.0/16)
          </span>
        </div>

        {/* Public Subnet */}
        <div
          className="absolute rounded-xl border border-dashed"
          style={{
            left: '8%',
            top: '46%',
            width: '84%',
            height: '22%',
            borderColor: 'rgba(59,130,246,0.3)',
            background: 'rgba(59,130,246,0.04)',
          }}
        >
          <span className="absolute -top-2.5 left-4 text-xs font-semibold text-blue-400 bg-[#0A1628] px-1">
            Public Subnet (10.0.1.0/24)
          </span>
        </div>

        {/* Private Subnet */}
        <div
          className="absolute rounded-xl border border-dashed"
          style={{
            left: '30%',
            top: '74%',
            width: '40%',
            height: '16%',
            borderColor: 'rgba(245,158,11,0.3)',
            background: 'rgba(245,158,11,0.04)',
          }}
        >
          <span className="absolute -top-2.5 left-4 text-xs font-semibold text-amber-400 bg-[#0A1628] px-1">
            Private Subnet (10.0.2.0/24)
          </span>
        </div>

        {/* Connection lines */}
        <ConnectionLines />

        {/* Network nodes */}
        {networkNodes.map((node) => (
          <NodeBox key={node.id} node={node} onClick={setSelectedNode} />
        ))}

        {/* Detail panel */}
        {selectedNode && (
          <DetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex gap-4">
          {[
            { color: '#16A34A', label: 'Activo' },
            { color: '#F59E0B', label: 'Advertencia' },
            { color: '#DC2626', label: 'Detenido' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              <span className="text-xs text-slate-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Click hint */}
        <div className="absolute bottom-4 right-4">
          <p className="text-xs text-slate-500 italic">Haz clic en un nodo para ver detalles</p>
        </div>
      </div>

      {/* Security Groups panel below */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {securityGroups.map((sg) => (
          <div
            key={sg.id}
            className="card p-4"
            style={{ background: '#0F172A', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} className="text-red-400" />
              <h4 className="text-white font-semibold text-sm">{sg.name}</h4>
            </div>
            <ul className="space-y-1.5">
              {sg.rules.map((r, i) => (
                <li key={i} className="text-xs text-slate-400 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkDiagram;
