import React from 'react';
import type { AWSService } from '../types/cloud';
import StatusBadge from './StatusBadge';
import {
  Server, Database, Shield, Globe, Zap, Code,
  Activity, Bell, List, Box, Package, Network
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Server:   <Server size={20} />,
  Database: <Database size={20} />,
  Shield:   <Shield size={20} />,
  Globe:    <Globe size={20} />,
  Zap:      <Zap size={20} />,
  Code:     <Code size={20} />,
  Activity: <Activity size={20} />,
  Bell:     <Bell size={20} />,
  List:     <List size={20} />,
  Box:      <Box size={20} />,
  Package:  <Package size={20} />,
  Network:  <Network size={20} />,
};

interface ServiceCardProps {
  service: AWSService;
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, delay = 0 }) => {
  return (
    <div
      className="card p-5 flex flex-col gap-3 animate-fade-in-up cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${service.color}20`, color: service.color }}
        >
          {ICON_MAP[service.icon] ?? <Server size={20} />}
        </div>
        <StatusBadge status={service.status} />
      </div>

      <div>
        <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          {service.name}
        </h3>
        <span
          className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: `${service.color}15`, color: service.color }}
        >
          {service.category}
        </span>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {service.description}
      </p>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: 'var(--text-secondary)' }}>Utilización</span>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {service.usagePercent}%
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${service.usagePercent}%`, background: service.color }}
          />
        </div>
      </div>

      <p className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>
        {service.mainFunction}
      </p>
    </div>
  );
};

export default ServiceCard;
