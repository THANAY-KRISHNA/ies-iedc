import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { ResourceItem } from '../../types';
import { Plus, Edit, Trash2, FolderDown, ExternalLink, Search } from 'lucide-react';

export const AdminResources: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResourceItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Startup Guides' as ResourceItem['category'],
    description: '',
    authorOrSource: 'IES IEDC & KSUM',
    linkUrl: '',
    published: true
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const list = await api.adminGetResources();
      setResources(list);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Startup Guides',
      description: '',
      authorOrSource: 'IES IEDC & KSUM',
      linkUrl: '',
      published: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ResourceItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      authorOrSource: item.authorOrSource || 'IES IEDC & KSUM',
      linkUrl: item.linkUrl || '',
      published: item.published
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    try {
      if (editingItem) {
        await api.adminUpdateResource(editingItem.id, formData);
      } else {
        await api.adminAddResource(formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save resource:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await api.adminDeleteResource(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete resource:', err);
    }
  };

  const filteredResources = resources.filter(
    r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] tracking-tight">Resources</h1>
            <p className="text-xs text-[#777777] mt-1">
              Manage downloadable guides, Business Model Canvas templates, IPR documents and tools.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Resource</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#FFFFFF] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
          />
          <Search className="w-4 h-4 text-[#777777] absolute left-2.5 top-2" />
        </div>

        {/* List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#777777]">Loading resources...</div>
        ) : filteredResources.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-[#242424]">No resources found</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#161616] text-white rounded text-xs font-semibold cursor-pointer"
            >
              + Add Resource
            </button>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#D8D8D3] bg-[#F5F5F3] text-[#777777] font-semibold text-[11px]">
                    <th className="p-3.5">Resource Title</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Author / Source</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBE8]">
                  {filteredResources.map(item => (
                    <tr key={item.id} className="hover:bg-[#F0F0ED]/50 transition-colors">
                      <td className="p-3.5 font-bold text-[#161616]">{item.title}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-[#F0F0ED] rounded text-[10px] font-medium text-[#4A4A4A]">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-[#4A4A4A]">{item.authorOrSource || '—'}</td>
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
            <div className="bg-white rounded border border-[#D8D8D3] w-full max-w-lg p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#EBEBE8] pb-3">
                <h3 className="font-bold text-base text-[#161616]">
                  {editingItem ? 'Edit Resource' : 'Add Resource'}
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
                  <label className="font-semibold text-[#242424]">Resource Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Business Model Canvas Guide"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as ResourceItem['category'] })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  >
                    <option value="Startup Guides">Startup Guides</option>
                    <option value="Project Ideas">Project Ideas</option>
                    <option value="IPR Resources">IPR Resources</option>
                    <option value="Business Model Canvas">Business Model Canvas</option>
                    <option value="Design Thinking">Design Thinking</option>
                    <option value="Pitch Deck Resources">Pitch Deck Resources</option>
                    <option value="Funding Information">Funding Information</option>
                    <option value="KSUM Resources">KSUM Resources</option>
                    <option value="Useful Tools">Useful Tools</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the resource..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Resource Link / File URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.linkUrl}
                    onChange={e => setFormData({ ...formData, linkUrl: e.target.value })}
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
                      Save Resource
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
