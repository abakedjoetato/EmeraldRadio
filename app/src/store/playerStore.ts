import { create } from 'zustand';

interface Station {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  headerImage?: string;
  youtubePlaylistId: string;
  themeSettings?: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
}

interface PlayerState {
  currentStation: Station | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  listenerCount: number;
  currentTime: number;
  setCurrentStation: (station: Station | null) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setListenerCount: (count: number) => void;
  setCurrentTime: (time: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentStation: null,
  isPlaying: false,
  volume: 80,
  isMuted: false,
  listenerCount: 0,
  currentTime: 0,
  setCurrentStation: (station) => set({
    currentStation: station,
    isPlaying: !!station,
    listenerCount: 0,
    currentTime: 0
  }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(100, volume)) }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setListenerCount: (count) => set({ listenerCount: count }),
  setCurrentTime: (time) => set({ currentTime: time })
}));
