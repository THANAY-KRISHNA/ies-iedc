import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { TeamMember, AcademicYear } from '../../types';
import { INITIAL_DEPARTMENTS, ROLE_RESPONSIBILITIES } from '../../data/initialData';
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Search,
  Eye,
  EyeOff,
  User,
  Upload,
  Image as ImageIcon,
  X,
  RefreshCw,
  CheckCircle2,
  Linkedin,
  Mail,
  Sparkles
} from 'lucide-react';

const COMMON_ROLES = [
  'Nodal Officer',
  'Assistant Nodal Officer',
  'Department Coordinator',
  'IEDC Lead',
  'CEO',
  'CFO',
  'CMO',
  'COO',
  'CTO',
  'CCO',
  'IPR & Research Lead',
  'Women Innovation Lead',
  'Community Lead',
  'Quality & Operations',
  'Creative & Innovation',
  'Technology',
  'Branding & Marketing',
  'Web Development',
  'Student Lead',
  'Core Member'
];

export const AdminTeam: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('2025–26');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Archived'>('All');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [newYearName, setNewYearName] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');

  // Photo Upload State
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    roleType: 'CEO',
    position: 'CEO',
    department: 'CSE',
    designation: '',
    responsibility: '',
    email: '',
    linkedinUrl: '',
    photoUrl: '',
    academicYear: '2025–26',
    status: 'Published' as TeamMember['status'],
    sortOrder: 1,
    isFeatured: false
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
        const current = years.find(y => y.isCurrent);
        if (current) setSelectedYear(current.year);
        else setSelectedYear(years[0].year);
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
    setPhotoPreview('');
    setIsCustomRole(false);
    setCustomRoleInput('');
    setFormData({
      name: '',
      roleType: 'CEO',
      position: 'CEO',
      department: 'CSE',
      designation: '',
      responsibility: ROLE_RESPONSIBILITIES['CEO'] || '',
      email: '',
      linkedinUrl: '',
      photoUrl: '',
      academicYear: selectedYear,
      status: 'Published',
      sortOrder: teamMembers.length + 1,
      isFeatured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setPhotoPreview(member.photoUrl || '');
    const isCustom = !COMMON_ROLES.includes(member.roleType);
    setIsCustomRole(isCustom);
    setCustomRoleInput(isCustom ? member.roleType : '');
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
      sortOrder: member.sortOrder || 1,
      isFeatured: member.isFeatured || false
    });
    setIsModalOpen(true);
  };

  // Image Upload Handler
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPhotoPreview(dataUrl);
      setFormData(prev => ({ ...prev, photoUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview('');
    setFormData(prev => ({ ...prev, photoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter member full name.');
      return;
    }

    const finalRole = isCustomRole ? customRoleInput.trim() || 'Custom Role' : formData.roleType;

    const payload: Omit<TeamMember, 'id'> = {
      ...formData,
      roleType: finalRole,
      position: formData.position || finalRole,
      photoUrl: photoPreview || formData.photoUrl
    };

    try {
      if (editingMember) {
        await api.adminUpdateTeamMember(editingMember.id, payload);
      } else {
        await api.adminAddTeamMember(payload);
      }
      setIsModalOpen(false);
      if (formData.academicYear !== selectedYear) {
        setSelectedYear(formData.academicYear);
      } else {
        loadTeam();
      }
    } catch (err) {
      console.error('Failed to save team member:', err);
      alert('Error saving team member. Please try again.');
    }
  };

  const handleToggleStatus = async (member: TeamMember) => {
    const nextStatus: TeamMember['status'] = member.status === 'Published' ? 'Archived' : 'Published';
    try {
      await api.adminUpdateTeamMember(member.id, { status: nextStatus });
      loadTeam();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this team member record?')) return;
    try {
      await api.adminDeleteTeamMember(id);
      loadTeam();
    } catch (err) {
      console.error('Failed to delete team member:', err);
    }
  };

  const handleAddYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearName.trim()) return;
    try {
      await api.adminAddAcademicYear({ year: newYearName.trim(), isCurrent: false });
      setIsYearModalOpen(false);
      setNewYearName('');
      loadAcademicYears();
    } catch (err) {
      console.error('Failed to add academic year:', err);
    }
  };

  const filteredMembers = teamMembers.filter(m => {
    const matchesSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.position.toLowerCase().includes(search.toLowerCase()) ||
      m.roleType.toLowerCase().includes(search.toLowerCase()) ||
      (m.department && m.department.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === 'All' || m.roleType === roleFilter;
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans text-[#161616]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#161616]">Team CMS &amp; Roster Management</h1>
            <p className="text-xs text-[#777777] mt-1">
              Add and manage IEDC executive leads, nodal officers, and departmental team members with direct profile photo uploads.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsYearModalOpen(true)}
              className="px-3.5 py-2 bg-[#F0F0ED] hover:bg-[#EBEBE8] border border-[#D8D8D3] rounded-xl text-xs font-bold text-[#242424] cursor-pointer transition-colors"
            >
              + Add Academic Year
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Team Member</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#D8D8D3] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Academic Year Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">Academic Year:</span>
              {academicYears.map(y => (
                <button
                  key={y.id}
                  onClick={() => setSelectedYear(y.year)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    selectedYear === y.year
                      ? 'bg-[#161616] text-white shadow-sm'
                      : 'bg-[#F0F0ED] text-[#4A4A4A] hover:bg-[#EBEBE8]'
                  }`}
                >
                  {y.year}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search member by name, role, dept..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded-xl text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
              />
              <Search className="w-4 h-4 text-[#777777] absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-[#EBEBE8]">
            <div className="flex items-center gap-2">
              <span className="text-[#777777] font-semibold">Status:</span>
              {(['All', 'Published', 'Archived'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#242424] text-white'
                      : 'bg-[#F0F0ED] text-[#777777] hover:text-[#161616]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Team Roster Table */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#777777] font-medium">Loading team roster...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded-2xl p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-[#777777] mx-auto" />
            <p className="text-sm font-bold text-[#161616]">No team members found for {selectedYear}</p>
            <p className="text-xs text-[#777777]">Add team members to construct the role hierarchy for this cycle.</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#161616] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              + Add Team Member
            </button>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#D8D8D3] bg-[#F5F5F3] text-[#777777] font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="p-4">Profile Photo &amp; Name</th>
                    <th className="p-4">IEDC Role</th>
                    <th className="p-4">Position Title</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBE8]">
                  {filteredMembers.map(member => (
                    <tr key={member.id} className="hover:bg-[#F0F0ED]/50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#F0F0ED] border border-[#D8D8D3] overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-[#777777]" />
                          )}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#161616] text-sm">{member.name}</p>
                          <p className="text-[11px] text-[#777777]">{member.email || 'No email specified'}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-[#161616] text-white rounded-lg text-[10px] font-bold">
                          {member.roleType}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-[#242424]">{member.position}</td>
                      <td className="p-4 text-[#4A4A4A] font-medium">{member.department || '—'}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(member)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border cursor-pointer transition-colors ${
                            member.status === 'Published'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                          }`}
                        >
                          {member.status === 'Published' ? '● Published' : '○ Archived'}
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="p-2 bg-[#F0F0ED] hover:bg-[#EBEBE8] text-[#242424] rounded-lg cursor-pointer transition-colors"
                          title="Edit Member"
                        >
                          <Edit className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer transition-colors"
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

        {/* Add / Edit Team Member Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl border border-[#D8D8D3] w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#EBEBE8] pb-4">
                <div>
                  <span className="text-[10px] font-extrabold text-[#777777] uppercase tracking-wider">CMS Team Editor</span>
                  <h3 className="font-extrabold text-lg text-[#161616]">
                    {editingMember ? `Edit Team Member: ${editingMember.name}` : 'Add New Team Member'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-[#777777] hover:text-[#161616] rounded-lg hover:bg-[#F0F0ED] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMember} className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                {/* Left Column - Form Fields (8 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* SECTION 1: PROFILE PHOTO UPLOAD */}
                  <div className="space-y-2 bg-[#F5F5F3] p-4 rounded-xl border border-[#D8D8D3]">
                    <label className="font-bold text-[#161616] text-xs flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#161616]" />
                      <span>Member Profile Photo *</span>
                    </label>

                    {/* Drag and Drop Zone */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                        isDragging ? 'border-[#161616] bg-[#FFFFFF]' : 'border-[#D8D8D3] bg-[#FFFFFF] hover:border-[#777777]'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                        className="hidden"
                      />

                      {photoPreview ? (
                        <div className="flex items-center justify-between gap-4">
                          <div className="w-16 h-20 rounded-lg overflow-hidden border border-[#D8D8D3] bg-[#EBEBE8] shrink-0">
                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-bold text-[#161616] text-xs">Photo Uploaded Successfully</p>
                            <p className="text-[10px] text-[#777777] mt-0.5">Click replace or choose another image.</p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                              className="px-2.5 py-1.5 bg-[#F0F0ED] hover:bg-[#EBEBE8] text-[#161616] font-bold rounded text-[11px]"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemovePhoto(); }}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded text-[11px]"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1 py-2">
                          <Upload className="w-6 h-6 text-[#777777] mx-auto" />
                          <p className="font-bold text-[#161616] text-xs">Drag &amp; Drop Photo Here or <span className="underline">Browse</span></p>
                          <p className="text-[10px] text-[#777777]">JPG, PNG, WEBP. Max size 5MB.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECTION 2: BASIC INFORMATION */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-[#161616] text-xs uppercase tracking-wider text-[#777777]">Basic Member Data</h4>
                    
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#242424]">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Prof. Shahaziya Parvez / Ajmal P R"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded-xl text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#242424]">Department</label>
                        <select
                          value={formData.department}
                          onChange={e => setFormData({ ...formData, department: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded-xl text-xs"
                        >
                          {INITIAL_DEPARTMENTS.map(d => (
                            <option key={d.id} value={d.code}>
                              {d.code} - {d.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-[#242424]">Designation / Position Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. CEO / Nodal Officer / HOD"
                          value={formData.position}
                          onChange={e => setFormData({ ...formData, position: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: IEDC ROLE */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-[#161616] text-xs uppercase tracking-wider text-[#777777]">IEDC Role Category</h4>
                    
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#242424]">Select Role</label>
                      <select
                        value={isCustomRole ? 'CUSTOM' : formData.roleType}
                        onChange={e => {
                          if (e.target.value === 'CUSTOM') {
                            setIsCustomRole(true);
                          } else {
                            setIsCustomRole(false);
                            const selectedRole = e.target.value;
                            setFormData({
                              ...formData,
                              roleType: selectedRole,
                              responsibility: formData.responsibility || ROLE_RESPONSIBILITIES[selectedRole] || ''
                            });
                          }
                        }}
                        className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded-xl text-xs"
                      >
                        {COMMON_ROLES.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                        <option value="CUSTOM">+ Add Custom Role Name</option>
                      </select>
                    </div>

                    {isCustomRole && (
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#242424]">Custom Role Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Innovation &amp; Hackathon Lead"
                          value={customRoleInput}
                          onChange={e => setCustomRoleInput(e.target.value)}
                          className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded-xl text-xs"
                        />
                      </div>
                    )}
                  </div>

                  {/* SECTION 4: RESPONSIBILITY & ACADEMIC YEAR */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#242424]">Academic Year</label>
                      <select
                        value={formData.academicYear}
                        onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                        className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded-xl text-xs"
                      >
                        {academicYears.map(y => (
                          <option key={y.id} value={y.year}>{y.year}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-[#242424]">Status</label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as TeamMember['status'] })}
                        className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded-xl text-xs font-bold"
                      >
                        <option value="Published">Published (Active on Team Page)</option>
                        <option value="Archived">Archived (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-[#242424]">Responsibility Summary</label>
                    <textarea
                      rows={2}
                      placeholder="Coordinates overall student activities..."
                      value={formData.responsibility}
                      onChange={e => setFormData({ ...formData, responsibility: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded-xl text-xs"
                    />
                  </div>

                  {/* SECTION 5: CONTACT & SOCIAL LINKS */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#242424]">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="member@iesce.info"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-[#242424]">LinkedIn Profile (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        value={formData.linkedinUrl}
                        onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Live Card Preview (5 cols) */}
                <div className="lg:col-span-5 space-y-4 bg-[#F5F5F3] p-5 rounded-2xl border border-[#D8D8D3] flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#D8D8D3]">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#777777] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#161616]" />
                        Live Member Card Preview
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#161616] text-white rounded font-bold">Public View</span>
                    </div>

                    {/* Preview Card Box */}
                    <div className="neu-raised rounded-2xl overflow-hidden border border-[#D8D8D3] bg-[#FFFFFF] space-y-3 p-4">
                      <div className="w-full h-48 rounded-xl overflow-hidden bg-[#EBEBE8] border border-[#D8D8D3] relative">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#777777] space-y-1">
                            <User className="w-10 h-10" />
                            <span className="text-[10px] font-semibold">No Photo Uploaded</span>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2">
                          <span className="px-2 py-0.5 bg-[#161616] text-white text-[10px] font-bold rounded">
                            {isCustomRole ? customRoleInput || 'Role' : formData.roleType}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-base text-[#161616]">{formData.name || 'Member Name'}</h4>
                        <p className="text-xs font-semibold text-[#777777]">{formData.position || 'Position Title'}</p>
                        <p className="text-[11px] text-[#4A4A4A] italic pt-1 border-t border-[#EBEBE8] mt-2">
                          "{formData.responsibility || 'Key responsibility description will appear here...'}"
                        </p>
                      </div>

                      {formData.email && (
                        <div className="pt-2 border-t border-[#EBEBE8] text-[10px] text-[#777777] flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{formData.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="pt-4 border-t border-[#D8D8D3] flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-[#FFFFFF] hover:bg-[#EBEBE8] border border-[#D8D8D3] rounded-xl text-xs font-bold text-[#242424] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded-xl text-xs font-extrabold cursor-pointer shadow-md"
                    >
                      Save &amp; Publish Member
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Academic Year Modal */}
        {isYearModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-[#D8D8D3] w-full max-w-sm p-6 space-y-4 shadow-2xl">
              <h3 className="font-extrabold text-sm text-[#161616]">Add Academic Year Cycle</h3>
              <form onSubmit={handleAddYear} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#242424]">Academic Year Format *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026–27"
                    value={newYearName}
                    onChange={e => setNewYearName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded-xl text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsYearModalOpen(false)}
                    className="px-3.5 py-2 bg-[#F0F0ED] rounded-xl text-xs font-bold text-[#242424]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#161616] text-white rounded-xl text-xs font-bold"
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

