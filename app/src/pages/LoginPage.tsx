import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { authAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Please enter both username and password');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.login(username.trim(), password);
      const { user, token } = response.data.data;

      setAuth(user, token);
      toast.success('Login successful');

      // Redirect based on role
      if (user.role === 'admin' || user.role === 'manager') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <img
              src="/logo.png"
              alt="Emerald Radio Logo"
              className="h-12 w-auto object-contain"
            />
            <div className="text-left">
              <h1 className="font-bold text-xl">Emerald</h1>
              <p className="text-xs text-[#9AA3B2]">Radio</p>
            </div>
          </Link>
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-[#9AA3B2] mt-2">Sign in to manage your radio stations</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9AA3B2]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9AA3B2]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9AA3B2] hover:text-[#F2F5FA] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#00D084] text-[#070B14] rounded-xl font-semibold hover:bg-[#00E090] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-[#070B14] border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#9AA3B2] text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#00D084] hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Back to Site */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-[#9AA3B2] hover:text-[#F2F5FA] text-sm transition-colors"
          >
            ← Back to Emerald Radio
          </Link>
        </div>

        {/* Default Credentials Hint */}
        <div className="mt-8 p-4 bg-[#0F1623] rounded-xl border border-white/10">
          <p className="text-xs text-[#9AA3B2] text-center">
            Default admin: <span className="text-[#00D084]">Emerald</span>
            <br />
            Password is set via <code className="text-[#2EE9FF]">DEFAULT_ADMIN_PASSWORD</code> env variable
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
