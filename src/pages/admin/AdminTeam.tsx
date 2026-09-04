import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { SearchFilterBar } from '../../components/ui/SearchFilterBar';
import { LoadingState } from '../../components/ui/LoadingState';
import { api } from '../../services/api';
import { TeamMember, AcademicYear } from '../../types';
import { INITIAL_DEPARTMENTS } from '../../data/initialData';
import { Plus, Edit2, Trash2, Shield, Users, Mail } from 'lucide-react';

export const AdminTeam: React.FC = () => {
  const { hasRole } = useAuth();
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
    academicYear: '2025–26',
    status: 'Published' as TeamMember['status'],
    sortOrder: 10
  });

  const isAuthorized = hasRole(['Team Admin']);

  useEffect(() => {
    loadAcademicYears();
  }, []);

  useEffect(() => {
    loadTeam();
  }, [selectedYear]);

  async function loadAcademicYears() {
    try {
      const years = await api.getAcademicYears();
      setAcademicYears(years);
    } catch (err) {
      console.error('Failed to load years:', err);
    }
  }

  async function loadTeam() {
    setLoading(true);
    try {
      const members = await api.adminGetTeam(selectedYear);
      setTeamMembers(members);
    } catch (err) {
      console.error('Failed to load team:', err);
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
    if (!window.confirm('Are you sure you want to remove this team member record?')) return;
    try {
      await api.adminDeleteTeamMember(id);
      loadTeam();
    } catch (err) {
      console.error('Failed to delete member:', err);
    }
  };

  const handleAddYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearName) return;
    try {
      await api.adminAddAcademicYear({ year: newYearName, notes: 'Archived Academic Cycle' });
      setIsYearModalOpen(false);
      setNewYearName('');
      loadAcademicYears();
    } catch (err) {
      console.error('Failed to add academic year:', err);
    }
  };

  const filteredMembers = teamMembers.filter(m => {
    return (
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.position.toLowerCase().includes(search.toLowerCase()) ||
      (m.department && m.department.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D8D8D3]">
        <div>
          <h1 className="text-2xl font-black text-[#161616] tracking-tight">
            Team &amp; Academic Archives
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            Manage institutional nodal officers, department faculty coordinators, and student leads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAuthorized && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsYearModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                New Academic Year
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenAdd}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Member
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Year Selection & Search */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#777777] uppercase mr-2">Cycle:</span>
          {academicYears.map(y => (
            <button
              key={y.id}
              onClick={() => setSelectedYear(y.year)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedYear === y.year
                  ? 'neu-button'
                  : 'neu-raised-soft text-[#4A4A4A] hover:text-[#161616]'
              }`}
            >
              {y.year}
              {y.isCurrent && (
                <span className="ml-1 text-[10px] px-1 py-0.2 bg-[#242424] text-white rounded">
                  Current
                </span>
              )}
            </button>
          ))}
        </div>

        <SearchFilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Filter members in this cycle by name, position, or department..."
        />
      </div>

      {/* Table of Team Members */}
      {loading ? (
        <LoadingState message="Loading team member records..." />
      ) : (
        <div className="neu-raised rounded-xl overflow-hidden border border-[#D8D8D3]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#D8D8D3] bg-[#EBEBE8]/50 text-[#777777] uppercase tracking-wider text-[10px]">
                  <th className="p-3.5 font-bold">Member Name</th>
                  <th className="p-3.5 font-bold">Role Type</th>
                  <th className="p-3.5 font-bold">Position</th>
                  <th className="p-3.5 font-bold">Department</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBE8]">
                {filteredMembers.map(member => (
                  <tr key={member.id} className="hover:bg-[#EBEBE8]/20 transition-colors">
                    <td className="p-3.5 font-bold text-[#161616]">
                      {member.name}
                      {member.email && (
                        <span className="block text-[10px] text-[#777777] font-normal">
                          {member.email}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <Badge variant="outline" size="sm">
                        {member.roleType}
                      </Badge>
                    </td>
                    <td className="p-3.5 font-medium text-[#242424]">{member.position}</td>
                    <td className="p-3.5 text-[#4A4A4A]">{member.department || '—'}</td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          member.status === 'Published'
                            ? 'success'
                            : member.status === 'Archived'
                            ? 'neutral'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {member.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="p-1 text-[#4A4A4A] hover:text-[#161616] cursor-pointer"
                        title="Edit Member"
                      >
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-1 text-red-700 hover:text-red-900 cursor-pointer"
                        title="Delete Member"
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
        subtitle={`Academic Year Cycle: ${selectedYear}`}
      >
        <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Role Category</label>
              <select
                value={formData.roleType}
                onChange={e =>
                  setFormData({ ...formData, roleType: e.target.value as TeamMember['roleType'] })
                }
                className="w-full px-3 py-2 neu-raised-soft border border-[#D8D8D3] rounded-lg text-xs"
              >
                <option value="Nodal Officer">Nodal Officer</option>
                <option value="Assistant Nodal Officer">Assistant Nodal Officer</option>
                <option value="Department Coordinator">Department Coordinator</option>
                <option value="IEDC Lead">IEDC Lead</option>
                <option value="Student Lead">Student Lead</option>
                <option value="Executive Member">Executive Member</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Position Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Creative Lead / Nodal Officer"
                value={formData.position}
                onChange={e => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Department</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 neu-raised-soft border border-[#D8D8D3] rounded-lg text-xs"
              >
                {INITIAL_DEPARTMENTS.map(d => (
                  <option key={d.id} value={d.code}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Designation / Sem</label>
              <input
                type="text"
                placeholder="e.g. Assistant Professor, CSE or S5 CSE"
                value={formData.designation}
                onChange={e => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Institutional Email</label>
            <input
              type="email"
              placeholder="name@iesce.info"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Key Responsibilities / Role Description</label>
            <textarea
              rows={2}
              placeholder="Brief description of duties..."
              value={formData.responsibility}
              onChange={e => setFormData({ ...formData, responsibility: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Status</label>
              <select
                value={formData.status}
                onChange={e =>
                  setFormData({ ...formData, status: e.target.value as TeamMember['status'] })
                }
                className="w-full px-3 py-2 neu-raised-soft border border-[#D8D8D3] rounded-lg text-xs"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Display Sort Order</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 10 })}
                className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Academic Year Modal */}
      <Modal
        isOpen={isYearModalOpen}
        onClose={() => setIsYearModalOpen(false)}
        title="Add Academic Year Archive"
        subtitle="Create an academic cycle archive for team leadership and events."
      >
        <form onSubmit={handleAddYear} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Academic Year Format *</label>
            <input
              type="text"
              required
              placeholder="e.g. 2026–27"
              value={newYearName}
              onChange={e => setNewYearName(e.target.value)}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsYearModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Year
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
