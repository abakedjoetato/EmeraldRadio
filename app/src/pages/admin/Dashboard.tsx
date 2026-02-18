import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Radio,
  Users,
  Play,
  Plus,
  Settings,
  ArrowRight,
  Activity
} from 'lucide-react';
import { adminAPI } from '@/services/api';
import { toast } from 'sonner';

interface DashboardStats {
  stations: {
    total: number;
    active: number;
  };
  users: {
    total: number;
    managers: number;
    admins: number;
    basicUsers?: number;
  };
  listeners: number;
  totalPlays: number;
  recentStations: any[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getStats();
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Stations',
      value: stats?.stations.total || 0,
      subtext: `${stats?.stations.active || 0} active`,
      icon: Radio,
      color: 'from-[#00D084] to-[#00A868]',
      link: '/admin/stations'
    },
    {
      title: 'Total Users',
      value: stats?.users.total || 0,
      subtext: `${stats?.users.admins || 0} Admins, ${stats?.users.managers || 0} Mods`,
      icon: Users,
      color: 'from-[#2EE9FF] to-[#00A8CC]',
      link: '/admin/users'
    },
    {
      title: 'Live Listeners',
      value: stats?.listeners || 0,
      subtext: 'Currently tuned in',
      icon: Activity,
      color: 'from-[#FF4D6D] to-[#FF2D55]',
      link: '/admin/stations'
    },
    {
      title: 'Total Plays',
      value: stats?.totalPlays?.toLocaleString() || 0,
      subtext: 'All time plays',
      icon: Play,
      color: 'from-[#9B87F5] to-[#7C6BDB]',
      link: '/admin/stations'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Station',
      description: 'Create a new radio station',
      icon: Plus,
      link: '/admin/stations/new',
      color: 'bg-[#00D084]/10 text-[#00D084]'
    },
    {
      title: 'Edit Landing Page',
      description: 'Customize your homepage',
      icon: Settings,
      link: '/admin/landing',
      color: 'bg-[#2EE9FF]/10 text-[#2EE9FF]'
    },
    {
      title: 'Manage Users',
      description: 'Add or remove team members',
      icon: Users,
      link: '/admin/users',
      color: 'bg-[#9B87F5]/10 text-[#9B87F5]'
    }
  ];

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00D084] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-[#9AA3B2]">Welcome back! Here's what's happening with your radio.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="group p-6 bg-[#0F1623] rounded-2xl border border-white/5 hover:border-[#00D084]/30 transition-all card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-[#9AA3B2] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{card.value}</h3>
              <p className="text-[#9AA3B2] text-sm">{card.title}</p>
              <p className="text-[#00D084] text-xs mt-1">{card.subtext}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.link}
                  className="p-6 bg-[#0F1623] rounded-2xl border border-white/5 hover:border-[#00D084]/30 transition-all card-hover"
                >
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">{action.title}</h3>
                  <p className="text-[#9AA3B2] text-sm">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Stations */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Stations</h2>
          <div className="bg-[#0F1623] rounded-2xl border border-white/5 overflow-hidden">
            {stats?.recentStations?.length === 0 ? (
              <div className="p-8 text-center text-[#9AA3B2]">
                <Radio className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No stations yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {stats?.recentStations?.map((station) => (
                  <Link
                    key={station._id}
                    to={`/admin/stations/edit/${station._id}`}
                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{
                        backgroundImage: station.headerImage
                          ? `url(${station.headerImage})`
                          : 'linear-gradient(135deg, #00D084, #2EE9FF)'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{station.name}</p>
                      <p className="text-xs text-[#9AA3B2]">
                        {station.listenerCount} listeners
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      station.isActive
                        ? 'bg-[#00D084]/10 text-[#00D084]'
                        : 'bg-[#9AA3B2]/10 text-[#9AA3B2]'
                    }`}>
                      {station.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
