import type {
  Customer, Supplier, Product, Category, Warehouse,
  Sale, Purchase, FinanceTransaction, BankAccount,
  ERPDocument, AuditLog, InventoryMovement,
} from '../types/cloud';

// ── Categories ────────────────────────────────────────────
export const categories: Category[] = [
  { id: 'cat-1', name: 'Tecnología', description: 'Equipos y software tecnológico', color: '#2563EB' },
  { id: 'cat-2', name: 'Oficina',    description: 'Suministros de oficina',          color: '#8B5CF6' },
  { id: 'cat-3', name: 'Servicios',  description: 'Servicios profesionales',         color: '#F59E0B' },
  { id: 'cat-4', name: 'Hardware',   description: 'Hardware y componentes',          color: '#14B8A6' },
];

// ── Warehouses ────────────────────────────────────────────
export const warehouses: Warehouse[] = [
  { id: 'wh-1', name: 'Almacén Principal',   location: 'Guayaquil - Sede Central', capacity: 1000, used: 650, status: 'active' },
  { id: 'wh-2', name: 'Almacén Secundario',  location: 'Quito - Oficina Norte',    capacity: 500,  used: 210, status: 'active' },
  { id: 'wh-3', name: 'Almacén Virtual',     location: 'Amazon S3 / Cloud',        capacity: 9999, used: 142, status: 'active' },
];

// ── Products ──────────────────────────────────────────────
export const products: Product[] = [
  { id: 'prod-1', code: 'TEC-001', name: 'Laptop Dell XPS 15', description: 'Laptop profesional 16GB RAM 512GB SSD', categoryId: 'cat-4', categoryName: 'Hardware', unitPrice: 1250.00, purchasePrice: 950.00, stock: 15, minStock: 5, maxStock: 50, unit: 'unidad', warehouseId: 'wh-1', status: 'active', createdAt: '2026-01-15' },
  { id: 'prod-2', code: 'TEC-002', name: 'Monitor Samsung 27"', description: 'Monitor 4K 27 pulgadas IPS', categoryId: 'cat-4', categoryName: 'Hardware', unitPrice: 420.00, purchasePrice: 310.00, stock: 8, minStock: 3, maxStock: 30, unit: 'unidad', warehouseId: 'wh-1', status: 'active', createdAt: '2026-01-15' },
  { id: 'prod-3', code: 'SRV-001', name: 'Licencia Microsoft 365', description: 'Licencia anual Microsoft 365 Business', categoryId: 'cat-1', categoryName: 'Tecnología', unitPrice: 150.00, purchasePrice: 110.00, stock: 50, minStock: 10, maxStock: 200, unit: 'licencia', warehouseId: 'wh-3', status: 'active', createdAt: '2026-02-01' },
  { id: 'prod-4', code: 'SRV-002', name: 'Plan AWS Cloud Business', description: 'Plan mensual AWS con soporte empresarial', categoryId: 'cat-1', categoryName: 'Tecnología', unitPrice: 500.00, purchasePrice: 380.00, stock: 100, minStock: 5, maxStock: 500, unit: 'plan/mes', warehouseId: 'wh-3', status: 'active', createdAt: '2026-02-01' },
  { id: 'prod-5', code: 'OFI-001', name: 'Escritorio Ejecutivo', description: 'Escritorio de madera 180x90cm', categoryId: 'cat-2', categoryName: 'Oficina', unitPrice: 380.00, purchasePrice: 250.00, stock: 2, minStock: 2, maxStock: 10, unit: 'unidad', warehouseId: 'wh-1', status: 'active', createdAt: '2026-03-01' },
  { id: 'prod-6', code: 'TEC-003', name: 'Router Cisco Enterprise', description: 'Router empresarial Cisco ISR 4321', categoryId: 'cat-4', categoryName: 'Hardware', unitPrice: 1800.00, purchasePrice: 1400.00, stock: 3, minStock: 2, maxStock: 10, unit: 'unidad', warehouseId: 'wh-1', status: 'active', createdAt: '2026-03-15' },
];

// ── Customers ─────────────────────────────────────────────
export const customers: Customer[] = [
  { id: 'cust-1', code: 'CLI-001', name: 'Tech Solutions S.A.', email: 'gerencia@techsolutions.ec', phone: '+593 4 256-7890', address: 'Av. Francisco de Orellana 123', city: 'Guayaquil', country: 'Ecuador', creditLimit: 50000, balance: 12500, status: 'active', createdAt: '2026-01-10', contactPerson: 'Andrés Méndez', ruc: '0990123456001' },
  { id: 'cust-2', code: 'CLI-002', name: 'Innovatech Corp.', email: 'compras@innovatech.com', phone: '+593 2 345-6789', address: 'Av. Amazonas N47-210', city: 'Quito', country: 'Ecuador', creditLimit: 80000, balance: 5800, status: 'active', createdAt: '2026-01-20', contactPerson: 'María García', ruc: '1791234567001' },
  { id: 'cust-3', code: 'CLI-003', name: 'DataCloud Ltda.', email: 'admin@datacloud.ec', phone: '+593 4 678-9012', address: 'Km 12.5 Vía Daule', city: 'Guayaquil', country: 'Ecuador', creditLimit: 30000, balance: 0, status: 'active', createdAt: '2026-02-05', contactPerson: 'Roberto Silva', ruc: '0920987654001' },
  { id: 'cust-4', code: 'CLI-004', name: 'Global Services Ecuador', email: 'finanzas@globalserv.ec', phone: '+593 7 234-5678', address: 'Av. Universitaria s/n', city: 'Cuenca', country: 'Ecuador', creditLimit: 25000, balance: 8900, status: 'active', createdAt: '2026-03-01', contactPerson: 'Lucía Pérez', ruc: '0100456789001' },
  { id: 'cust-5', code: 'CLI-005', name: 'StartupHub Ecuador', email: 'cto@startuphub.ec', phone: '+593 2 567-8901', address: 'Innova Hub, Piso 5', city: 'Quito', country: 'Ecuador', creditLimit: 15000, balance: 3200, status: 'active', createdAt: '2026-03-20', contactPerson: 'Diego Torres', ruc: '1712345678001' },
];

// ── Suppliers ─────────────────────────────────────────────
export const suppliers: Supplier[] = [
  { id: 'supp-1', code: 'PRV-001', name: 'Dell Technologies Ecuador', email: 'ventas@dell.ec', phone: '+593 4 234-5678', address: 'CC Mall del Sol, Local 45', city: 'Guayaquil', country: 'Ecuador', creditLimit: 100000, balance: 25000, status: 'active', createdAt: '2026-01-05', contactPerson: 'Carlos Ramos', ruc: '0991234567001', category: 'Hardware' },
  { id: 'supp-2', code: 'PRV-002', name: 'Microsoft Ecuador', email: 'licencias@microsoft.ec', phone: '+593 2 456-7890', address: 'Av. Naciones Unidas E10-44', city: 'Quito', country: 'Ecuador', creditLimit: 200000, balance: 45000, status: 'active', createdAt: '2026-01-05', contactPerson: 'Patricia Luna', ruc: '1790567890001', category: 'Software' },
  { id: 'supp-3', code: 'PRV-003', name: 'Amazon Web Services', email: 'aws-sales@amazon.com', phone: '+1 206-555-0100', address: '410 Terry Ave N', city: 'Seattle', country: 'USA', creditLimit: 500000, balance: 12800, status: 'active', createdAt: '2026-01-10', contactPerson: 'AWS Account Team', category: 'Cloud Services' },
  { id: 'supp-4', code: 'PRV-004', name: 'Cisco Systems Ecuador', email: 'ventas@cisco.ec', phone: '+593 4 345-6789', address: 'Av. Juan Tanca Marengo', city: 'Guayaquil', country: 'Ecuador', creditLimit: 150000, balance: 18500, status: 'active', createdAt: '2026-02-01', contactPerson: 'Fernando Castro', ruc: '0990876543001', category: 'Networking' },
];

// ── Sales ─────────────────────────────────────────────────
export const sales: Sale[] = [
  {
    id: 'sale-1', code: 'VEN-2026-001', customerId: 'cust-1', customerName: 'Tech Solutions S.A.',
    date: '2026-10-01', dueDate: '2026-10-31', status: 'confirmado',
    details: [
      { id: 'sd-1', saleId: 'sale-1', productId: 'prod-1', productName: 'Laptop Dell XPS 15', quantity: 5, unitPrice: 1250, discount: 0, subtotal: 6250 },
      { id: 'sd-2', saleId: 'sale-1', productId: 'prod-3', productName: 'Licencia Microsoft 365', quantity: 5, unitPrice: 150, discount: 50, subtotal: 700 },
    ],
    subtotal: 6950, tax: 834, discount: 50, total: 7734, paid: 4000, balance: 3734, notes: 'Pago en 2 cuotas',
  },
  {
    id: 'sale-2', code: 'VEN-2026-002', customerId: 'cust-2', customerName: 'Innovatech Corp.',
    date: '2026-10-05', dueDate: '2026-11-05', status: 'entregado',
    details: [
      { id: 'sd-3', saleId: 'sale-2', productId: 'prod-4', productName: 'Plan AWS Cloud Business', quantity: 3, unitPrice: 500, discount: 0, subtotal: 1500 },
    ],
    subtotal: 1500, tax: 180, discount: 0, total: 1680, paid: 1680, balance: 0,
  },
  {
    id: 'sale-3', code: 'VEN-2026-003', customerId: 'cust-3', customerName: 'DataCloud Ltda.',
    date: '2026-10-08', dueDate: '2026-10-22', status: 'pendiente',
    details: [
      { id: 'sd-4', saleId: 'sale-3', productId: 'prod-2', productName: 'Monitor Samsung 27"', quantity: 4, unitPrice: 420, discount: 0, subtotal: 1680 },
      { id: 'sd-5', saleId: 'sale-3', productId: 'prod-6', productName: 'Router Cisco Enterprise', quantity: 1, unitPrice: 1800, discount: 100, subtotal: 1700 },
    ],
    subtotal: 3380, tax: 405.6, discount: 100, total: 3685.6, paid: 0, balance: 3685.6,
  },
  {
    id: 'sale-4', code: 'VEN-2026-004', customerId: 'cust-4', customerName: 'Global Services Ecuador',
    date: '2026-10-10', dueDate: '2026-11-10', status: 'cotizacion',
    details: [
      { id: 'sd-6', saleId: 'sale-4', productId: 'prod-1', productName: 'Laptop Dell XPS 15', quantity: 3, unitPrice: 1250, discount: 0, subtotal: 3750 },
    ],
    subtotal: 3750, tax: 450, discount: 0, total: 4200, paid: 0, balance: 4200, notes: 'Pendiente aprobación de presupuesto',
  },
  {
    id: 'sale-5', code: 'VEN-2026-005', customerId: 'cust-5', customerName: 'StartupHub Ecuador',
    date: '2026-10-12', dueDate: '2026-10-26', status: 'confirmado',
    details: [
      { id: 'sd-7', saleId: 'sale-5', productId: 'prod-3', productName: 'Licencia Microsoft 365', quantity: 10, unitPrice: 150, discount: 150, subtotal: 1350 },
      { id: 'sd-8', saleId: 'sale-5', productId: 'prod-4', productName: 'Plan AWS Cloud Business', quantity: 1, unitPrice: 500, discount: 0, subtotal: 500 },
    ],
    subtotal: 1850, tax: 222, discount: 150, total: 1922, paid: 1000, balance: 922,
  },
];

// ── Purchases ─────────────────────────────────────────────
export const purchases: Purchase[] = [
  {
    id: 'purch-1', code: 'COM-2026-001', supplierId: 'supp-1', supplierName: 'Dell Technologies Ecuador',
    date: '2026-09-25', dueDate: '2026-10-25', status: 'recibido',
    details: [
      { id: 'pd-1', purchaseId: 'purch-1', productId: 'prod-1', productName: 'Laptop Dell XPS 15', quantity: 10, unitPrice: 950, subtotal: 9500 },
    ],
    subtotal: 9500, tax: 1140, total: 10640, paid: 5000, balance: 5640,
  },
  {
    id: 'purch-2', code: 'COM-2026-002', supplierId: 'supp-2', supplierName: 'Microsoft Ecuador',
    date: '2026-10-01', dueDate: '2026-10-31', status: 'facturado',
    details: [
      { id: 'pd-2', purchaseId: 'purch-2', productId: 'prod-3', productName: 'Licencia Microsoft 365', quantity: 50, unitPrice: 110, subtotal: 5500 },
    ],
    subtotal: 5500, tax: 660, total: 6160, paid: 6160, balance: 0,
  },
  {
    id: 'purch-3', code: 'COM-2026-003', supplierId: 'supp-3', supplierName: 'Amazon Web Services',
    date: '2026-10-05', dueDate: '2026-11-05', status: 'pagado',
    details: [
      { id: 'pd-3', purchaseId: 'purch-3', productId: 'prod-4', productName: 'Plan AWS Cloud Business', quantity: 5, unitPrice: 380, subtotal: 1900 },
    ],
    subtotal: 1900, tax: 228, total: 2128, paid: 2128, balance: 0,
  },
];

// ── Finance Transactions ──────────────────────────────────
export const financeTransactions: FinanceTransaction[] = [
  { id: 'fin-1', type: 'ingreso',  category: 'Ventas',           description: 'Pago parcial VEN-2026-001',      amount: 4000,  date: '2026-10-05', reference: 'TRF-001', account: 'Cuenta Corriente GYE', status: 'procesado' },
  { id: 'fin-2', type: 'ingreso',  category: 'Ventas',           description: 'Pago completo VEN-2026-002',    amount: 1680,  date: '2026-10-07', reference: 'TRF-002', account: 'Cuenta Corriente GYE', status: 'procesado' },
  { id: 'fin-3', type: 'egreso',   category: 'Proveedores',      description: 'Pago parcial COM-2026-001',     amount: 5000,  date: '2026-10-08', reference: 'TRF-003', account: 'Cuenta Corriente GYE', status: 'procesado' },
  { id: 'fin-4', type: 'egreso',   category: 'Servicios Cloud',  description: 'Pago AWS - Octubre 2026',       amount: 2128,  date: '2026-10-10', reference: 'TRF-004', account: 'Cuenta Corriente UIO', status: 'procesado' },
  { id: 'fin-5', type: 'ingreso',  category: 'Ventas',           description: 'Pago parcial VEN-2026-005',    amount: 1000,  date: '2026-10-13', reference: 'TRF-005', account: 'Cuenta Corriente GYE', status: 'procesado' },
  { id: 'fin-6', type: 'egreso',   category: 'Nómina',           description: 'Pago nómina Octubre 2026',     amount: 18500, date: '2026-10-15', reference: 'TRF-006', account: 'Cuenta Corriente GYE', status: 'procesado' },
  { id: 'fin-7', type: 'egreso',   category: 'Arriendo',         description: 'Arriendo oficina Guayaquil',   amount: 2800,  date: '2026-10-01', reference: 'TRF-007', account: 'Cuenta Corriente GYE', status: 'procesado' },
  { id: 'fin-8', type: 'ingreso',  category: 'Servicios',        description: 'Consultoría cloud Q3 2026',   amount: 6500,  date: '2026-09-30', reference: 'TRF-008', account: 'Cuenta Corriente UIO', status: 'procesado' },
];

// ── Bank Accounts ─────────────────────────────────────────
export const bankAccounts: BankAccount[] = [
  { id: 'bank-1', name: 'Cuenta Corriente GYE', bank: 'Banco Pichincha', number: '****-1234', type: 'corriente', balance: 45820.50, currency: 'USD' },
  { id: 'bank-2', name: 'Cuenta Corriente UIO', bank: 'Banco del Pacífico', number: '****-5678', type: 'corriente', balance: 22100.00, currency: 'USD' },
  { id: 'bank-3', name: 'Cuenta Ahorros',        bank: 'Produbanco',       number: '****-9012', type: 'ahorros',   balance: 15000.00, currency: 'USD' },
];

// ── Documents ─────────────────────────────────────────────
export const erpDocuments: ERPDocument[] = [
  { id: 'doc-1', type: 'factura', name: 'FAC-2026-001.pdf', description: 'Factura de venta Tech Solutions', entityType: 'venta', entityId: 'sale-1', entityName: 'VEN-2026-001', fileUrl: '/docs/FAC-2026-001.pdf', fileSize: 245000, mimeType: 'application/pdf', uploadedBy: 'admin@cloudops.com', uploadedAt: '2026-10-01T14:30:00Z', s3Key: 'docs/facturas/FAC-2026-001.pdf', tags: ['factura', 'venta', 'tech-solutions'] },
  { id: 'doc-2', type: 'contrato', name: 'CONT-2026-001.pdf', description: 'Contrato de servicios cloud Innovatech', entityType: 'cliente', entityId: 'cust-2', entityName: 'Innovatech Corp.', fileUrl: '/docs/CONT-2026-001.pdf', fileSize: 512000, mimeType: 'application/pdf', uploadedBy: 'admin@cloudops.com', uploadedAt: '2026-09-15T10:00:00Z', s3Key: 'docs/contratos/CONT-2026-001.pdf', tags: ['contrato', 'servicios', 'innovatech'] },
  { id: 'doc-3', type: 'orden', name: 'ORD-2026-001.pdf', description: 'Orden de compra Dell Technologies', entityType: 'compra', entityId: 'purch-1', entityName: 'COM-2026-001', fileUrl: '/docs/ORD-2026-001.pdf', fileSize: 186000, mimeType: 'application/pdf', uploadedBy: 'operador@cloudops.com', uploadedAt: '2026-09-25T09:15:00Z', s3Key: 'docs/ordenes/ORD-2026-001.pdf', tags: ['orden', 'compra', 'dell'] },
  { id: 'doc-4', type: 'archivo', name: 'Politica-Seguridad-2026.pdf', description: 'Política de seguridad empresarial v2.0', entityType: 'interno', entityId: 'int-1', entityName: 'Administración', fileUrl: '/docs/Politica-Seguridad-2026.pdf', fileSize: 1240000, mimeType: 'application/pdf', uploadedBy: 'admin@cloudops.com', uploadedAt: '2026-08-01T08:00:00Z', s3Key: 'docs/internos/Politica-Seguridad-2026.pdf', tags: ['política', 'seguridad', 'interno'] },
  { id: 'doc-5', type: 'comprobante', name: 'COMP-TRF-001.pdf', description: 'Comprobante transferencia bancaria', entityType: 'venta', entityId: 'sale-1', entityName: 'VEN-2026-001', fileUrl: '/docs/COMP-TRF-001.pdf', fileSize: 98000, mimeType: 'application/pdf', uploadedBy: 'operador@cloudops.com', uploadedAt: '2026-10-05T16:45:00Z', s3Key: 'docs/comprobantes/COMP-TRF-001.pdf', tags: ['comprobante', 'pago', 'transferencia'] },
];

// ── Audit Logs ────────────────────────────────────────────
export const auditLogs: AuditLog[] = [
  { id: 'aud-1', userId: 'usr-admin-1', userName: 'Administrador Principal', action: 'LOGIN', module: 'Autenticación', description: 'Inicio de sesión exitoso', result: 'success', ipAddress: '192.168.1.100', timestamp: '2026-10-15T08:00:00Z' },
  { id: 'aud-2', userId: 'usr-admin-1', userName: 'Administrador Principal', action: 'CREATE', module: 'Ventas', entityId: 'sale-5', entityType: 'Sale', description: 'Creación de venta VEN-2026-005', result: 'success', ipAddress: '192.168.1.100', timestamp: '2026-10-12T10:30:00Z' },
  { id: 'aud-3', userId: 'usr-user-1', userName: 'Carlos Zambrano', action: 'VIEW', module: 'Clientes', entityId: 'cust-1', entityType: 'Customer', description: 'Consulta de datos de Tech Solutions S.A.', result: 'success', ipAddress: '192.168.1.101', timestamp: '2026-10-13T14:20:00Z' },
  { id: 'aud-4', userId: 'usr-admin-1', userName: 'Administrador Principal', action: 'APPROVE_USER', module: 'Administración', entityId: 'usr-user-1', entityType: 'User', description: 'Aprobación de usuario Carlos Zambrano', result: 'success', ipAddress: '192.168.1.100', timestamp: '2026-02-01T15:00:00Z' },
  { id: 'aud-5', userId: 'usr-user-1', userName: 'Carlos Zambrano', action: 'UPLOAD', module: 'Documentos', entityId: 'doc-3', entityType: 'Document', description: 'Carga de orden de compra ORD-2026-001.pdf a S3', result: 'success', ipAddress: '192.168.1.101', timestamp: '2026-09-25T09:15:00Z' },
  { id: 'aud-6', userId: 'usr-user-1', userName: 'Carlos Zambrano', action: 'LOGIN_FAILED', module: 'Autenticación', description: 'Intento de login fallido - contraseña incorrecta', result: 'failure', ipAddress: '192.168.1.102', timestamp: '2026-10-14T07:55:00Z' },
  { id: 'aud-7', userId: 'usr-admin-1', userName: 'Administrador Principal', action: 'UPDATE_PERMISSIONS', module: 'Administración', entityId: 'usr-user-1', entityType: 'User', description: 'Actualización de permisos del usuario', result: 'success', ipAddress: '192.168.1.100', timestamp: '2026-10-15T09:10:00Z' },
  { id: 'aud-8', userId: 'usr-admin-1', userName: 'Administrador Principal', action: 'CREATE', module: 'Compras', entityId: 'purch-3', entityType: 'Purchase', description: 'Creación de orden de compra AWS COM-2026-003', result: 'success', ipAddress: '192.168.1.100', timestamp: '2026-10-05T11:00:00Z' },
];

// ── Inventory Movements ───────────────────────────────────
export const inventoryMovements: InventoryMovement[] = [
  { id: 'mov-1', productId: 'prod-1', productName: 'Laptop Dell XPS 15', type: 'entrada', quantity: 10, previousStock: 5, newStock: 15, reference: 'COM-2026-001', reason: 'Recepción de compra', date: '2026-09-26', userId: 'usr-admin-1' },
  { id: 'mov-2', productId: 'prod-1', productName: 'Laptop Dell XPS 15', type: 'salida', quantity: 5, previousStock: 20, newStock: 15, reference: 'VEN-2026-001', reason: 'Despacho de venta', date: '2026-10-03', userId: 'usr-user-1' },
  { id: 'mov-3', productId: 'prod-3', productName: 'Licencia Microsoft 365', type: 'entrada', quantity: 50, previousStock: 0, newStock: 50, reference: 'COM-2026-002', reason: 'Recepción de compra', date: '2026-10-02', userId: 'usr-admin-1' },
  { id: 'mov-4', productId: 'prod-3', productName: 'Licencia Microsoft 365', type: 'salida', quantity: 10, previousStock: 50, newStock: 40, reference: 'VEN-2026-005', reason: 'Entrega de licencias', date: '2026-10-13', userId: 'usr-user-1' },
  { id: 'mov-5', productId: 'prod-2', productName: 'Monitor Samsung 27"', type: 'ajuste', quantity: -2, previousStock: 10, newStock: 8, reference: 'AJU-001', reason: 'Ajuste por inventario físico', date: '2026-10-01', userId: 'usr-admin-1' },
];

// ── Monthly Sales Data (for charts) ──────────────────────
export const monthlySalesData = [
  { month: 'May',  ventas: 12400, compras: 8200,  utilidad: 4200  },
  { month: 'Jun',  ventas: 15800, compras: 10500, utilidad: 5300  },
  { month: 'Jul',  ventas: 13200, compras: 9100,  utilidad: 4100  },
  { month: 'Ago',  ventas: 18900, compras: 12300, utilidad: 6600  },
  { month: 'Sep',  ventas: 16500, compras: 11000, utilidad: 5500  },
  { month: 'Oct',  ventas: 19041, compras: 13640, utilidad: 5401  },
];
