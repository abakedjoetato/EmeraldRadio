import { useEffect, useState } from 'react';
import { Plus, Search, Trash2, UserCheck, UserX, Shield, User } from 'lucide-react';
import { adminAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface UserData {
  _id: string;
  username: string;
  role: 'admin' | 'manager' | 'user';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

const UsersManager = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'manager' });
  const [isCreating, setIsCreating] = useState(false);

  const currentUser = useAuthStore(state => state.user);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUser.username.trim() || !newUser.password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsCreating(true);
      await adminAPI.createUser(newUser);
      toast.success('User created successfully');
      setIsCreateDialogOpen(false);
      setNewUser({ username: '', password: '', role: 'manager' });
      fetchUsers();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create user';
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleStatus = async (user: UserData) => {
    try {
      await adminAPI.toggleUser(user._id);
      toast.success(`User ${user.isActive ? 'disabled' : 'enabled'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await adminAPI.deleteUser(userToDelete._id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete user';
      toast.error(message);
    } finally {
      setUserToDelete(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
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
          <h1 className="text-3xl font-bold mb-2">Users</h1>
          <p className="text-[#9AA3B2]">Manage admin and manager accounts</p>
        </div>
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D084] text-[#070B14] rounded-xl font-semibold hover:bg-[#00E090] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9AA3B2]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-12 pr-4 py-3 bg-[#0F1623] border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
        />
      </div>

      {/* Users Table */}
      <div className="bg-[#0F1623] rounded-2xl border border-white/5 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-16 h-16 text-[#9AA3B2] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No users found</h3>
            <p className="text-[#9AA3B2]">
              {searchQuery ? 'Try a different search term' : 'Create your first user'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#9AA3B2]">User</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#9AA3B2]">Role</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#9AA3B2]">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#9AA3B2]">Created</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-[#9AA3B2]">Last Login</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-[#9AA3B2]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          user.role === 'admin'
                            ? 'bg-gradient-to-br from-[#00D084] to-[#00A868]'
                            : 'bg-gradient-to-br from-[#2EE9FF] to-[#00A8CC]'
                        }`}>
                          <span className="font-bold text-sm text-[#070B14]">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          {user._id === currentUser?.id && (
                            <span className="text-xs text-[#00D084]">You</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-[#00D084]/10 text-[#00D084]'
                          : user.role === 'manager'
                          ? 'bg-[#2EE9FF]/10 text-[#2EE9FF]'
                          : 'bg-[#9AA3B2]/10 text-[#9AA3B2]'
                      }`}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {user.role === 'manager' ? 'Moderator' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? 'bg-[#00D084]/10 text-[#00D084]'
                          : 'bg-[#9AA3B2]/10 text-[#9AA3B2]'
                      }`}>
                        {user.isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#9AA3B2]">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-[#9AA3B2]">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {user._id !== currentUser?.id && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                user.isActive
                                  ? 'hover:bg-red-500/10 text-[#9AA3B2] hover:text-red-400'
                                  : 'hover:bg-[#00D084]/10 text-[#9AA3B2] hover:text-[#00D084]'
                              }`}
                              title={user.isActive ? 'Disable' : 'Enable'}
                            >
                              {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => setUserToDelete(user)}
                              className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-[#9AA3B2] hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-[#0F1623] border-white/10">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription className="text-[#9AA3B2]">
              Add a new admin or manager account
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateUser}>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="Enter username"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full px-4 py-3 bg-[#070B14] border border-white/10 rounded-xl focus:outline-none focus:border-[#00D084] transition-colors"
                >
                  <option value="user">Basic User</option>
                  <option value="manager">Moderator (Manager)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsCreateDialogOpen(false)}
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-4 py-2 bg-[#00D084] text-[#070B14] rounded-lg font-medium hover:bg-[#00E090] transition-colors disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create User'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent className="bg-[#0F1623] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-[#9AA3B2]">
              Are you sure you want to delete "{userToDelete?.username}"? This action cannot be undone.
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

export default UsersManager;
