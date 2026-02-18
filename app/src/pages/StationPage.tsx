import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Radio, Users, Share2, Clock } from 'lucide-react';
import { stationsAPI } from '@/services/api';
import { socketService } from '@/services/socket';
import { usePlayerStore } from '@/store/playerStore';
import YouTubePlayer from '@/components/player/YouTubePlayer';
import ChatPanel from '@/components/chat/ChatPanel';
import { toast } from 'sonner';

interface Station {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  youtubePlaylistId: string;
  headerImage?: string;
  thumbnailImage?: string;
  genre?: string[];
  themeSettings?: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
  listenerCount: number;
  totalPlays: number;
  schedule?: any[];
  sync?: {
    position: number;
    elapsed: number;
    playlistDuration: number;
  };
}

const StationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [station, setStation] = useState<Station | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedStations, setRelatedStations] = useState<Station[]>([]);
  const { setCurrentStation, setListenerCount, listenerCount } = usePlayerStore();

  useEffect(() => {
    const fetchStation = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        const response = await stationsAPI.getBySlug(slug);
        const stationData = response.data.data;
        setStation(stationData);
        setCurrentStation(stationData);
        setListenerCount(stationData.listenerCount);

        // Update listeners
        await stationsAPI.updateListeners(slug, 'join');

        // Fetch related stations
        const allStations = await stationsAPI.getAll();
        const related = allStations.data.data
          .filter((s: Station) => s.slug !== slug)
          .slice(0, 3);
        setRelatedStations(related);
      } catch (error) {
        console.error('Failed to fetch station:', error);
        toast.error('Station not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStation();

    // Cleanup
    return () => {
      if (slug) {
        stationsAPI.updateListeners(slug, 'leave');
        socketService.leaveStation();
      }
    };
  }, [slug, setCurrentStation, setListenerCount]);

  // Socket connection for real-time updates
  useEffect(() => {
    if (!slug || !station) return;

    socketService.connect();
    socketService.joinStation(slug);

    const handleListenerUpdate = (data: { count: number }) => {
      setListenerCount(data.count);
    };

    socketService.onListenerUpdate(handleListenerUpdate);

    return () => {
      socketService.offListenerUpdate();
    };
  }, [slug, station, setListenerCount]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center pt-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00D084] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#9AA3B2]">Loading station...</p>
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center pt-16">
        <div className="text-center">
          <Radio className="w-16 h-16 text-[#9AA3B2] mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Station Not Found</h1>
          <p className="text-[#9AA3B2] mb-6">The station you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D084] text-[#070B14] rounded-xl font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] pt-16">
      {/* Hero Section with Player */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center py-12 px-4"
        style={{
          background: station.headerImage
            ? `linear-gradient(to bottom, rgba(7, 11, 20, 0.7), rgba(7, 11, 20, 0.95)), url(${station.headerImage})`
            : `linear-gradient(135deg, ${station.themeSettings?.backgroundColor || '#070B14'}, #0F1623)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="w-full max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#9AA3B2] hover:text-[#F2F5FA] mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Stations
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Player */}
            <div className="lg:col-span-2">
              <YouTubePlayer station={station} />
            </div>

            {/* Chat */}
            <div className="lg:col-span-1">
              <ChatPanel stationSlug={station.slug} />
            </div>
          </div>
        </div>
      </section>

      {/* Station Info */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{station.name}</h1>
              <p className="text-[#9AA3B2] text-lg max-w-2xl mb-6">
                {station.description || 'No description available.'}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                {station.genre?.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1.5 bg-white/5 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
                <span className="flex items-center gap-2 text-[#9AA3B2]">
                  <Users className="w-4 h-4" />
                  {listenerCount} listening now
                </span>
                <span className="flex items-center gap-2 text-[#9AA3B2]">
                  <Clock className="w-4 h-4" />
                  {station.totalPlays?.toLocaleString()} total plays
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      {station.schedule && station.schedule.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#0F1623]/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Schedule</h2>
            <div className="space-y-3">
              {station.schedule.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/[0.07] transition-colors"
                >
                  <div className="w-16 text-center">
                    <span className="font-mono text-[#00D084]">{item.startTime}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-[#9AA3B2]">{item.description}</p>
                    )}
                  </div>
                  <span className="text-sm text-[#9AA3B2]">{item.duration} min</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Stations */}
      {relatedStations.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">More Stations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedStations.map((relatedStation) => (
                <Link
                  key={relatedStation._id}
                  to={`/station/${relatedStation.slug}`}
                  className="group relative aspect-video rounded-xl overflow-hidden card-hover"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: relatedStation.headerImage
                        ? `url(${relatedStation.headerImage})`
                        : 'linear-gradient(135deg, #00D084, #2EE9FF)'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <h3 className="font-bold">{relatedStation.name}</h3>
                    <span className="flex items-center gap-1 text-sm text-[#9AA3B2]">
                      <Users className="w-4 h-4" />
                      {relatedStation.listenerCount}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default StationPage;
