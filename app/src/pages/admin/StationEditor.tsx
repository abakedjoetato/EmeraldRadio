import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { adminAPI } from '@/services/api';
import { toast } from 'sonner';

interface StationFormData {
  name: string;
  slug: string;
  description: string;
  youtubePlaylistId: string;
  playlistDuration: number;
  headerImage: string;
  thumbnailImage: string;
  genre: string[];
  isFeatured: boolean;
  isActive: boolean;
  themeSettings: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
}

const defaultFormData: StationFormData = {
  name: '',
  slug: '',
  description: '',
  youtubePlaylistId: '',
  playlistDuration: 3600000,
  headerImage: '',
  thumbnailImage: '',
  genre: [],
  isFeatured: false,
  isActive: true,
  themeSettings: {
    backgroundColor: '#070B14',
    textColor: '#F2F5FA',
    accentColor: '#00D084'
  }
};

const StationEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<StationFormData>(defaultFormData);
  const [genreInput, setGenreInput] = useState('');
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchStation();
    }
  }, [id]);

  const fetchStation = async () => {
    try {
      const response = await adminAPI.getAllStations();
      const station = response.data.data.find((s: any) => s._id === id);

      if (station) {
        setFormData({
          name: station.name || '',
          slug: station.slug || '',
          description: station.description || '',
          youtubePlaylistId: station.youtubePlaylistId || '',
          playlistDuration: station.playlistDuration || 3600000,
          headerImage: station.headerImage || '',
          thumbnailImage: station.thumbnailImage || '',
          genre: station.genre || [],
          isFeatured: station.isFeatured || false,
          isActive: station.isActive !== false,
          themeSettings: {
            backgroundColor: station.themeSettings?.backgroundColor || '#070B14',
            textColor: station.themeSettings?.textColor || '#F2F5FA',
            accentColor: station.themeSettings?.accentColor || '#00D084'
          }
        });
      } else {
        toast.error('Station not found');
        navigate('/admin/stations');
      }
    } catch (error) {
      console.error('Failed to fetch station:', error);
      toast.error('Failed to load station');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.slug.trim() || !formData.youtubePlaylistId.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);

      if (isEditing) {
        await adminAPI.updateStation(id!, formData);
        toast.success('Station updated successfully');
      } else {
        await adminAPI.createStation(formData);
        toast.success('Station created successfully');
      }

      navigate('/admin/stations');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save station';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof StationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleThemeChange = (field: keyof StationFormData['themeSettings'], value: string) => {
    setFormData(prev => ({
      ...prev,
      themeSettings: { ...prev.themeSettings, [field]: value }
    }));
  };

  const addGenre = () => {
    if (genreInput.trim() && !formData.genre.includes(genreInput.trim())) {
      setFormData(prev => ({
        ...prev,
        genre: [...prev.genre, genreInput.trim()]
      }));
      setGenreInput('');
    }
  };

  const removeGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.filter(g => g !== genre)
    }));
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    handleChange('slug', slug);
  };

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
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/stations')}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Edit Station' : 'Create Station'}
          </h1>
          <p className="text-[#9AA3B2]">
            {isEditing ? 'Update your radio station' : 'Add a new radio station'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <div className="bg-[#0F1623] rounded-2xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Station Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={!isEditing ? generateSlug : undefined}
                    placeholder="e.g., Night Drive Radio"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Slug <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    placeholder="e.g., night-drive"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
                  />
                  <p className="text-xs text-[#9AA3B2] mt-1">
                    Used in URL: /station/{formData.slug || 'your-slug'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe your station..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* YouTube Settings */}
            <div className="bg-[#0F1623] rounded-2xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold mb-4">YouTube Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Playlist ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.youtubePlaylistId}
                    onChange={(e) => handleChange('youtubePlaylistId', e.target.value)}
                    placeholder="e.g., PLxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
                  />
                  <p className="text-xs text-[#9AA3B2] mt-1">
                    YouTube playlist ID for synchronized playback
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Playlist Duration (ms)
                  </label>
                  <input
                    type="number"
                    value={formData.playlistDuration}
                    onChange={(e) => handleChange('playlistDuration', parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
                  />
                  <p className="text-xs text-[#9AA3B2] mt-1">
                    Total duration in milliseconds for sync calculation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-6">
            <div className="bg-[#0F1623] rounded-2xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold mb-4">Appearance</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Header Image URL</label>
                  <input
                    type="text"
                    value={formData.headerImage}
                    onChange={(e) => handleChange('headerImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail Image URL</label>
                  <input
                    type="text"
                    value={formData.thumbnailImage}
                    onChange={(e) => handleChange('thumbnailImage', e.target.value)}
                    placeholder="https://example.com/thumb.jpg"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Genres</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={genreInput}
                      onChange={(e) => setGenreInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre())}
                      placeholder="Add genre..."
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={addGenre}
                      className="px-4 py-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.genre.map((g) => (
                      <span
                        key={g}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#00D084]/10 text-[#00D084] rounded-full text-sm"
                      >
                        {g}
                        <button
                          type="button"
                          onClick={() => removeGenre(g)}
                          className="hover:text-red-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Colors */}
            <div className="bg-[#0F1623] rounded-2xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold mb-4">Theme Colors</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={formData.themeSettings.backgroundColor}
                    onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <div>
                    <label className="block text-sm font-medium">Background Color</label>
                    <p className="text-xs text-[#9AA3B2]">{formData.themeSettings.backgroundColor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={formData.themeSettings.textColor}
                    onChange={(e) => handleThemeChange('textColor', e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <div>
                    <label className="block text-sm font-medium">Text Color</label>
                    <p className="text-xs text-[#9AA3B2]">{formData.themeSettings.textColor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={formData.themeSettings.accentColor}
                    onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <div>
                    <label className="block text-sm font-medium">Accent Color</label>
                    <p className="text-xs text-[#9AA3B2]">{formData.themeSettings.accentColor}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-[#0F1623] rounded-2xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold mb-4">Settings</h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#00D084] focus:ring-[#00D084]"
                  />
                  <span>Active (visible to listeners)</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleChange('isFeatured', e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#00D084] focus:ring-[#00D084]"
                  />
                  <span>Featured (show on homepage)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#00D084] text-[#070B14] rounded-xl font-semibold hover:bg-[#00E090] transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEditing ? 'Update Station' : 'Create Station'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/stations')}
            className="px-8 py-3 border border-white/20 rounded-xl font-semibold hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StationEditor;
