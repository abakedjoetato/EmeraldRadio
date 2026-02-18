import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Share2, Heart, Users } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { stationsAPI, favoritesAPI } from '@/services/api';
import { toast } from 'sonner';

interface YouTubePlayerProps {
  station: {
    _id: string;
    name: string;
    slug: string;
    youtubePlaylistId: string;
    description?: string;
    headerImage?: string;
    listenerCount: number;
  };
}

// Extend Window interface for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer = ({ station }: YouTubePlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [syncData, setSyncData] = useState<any>(null);

  const {
    isPlaying,
    setIsPlaying,
    volume,
    isMuted,
    setVolume,
    toggleMute
  } = usePlayerStore();

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsReady(true);
      };
    } else {
      setIsReady(true);
    }
  }, []);

  // Fetch sync data
  useEffect(() => {
    const fetchSyncData = async () => {
      try {
        const response = await stationsAPI.getSync(station.slug);
        setSyncData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch sync data:', error);
      }
    };
    fetchSyncData();
  }, [station.slug]);

  // Initialize YouTube player
  useEffect(() => {
    if (!isReady || !playerRef.current || !syncData) return;

    const startSeconds = Math.floor(syncData.position / 1000);

    youtubePlayerRef.current = new window.YT.Player(playerRef.current, {
      height: '100%',
      width: '100%',
      playerVars: {
        listType: 'playlist',
        list: syncData.playlistId,
        autoplay: 0,
        controls: 1,
        disablekb: 1,
        fs: 1,
        modestbranding: 1,
        rel: 0,
        start: startSeconds,
      },
      events: {
        onReady: (event: any) => {
          event.target.setVolume(volume);
          if (isMuted) event.target.mute();
        },
        onStateChange: (event: any) => {
          // Update playing state based on player state
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
        },
      },
    });

    return () => {
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy();
      }
    };
  }, [isReady, syncData, station.youtubePlaylistId]);

  // Update player when play state changes
  useEffect(() => {
    if (!youtubePlayerRef.current) return;

    if (isPlaying) {
      youtubePlayerRef.current.playVideo();
    } else {
      youtubePlayerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  // Update volume
  useEffect(() => {
    if (!youtubePlayerRef.current) return;
    youtubePlayerRef.current.setVolume(volume);
    if (isMuted) {
      youtubePlayerRef.current.mute();
    } else {
      youtubePlayerRef.current.unMute();
    }
  }, [volume, isMuted]);

  // Check if favorited
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const response = await favoritesAPI.check(station._id);
        setIsFavorited(response.data.data.isFavorited);
      } catch (error) {
        // User not logged in, ignore
      }
    };
    checkFavorite();
  }, [station._id]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorited) {
        await favoritesAPI.remove(station._id);
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await favoritesAPI.add(station._id);
        setIsFavorited(true);
        toast.success('Added to favorites');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Please login to add favorites');
      } else {
        toast.error('Failed to update favorites');
      }
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/station/${station.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="w-full">
      {/* Player Container */}
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
        <div ref={playerRef} className="w-full h-full" />

        {/* Custom Overlay Controls */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {!isPlaying && (
            <button
              onClick={handleTogglePlay}
              className="pointer-events-auto w-20 h-20 rounded-full bg-[#00D084] flex items-center justify-center text-[#070B14] hover:scale-110 transition-transform shadow-lg"
            >
              <Play className="w-8 h-8 ml-1" />
            </button>
          )}
        </div>

        {/* Live Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="live-indicator flex items-center gap-2 px-3 py-1.5 bg-red-500/90 rounded-full text-xs font-bold uppercase">
            <span className="w-2 h-2 rounded-full bg-white" />
            Live
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-xs">
            <Users className="w-3.5 h-3.5" />
            {station.listenerCount} listeners
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            className="w-12 h-12 rounded-full bg-[#00D084] flex items-center justify-center text-[#070B14] hover:bg-[#00E090] transition-colors btn-press"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#9AA3B2] hover:text-[#F2F5FA] transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#00D084]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleFavorite}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              isFavorited
                ? 'bg-red-500/10 text-red-500'
                : 'hover:bg-white/5 text-[#9AA3B2] hover:text-[#F2F5FA]'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#9AA3B2] hover:text-[#F2F5FA] transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;
