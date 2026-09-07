import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { useRealtimeSync } from '../../services/realtime';
import { Achievement, AcademicYear } from '../../types';
import { INITIAL_DEPARTMENTS } from '../../data/initialData';
import { Plus, Edit, Trash2, Award, Search } from 'lucide-react';

export const AdminAchievements: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    academicYear: '2024–25',
    category: 'Hackathon Winners' as Achievement['category'],
    recipients: '',
    description: '',
    dateAwarded: '',
    certificateUrl: '',
    imageUrl: '',
    published: true
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [list, years] = await Promise.all([
        api.adminGetAchievements(),
        api.getAcademicYears()
      ]);
      setAchievements(list);
      setAcademicYears(years);
    } catch (err) {
      console.error('Failed to load achievements data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    if (searchParams.get('action') === 'new') {
      handleOpenAdd();
    }
  }, [loadData]);

  useRealtimeSync(['achievements', 'academicYears'], loadData);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      academicYear: '2024–25',
      category: 'Hackathon Winners',
      recipients: '',
      description: '',
      dateAwarded: new Date().toISOString().split('T')[0],
      certificateUrl: '',
      imageUrl: '',
      published: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Achievement) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      academicYear: item.academicYear,
      category: item.category,
      recipients: item.recipients,
      description: item.description,
      dateAwarded: item.dateAwarded || '',
      certificateUrl: item.certificateUrl || '',
      imageUrl: item.imageUrl || '',
      published: item.published
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
      loadData();
    } catch (err) {
      console.error('Failed to save achievement:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this achievement record?')) return;
    try {
      await api.adminDeleteAchievement(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete achievement:', err);
    }
  };

  const filteredAchievements = achievements.filter(
    a =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.recipients.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] tracking-tight">Achievements</h1>
            <p className="text-xs text-[#777777] mt-1">
              Record verified student competition awards, hackathon wins, grants, and recognitions.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Achievement</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search achievements..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#FFFFFF] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
          />
          <Search className="w-4 h-4 text-[#777777] absolute left-2.5 top-2" />
        </div>

        {/* List Table */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#777777]">Loading achievements...</div>
        ) : filteredAchievements.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-[#242424]">No achievement records found</p>
            <p className="text-xs text-[#777777]">Only administrator-entered/approved information is published.</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#161616] text-white rounded text-xs font-semibold cursor-pointer"
            >
              + Add Achievement
            </button>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#D8D8D3] bg-[#F5F5F3] text-[#777777] font-semibold text-[11px]">
                    <th className="p-3.5">Achievement Title</th>
                    <th className="p-3.5">Student / Team</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Year</th>
                    <th className="p-3.5">Visibility</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBE8]">
                  {filteredAchievements.map(item => (
                    <tr key={item.id} className="hover:bg-[#F0F0ED]/50 transition-colors">
                      <td className="p-3.5 font-bold text-[#161616] max-w-xs">{item.title}</td>
                      <td className="p-3.5 font-medium text-[#242424]">{item.recipients}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-[#F0F0ED] rounded text-[10px] font-medium text-[#4A4A4A]">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-[#242424]">{item.academicYear}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.published
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {item.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1 text-[#4A4A4A] hover:text-[#161616] cursor-pointer"
                        >
                          <Edit className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
                  {editingItem ? 'Edit Achievement' : 'Add Achievement'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs text-[#777777] hover:text-[#161616] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Achievement Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1st Place - Smart India Hackathon"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Student / Team Members *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul V., Ananya K., Muhammed Shafi (S7 CSE)"
                    value={formData.recipients}
                    onChange={e => setFormData({ ...formData, recipients: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value as Achievement['category'] })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    >
                      <option value="Hackathon Winners">Hackathon Winners</option>
                      <option value="Startup Achievements">Startup Achievements</option>
                      <option value="Idea Competitions">Idea Competitions</option>
                      <option value="Awards">Awards</option>
                      <option value="Patents">Patents</option>
                      <option value="Funded Projects">Funded Projects</option>
                      <option value="Incubated Startups">Incubated Startups</option>
                      <option value="External Recognitions">External Recognitions</option>
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
                  <label className="font-semibold text-[#242424]">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Details about the competition and result..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Photo URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formData.imageUrl}
                      onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Certificate URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formData.certificateUrl}
                      onChange={e => setFormData({ ...formData, certificateUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EBEBE8] flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={e => setFormData({ ...formData, published: e.target.checked })}
                      className="rounded"
                    />
                    <span>Publish Immediately</span>
                  </label>

                  <div className="flex gap-2">
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
                      Save Achievement
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
