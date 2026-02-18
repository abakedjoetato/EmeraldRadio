import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';

const MiniPlayer = () => {
  const {
    currentStation,
    isPlaying,
    volume,
    isMuted,
    listenerCount,
    togglePlay,
    setVolume,
    toggleMute
  } = usePlayerStore();

  if (!currentStation) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0F1623]/95 backdrop-blur-lg border-t border-white/10 z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Station Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div
              className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
              style={{
                backgroundImage: currentStation.headerImage
                  ? `url(${currentStation.headerImage})`
                  : 'linear-gradient(135deg, #00D084, #2EE9FF)'
              }}
            />
            <div className="min-w-0">
              <Link
                to={`/station/${currentStation.slug}`}
                className="font-medium text-sm truncate hover:text-[#00D084] transition-colors"
              >
                {currentStation.name}
              </Link>
              <div className="flex items-center gap-2 text-xs text-[#9AA3B2]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00D084] animate-pulse" />
                  Live
                </span>
                <span>•</span>
                <span>{listenerCount} listeners</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-[#00D084] flex items-center justify-center text-[#070B14] hover:bg-[#00E090] transition-colors btn-press"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#9AA3B2] hover:text-[#F2F5FA] transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#00D084]"
              />
            </div>

            {/* Full Player Link */}
            <Link
              to={`/station/${currentStation.slug}`}
              className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#9AA3B2] hover:text-[#F2F5FA] transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
