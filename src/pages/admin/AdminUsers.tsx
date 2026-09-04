import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { User, UserRole } from '../../types';
import { Shield, UserCheck, Mail, Check } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await api.adminGetUsers();
      setUsers(res);
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await api.adminUpdateUserRole(userId, newRole);
      setSuccessMsg('User role updated successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
      loadUsers();
    } catch (err) {
      console.error('Failed to update user role:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="pb-4 border-b border-[#D8D8D3]">
          <h1 className="text-2xl font-bold text-[#161616] tracking-tight">Users &amp; Roles</h1>
          <p className="text-xs text-[#777777] mt-1">
            Manage administrative team members and assign content permissions.
          </p>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-700 font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Roles Breakdown Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-4 space-y-1">
            <h3 className="font-bold text-[#161616]">Super Admin</h3>
            <p className="text-[#777777] text-[11px]">Full access to all settings, users, and content editing.</p>
          </div>
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-4 space-y-1">
            <h3 className="font-bold text-[#161616]">Content Admin</h3>
            <p className="text-[#777777] text-[11px]">Homepage, Events, Gallery, News, Workshops, Resources.</p>
          </div>
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-4 space-y-1">
            <h3 className="font-bold text-[#161616]">Team Admin</h3>
            <p className="text-[#777777] text-[11px]">Team roster management and Academic Year history.</p>
          </div>
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-4 space-y-1">
            <h3 className="font-bold text-[#161616]">Achievement Admin</h3>
            <p className="text-[#777777] text-[11px]">Achievements, Student Ideas review, Startups.</p>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#777777]">Loading user directory...</div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#D8D8D3] bg-[#F5F5F3] text-[#777777] font-semibold text-[11px]">
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Role Permission</th>
                    <th className="p-3.5">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBE8]">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-[#F0F0ED]/50 transition-colors">
                      <td className="p-3.5 font-bold text-[#161616]">{u.name}</td>
                      <td className="p-3.5 text-[#4A4A4A]">{u.email}</td>
                      <td className="p-3.5">
                        <select
                          value={u.role}
                          onChange={e => handleRoleChange(u.id, e.target.value as UserRole)}
                          className="px-2.5 py-1 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424] font-medium cursor-pointer"
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="Content Admin">Content Admin</option>
                          <option value="Team Admin">Team Admin</option>
                          <option value="Achievement Admin">Achievement Admin</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-[#777777]">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Recent'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
