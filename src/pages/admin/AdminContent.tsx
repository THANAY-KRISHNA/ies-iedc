import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingState } from '../../components/ui/LoadingState';
import { api } from '../../services/api';
import {
  StartupItem,
  WorkshopItem,
  ResourceItem,
  GalleryAlbum,
  NewsItem
} from '../../types';
import {
  Rocket,
  Calendar,
  BookOpen,
  Image as ImageIcon,
  FileText,
  Plus,
  Edit2,
  Trash2,
  ExternalLink
} from 'lucide-react';

export const AdminContent: React.FC = () => {
  const { hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'news' | 'startups' | 'workshops' | 'resources' | 'gallery'>('news');
  const [loading, setLoading] = useState(false);

  // Data states
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [startupsList, setStartupsList] = useState<StartupItem[]>([]);
  const [workshopsList, setWorkshopsList] = useState<WorkshopItem[]>([]);
  const [resourcesList, setResourcesList] = useState<ResourceItem[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryAlbum[]>([]);

  // News Modal
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'Circular',
    academicYear: '2024–25',
    author: 'IEDC Coordination Office',
    excerpt: '',
    content: '',
    published: true
  });

  // Startup Modal
  const [startupModalOpen, setStartupModalOpen] = useState(false);
  const [startupForm, setStartupForm] = useState({
    name: '',
    founderTeam: '',
    department: 'CSE',
    status: 'Pre-Incubation' as StartupItem['status'],
    description: '',
    problemSolved: '',
    productService: '',
    websiteUrl: '',
    published: true
  });

  // Resource Modal
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [resourceForm, setResourceForm] = useState({
    title: '',
    category: 'Startup Guides',
    fileType: 'PDF',
    description: '',
    authorOrSource: 'Kerala Startup Mission (KSUM)',
    linkUrl: ''
  });

  const isAuthorized = hasRole(['Content Admin']);

  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  async function loadTabData() {
    setLoading(true);
    try {
      if (activeTab === 'news') {
        const data = await api.getNews();
        setNewsList(data);
      } else if (activeTab === 'startups') {
        const data = await api.getStartups();
        setStartupsList(data);
      } else if (activeTab === 'workshops') {
        const data = await api.getWorkshops();
        setWorkshopsList(data);
      } else if (activeTab === 'resources') {
        const data = await api.getResources();
        setResourcesList(data);
      } else if (activeTab === 'gallery') {
        const data = await api.getGallery();
        setGalleryList(data);
      }
    } catch (err) {
      console.error('Failed to load tab data:', err);
    } finally {
      setLoading(false);
    }
  }

  // News Handlers
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newsForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      await api.adminAddNews({
        ...newsForm,
        slug,
        publicationDate: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })
      });
      setNewsModalOpen(false);
      loadTabData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm('Delete this news circular?')) return;
    await api.adminDeleteNews(id);
    loadTabData();
  };

  // Startup Handlers
  const handleSaveStartup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.adminAddStartup(startupForm);
      setStartupModalOpen(false);
      loadTabData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStartup = async (id: string) => {
    if (!window.confirm('Delete startup record?')) return;
    await api.adminDeleteStartup(id);
    loadTabData();
  };

  // Resource Handlers
  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.adminAddResource(resourceForm);
      setResourceModalOpen(false);
      loadTabData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!window.confirm('Delete resource material?')) return;
    await api.adminDeleteResource(id);
    loadTabData();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D8D8D3]">
        <div>
          <h1 className="text-2xl font-black text-[#161616] tracking-tight">
            Content &amp; Media Management
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            Manage circulars, startups, workshops, knowledge repositories, and photo albums.
          </p>
        </div>

        {isAuthorized && (
          <div>
            {activeTab === 'news' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setNewsModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Post Circular
              </Button>
            )}
            {activeTab === 'startups' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStartupModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Startup
              </Button>
            )}
            {activeTab === 'resources' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setResourceModalOpen(true)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Upload Resource
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#D8D8D3] pb-3">
        {[
          { id: 'news', label: 'News & Circulars', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'startups', label: 'Campus Startups', icon: <Rocket className="w-3.5 h-3.5" /> },
          { id: 'workshops', label: 'Workshops & Bootcamps', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'resources', label: 'Knowledge Resources', icon: <BookOpen className="w-3.5 h-3.5" /> },
          { id: 'gallery', label: 'Gallery Albums', icon: <ImageIcon className="w-3.5 h-3.5" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'neu-button text-[#161616]'
                : 'neu-raised-soft text-[#4A4A4A] hover:text-[#161616]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {loading ? (
        <LoadingState message="Loading module content..." />
      ) : (
        <div>
          {/* 1. News Tab */}
          {activeTab === 'news' && (
            <div className="neu-raised rounded-xl overflow-hidden border border-[#D8D8D3]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#D8D8D3] bg-[#EBEBE8]/50 text-[#777777] uppercase tracking-wider text-[10px]">
                      <th className="p-3.5 font-bold">Headline</th>
                      <th className="p-3.5 font-bold">Category</th>
                      <th className="p-3.5 font-bold">Date Published</th>
                      <th className="p-3.5 font-bold">Author</th>
                      <th className="p-3.5 font-bold">Status</th>
                      <th className="p-3.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBEBE8]">
                    {newsList.map(n => (
                      <tr key={n.id} className="hover:bg-[#EBEBE8]/20">
                        <td className="p-3.5 font-bold text-[#161616] max-w-sm truncate">
                          {n.title}
                        </td>
                        <td className="p-3.5">
                          <Badge variant="outline" size="sm">
                            {n.category}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-[#4A4A4A]">{n.publicationDate}</td>
                        <td className="p-3.5 text-[#777777]">{n.author}</td>
                        <td className="p-3.5">
                          <Badge variant={n.published ? 'success' : 'neutral'} size="sm">
                            {n.published ? 'Published' : 'Draft'}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteNews(n.id)}
                            className="p-1 text-red-700 hover:text-red-900 cursor-pointer"
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

          {/* 2. Startups Tab */}
          {activeTab === 'startups' && (
            <div className="neu-raised rounded-xl overflow-hidden border border-[#D8D8D3]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#D8D8D3] bg-[#EBEBE8]/50 text-[#777777] uppercase tracking-wider text-[10px]">
                      <th className="p-3.5 font-bold">Startup Name</th>
                      <th className="p-3.5 font-bold">Founding Team</th>
                      <th className="p-3.5 font-bold">Status</th>
                      <th className="p-3.5 font-bold">Product / Service</th>
                      <th className="p-3.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBEBE8]">
                    {startupsList.map(s => (
                      <tr key={s.id} className="hover:bg-[#EBEBE8]/20">
                        <td className="p-3.5 font-bold text-[#161616]">{s.name}</td>
                        <td className="p-3.5 text-[#4A4A4A]">{s.founderTeam}</td>
                        <td className="p-3.5">
                          <Badge variant="success" size="sm">
                            {s.status}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-[#777777] max-w-xs truncate">
                          {s.productService}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteStartup(s.id)}
                            className="p-1 text-red-700 hover:text-red-900 cursor-pointer"
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

          {/* 3. Workshops Tab */}
          {activeTab === 'workshops' && (
            <div className="neu-raised rounded-xl overflow-hidden border border-[#D8D8D3]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#D8D8D3] bg-[#EBEBE8]/50 text-[#777777] uppercase tracking-wider text-[10px]">
                      <th className="p-3.5 font-bold">Workshop Title</th>
                      <th className="p-3.5 font-bold">Date &amp; Venue</th>
                      <th className="p-3.5 font-bold">Cycle</th>
                      <th className="p-3.5 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBEBE8]">
                    {workshopsList.map(w => (
                      <tr key={w.id} className="hover:bg-[#EBEBE8]/20">
                        <td className="p-3.5 font-bold text-[#161616]">{w.title}</td>
                        <td className="p-3.5 text-[#4A4A4A]">
                          {w.displayDate} ({w.venue})
                        </td>
                        <td className="p-3.5">{w.academicYear}</td>
                        <td className="p-3.5">
                          <Badge variant="neutral" size="sm">
                            {w.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Resources Tab */}
          {activeTab === 'resources' && (
            <div className="neu-raised rounded-xl overflow-hidden border border-[#D8D8D3]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#D8D8D3] bg-[#EBEBE8]/50 text-[#777777] uppercase tracking-wider text-[10px]">
                      <th className="p-3.5 font-bold">Resource Title</th>
                      <th className="p-3.5 font-bold">Category</th>
                      <th className="p-3.5 font-bold">Type</th>
                      <th className="p-3.5 font-bold">Source</th>
                      <th className="p-3.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBEBE8]">
                    {resourcesList.map(r => (
                      <tr key={r.id} className="hover:bg-[#EBEBE8]/20">
                        <td className="p-3.5 font-bold text-[#161616]">{r.title}</td>
                        <td className="p-3.5">{r.category}</td>
                        <td className="p-3.5 uppercase font-bold text-[10px] text-[#777777]">
                          {r.fileType}
                        </td>
                        <td className="p-3.5 text-[#777777]">{r.authorOrSource}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteResource(r.id)}
                            className="p-1 text-red-700 hover:text-red-900 cursor-pointer"
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

          {/* 5. Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryList.map(g => (
                <div
                  key={g.id}
                  className="neu-raised rounded-xl p-4 border border-[#D8D8D3] space-y-3"
                >
                  <img
                    src={g.coverImageUrl}
                    alt={g.title}
                    referrerPolicy="no-referrer"
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                  <h4 className="text-sm font-bold text-[#161616]">{g.title}</h4>
                  <div className="flex items-center justify-between text-xs text-[#777777]">
                    <span>{g.academicYear}</span>
                    <Badge variant="outline" size="sm">
                      {g.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* News Modal */}
      <Modal
        isOpen={newsModalOpen}
        onClose={() => setNewsModalOpen(false)}
        title="Post New Circular / Notice"
        subtitle="Publish an official announcement to the IEDC community."
      >
        <form onSubmit={handleSaveNews} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Headline *</label>
            <input
              type="text"
              required
              value={newsForm.title}
              onChange={e => setNewsForm({ ...newsForm, title: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Category</label>
              <select
                value={newsForm.category}
                onChange={e => setNewsForm({ ...newsForm, category: e.target.value })}
                className="w-full px-3 py-2 neu-raised-soft border border-[#D8D8D3] rounded-lg text-xs"
              >
                <option value="Circular">Circular</option>
                <option value="Announcement">Announcement</option>
                <option value="YIP Update">YIP Update</option>
                <option value="Event Notice">Event Notice</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Academic Year</label>
              <input
                type="text"
                value={newsForm.academicYear}
                onChange={e => setNewsForm({ ...newsForm, academicYear: e.target.value })}
                className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Excerpt (Summary)</label>
            <input
              type="text"
              required
              value={newsForm.excerpt}
              onChange={e => setNewsForm({ ...newsForm, excerpt: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Full Content *</label>
            <textarea
              required
              rows={4}
              value={newsForm.content}
              onChange={e => setNewsForm({ ...newsForm, content: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setNewsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Post Circular
            </Button>
          </div>
        </form>
      </Modal>

      {/* Startup Modal */}
      <Modal
        isOpen={startupModalOpen}
        onClose={() => setStartupModalOpen(false)}
        title="Register Campus Startup"
        subtitle="Policy rule: Only verified student ventures can be registered."
      >
        <form onSubmit={handleSaveStartup} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Company / Venture Name *</label>
            <input
              type="text"
              required
              value={startupForm.name}
              onChange={e => setStartupForm({ ...startupForm, name: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Founders Team *</label>
              <input
                type="text"
                required
                value={startupForm.founderTeam}
                onChange={e => setStartupForm({ ...startupForm, founderTeam: e.target.value })}
                className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Incubation Status</label>
              <select
                value={startupForm.status}
                onChange={e =>
                  setStartupForm({ ...startupForm, status: e.target.value as StartupItem['status'] })
                }
                className="w-full px-3 py-2 neu-raised-soft border border-[#D8D8D3] rounded-lg text-xs"
              >
                <option value="Pre-Incubation">Pre-Incubation</option>
                <option value="Incubated">Incubated</option>
                <option value="Registered Entity">Registered Entity</option>
                <option value="Graduated">Graduated</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Problem Solved *</label>
            <input
              type="text"
              required
              value={startupForm.problemSolved}
              onChange={e => setStartupForm({ ...startupForm, problemSolved: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Product / Service Description *</label>
            <textarea
              required
              rows={3}
              value={startupForm.productService}
              onChange={e => setStartupForm({ ...startupForm, productService: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStartupModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Startup
            </Button>
          </div>
        </form>
      </Modal>

      {/* Resource Modal */}
      <Modal
        isOpen={resourceModalOpen}
        onClose={() => setResourceModalOpen(false)}
        title="Add Knowledge Resource"
        subtitle="Pitch templates, patent manuals, or BMC frameworks."
      >
        <form onSubmit={handleSaveResource} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Resource Title *</label>
            <input
              type="text"
              required
              value={resourceForm.title}
              onChange={e => setResourceForm({ ...resourceForm, title: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Category</label>
              <select
                value={resourceForm.category}
                onChange={e => setResourceForm({ ...resourceForm, category: e.target.value })}
                className="w-full px-3 py-2 neu-raised-soft border border-[#D8D8D3] rounded-lg text-xs"
              >
                <option value="Startup Guides">Startup Guides</option>
                <option value="Business Model Canvas">Business Model Canvas</option>
                <option value="IPR Resources">IPR Resources</option>
                <option value="Project Ideas">Project Ideas</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#242424]">File Type</label>
              <input
                type="text"
                value={resourceForm.fileType}
                onChange={e => setResourceForm({ ...resourceForm, fileType: e.target.value })}
                className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Description</label>
            <textarea
              rows={2}
              value={resourceForm.description}
              onChange={e => setResourceForm({ ...resourceForm, description: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Download / Access URL *</label>
            <input
              type="url"
              required
              placeholder="https://..."
              value={resourceForm.linkUrl}
              onChange={e => setResourceForm({ ...resourceForm, linkUrl: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setResourceModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Resource
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
