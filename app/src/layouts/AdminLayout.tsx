import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  Radio,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  Home
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { socketService } from '@/services/socket';
import { toast } from 'sonner';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();

  useEffect(() => {
    // Connect socket for real-time updates
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/stations', label: 'Stations', icon: Radio },
    ...(user?.role === 'admin' ? [{ path: '/admin/users', label: 'Users', icon: Users }] : []),
    { path: '/admin/landing', label: 'Landing Page', icon: FileText },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F2F5FA] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F1623] border-r border-white/10 flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Emerald Radio Logo"
              className="h-10 w-auto object-contain"
            />
            <div>
              <h1 className="font-bold text-lg leading-tight">Emerald</h1>
              <p className="text-xs text-[#9AA3B2]">Admin</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-[#00D084]/10 text-[#00D084] border border-[#00D084]/20'
                    : 'text-[#9AA3B2] hover:bg-white/5 hover:text-[#F2F5FA]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2EE9FF] to-[#00A8CC] flex items-center justify-center">
              <span className="font-bold text-sm text-[#070B14]">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.username}</p>
              <p className="text-xs text-[#9AA3B2] capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-[#9AA3B2] hover:bg-white/5 hover:text-[#F2F5FA] transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">View Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[#9AA3B2] hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
