import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { EventItem } from '../../types';
import { Upload, Copy, Check, Trash2, Image as ImageIcon, FileText, Search, Link as LinkIcon, Download } from 'lucide-react';

interface PosterMediaItem {
  id: string;
  title: string;
  url: string;
  fileType: 'image' | 'document';
  eventId?: string;
  eventName?: string;
  uploadedAt: string;
  size: string;
}

export const AdminPosters: React.FC = () => {
  const [posters, setPosters] = useState<PosterMediaItem[]>([
    {
      id: 'p1',
      title: 'IEDC Summit 2024 Poster',
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
      fileType: 'image',
      uploadedAt: new Date().toLocaleDateString(),
      size: '1.2 MB'
    }
  ]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const evtList = await api.adminGetEvents();
        setEvents(evtList);
      } catch (err) {
        console.error('Failed to load events:', err);
      }
    }
    loadEvents();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    (Array.from(files) as File[]).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileData = event.target?.result as string;
        try {
          const isDoc = file.type.includes('pdf') || file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx');
          const newItem: PosterMediaItem = {
            id: `poster_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            title: file.name.replace(/\.[^/.]+$/, ''),
            url: fileData,
            fileType: isDoc ? 'document' : 'image',
            uploadedAt: new Date().toLocaleDateString(),
            size: `${(file.size / 1024).toFixed(1)} KB`
          };
          setPosters(prev => [newItem, ...prev]);
        } catch (err) {
          console.error('Failed to upload poster:', err);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAttachToEvent = async (posterId: string, eventId: string) => {
    const targetEvent = events.find(e => e.id === eventId);
    setPosters(prev =>
      prev.map(p => (p.id === posterId ? { ...p, eventId, eventName: targetEvent?.name } : p))
    );
    if (targetEvent) {
      const targetPoster = posters.find(p => p.id === posterId);
      if (targetPoster) {
        try {
          await api.adminUpdateEvent(eventId, { posterUrl: targetPoster.url });
          alert(`Poster attached to "${targetEvent.name}" successfully!`);
        } catch (err) {
          console.error('Failed to attach poster to event:', err);
        }
      }
    }
  };

  const handleCopyUrl = (item: PosterMediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this poster?')) return;
    setPosters(prev => prev.filter(p => p.id !== id));
  };

  const filteredPosters = posters.filter(
    p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.eventName && p.eventName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] tracking-tight">Posters &amp; Flyers Dashboard</h1>
            <p className="text-xs text-[#777777] mt-1">
              Upload event promotional posters, flyers, banners and official event documents.
            </p>
          </div>

          <label className="px-4 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors w-fit">
            <Upload className="w-4 h-4" />
            <span>+ Upload Poster / Document</span>
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Drag and Drop Upload Area */}
        <div className="border-2 border-dashed border-[#D8D8D3] hover:border-[#161616] bg-[#FFFFFF] rounded-lg p-6 text-center space-y-2 relative transition-colors">
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="w-10 h-10 mx-auto rounded-full bg-[#F5F5F3] border border-[#D8D8D3] flex items-center justify-center text-[#242424]">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-[#161616]">
            {uploading ? 'Processing file...' : 'Drag & Drop Event Posters & Documents Here'}
          </p>
          <p className="text-[11px] text-[#777777]">Supports JPG, PNG, WEBP, and PDF documents</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search posters or event..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#FFFFFF] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
          />
          <Search className="w-4 h-4 text-[#777777] absolute left-2.5 top-2" />
        </div>

        {/* Poster Grid */}
        {filteredPosters.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-12 text-center text-xs text-[#777777]">
            No posters or flyers uploaded yet. Use the upload area above to add event posters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPosters.map(item => (
              <div
                key={item.id}
                className="bg-[#FFFFFF] border border-[#D8D8D3] hover:border-[#161616] rounded overflow-hidden flex flex-col justify-between group transition-colors p-4 space-y-3"
              >
                <div className="space-y-3">
                  <div className="aspect-[3/4] bg-[#F5F5F3] rounded border border-[#EBEBE8] overflow-hidden relative flex items-center justify-center">
                    {item.fileType === 'document' ? (
                      <div className="text-center p-4 space-y-2">
                        <FileText className="w-12 h-12 text-[#777777] mx-auto" />
                        <span className="text-[11px] font-bold text-[#161616] uppercase block">PDF Document</span>
                      </div>
                    ) : (
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-xs text-[#161616] truncate">{item.title}</h3>
                    <p className="text-[10px] text-[#777777]">{item.size} • Uploaded {item.uploadedAt}</p>
                  </div>

                  {/* Attach to Event Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-[#777777] block">Attach to Event:</label>
                    <select
                      value={item.eventId || ''}
                      onChange={e => handleAttachToEvent(item.id, e.target.value)}
                      className="w-full text-xs bg-[#F5F5F3] border border-[#D8D8D3] rounded px-2 py-1 text-[#242424] cursor-pointer"
                    >
                      <option value="">-- Unattached --</option>
                      {events.map(e => (
                        <option key={e.id} value={e.id}>
                          {e.name} ({e.academicYear})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EBEBE8] flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item)}
                    className="flex items-center gap-1 text-[11px] font-medium text-[#4A4A4A] hover:text-[#161616] cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === item.id ? 'Copied URL' : 'Copy URL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                    title="Delete Poster"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
