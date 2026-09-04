import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { TeamMember, AcademicYear } from '../../types';
import { INITIAL_DEPARTMENTS } from '../../data/initialData';
import { Plus, Edit, Trash2, Users, Search, Eye, EyeOff, User } from 'lucide-react';

export const AdminTeam: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('2025–26');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [newYearName, setNewYearName] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    roleType: 'Student Lead' as TeamMember['roleType'],
    position: '',
    department: 'CSE',
    designation: '',
    responsibility: '',
    email: '',
    linkedinUrl: '',
    photoUrl: '',
    academicYear: '2025–26',
    status: 'Published' as TeamMember['status'],
    sortOrder: 10
  });

  useEffect(() => {
    loadAcademicYears();
    if (searchParams.get('action') === 'new') {
      handleOpenAdd();
    }
  }, []);

  useEffect(() => {
    loadTeam();
  }, [selectedYear]);

  async function loadAcademicYears() {
    try {
      const years = await api.getAcademicYears();
      setAcademicYears(years);
      if (years.length > 0 && !years.some(y => y.year === selectedYear)) {
        setSelectedYear(years[0].year);
      }
    } catch (err) {
      console.error('Failed to load academic years:', err);
    }
  }

  async function loadTeam() {
    setLoading(true);
    try {
      const members = await api.adminGetTeam(selectedYear);
      setTeamMembers(members);
    } catch (err) {
      console.error('Failed to load team members:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      roleType: 'Student Lead',
      position: '',
      department: 'CSE',
      designation: '',
      responsibility: '',
      email: '',
      linkedinUrl: '',
      photoUrl: '',
      academicYear: selectedYear,
      status: 'Published',
      sortOrder: teamMembers.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      roleType: member.roleType,
      position: member.position,
      department: member.department || 'CSE',
      designation: member.designation || '',
      responsibility: member.responsibility || '',
      email: member.email || '',
      linkedinUrl: member.linkedinUrl || '',
      photoUrl: member.photoUrl || '',
      academicYear: member.academicYear,
      status: member.status,
      sortOrder: member.sortOrder || 10
    });
    setIsModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.position) return;

    try {
      if (editingMember) {
        await api.adminUpdateTeamMember(editingMember.id, formData);
      } else {
        await api.adminAddTeamMember(formData);
      }
      setIsModalOpen(false);
      loadTeam();
    } catch (err) {
      console.error('Failed to save team member:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return;
    try {
      await api.adminDeleteTeamMember(id);
      loadTeam();
    } catch (err) {
      console.error('Failed to delete team member:', err);
    }
  };

  const handleAddYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearName) return;
    try {
      await api.adminAddAcademicYear({ year: newYearName, isCurrent: false });
      setIsYearModalOpen(false);
      setNewYearName('');
      loadAcademicYears();
    } catch (err) {
      console.error('Failed to add academic year:', err);
    }
  };

  const filteredMembers = teamMembers.filter(
    m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.position.toLowerCase().includes(search.toLowerCase()) ||
      (m.department && m.department.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] tracking-tight">Team Management</h1>
            <p className="text-xs text-[#777777] mt-1">
              Manage executive leads, nodal officers, faculty coordinators, and student teams across academic years.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsYearModalOpen(true)}
              className="px-3 py-2 bg-[#F0F0ED] hover:bg-[#EBEBE8] border border-[#D8D8D3] rounded text-xs font-semibold text-[#242424] cursor-pointer"
            >
              + Add Academic Year
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Team Member</span>
            </button>
          </div>
        </div>

        {/* Academic Years Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[#777777]">Academic Year History:</span>
            {academicYears.map(y => (
              <button
                key={y.id}
                onClick={() => setSelectedYear(y.year)}
                className={`px-3 py-1.5 text-xs font-medium rounded cursor-pointer transition-colors ${
                  selectedYear === y.year
                    ? 'bg-[#242424] text-white font-semibold'
                    : 'bg-[#F0F0ED] text-[#4A4A4A] hover:bg-[#EBEBE8]'
                }`}
              >
                {y.year}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search team member..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#FFFFFF] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
            />
            <Search className="w-4 h-4 text-[#777777] absolute left-2.5 top-2" />
          </div>
        </div>

        {/* Team Table */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#777777]">Loading team roster...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-[#242424]">No team members for {selectedYear}</p>
            <p className="text-xs text-[#777777]">Add team members for this academic year cycle.</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#161616] text-white rounded text-xs font-semibold cursor-pointer"
            >
              + Add Team Member
            </button>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#D8D8D3] bg-[#F5F5F3] text-[#777777] font-semibold text-[11px]">
                    <th className="p-3.5">Member</th>
                    <th className="p-3.5">Role Type</th>
                    <th className="p-3.5">Position Title</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBE8]">
                  {filteredMembers.map(member => (
                    <tr key={member.id} className="hover:bg-[#F0F0ED]/50 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F0F0ED] border border-[#D8D8D3] overflow-hidden flex items-center justify-center shrink-0">
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 text-[#777777]" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#161616]">{member.name}</p>
                          <p className="text-[11px] text-[#777777]">{member.email || '—'}</p>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-[#F0F0ED] rounded text-[10px] font-medium text-[#4A4A4A]">
                          {member.roleType}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-[#242424]">{member.position}</td>
                      <td className="p-3.5 text-[#4A4A4A]">{member.department || '—'}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            member.status === 'Published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="p-1 text-[#4A4A4A] hover:text-[#161616] cursor-pointer"
                        >
                          <Edit className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded border border-[#D8D8D3] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#EBEBE8] pb-3">
                <h3 className="font-bold text-base text-[#161616]">
                  {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs text-[#777777] hover:text-[#161616] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. Shahaziya Parvez"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Role Category</label>
                    <select
                      value={formData.roleType}
                      onChange={e =>
                        setFormData({ ...formData, roleType: e.target.value as TeamMember['roleType'] })
                      }
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    >
                      <option value="Nodal Officer">Nodal Officer</option>
                      <option value="Assistant Nodal Officer">Assistant Nodal Officer</option>
                      <option value="Department Coordinator">Department Coordinator</option>
                      <option value="IEDC Lead">IEDC Lead</option>
                      <option value="Student Lead">Student Lead</option>
                      <option value="Women Lead">Women Lead</option>
                      <option value="Executive Lead">Executive Lead</option>
                      <option value="Core Member">Core Member</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Position Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nodal Officer / Finance Lead"
                      value={formData.position}
                      onChange={e => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Department</label>
                    <select
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    >
                      {INITIAL_DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.code}>
                          {d.code} - {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Academic Year</label>
                    <select
                      value={formData.academicYear}
                      onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    >
                      {academicYears.map(y => (
                        <option key={y.id} value={y.year}>
                          {y.year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Photo URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.photoUrl}
                    onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Responsibility / Overview</label>
                  <input
                    type="text"
                    placeholder="Key responsibilities..."
                    value={formData.responsibility}
                    onChange={e => setFormData({ ...formData, responsibility: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-[#EBEBE8] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-[#F0F0ED] hover:bg-[#EBEBE8] rounded text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold"
                  >
                    Save Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Academic Year Modal */}
        {isYearModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded border border-[#D8D8D3] w-full max-w-sm p-6 space-y-4">
              <h3 className="font-bold text-sm text-[#161616]">Add Academic Year Cycle</h3>
              <form onSubmit={handleAddYear} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Academic Year Format *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026–27"
                    value={newYearName}
                    onChange={e => setNewYearName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsYearModalOpen(false)}
                    className="px-3 py-1.5 bg-[#F0F0ED] rounded text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#161616] text-white rounded text-xs font-semibold"
                  >
                    Create Year
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
