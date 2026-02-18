import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Youtube, Globe, User, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { userAPI } from '@/services/api';

interface ProfileModalProps {
  username: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal = ({ username, isOpen, onClose }: ProfileModalProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && username) {
      const fetchProfile = async () => {
        try {
          setIsLoading(true);
          const response = await userAPI.getProfile(username);
          setProfile(response.data.data);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [isOpen, username]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0F1623] border-white/10 text-[#F2F5FA] max-w-sm">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-[#00D084] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : profile ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00D084] to-[#2EE9FF] flex items-center justify-center overflow-hidden mb-4 border-4 border-white/5">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-[#070B14]">
                    {profile.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold">{profile.displayName || profile.username}</h3>
              <p className="text-[#9AA3B2] text-sm">@{profile.username}</p>

              <div className="mt-2 flex gap-2">
                {profile.role === 'admin' && (
                  <span className="px-2 py-0.5 bg-[#00D084]/20 text-[#00D084] text-[10px] rounded uppercase font-bold">Admin</span>
                )}
                {profile.role === 'manager' && (
                  <span className="px-2 py-0.5 bg-[#2EE9FF]/20 text-[#2EE9FF] text-[10px] rounded uppercase font-bold">Moderator</span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9AA3B2]">Social Links</h4>
              <div className="grid grid-cols-2 gap-2">
                {profile.socialLinks && Object.entries(profile.socialLinks).map(([platform, link]: [string, any]) => {
                  if (!link) return null;
                  const Icon = platform === 'twitter' ? Twitter : platform === 'instagram' ? Instagram : platform === 'youtube' ? Youtube : Globe;
                  return (
                    <a
                      key={platform}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-sm"
                    >
                      <Icon className="w-4 h-4 text-[#9AA3B2]" />
                      <span className="capitalize">{platform}</span>
                    </a>
                  );
                })}
                {(!profile.socialLinks || Object.values(profile.socialLinks).every(v => !v)) && (
                  <p className="text-sm text-[#9AA3B2] col-span-2 italic">No social links provided</p>
                )}
              </div>
            </div>

            <Link
              to={`/profile/${profile.username}`}
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-colors text-sm"
            >
              <User className="w-4 h-4" />
              View Full Profile
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="py-8 text-center text-[#9AA3B2]">
            User not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
