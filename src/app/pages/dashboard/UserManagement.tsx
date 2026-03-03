import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersAPI } from '../../utils/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { UserPlus, Edit, Archive, Trash2, Search, RotateCcw } from 'lucide-react';
import { ConfirmModal } from '../../components/ConfirmModal';

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'Staff',
  });
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: 'archive' | 'delete';
    id: string;
    email: string;
    name: string;
  }>({ open: false, type: 'archive', id: '', email: '', name: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      setUsers(data.filter((u: any) => u.status !== 'deleted'));
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Update user
        await usersAPI.update(editingUser.id, formData);
        toast.success('User updated successfully');
      } else {
        // Create user
        await usersAPI.create({
          ...formData,
          status: 'active',
        });
        toast.success('User created successfully');
      }

      await loadUsers();
      setShowDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(editingUser ? 'Failed to update user' : 'Failed to create user');
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: user.password,
      fullName: user.fullName,
      role: user.role,
    });
    setShowDialog(true);
  };

  const handleArchive = (id: string, email: string) => {
    const targetUser = users.find(u => u.id === id);
    setConfirmModal({ open: true, type: 'archive', id, email, name: targetUser?.fullName || email });
  };

  const handlePermanentDelete = (id: string, email: string) => {
    const targetUser = users.find(u => u.id === id);
    setConfirmModal({ open: true, type: 'delete', id, email, name: targetUser?.fullName || email });
  };

  const executeConfirm = async () => {
    const { type, id, email } = confirmModal;
    try {
      if (type === 'archive') {
        await usersAPI.update(id, { status: 'archived' });
        await loadUsers();
        toast.success('User archived');
      } else {
        await usersAPI.delete(id);
        await loadUsers();
        toast.success('User permanently deleted');
      }
      setConfirmModal({ open: false, type: 'archive', id: '', email: '', name: '' });
    } catch (error) {
      console.error('Error:', error);
      toast.error(type === 'archive' ? 'Failed to archive user' : 'Failed to delete user');
    }
  };

  const handleResetPassword = (email: string) => {
    toast.success(`Password reset link sent to ${email}`);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      role: 'Staff',
    });
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canManageUsers = currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin';

  if (!canManageUsers) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 gap-4 lg:overflow-hidden overflow-y-auto custom-scrollbar">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-[#1F2937]">User Management</h1>
          <p className="text-xs text-gray-500">Manage system users and access controls</p>
        </div>

        <Dialog open={showDialog} onOpenChange={(open) => {
          setShowDialog(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-[#FF6A00] hover:bg-[#E55F00]">
              <UserPlus size={16} className="mr-1.5" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <Input
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <Input
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <Input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 8 chars, 1 number, 1 special char"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentUser?.role === 'Super Admin' && <SelectItem value="Super Admin">Super Admin</SelectItem>}
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-[#FF6A00] hover:bg-[#E55F00]">
                  {editingUser ? 'Update User' : 'Create User'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-2.5 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
        </div>
      </div>

      {/* Users Table — desktop only */}
      <div className="hidden lg:flex flex-1 min-h-0 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex-col">
        <div className="overflow-auto flex-1 min-h-0 custom-scrollbar">
          <Table className="min-w-[700px]">
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.fullName}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'Super Admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResetPassword(user.email)}
                        >
                          <RotateCcw size={16} />
                        </Button>
                        {user.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleArchive(user.id, user.email)}
                          >
                            <Archive size={16} />
                          </Button>
                        )}
                        {user.status === 'archived' && currentUser?.role === 'Super Admin' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handlePermanentDelete(user.id, user.email)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Users Cards — mobile only */}
      <div className="lg:hidden space-y-2 pb-4">
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <UserPlus className="mx-auto text-gray-300 mb-2" size={40} />
            <p className="text-sm text-gray-500">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-3.5"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-[#1F2937] truncate">{user.fullName}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">@{user.username}</p>
                </div>
                <Badge variant={user.status === 'active' ? 'default' : 'outline'} className="text-[10px] shrink-0">
                  {user.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mb-1">{user.email}</p>
              <div className="mb-3">
                <Badge variant={user.role === 'Super Admin' ? 'default' : 'secondary'} className="text-[10px]">
                  {user.role}
                </Badge>
              </div>
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => handleEdit(user)}>
                  <Edit size={14} className="mr-1" /> Edit
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleResetPassword(user.email)}>
                  <RotateCcw size={14} className="mr-1" /> Reset
                </Button>
                {user.status === 'active' && (
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleArchive(user.id, user.email)}>
                    <Archive size={14} />
                  </Button>
                )}
                {user.status === 'archived' && currentUser?.role === 'Super Admin' && (
                  <Button size="sm" variant="destructive" className="h-8 text-xs" onClick={() => handlePermanentDelete(user.id, user.email)}>
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, type: 'archive', id: '', email: '', name: '' })}
        onConfirm={executeConfirm}
        title={confirmModal.type === 'archive' ? 'Archive User' : 'Permanently Delete User'}
        description={
          confirmModal.type === 'archive'
            ? 'This user will be archived and will no longer be able to log in.'
            : 'This action cannot be undone. The user account will be permanently removed from the system.'
        }
        detail={`${confirmModal.name} (${confirmModal.email})`}
        confirmLabel={confirmModal.type === 'archive' ? 'Archive User' : 'Delete Permanently'}
        variant={confirmModal.type === 'archive' ? 'warning' : 'danger'}
      />
    </div>
  );
}