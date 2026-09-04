import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { WorkshopItem, AcademicYear } from '../../types';
import { Plus, Edit, Trash2, BookOpen, Search, Eye } from 'lucide-react';

export const AdminWorkshops: React.FC = () => {
  const [workshops, setWorkshops] = useState<WorkshopItem[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkshopItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    academicYear: '2024–25',
    date: new Date().toISOString().split('T')[0],
    venue: 'CCF Lab 2, IESCE',
    isOnline: false,
    speakersText: '',
    description: '',
    topicsText: '',
    registrationUrl: '',
    certificateProvided: true,
    learningMaterialsUrl: '',
    status: 'Upcoming' as WorkshopItem['status'],
    published: true
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [list, years] = await Promise.all([
        api.adminGetWorkshops(),
        api.getAcademicYears()
      ]);
      setWorkshops(list);
      setAcademicYears(years);
    } catch (err) {
      console.error('Failed to load workshops:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      academicYear: '2024–25',
      date: new Date().toISOString().split('T')[0],
      venue: 'CCF Lab 2, IESCE',
      isOnline: false,
      speakersText: '',
      description: '',
      topicsText: 'IoT, Microcontrollers, Embedded C',
      registrationUrl: '',
      certificateProvided: true,
      learningMaterialsUrl: '',
      status: 'Upcoming',
      published: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: WorkshopItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      academicYear: item.academicYear,
      date: item.date,
      venue: item.venue,
      isOnline: !!item.isOnline,
      speakersText: item.speakers ? item.speakers.join(', ') : '',
      description: item.description,
      topicsText: item.topicsCovered ? item.topicsCovered.join(', ') : '',
      registrationUrl: item.registrationUrl || '',
      certificateProvided: !!item.certificateProvided,
      learningMaterialsUrl: item.learningMaterialsUrl || '',
      status: item.status,
      published: item.published
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    const speakers = formData.speakersText.split(',').map(s => s.trim()).filter(Boolean);
    const topicsCovered = formData.topicsText.split(',').map(t => t.trim()).filter(Boolean);

    const payload: Partial<WorkshopItem> = {
      title: formData.title,
      academicYear: formData.academicYear,
      date: formData.date,
      venue: formData.venue,
      isOnline: formData.isOnline,
      speakers,
      description: formData.description,
      topicsCovered,
      registrationUrl: formData.registrationUrl,
      certificateProvided: formData.certificateProvided,
      learningMaterialsUrl: formData.learningMaterialsUrl,
      status: formData.status,
      published: formData.published
    };

    try {
      if (editingItem) {
        await api.adminUpdateWorkshop(editingItem.id, payload);
      } else {
        await api.adminAddWorkshop(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save workshop:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this workshop?')) return;
    try {
      await api.adminDeleteWorkshop(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete workshop:', err);
    }
  };

  const filteredWorkshops = workshops.filter(w =>
    w.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] tracking-tight">Workshops</h1>
            <p className="text-xs text-[#777777] mt-1">
              Manage technical workshops, skill development sessions, and hands-on masterclasses.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Workshop</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search workshops..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#FFFFFF] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
          />
          <Search className="w-4 h-4 text-[#777777] absolute left-2.5 top-2" />
        </div>

        {/* List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#777777]">Loading workshops...</div>
        ) : filteredWorkshops.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-[#242424]">No workshops recorded</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#161616] text-white rounded text-xs font-semibold cursor-pointer"
            >
              + Add Workshop
            </button>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#D8D8D3] bg-[#F5F5F3] text-[#777777] font-semibold text-[11px]">
                    <th className="p-3.5">Workshop Name</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Venue</th>
                    <th className="p-3.5">Speakers</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBE8]">
                  {filteredWorkshops.map(item => (
                    <tr key={item.id} className="hover:bg-[#F0F0ED]/50 transition-colors">
                      <td className="p-3.5 font-bold text-[#161616]">{item.title}</td>
                      <td className="p-3.5 font-medium text-[#242424]">{item.date}</td>
                      <td className="p-3.5 text-[#4A4A4A]">{item.venue}</td>
                      <td className="p-3.5 text-[#4A4A4A]">
                        {item.speakers ? item.speakers.join(', ') : '—'}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'Upcoming'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {item.status}
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
                  {editingItem ? 'Edit Workshop' : 'Add Workshop'}
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
                  <label className="font-semibold text-[#242424]">Workshop Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Embedded Systems & IoT Workshop"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    />
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
                  <label className="font-semibold text-[#242424]">Venue *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Seminar Hall / Online"
                    value={formData.venue}
                    onChange={e => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Speaker / Mentor</label>
                  <input
                    type="text"
                    placeholder="e.g. Er. Febin M F, IoT Specialist"
                    value={formData.speakersText}
                    onChange={e => setFormData({ ...formData, speakersText: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Workshop details and objectives..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Registration URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.registrationUrl}
                    onChange={e => setFormData({ ...formData, registrationUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="pt-3 border-t border-[#EBEBE8] flex items-center justify-between">
                  <label className="flex items-center gap-2 font-semibold cursor-pointer">
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
                      Save Workshop
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
