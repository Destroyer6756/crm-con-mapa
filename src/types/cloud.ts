// ============================================================
// ERP EnterpriseCloud — TypeScript Interfaces & Types
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

// ── Cloud Proposal (Legacy Planning) ──────────────────────
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
  // ERP modules
  canViewSales: boolean;
  canViewPurchases: boolean;
  canViewInventory: boolean;
  canViewCustomers: boolean;
  canViewSuppliers: boolean;
  canViewFinances: boolean;
  canViewDocuments: boolean;
  canViewAdministration: boolean;
  canViewReports: boolean;
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

// ============================================================
// ERP MODULE TYPES
// ============================================================

// ── Customers ─────────────────────────────────────────────
export interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  creditLimit: number;
  balance: number;
  status: 'active' | 'inactive';
  createdAt: string;
  contactPerson?: string;
  ruc?: string;
}

// ── Suppliers ─────────────────────────────────────────────
export interface Supplier {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  creditLimit: number;
  balance: number;
  status: 'active' | 'inactive';
  createdAt: string;
  contactPerson?: string;
  ruc?: string;
  category: string;
}

// ── Products & Inventory ──────────────────────────────────
export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  unitPrice: number;
  purchasePrice: number;
  stock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  warehouseId: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  used: number;
  status: 'active' | 'inactive';
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'entrada' | 'salida' | 'transferencia' | 'ajuste';
  quantity: number;
  previousStock: number;
  newStock: number;
  reference: string;
  reason: string;
  date: string;
  userId: string;
}

// ── Sales ─────────────────────────────────────────────────
export type SaleStatus = 'cotizacion' | 'pendiente' | 'confirmado' | 'entregado' | 'cancelado';

export interface SaleDetail {
  id: string;
  saleId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  code: string;
  customerId: string;
  customerName: string;
  date: string;
  dueDate: string;
  status: SaleStatus;
  details: SaleDetail[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paid: number;
  balance: number;
  notes?: string;
}

// ── Purchases ─────────────────────────────────────────────
export type PurchaseStatus = 'solicitud' | 'orden' | 'recibido' | 'facturado' | 'pagado' | 'cancelado';

export interface PurchaseDetail {
  id: string;
  purchaseId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Purchase {
  id: string;
  code: string;
  supplierId: string;
  supplierName: string;
  date: string;
  dueDate: string;
  status: PurchaseStatus;
  details: PurchaseDetail[];
  subtotal: number;
  tax: number;
  total: number;
  paid: number;
  balance: number;
  notes?: string;
}

// ── Finances ──────────────────────────────────────────────
export type TransactionType = 'ingreso' | 'egreso';

export interface FinanceTransaction {
  id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  date: string;
  reference: string;
  account: string;
  status: 'pendiente' | 'procesado' | 'anulado';
}

export interface BankAccount {
  id: string;
  name: string;
  bank: string;
  number: string;
  type: 'corriente' | 'ahorros';
  balance: number;
  currency: string;
}

// ── Documents ─────────────────────────────────────────────
export type DocumentType = 'factura' | 'contrato' | 'orden' | 'comprobante' | 'archivo';

export interface ERPDocument {
  id: string;
  type: DocumentType;
  name: string;
  description: string;
  entityType: 'cliente' | 'proveedor' | 'venta' | 'compra' | 'interno';
  entityId: string;
  entityName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  s3Key?: string;
  tags: string[];
}

// ── Audit Log ─────────────────────────────────────────────
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  entityId?: string;
  entityType?: string;
  description: string;
  result: 'success' | 'failure';
  ipAddress?: string;
  timestamp: string;
}

// ============================================================
// PLANNING & SECURITY SCORE TYPES
// ============================================================

export type PhaseStatus = 'pendiente' | 'en_progreso' | 'completada';

export interface SecurityControl {
  id: string;
  name: string;
  description: string;
  implemented: boolean;
  verificationDate?: string;
  evidence?: string;
  phaseReference: string; // Refers to FASE 8
}

export interface PhaseTask {
  id: string;
  phaseId: string;
  name: string;
  description: string;
  status: PhaseStatus;
  assignedModule?: string; // e.g. 'Administración', 'Backend'
  securityControlId?: string; // linked security control (for FASE 8 tasks)
  estimatedHours?: number;
  completedAt?: string;
}

export interface ProjectPhase {
  id: string;
  number: number;
  name: string;
  description: string;
  status: PhaseStatus;
  progress: number; // 0-100
  estimatedStart: string;
  estimatedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  tasks: PhaseTask[];
  relatedModule?: string;
}

export interface SecurityScore {
  totalControls: number;
  implementedControls: number;
  percentage: number;
  controls: SecurityControl[];
  lastCalculated: string;
}

export interface PlanningProgress {
  totalPhases: number;
  completedPhases: number;
  inProgressPhases: number;
  pendingPhases: number;
  percentage: number;
  phases: ProjectPhase[];
}
