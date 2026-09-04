import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { StartupItem, AcademicYear } from '../../types';
import { Plus, Edit, Trash2, Rocket, Search, Globe } from 'lucide-react';

export const AdminStartups: React.FC = () => {
  const [startups, setStartups] = useState<StartupItem[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StartupItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    founderTeam: '',
    department: 'CSE',
    academicYear: '2024–25',
    problemSolved: '',
    productService: '',
    description: '',
    logoUrl: '',
    websiteUrl: '',
    socialMediaUrl: '',
    status: 'Prototype' as StartupItem['status'],
    published: true
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [list, years] = await Promise.all([
        api.adminGetStartups(),
        api.getAcademicYears()
      ]);
      setStartups(list);
      setAcademicYears(years);
    } catch (err) {
      console.error('Failed to load startups:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      founderTeam: '',
      department: 'CSE',
      academicYear: '2024–25',
      problemSolved: '',
      productService: '',
      description: '',
      logoUrl: '',
      websiteUrl: '',
      socialMediaUrl: '',
      status: 'Prototype',
      published: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: StartupItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      founderTeam: item.founderTeam,
      department: item.department || 'CSE',
      academicYear: item.academicYear,
      problemSolved: item.problemSolved || '',
      productService: item.productService || '',
      description: item.description,
      logoUrl: item.logoUrl || '',
      websiteUrl: item.websiteUrl || '',
      socialMediaUrl: item.socialMediaUrl || '',
      status: item.status,
      published: item.published
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.founderTeam) return;

    try {
      if (editingItem) {
        await api.adminUpdateStartup(editingItem.id, formData);
      } else {
        await api.adminAddStartup(formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save startup:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this startup record?')) return;
    try {
      await api.adminDeleteStartup(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete startup:', err);
    }
  };

  const filteredStartups = startups.filter(
    s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.founderTeam.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] tracking-tight">Startups</h1>
            <p className="text-xs text-[#777777] mt-1">
              Manage student campus startups, incubated ventures, and commercial spin-offs.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Startup</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search startups..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#FFFFFF] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
          />
          <Search className="w-4 h-4 text-[#777777] absolute left-2.5 top-2" />
        </div>

        {/* List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#777777]">Loading startups...</div>
        ) : filteredStartups.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-[#242424]">No startups added yet</p>
            <p className="text-xs text-[#777777]">Only display administrator-entered approved content.</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#161616] text-white rounded text-xs font-semibold cursor-pointer"
            >
              + Add Startup
            </button>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#D8D8D3] bg-[#F5F5F3] text-[#777777] font-semibold text-[11px]">
                    <th className="p-3.5">Startup Name</th>
                    <th className="p-3.5">Founder / Team</th>
                    <th className="p-3.5">Product / Service</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBE8]">
                  {filteredStartups.map(item => (
                    <tr key={item.id} className="hover:bg-[#F0F0ED]/50 transition-colors">
                      <td className="p-3.5 font-bold text-[#161616]">{item.name}</td>
                      <td className="p-3.5 font-medium text-[#242424]">{item.founderTeam}</td>
                      <td className="p-3.5 text-[#4A4A4A]">{item.productService || item.description}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-[#F0F0ED] rounded text-[10px] font-bold text-[#4A4A4A]">
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
                  {editingItem ? 'Edit Startup' : 'Add Startup'}
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
                  <label className="font-semibold text-[#242424]">Startup Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EcoGrid Tech Solutions"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Founder / Team *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abhinav S. & Team (S7 EEE)"
                    value={formData.founderTeam}
                    onChange={e => setFormData({ ...formData, founderTeam: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as StartupItem['status'] })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    >
                      <option value="Ideation">Ideation</option>
                      <option value="Prototype">Prototype</option>
                      <option value="Incubated">Incubated</option>
                      <option value="Registered">Registered</option>
                      <option value="Revenue">Revenue</option>
                      <option value="Graduated">Graduated</option>
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
                  <label className="font-semibold text-[#242424]">Product / Service</label>
                  <input
                    type="text"
                    placeholder="e.g. Smart IoT Microgrid Controller"
                    value={formData.productService}
                    onChange={e => setFormData({ ...formData, productService: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the startup venture..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Website URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.websiteUrl}
                      onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Logo Image URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formData.logoUrl}
                      onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    />
                  </div>
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
                      Save Startup
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
