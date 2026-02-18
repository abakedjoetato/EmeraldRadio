import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Radio, Users, Zap, Headphones, ArrowRight } from 'lucide-react';
import { landingAPI, stationsAPI } from '@/services/api';
import { usePlayerStore } from '@/store/playerStore';

interface Station {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  headerImage?: string;
  thumbnailImage?: string;
  genre?: string[];
  listenerCount: number;
  isFeatured: boolean;
}

interface LandingData {
  headerTitle: string;
  headerSubtitle: string;
  headerImage?: string;
  sections: any[];
  featuredStations: Station[];
}

const LandingPage = () => {
  const [landingData, setLandingData] = useState<LandingData | null>(null);
  const [featuredStations, setFeaturedStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setCurrentStation } = usePlayerStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [landingResponse, stationsResponse] = await Promise.all([
          landingAPI.getLandingPage(),
          stationsAPI.getFeatured()
        ]);

        setLandingData(landingResponse.data.data);
        setFeaturedStations(stationsResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch landing data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePlayStation = (station: Station) => {
    setCurrentStation(station as any);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00D084] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14]">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: landingData?.headerImage
              ? `url(${landingData.headerImage})`
              : 'linear-gradient(135deg, #070B14 0%, #0F1623 50%, #1A2332 100%)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#070B14]/25 via-[#070B14]/60 to-[#070B14]" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-[#00D084] font-mono text-sm tracking-widest uppercase mb-4 animate-fade-in">
            24/7 Synchronized Radio
          </p>
          <h1 className="text-responsive-hero font-bold mb-6 leading-tight animate-slide-up">
            {landingData?.headerTitle || 'Tune In. Stay Synced.'}
          </h1>
          <p className="text-xl text-[#9AA3B2] mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {landingData?.headerSubtitle || 'Emerald is a multi-station platform where everyone hears the same moment—live.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to={featuredStations[0] ? `/station/${featuredStations[0].slug}` : '/'}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00D084] text-[#070B14] rounded-xl font-semibold hover:bg-[#00E090] transition-all hover:-translate-y-1"
            >
              <Play className="w-5 h-5" />
              Start Listening
            </Link>
            <Link
              to="#stations"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 rounded-xl font-semibold hover:bg-white/5 transition-all hover:-translate-y-1"
            >
              Explore Stations
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* Now Playing Strip */}
      <div className="bg-[#0F1623] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-[#00D084] rounded-full animate-equalizer"
                  style={{
                    height: `${8 + Math.random() * 16}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
            <span className="text-[#9AA3B2] text-sm">Now Playing on Emerald Radio</span>
            <span className="text-[#00D084] font-medium">Live Broadcast</span>
          </div>
        </div>
      </div>

      {/* Featured Stations */}
      <section id="stations" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-responsive-section font-bold">Featured Stations</h2>
            <Link
              to="/"
              className="text-[#00D084] hover:text-[#00E090] flex items-center gap-2 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStations.map((station, idx) => (
              <div
                key={station._id}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden card-hover"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: station.headerImage
                      ? `url(${station.headerImage})`
                      : 'linear-gradient(135deg, #00D084, #2EE9FF)'
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/50 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{station.name}</h3>
                      <p className="text-[#9AA3B2] text-sm line-clamp-2 mb-3">
                        {station.description || 'No description available'}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-sm text-[#9AA3B2]">
                          <Users className="w-4 h-4" />
                          {station.listenerCount}
                        </span>
                        {station.genre?.map((g) => (
                          <span
                            key={g}
                            className="px-2 py-0.5 bg-white/10 rounded text-xs"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handlePlayStation(station)}
                      className="w-12 h-12 rounded-full bg-[#00D084] flex items-center justify-center text-[#070B14] opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                    >
                      <Play className="w-5 h-5 ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* Link Overlay */}
                <Link
                  to={`/station/${station.slug}`}
                  className="absolute inset-0"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Synced Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F1623]/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-responsive-section font-bold text-center mb-16">
            Why <span className="gradient-text">Synced Radio?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Shared Moments',
                description: 'Everyone hears the same drop at the exact same moment. Experience music together, no matter where you are.'
              },
              {
                icon: Zap,
                title: 'Zero Setup',
                description: 'YouTube-powered streaming means no downloads, no installations. Just click and listen instantly.'
              },
              {
                icon: Radio,
                title: 'Always On',
                description: '24/7 looping playlists ensure the music never stops. Tune in anytime, day or night.'
              }
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="text-center p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#00D084]/30 transition-colors"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#00D084]/10 flex items-center justify-center mx-auto mb-6 animate-float">
                    <Icon className="w-8 h-8 text-[#00D084]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-[#9AA3B2]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-[#00D084]/20 to-[#2EE9FF]/10 border border-[#00D084]/20">
            <Headphones className="w-16 h-16 text-[#00D084] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Tune In?
            </h2>
            <p className="text-[#9AA3B2] text-lg mb-8 max-w-xl mx-auto">
              Join thousands of listeners experiencing synchronized radio. Pick a station and start listening now.
            </p>
            <Link
              to={featuredStations[0] ? `/station/${featuredStations[0].slug}` : '/'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#00D084] text-[#070B14] rounded-xl font-semibold hover:bg-[#00E090] transition-colors"
            >
              <Play className="w-5 h-5" />
              Start Listening Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
