// ============================================================
// CloudOps Dashboard - TypeScript Interfaces & Types
// ============================================================

export type RegionStatus = 'operational' | 'warning' | 'error';
export type ServiceStatus = 'active' | 'inactive' | 'maintenance';
export type SecurityStatus = 'good' | 'review' | 'critical';

// ── AWS Region ────────────────────────────────────────────
export interface AWSRegion {
  id: string;
  code: string;
  name: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  status: RegionStatus;
  services: string[];
  resources: number;
  users: number;
  monthlyCost: number;
  avgLatency: number;
  availability: number;
  isUserOrigin?: boolean;
}

// ── Route between regions ─────────────────────────────────
export interface CloudRoute {
  id: string;
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
  latency: string;
  traffic: string;
  status: 'active' | 'warning' | 'error';
  protocol: string;
  services: string[];
  bandwidth: string;
}

// ── AWS Service ───────────────────────────────────────────
export interface AWSService {
  id: string;
  name: string;
  category: string;
  description: string;
  mainFunction: string;
  status: ServiceStatus;
  usagePercent: number;
  icon: string;
  color: string;
}

// ── Cost Item ─────────────────────────────────────────────
export interface CostItem {
  id: string;
  service: string;
  category: string;
  quantity: number;
  hours: number;
  unitPrice: number;
  monthlyCost: number;
  annualCost: number;
  color: string;
}

// ── Security Item ─────────────────────────────────────────
export interface SecurityItem {
  id: string;
  title: string;
  description: string;
  status: SecurityStatus;
  score: number;
  details: string[];
  lastReview: string;
}

// ── Network Node ──────────────────────────────────────────
export interface NetworkNode {
  id: string;
  name: string;
  type: string;
  layer: number;
  position: { x: number; y: number };
  status: 'running' | 'stopped' | 'warning';
  details: Record<string, string | number>;
  connectedTo: string[];
  color: string;
  icon: string;
}

// ── Cloud Proposal (Planning) ─────────────────────────────
export interface CloudProposal {
  id: string;
  name: string;
  appType: string;
  description: string;
  region: string;
  estimatedUsers: number;
  availabilityLevel: string;
  selectedServices: string[];
  migrationObjective: string;
  createdAt: string;
  updatedAt: string;
}

// ── Notification ──────────────────────────────────────────
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
}

// ── Dashboard KPI ─────────────────────────────────────────
export interface DashboardKPI {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  color?: string;
}

// ── Monthly Cost Data ─────────────────────────────────────
export interface MonthlyCostData {
  month: string;
  total: number;
  EC2: number;
  S3: number;
  RDS: number;
  CloudFront: number;
  Route53: number;
}

// ── IAM Summary ───────────────────────────────────────────
export interface IAMSummary {
  users: number;
  roles: number;
  policies: number;
  mfaEnabled: number;
  mfaTotal: number;
  encryptedBuckets: number;
  totalBuckets: number;
  backupsConfigured: number;
  totalBackups: number;
}

// ── Authentication & User Management ──────────────────────
export type UserRole = 'admin' | 'user';
export type UserStatus = 'approved' | 'pending' | 'rejected' | 'blocked';

export interface UserPermissions {
  canViewDashboard: boolean;
  canViewPlanning: boolean;
  canViewCosts: boolean;
  canViewInfrastructure: boolean;
  canViewSecurity: boolean;
  canViewNetwork: boolean;
  canViewServices: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  reason?: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  permissions: UserPermissions;
}

