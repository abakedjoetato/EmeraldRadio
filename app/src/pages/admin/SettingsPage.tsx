import { useState } from 'react';
import { ArrowLeft, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword.trim() || !newPassword.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setIsChanging(true);
      await authAPI.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin')}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-[#9AA3B2]">Manage your account settings</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Change Password */}
        <div className="bg-[#0F1623] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#00D084]/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#00D084]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Change Password</h2>
              <p className="text-sm text-[#9AA3B2]">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9AA3B2] hover:text-[#F2F5FA] transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9AA3B2] hover:text-[#F2F5FA] transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-[#9AA3B2] mt-1">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isChanging}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D084] text-[#070B14] rounded-xl font-semibold hover:bg-[#00E090] transition-colors disabled:opacity-50"
            >
              {isChanging ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Changing...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        </div>

        {/* API Info */}
        <div className="bg-[#0F1623] rounded-2xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold mb-4">API Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#9AA3B2]">API Base URL</span>
              <code className="px-2 py-1 bg-white/5 rounded">{import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9AA3B2]">Socket URL</span>
              <code className="px-2 py-1 bg-white/5 rounded">{import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'}</code>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-[#0F1623] rounded-2xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold mb-4">About Emerald Radio</h2>
          <div className="space-y-2 text-sm text-[#9AA3B2]">
            <p>Version: 1.0.0</p>
            <p>A 24/7 synchronized multi-station web radio platform.</p>
            <p>Built with React, Node.js, Express, MongoDB, and Socket.IO.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
