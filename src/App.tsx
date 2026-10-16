import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNotifications } from './hooks/useNotifications';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotificationToast from './components/NotificationToast';

// Legacy pages (kept for backward compat)
import Login from './pages/Login';
import Planning from './pages/Planning';
import Costs from './pages/Costs';
import Infrastructure from './pages/Infrastructure';
import Security from './pages/Security';
import Network from './pages/Network';
import Services from './pages/Services';
import UserManagement from './pages/UserManagement';

// New ERP Pages
import ERPDashboard    from './pages/ERPDashboard';
import ERPPlanning     from './pages/ERPPlanning';
import Ventas          from './pages/Ventas';
import Compras         from './pages/Compras';
import Inventario      from './pages/Inventario';
import Clientes        from './pages/Clientes';
import Proveedores     from './pages/Proveedores';
import Finanzas        from './pages/Finanzas';
import Documentos      from './pages/Documentos';
import Reportes        from './pages/Reportes';
import Administracion  from './pages/Administracion';

const MainLayout: React.FC = () => {
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('cloudops-dark-mode', true);
  const { notifications, addNotification, removeNotification } = useNotifications();
  const location = useLocation();

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    addNotification(
      darkMode ? 'Modo claro activado' : 'Modo oscuro activado',
      'info',
    );
  };

  if (location.pathname === '/login') {
    return <Login />;
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div
        className="flex min-h-screen transition-colors duration-300"
        style={{ background: 'var(--bg-main)' }}
      >
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            notificationCount={3}
          />

          <main className="flex-1 overflow-auto">
            <Routes>
              {/* Redirect root to ERP dashboard */}
              <Route path="/" element={<Navigate to="/erp-dashboard" replace />} />

              {/* ── ERP Main Dashboard ─────────────────────── */}
              <Route
                path="/erp-dashboard"
                element={
                  <ProtectedRoute requiredPermission="canViewDashboard">
                    <ERPDashboard />
                  </ProtectedRoute>
                }
              />

              {/* ── ERP Planning (12 Phases Gantt) ──────────── */}
              <Route
                path="/erp-planning"
                element={
                  <ProtectedRoute requiredPermission="canViewPlanning">
                    <ERPPlanning />
                  </ProtectedRoute>
                }
              />

              {/* ── Ventas ──────────────────────────────────── */}
              <Route
                path="/ventas"
                element={
                  <ProtectedRoute requiredPermission="canViewSales">
                    <Ventas />
                  </ProtectedRoute>
                }
              />

              {/* ── Compras ─────────────────────────────────── */}
              <Route
                path="/compras"
                element={
                  <ProtectedRoute requiredPermission="canViewPurchases">
                    <Compras />
                  </ProtectedRoute>
                }
              />

              {/* ── Inventario ──────────────────────────────── */}
              <Route
                path="/inventario"
                element={
                  <ProtectedRoute requiredPermission="canViewInventory">
                    <Inventario />
                  </ProtectedRoute>
                }
              />

              {/* ── Clientes ────────────────────────────────── */}
              <Route
                path="/clientes"
                element={
                  <ProtectedRoute requiredPermission="canViewCustomers">
                    <Clientes />
                  </ProtectedRoute>
                }
              />

              {/* ── Proveedores ─────────────────────────────── */}
              <Route
                path="/proveedores"
                element={
                  <ProtectedRoute requiredPermission="canViewSuppliers">
                    <Proveedores />
                  </ProtectedRoute>
                }
              />

              {/* ── Finanzas ────────────────────────────────── */}
              <Route
                path="/finanzas"
                element={
                  <ProtectedRoute requiredPermission="canViewFinances">
                    <Finanzas />
                  </ProtectedRoute>
                }
              />

              {/* ── Documentos (S3) ─────────────────────────── */}
              <Route
                path="/documentos"
                element={
                  <ProtectedRoute requiredPermission="canViewDocuments">
                    <Documentos />
                  </ProtectedRoute>
                }
              />

              {/* ── Reportes ────────────────────────────────── */}
              <Route
                path="/reportes"
                element={
                  <ProtectedRoute requiredPermission="canViewReports">
                    <Reportes />
                  </ProtectedRoute>
                }
              />

              {/* ── Administración — Gestión y Control ──────── */}
              <Route
                path="/administracion"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Administracion />
                  </ProtectedRoute>
                }
              />

              {/* ── Admin User Management ───────────────────── */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <UserManagement onNotify={addNotification} />
                  </ProtectedRoute>
                }
              />

              {/* ── Legacy CloudOps pages ───────────────────── */}
              <Route
                path="/planning"
                element={
                  <ProtectedRoute requiredPermission="canViewPlanning">
                    <Planning onNotify={addNotification} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/costs"
                element={
                  <ProtectedRoute requiredPermission="canViewCosts">
                    <Costs onNotify={addNotification} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/infrastructure"
                element={
                  <ProtectedRoute requiredPermission="canViewInfrastructure">
                    <Infrastructure />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/security"
                element={
                  <ProtectedRoute requiredPermission="canViewSecurity">
                    <Security />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/network"
                element={
                  <ProtectedRoute requiredPermission="canViewNetwork">
                    <Network />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/services"
                element={
                  <ProtectedRoute requiredPermission="canViewServices">
                    <Services />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/erp-dashboard" replace />} />
            </Routes>
          </main>
        </div>

        {/* Toast notifications */}
        <NotificationToast
          notifications={notifications}
          onRemove={removeNotification}
        />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
