import { useEffect, useState } from 'react';
import { ArrowLeft, Save, Loader2, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '@/services/api';
import { toast } from 'sonner';

interface Section {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  isEnabled: boolean;
  order: number;
}

interface LandingData {
  headerTitle: string;
  headerSubtitle: string;
  headerImage: string;
  metaTitle: string;
  metaDescription: string;
  sections: Section[];
}

const defaultLandingData: LandingData = {
  headerTitle: 'Tune In. Stay Synced.',
  headerSubtitle: 'Emerald is a multi-station platform where everyone hears the same moment—live.',
  headerImage: '',
  metaTitle: 'Emerald Radio - 24/7 Multi-Station Web Radio',
  metaDescription: 'Tune in to Emerald Radio - a multi-station platform where everyone hears the same moment, synchronized across all listeners.',
  sections: [
    {
      id: 'featured',
      type: 'featured',
      title: 'Featured Stations',
      isEnabled: true,
      order: 1
    },
    {
      id: 'about',
      type: 'about',
      title: 'Why Synced Radio?',
      content: 'Experience music together. Our synchronized playback means every listener hears the same beat at the same moment.',
      isEnabled: true,
      order: 2
    }
  ]
};

const sectionTypes = [
  { value: 'hero', label: 'Hero Banner' },
  { value: 'featured', label: 'Featured Stations' },
  { value: 'about', label: 'About/Text' },
  { value: 'news', label: 'News' },
  { value: 'charts', label: 'Charts' },
  { value: 'submissions', label: 'Submissions' },
  { value: 'announcements', label: 'Announcements' },
  { value: 'events', label: 'Events' },
  { value: 'custom', label: 'Custom' }
];

const LandingEditor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LandingData>(defaultLandingData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLandingPage();
  }, []);

  const fetchLandingPage = async () => {
    try {
      const response = await adminAPI.getLandingPage();
      const data = response.data.data;
      setFormData({
        headerTitle: data.headerTitle || defaultLandingData.headerTitle,
        headerSubtitle: data.headerSubtitle || defaultLandingData.headerSubtitle,
        headerImage: data.headerImage || '',
        metaTitle: data.metaTitle || defaultLandingData.metaTitle,
        metaDescription: data.metaDescription || defaultLandingData.metaDescription,
        sections: data.sections || defaultLandingData.sections
      });
    } catch (error) {
      console.error('Failed to fetch landing page:', error);
      toast.error('Failed to load landing page data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      await adminAPI.updateLandingPage(formData);
      toast.success('Landing page updated successfully');
    } catch (error) {
      console.error('Failed to update landing page:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSectionChange = (index: number, field: keyof Section, value: any) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type: 'custom',
      title: 'New Section',
      isEnabled: true,
      order: formData.sections.length
    };
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const removeSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.sections.length - 1) return;

    const newSections = [...formData.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];

    setFormData(prev => ({
      ...prev,
      sections: newSections.map((s, i) => ({ ...s, order: i }))
    }));
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
          onClick={() => navigate('/admin')}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold">Landing Page</h1>
          <p className="text-[#9AA3B2]">Customize your homepage content</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        {/* Hero Section */}
        <div className="bg-[#0F1623] rounded-2xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold mb-4">Hero Section</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Header Title</label>
              <input
                type="text"
                value={formData.headerTitle}
                onChange={(e) => setFormData({ ...formData, headerTitle: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Header Subtitle</label>
              <input
                type="text"
                value={formData.headerSubtitle}
                onChange={(e) => setFormData({ ...formData, headerSubtitle: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Header Background Image</label>
              <input
                type="text"
                value={formData.headerImage}
                onChange={(e) => setFormData({ ...formData, headerImage: e.target.value })}
                placeholder="https://example.com/hero-image.jpg"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-[#0F1623] rounded-2xl p-6 border border-white/5">
          <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Meta Title</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Meta Description</label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Page Sections</h2>
            <button
              type="button"
              onClick={addSection}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D084] text-[#070B14] rounded-lg font-medium hover:bg-[#00E090] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </button>
          </div>

          <div className="space-y-4">
            {formData.sections.map((section, index) => (
              <div
                key={section.id}
                className={`bg-[#0F1623] rounded-2xl border ${
                  section.isEnabled ? 'border-white/5' : 'border-white/5 opacity-60'
                }`}
              >
                <div className="p-4 flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className="text-[#9AA3B2] hover:text-[#F2F5FA] disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === formData.sections.length - 1}
                      className="text-[#9AA3B2] hover:text-[#F2F5FA] disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <select
                        value={section.type}
                        onChange={(e) => handleSectionChange(index, 'type', e.target.value)}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#00D084]"
                      >
                        {sectionTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                        placeholder="Section Title"
                        className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#00D084]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSectionChange(index, 'isEnabled', !section.isEnabled)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        section.isEnabled
                          ? 'bg-[#00D084]/10 text-[#00D084]'
                          : 'bg-white/5 text-[#9AA3B2]'
                      }`}
                    >
                      {section.isEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-[#9AA3B2] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Section Details */}
                <div className="px-4 pb-4 pt-2 border-t border-white/5">
                  <div className="space-y-3">
                    {section.type !== 'featured' && (
                      <>
                        <input
                          type="text"
                          value={section.subtitle || ''}
                          onChange={(e) => handleSectionChange(index, 'subtitle', e.target.value)}
                          placeholder="Subtitle (optional)"
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#00D084]"
                        />
                        <textarea
                          value={section.content || ''}
                          onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                          placeholder="Content (optional)"
                          rows={3}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#00D084] resize-none"
                        />
                      </>
                    )}
                    <input
                      type="text"
                      value={section.imageUrl || ''}
                      onChange={(e) => handleSectionChange(index, 'imageUrl', e.target.value)}
                      placeholder="Image URL (optional)"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#00D084]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-8 border-t border-white/10">
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
                Save Changes
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-8 py-3 border border-white/20 rounded-xl font-semibold hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LandingEditor;
