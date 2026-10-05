import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useNotifications } from './hooks/useNotifications';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotificationToast from './components/NotificationToast';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Planning from './pages/Planning';
import Costs from './pages/Costs';
import Infrastructure from './pages/Infrastructure';
import Security from './pages/Security';
import Network from './pages/Network';
import Services from './pages/Services';
import UserManagement from './pages/UserManagement';

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

  // Do not render layout frame on Login page
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
        <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
          <Header
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            notificationCount={3}
          />

          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredPermission="canViewDashboard">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

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

              {/* Admin User Management Route */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <UserManagement onNotify={addNotification} />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
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
