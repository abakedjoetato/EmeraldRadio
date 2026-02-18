import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Radio, Menu, X, Headphones, User as UserIcon } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useAuthStore } from '@/store/authStore';
import { stationsAPI } from '@/services/api';

interface Station {
  _id: string;
  name: string;
  slug: string;
  listenerCount: number;
}

const Navbar = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const location = useLocation();
  const { currentStation, isPlaying } = usePlayerStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await stationsAPI.getAll();
        setStations(response.data.data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch stations:', error);
      }
    };
    fetchStations();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Audio Visualizer Bar */}
      {isPlaying && currentStation && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-[#070B14] z-[60]">
          <div className="flex h-full gap-[2px]">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-[#00D084] to-[#2EE9FF] animate-equalizer"
                style={{
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isPlaying
            ? 'bg-[#070B14]/90 backdrop-blur-lg border-b border-white/10'
            : 'bg-transparent'
        } ${isPlaying ? 'mt-1' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Emerald Radio Logo"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg leading-tight">Emerald</h1>
                <p className="text-xs text-[#9AA3B2]">Radio</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-[#00D084]' : 'text-[#9AA3B2] hover:text-[#F2F5FA]'
                }`}
              >
                Home
              </Link>

              {/* Stations Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-[#9AA3B2] hover:text-[#F2F5FA] transition-colors">
                  Stations
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#0F1623] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    {stations.map((station) => (
                      <Link
                        key={station._id}
                        to={`/station/${station.slug}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <span className="text-sm">{station.name}</span>
                        <span className="flex items-center gap-1 text-xs text-[#9AA3B2]">
                          <Headphones className="w-3 h-3" />
                          {station.listenerCount}
                        </span>
                      </Link>
                    ))}
                    <div className="border-t border-white/10 mt-2 pt-2">
                      <Link
                        to="/"
                        className="block px-3 py-2 text-sm text-[#00D084] hover:bg-white/5 rounded-lg transition-colors"
                      >
                        View All Stations
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {(user?.role === 'admin' || user?.role === 'manager') && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-[#9AA3B2] hover:text-[#F2F5FA] transition-colors"
                >
                  Admin
                </Link>
              )}

              {isAuthenticated ? (
                <Link
                  to={`/profile/${user?.username}`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-[#00D084]" />
                  <span className="text-sm font-medium">{user?.username}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-[#00D084] text-[#070B14] rounded-lg text-sm font-semibold hover:bg-[#00E090] transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Now Playing Indicator */}
            {isPlaying && currentStation && (
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full">
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-1 bg-[#00D084] rounded-full animate-equalizer"
                      style={{
                        height: '12px',
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-[#9AA3B2]">Now Playing:</span>
                <span className="text-sm font-medium">{currentStation.name}</span>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0F1623] border-t border-white/10">
            <div className="px-4 py-4 space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium ${
                  isActive('/') ? 'bg-[#00D084]/10 text-[#00D084]' : 'text-[#9AA3B2] hover:bg-white/5'
                }`}
              >
                Home
              </Link>
              <div className="px-4 py-2 text-sm text-[#9AA3B2]">Stations</div>
              {stations.map((station) => (
                <Link
                  key={station._id}
                  to={`/station/${station.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 pl-8 text-sm text-[#F2F5FA] hover:bg-white/5 rounded-lg"
                >
                  {station.name}
                </Link>
              ))}

              {(user?.role === 'admin' || user?.role === 'manager') && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg font-medium text-[#9AA3B2] hover:bg-white/5"
                >
                  Admin
                </Link>
              )}

              {isAuthenticated ? (
                <Link
                  to={`/profile/${user?.username}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg font-medium text-[#00D084] hover:bg-white/5"
                >
                  My Profile ({user?.username})
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg font-medium text-[#00D084] hover:bg-white/5"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
