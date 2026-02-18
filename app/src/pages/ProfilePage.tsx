import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Globe, Twitter, Instagram, Youtube, Save, Camera, LogOut, Radio } from 'lucide-react';
import { userAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateUser, clearAuth } = useAuthStore();

  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    displayName: '',
    profileImage: '',
    socialLinks: {
      twitter: '',
      instagram: '',
      youtube: '',
      website: ''
    }
  });

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await userAPI.getProfile(username!);
        const data = response.data.data;
        setProfile(data);

        if (isOwnProfile) {
          setFormData({
            displayName: data.displayName || data.username,
            profileImage: data.profileImage || '',
            socialLinks: {
              twitter: data.socialLinks?.twitter || '',
              instagram: data.socialLinks?.instagram || '',
              youtube: data.socialLinks?.youtube || '',
              website: data.socialLinks?.website || ''
            }
          });
        }
      } catch (error) {
        toast.error('Failed to load profile');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username, isOwnProfile, navigate]);

  const handleSave = async () => {
    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    for (const [platform, link] of Object.entries(formData.socialLinks)) {
      if (link && !urlPattern.test(link)) {
        toast.error(`Invalid URL for ${platform}`);
        return;
      }
    }

    try {
      setIsSaving(true);
      const response = await userAPI.updateProfile(formData);
      setProfile(response.data.data);
      updateUser(response.data.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00D084] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-[#0F1623] border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#00D084]/20 to-[#2EE9FF]/20" />

          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 pt-12">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-[#070B14] bg-gradient-to-br from-[#00D084] to-[#2EE9FF] flex items-center justify-center overflow-hidden">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-[#070B14]">
                    {profile.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {isEditing && (
                <button
                  className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    const url = prompt('Enter profile image URL:');
                    if (url) setFormData({ ...formData, profileImage: url });
                  }}
                >
                  <Camera className="w-8 h-8 text-white" />
                </button>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold">{profile.displayName || profile.username}</h2>
              <p className="text-[#9AA3B2]">@{profile.username} • {profile.role}</p>
            </div>

            <div className="flex gap-3">
              {isOwnProfile && (
                <>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-colors"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-[#00D084] text-[#070B14] rounded-xl font-bold hover:bg-[#00E090] transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? <div className="w-4 h-4 border-2 border-[#070B14] border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="p-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-[#0F1623] border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9AA3B2] mb-4">About</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-[#00D084]" />
                  <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
                {profile.role === 'admin' && (
                  <div className="px-2 py-1 bg-[#00D084]/10 text-[#00D084] text-xs font-bold rounded uppercase inline-block">
                    Administrator
                  </div>
                )}
                {profile.role === 'manager' && (
                  <div className="px-2 py-1 bg-[#2EE9FF]/10 text-[#2EE9FF] text-xs font-bold rounded uppercase inline-block">
                    Moderator
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#0F1623] border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#9AA3B2] mb-4">Social Links</h3>
              <div className="space-y-4">
                {Object.entries(profile.socialLinks || {}).map(([platform, link]: [string, any]) => {
                  if (!link && !isEditing) return null;
                  const Icon = platform === 'twitter' ? Twitter : platform === 'instagram' ? Instagram : platform === 'youtube' ? Youtube : Globe;
                  return (
                    <div key={platform} className="flex items-center gap-3 text-sm">
                      <Icon className="w-4 h-4 text-[#9AA3B2]" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.socialLinks[platform as keyof typeof formData.socialLinks]}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialLinks: { ...formData.socialLinks, [platform]: e.target.value }
                          })}
                          placeholder={`${platform} link`}
                          className="bg-transparent border-b border-white/10 focus:border-[#00D084] outline-none flex-1 text-xs py-1"
                        />
                      ) : (
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-[#00D084] hover:underline truncate">
                          {link.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Column */}
          <div className="md:col-span-2 space-y-6">
            {isEditing && (
              <div className="bg-[#0F1623] border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-6">Edit Profile Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-[#9AA3B2] mb-1.5 block">Display Name</label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-[#00D084] outline-none transition-colors"
                      placeholder="Your display name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#9AA3B2] mb-1.5 block">Profile Image URL</label>
                    <input
                      type="text"
                      value={formData.profileImage}
                      onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-[#00D084] outline-none transition-colors"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[#0F1623] border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Radio className="w-8 h-8 text-[#9AA3B2]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Listener Stats</h3>
              <p className="text-[#9AA3B2]">More features coming soon! You'll be able to see your favorite stations, top genres, and listening history here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
