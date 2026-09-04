import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingState } from '../../components/ui/LoadingState';
import { api } from '../../services/api';
import { Achievement, AcademicYear } from '../../types';
import { Plus, Edit2, Trash2, ShieldCheck, Trophy } from 'lucide-react';

export const AdminAchievements: React.FC = () => {
  const { hasRole } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);

  // Form
  const [formData, setFormData] = useState({
    title: '',
    academicYear: '2024–25',
    recipients: '',
    category: 'State Level Recognition',
    description: '',
    verificationInfo: 'Verified by IEDC Nodal Officer via KSUM Records',
    published: true
  });

  const isAuthorized = hasRole(['Achievement Admin']);

  useEffect(() => {
    loadAcademicYears();
    loadAchievements();
  }, [selectedYear]);

  async function loadAcademicYears() {
    try {
      const years = await api.getAcademicYears();
      setAcademicYears(years);
    } catch (err) {
      console.error('Failed to load years:', err);
    }
  }

  async function loadAchievements() {
    setLoading(true);
    try {
      const data = await api.adminGetAchievements();
      setAchievements(data);
    } catch (err) {
      console.error('Failed to load achievements:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      academicYear: '2024–25',
      recipients: '',
      category: 'State Level Recognition',
      description: '',
      verificationInfo: 'Verified by IEDC Nodal Officer via KSUM Records',
      published: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ach: Achievement) => {
    setEditingItem(ach);
    setFormData({
      title: ach.title,
      academicYear: ach.academicYear,
      recipients: ach.recipients,
      category: ach.category,
      description: ach.description,
      verificationInfo: ach.verificationInfo || '',
      published: ach.published
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.recipients) return;

    try {
      if (editingItem) {
        await api.adminUpdateAchievement(editingItem.id, formData);
      } else {
        await api.adminAddAchievement(formData);
      }
      setIsModalOpen(false);
      loadAchievements();
    } catch (err) {
      console.error('Failed to save achievement:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this verified achievement record?')) return;
    try {
      await api.adminDeleteAchievement(id);
      loadAchievements();
    } catch (err) {
      console.error('Failed to delete achievement:', err);
    }
  };

  const handleTogglePublish = async (ach: Achievement) => {
    try {
      await api.adminUpdateAchievement(ach.id, { published: !ach.published });
      loadAchievements();
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  };

  const filtered = achievements.filter(a => {
    return selectedYear === 'All' || a.academicYear === selectedYear;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D8D8D3]">
        <div>
          <h1 className="text-2xl font-black text-[#161616] tracking-tight">
            Achievements &amp; Recognitions Cell
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            Audit and publish verified awards, YIP state grants, and hackathon finalists.
          </p>
        </div>

        {isAuthorized && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Achievement Record
          </Button>
        )}
      </div>

      {/* Year Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#777777] uppercase mr-2">Cycle:</span>
        <button
          onClick={() => setSelectedYear('All')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            selectedYear === 'All'
              ? 'neu-button'
              : 'neu-raised-soft text-[#4A4A4A] hover:text-[#161616]'
          }`}
        >
          All Years
        </button>
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
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <LoadingState message="Loading achievements..." />
      ) : (
        <div className="neu-raised rounded-xl overflow-hidden border border-[#D8D8D3]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#D8D8D3] bg-[#EBEBE8]/50 text-[#777777] uppercase tracking-wider text-[10px]">
                  <th className="p-3.5 font-bold">Achievement Title</th>
                  <th className="p-3.5 font-bold">Recipients</th>
                  <th className="p-3.5 font-bold">Academic Cycle</th>
                  <th className="p-3.5 font-bold">Verification Note</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBE8]">
                {filtered.map(ach => (
                  <tr key={ach.id} className="hover:bg-[#EBEBE8]/20 transition-colors">
                    <td className="p-3.5 font-bold text-[#161616] max-w-xs">{ach.title}</td>
                    <td className="p-3.5 text-[#242424]">{ach.recipients}</td>
                    <td className="p-3.5">
                      <Badge variant="neutral" size="sm">
                        {ach.academicYear}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-[#777777] max-w-xs truncate">
                      {ach.verificationInfo || 'Verified'}
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleTogglePublish(ach)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer border ${
                          ach.published
                            ? 'bg-[#EFEFEA] text-[#1E3A1E] border-[#C5D5C5]'
                            : 'bg-[#F2DFDF] text-[#772222] border-[#D8A8A8]'
                        }`}
                      >
                        {ach.published ? 'Published' : 'Hidden'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(ach)}
                        className="p-1 text-[#4A4A4A] hover:text-[#161616] cursor-pointer"
                        title="Edit Achievement"
                      >
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(ach.id)}
                        className="p-1 text-red-700 hover:text-red-900 cursor-pointer"
                        title="Delete Achievement"
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Achievement Record' : 'Record Verified Achievement'}
        subtitle="Policy rule: Only verified official recognitions may be published."
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Title / Award Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Young Innovators Programme (YIP) 2024 Shortlist"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Academic Year</label>
              <select
                value={formData.academicYear}
                onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 neu-raised-soft border border-[#D8D8D3] rounded-lg text-xs"
              >
                {academicYears.map(y => (
                  <option key={y.id} value={y.year}>
                    {y.year}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Recipients / Student Innovators *</label>
            <input
              type="text"
              required
              placeholder="e.g. College of Engineering Student Innovators Team"
              value={formData.recipients}
              onChange={e => setFormData({ ...formData, recipients: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Official Verification Source *</label>
            <input
              type="text"
              required
              placeholder="e.g. KSUM Evaluation Panel Official Memo #1024"
              value={formData.verificationInfo}
              onChange={e => setFormData({ ...formData, verificationInfo: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={e => setFormData({ ...formData, published: e.target.checked })}
                className="rounded cursor-pointer"
              />
              <span>Published on Website</span>
            </label>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Record
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
