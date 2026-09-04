import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { Upload, Search, Trash2, Copy, Check, Image as ImageIcon } from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  size: string;
}

export const AdminMedia: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  React.useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    try {
      const items = await api.adminGetMedia();
      setMediaList(items || []);
    } catch (err) {
      console.error('Failed to load media items:', err);
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileData = event.target?.result as string;
        try {
          const res = await api.uploadMedia(file.name, fileData);
          const payload = {
            name: file.name,
            url: res.url,
            uploadedAt: new Date().toLocaleDateString(),
            size: `${(file.size / 1024).toFixed(1)} KB`
          };
          const created = await api.adminAddMedia(payload);
          setMediaList(prev => [created, ...prev]);
        } catch (err) {
          console.error('Upload failed:', err);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this file from media library?')) return;
    try {
      await api.adminDeleteMedia(id);
      setMediaList(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Failed to delete media item:', err);
    }
  };

  const filteredMedia = mediaList.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] tracking-tight">Media Library</h1>
            <p className="text-xs text-[#777777] mt-1">
              Upload, organize, and manage image files and media assets.
            </p>
          </div>

          <label className="px-4 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors w-fit">
            <Upload className="w-4 h-4" />
            <span>Upload New Media</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search media files..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#FFFFFF] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
          />
          <Search className="w-4 h-4 text-[#777777] absolute left-2.5 top-2" />
        </div>

        {/* Media Grid */}
        {filteredMedia.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-12 text-center text-xs text-[#777777]">
            No media files found. Upload an image to get started.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map(item => (
              <div
                key={item.id}
                className="bg-[#FFFFFF] border border-[#D8D8D3] hover:border-[#161616] rounded p-3 space-y-2 flex flex-col justify-between group transition-colors"
              >
                <div className="space-y-2">
                  <div className="aspect-square bg-[#F5F5F3] rounded overflow-hidden flex items-center justify-center border border-[#EBEBE8]">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#161616] truncate">{item.name}</p>
                    <p className="text-[10px] text-[#777777]">{item.size} • {item.uploadedAt}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EBEBE8] text-xs">
                  <button
                    onClick={() => handleCopyUrl(item)}
                    className="flex items-center gap-1 text-[11px] text-[#4A4A4A] hover:text-[#161616] cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                    title="Delete File"
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
