import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { NewsItem, AcademicYear } from '../../types';
import { Plus, Edit, Trash2, Newspaper, Eye, Search } from 'lucide-react';

export const AdminNews: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Announcement' as NewsItem['category'],
    excerpt: '',
    content: '',
    featuredImageUrl: '',
    author: 'IEDC Editorial Team',
    publicationDate: new Date().toISOString().split('T')[0],
    academicYear: '2024–25',
    status: 'Published' as NewsItem['status']
  });

  useEffect(() => {
    loadData();
    if (searchParams.get('action') === 'new') {
      handleOpenAdd();
    }
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [newsList, years] = await Promise.all([
        api.adminGetNews(),
        api.getAcademicYears()
      ]);
      setNews(newsList);
      setAcademicYears(years);
    } catch (err) {
      console.error('Failed to load news data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      category: 'Announcement',
      excerpt: '',
      content: '',
      featuredImageUrl: '',
      author: 'IEDC Editorial Team',
      publicationDate: new Date().toISOString().split('T')[0],
      academicYear: '2024–25',
      status: 'Published'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: NewsItem) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      category: item.category,
      excerpt: item.excerpt,
      content: item.content,
      featuredImageUrl: item.featuredImageUrl || '',
      author: item.author || 'IEDC Editorial Team',
      publicationDate: item.publicationDate || new Date().toISOString().split('T')[0],
      academicYear: item.academicYear || '2024–25',
      status: item.status
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const payload: Partial<NewsItem> = {
      ...formData,
      slug
    };

    try {
      if (editingNews) {
        await api.adminUpdateNews(editingNews.id, payload);
      } else {
        await api.adminAddNews(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save announcement:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await api.adminDeleteNews(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete news item:', err);
    }
  };

  const filteredNews = news.filter(
    n =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] tracking-tight">News &amp; Announcements</h1>
            <p className="text-xs text-[#777777] mt-1">
              Publish news, announcements, deadline alerts and competition notices.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Announcement</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search announcements..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#FFFFFF] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
          />
          <Search className="w-4 h-4 text-[#777777] absolute left-2.5 top-2" />
        </div>

        {/* News List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#777777]">Loading announcements...</div>
        ) : filteredNews.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-[#242424]">No announcements created</p>
            <p className="text-xs text-[#777777]">Create your first announcement to publish on the website.</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#161616] text-white rounded text-xs font-semibold cursor-pointer"
            >
              + Add Announcement
            </button>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#D8D8D3] bg-[#F5F5F3] text-[#777777] font-semibold text-[11px]">
                    <th className="p-3.5">Title</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Publication Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBE8]">
                  {filteredNews.map(item => (
                    <tr key={item.id} className="hover:bg-[#F0F0ED]/50 transition-colors">
                      <td className="p-3.5">
                        <p className="font-bold text-[#161616]">{item.title}</p>
                        <p className="text-[11px] text-[#777777] truncate max-w-xs">{item.excerpt}</p>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-[#F0F0ED] rounded text-[10px] font-medium text-[#4A4A4A]">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-[#242424]">{item.publicationDate}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'Published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
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
            <div className="bg-white rounded border border-[#D8D8D3] w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#EBEBE8] pb-3">
                <h3 className="font-bold text-base text-[#161616]">
                  {editingNews ? 'Edit Announcement' : 'Add Announcement'}
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
                  <label className="font-semibold text-[#242424]">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. YIP 2024 Registration Deadline Extended"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value as NewsItem['category'] })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    >
                      <option value="Announcement">Announcement</option>
                      <option value="News">News</option>
                      <option value="Registration Deadline">Registration Deadline</option>
                      <option value="Competition">Competition</option>
                      <option value="Result">Result</option>
                      <option value="Opportunity">Opportunity</option>
                      <option value="Important Notice">Important Notice</option>
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
                  <label className="font-semibold text-[#242424]">Short Description / Excerpt</label>
                  <input
                    type="text"
                    placeholder="Summary for list cards..."
                    value={formData.excerpt}
                    onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Full Content *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Write detailed announcement content..."
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Featured Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.featuredImageUrl}
                    onChange={e => setFormData({ ...formData, featuredImageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Publication Date</label>
                    <input
                      type="date"
                      value={formData.publicationDate}
                      onChange={e => setFormData({ ...formData, publicationDate: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as NewsItem['status'] })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
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
                    Save Announcement
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
