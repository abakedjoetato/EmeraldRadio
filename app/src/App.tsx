import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/services/api';
import { Toaster } from '@/components/ui/sonner';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Pages
import LandingPage from '@/pages/LandingPage';
import StationPage from '@/pages/StationPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminDashboard from '@/pages/admin/Dashboard';
import StationsManager from '@/pages/admin/StationsManager';
import StationEditor from '@/pages/admin/StationEditor';
import UsersManager from '@/pages/admin/UsersManager';
import LandingEditor from '@/pages/admin/LandingEditor';
import SettingsPage from '@/pages/admin/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00D084] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#9AA3B2]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { setAuth, clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      const token = useAuthStore.getState().token;

      if (token) {
        try {
          const response = await authAPI.getMe();
          setAuth(response.data.data, token);
        } catch (error) {
          clearAuth();
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setAuth, clearAuth, setLoading]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/station/:slug" element={<StationPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="stations" element={<StationsManager />} />
          <Route path="stations/new" element={<StationEditor />} />
          <Route path="stations/edit/:id" element={<StationEditor />} />
          <Route path="users" element={<UsersManager />} />
          <Route path="landing" element={<LandingEditor />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0F1623',
            color: '#F2F5FA',
            border: '1px solid rgba(242, 245, 250, 0.1)'
          }
        }}
      />
    </>
  );
}

export default App;
