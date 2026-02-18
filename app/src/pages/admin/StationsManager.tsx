import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Power,
  PowerOff,
  ExternalLink,
  MoreVertical,
  Radio
} from 'lucide-react';
import { adminAPI } from '@/services/api';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Station {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  headerImage?: string;
  youtubePlaylistId: string;
  isActive: boolean;
  isFeatured: boolean;
  listenerCount: number;
  totalPlays: number;
  createdAt: string;
}

const StationsManager = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [stationToDelete, setStationToDelete] = useState<Station | null>(null);

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    const filtered = stations.filter(station =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStations(filtered);
  }, [searchQuery, stations]);

  const fetchStations = async () => {
    try {
      const response = await adminAPI.getAllStations();
      setStations(response.data.data);
      setFilteredStations(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
      toast.error('Failed to load stations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (station: Station) => {
    try {
      await adminAPI.toggleStation(station._id);
      toast.success(`Station ${station.isActive ? 'disabled' : 'enabled'} successfully`);
      fetchStations();
    } catch (error) {
      toast.error('Failed to update station status');
    }
  };

  const handleDelete = async () => {
    if (!stationToDelete) return;

    try {
      await adminAPI.deleteStation(stationToDelete._id);
      toast.success('Station deleted successfully');
      fetchStations();
    } catch (error) {
      toast.error('Failed to delete station');
    } finally {
      setStationToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Stations</h1>
          <p className="text-[#9AA3B2]">Manage your radio stations</p>
        </div>
        <Link
          to="/admin/stations/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D084] text-[#070B14] rounded-xl font-semibold hover:bg-[#00E090] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Station
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9AA3B2]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search stations..."
          className="w-full pl-12 pr-4 py-3 bg-[#0F1623] border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
        />
      </div>

      {/* Stations Table */}
      <div className="bg-[#0F1623] rounded-2xl border border-white/5 overflow-hidden">
        {filteredStations.length === 0 ? (
          <div className="p-12 text-center">
            <Radio className="w-16 h-16 text-[#9AA3B2] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No stations found</h3>
            <p className="text-[#9AA3B2] mb-6">
              {searchQuery ? 'Try a different search term' : 'Create your first station to get started'}
            </p>
            {!searchQuery && (
              <Link
                to="/admin/stations/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D084] text-[#070B14] rounded-xl font-semibold"
              >
                <Plus className="w-5 h-5" />
                Create Station
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#9AA3B2]">Station</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#9AA3B2]">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#9AA3B2]">Listeners</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#9AA3B2]">Plays</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#9AA3B2]">Created</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-[#9AA3B2]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStations.map((station) => (
                  <tr key={station._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                          style={{
                            backgroundImage: station.headerImage
                              ? `url(${station.headerImage})`
                              : 'linear-gradient(135deg, #00D084, #2EE9FF)'
                          }}
                        />
                        <div>
                          <p className="font-medium">{station.name}</p>
                          <p className="text-sm text-[#9AA3B2]">/{station.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        station.isActive
                          ? 'bg-[#00D084]/10 text-[#00D084]'
                          : 'bg-[#9AA3B2]/10 text-[#9AA3B2]'
                      }`}>
                        {station.isActive ? (
                          <><Power className="w-3 h-3" /> Active</>
                        ) : (
                          <><PowerOff className="w-3 h-3" /> Inactive</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#9AA3B2]">
                      {station.listenerCount}
                    </td>
                    <td className="px-6 py-4 text-[#9AA3B2]">
                      {station.totalPlays.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-[#9AA3B2]">
                      {formatDate(station.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/station/${station.slug}`}
                          target="_blank"
                          className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#9AA3B2] hover:text-[#F2F5FA] transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#9AA3B2] hover:text-[#F2F5FA] transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#0F1623] border-white/10">
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/admin/stations/edit/${station._id}`}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(station)}>
                              {station.isActive ? (
                                <><PowerOff className="w-4 h-4 mr-2" /> Disable</>
                              ) : (
                                <><Power className="w-4 h-4 mr-2" /> Enable</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setStationToDelete(station)}
                              className="text-red-400 focus:text-red-400"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!stationToDelete} onOpenChange={() => setStationToDelete(null)}>
        <AlertDialogContent className="bg-[#0F1623] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Station</AlertDialogTitle>
            <AlertDialogDescription className="text-[#9AA3B2]">
              Are you sure you want to delete "{stationToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StationsManager;
