import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Mail } from 'lucide-react';
import { authAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.register({
        username: username.trim(),
        email: email.trim(),
        password
      });
      const { user, token } = response.data.data;

      setAuth(user, token);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center px-4 py-12">
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
          <h2 className="text-2xl font-bold">Create an Account</h2>
          <p className="text-[#9AA3B2] mt-2">Join the Emerald Radio community</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9AA3B2]" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9AA3B2]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
                placeholder="Create a password"
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9AA3B2]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#00D084] text-[#070B14] rounded-xl font-semibold hover:bg-[#00E090] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-[#070B14] border-t-transparent rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#9AA3B2] text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00D084] hover:underline font-medium">
              Sign In
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
      </div>
    </div>
  );
};

export default RegisterPage;
