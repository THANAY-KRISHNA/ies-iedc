import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { GalleryAlbum, GalleryImage, AcademicYear, EventItem } from '../../types';
import { Plus, Upload, Trash2, Eye, Star, Save, Image as ImageIcon, Check, ArrowUp, ArrowDown } from 'lucide-react';

export const AdminGallery: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Active Album Form / Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GalleryAlbum['category']>('Events');
  const [academicYear, setAcademicYear] = useState('2024–25');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [published, setPublished] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
    if (searchParams.get('action') === 'new') {
      handleCreateAlbum();
    }
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [albumList, years, evtList] = await Promise.all([
        api.adminGetGallery(),
        api.getAcademicYears(),
        api.adminGetEvents()
      ]);
      setAlbums(albumList);
      setAcademicYears(years);
      setEvents(evtList);
    } catch (err) {
      console.error('Failed to load gallery data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateAlbum = () => {
    setEditingAlbum(null);
    setTitle('');
    setDescription('');
    setCategory('Events');
    setAcademicYear('2024–25');
    setCoverImageUrl('');
    setImages([]);
    setPublished(true);
    setIsModalOpen(true);
  };

  const handleEditAlbum = (alb: GalleryAlbum) => {
    setEditingAlbum(alb);
    setTitle(alb.title);
    setDescription('');
    setCategory(alb.category);
    setAcademicYear(alb.academicYear);
    setCoverImageUrl(alb.coverImageUrl);
    setImages(alb.images || []);
    setPublished(alb.published);
    setIsModalOpen(true);
  };

  // Bulk File Selection Handler (Handles 20 / 30 / 50 photos at once)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: GalleryImage[] = [];

    (Array.from(files) as File[]).forEach((file: File, index: number) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileUrl = event.target?.result as string;
        const imgItem: GalleryImage = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          albumId: editingAlbum ? editingAlbum.id : 'temp_album',
          imageUrl: fileUrl,
          caption: file.name.replace(/\.[^/.]+$/, ''),
          sortOrder: images.length + index + 1
        };
        newImages.push(imgItem);

        // Set first image as cover if cover is not set
        if (!coverImageUrl && index === 0) {
          setCoverImageUrl(fileUrl);
        }

        if (newImages.length === files.length) {
          setImages(prev => [...prev, ...newImages]);
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSetCover = (url: string) => {
    setCoverImageUrl(url);
  };

  const handleCaptionChange = (id: string, newCaption: string) => {
    setImages(prev =>
      prev.map(img => (img.id === id ? { ...img, caption: newCaption } : img))
    );
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setImages(copy);
  };

  const handleSaveAlbum = async (publishState: boolean) => {
    if (!title) {
      alert('Please enter an album title.');
      return;
    }

    const payload: Partial<GalleryAlbum> = {
      title,
      category,
      academicYear,
      coverImageUrl: coverImageUrl || (images.length > 0 ? images[0].imageUrl : ''),
      images,
      published: publishState
    };

    try {
      if (editingAlbum) {
        await api.adminUpdateGalleryAlbum(editingAlbum.id, payload);
      } else {
        await api.adminAddGalleryAlbum(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save album:', err);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this gallery album?')) return;
    try {
      await api.adminDeleteGalleryAlbum(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete album:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] tracking-tight">Gallery Management</h1>
            <p className="text-xs text-[#777777] mt-1">
              Create photo albums and bulk upload event photos for display on the public website.
            </p>
          </div>

          <button
            onClick={handleCreateAlbum}
            className="px-4 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Album</span>
          </button>
        </div>

        {/* Albums Grid */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#777777]">Loading photo gallery...</div>
        ) : albums.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-[#242424]">No gallery albums created</p>
            <p className="text-xs text-[#777777]">Create an album to start adding event photos.</p>
            <button
              onClick={handleCreateAlbum}
              className="px-4 py-2 bg-[#161616] text-white rounded text-xs font-semibold cursor-pointer"
            >
              + Create Album
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map(alb => (
              <div
                key={alb.id}
                className="bg-[#FFFFFF] border border-[#D8D8D3] rounded overflow-hidden flex flex-col justify-between group hover:border-[#161616] transition-colors"
              >
                <div className="space-y-3 p-4">
                  <div className="aspect-video bg-[#F5F5F3] rounded border border-[#EBEBE8] overflow-hidden relative">
                    {alb.coverImageUrl ? (
                      <img
                        src={alb.coverImageUrl}
                        alt={alb.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#777777]">
                        <ImageIcon className="w-8 h-8 opacity-40" />
                      </div>
                    )}
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded">
                      {alb.images?.length || 0} Photos
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#161616]">{alb.title}</h3>
                    <p className="text-xs text-[#777777]">{alb.academicYear} • {alb.category}</p>
                  </div>
                </div>

                <div className="p-4 bg-[#F5F5F3] border-t border-[#EBEBE8] flex items-center justify-between text-xs">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      alb.published
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {alb.published ? 'Published' : 'Draft'}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAlbum(alb)}
                      className="px-3 py-1 bg-[#FFFFFF] border border-[#D8D8D3] hover:bg-[#EBEBE8] rounded text-xs font-semibold cursor-pointer"
                    >
                      Edit Album
                    </button>
                    <button
                      onClick={() => handleDeleteAlbum(alb.id)}
                      className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                      title="Delete Album"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Album Editor / Bulk Photo Upload Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded border border-[#D8D8D3] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#EBEBE8] pb-3">
                <h3 className="font-bold text-base text-[#161616]">
                  {editingAlbum ? 'Edit Gallery Album' : 'Create Gallery Album'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs text-[#777777] hover:text-[#161616] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* ALBUM DETAILS FORM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Album Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IEDC Innovation Summit 2024"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#242424]">Academic Year</label>
                  <select
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424]"
                  >
                    {academicYears.map(y => (
                      <option key={y.id} value={y.year}>
                        {y.year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* BULK UPLOAD AREA */}
              <div className="space-y-2">
                <label className="font-bold text-xs text-[#161616] block">
                  Upload Photos (Select 20, 30, 50 photos at once)
                </label>
                <div className="border-2 border-dashed border-[#D8D8D3] hover:border-[#161616] bg-[#F5F5F3] rounded-lg p-8 text-center space-y-3 relative transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#FFFFFF] border border-[#D8D8D3] flex items-center justify-center text-[#242424]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#161616]">
                      {uploading ? 'Processing photos...' : 'Drag & Drop Photos Here'}
                    </p>
                    <p className="text-[11px] text-[#777777] mt-0.5">
                      or click to choose multiple files (JPG, PNG, WEBP)
                    </p>
                  </div>
                </div>
              </div>

              {/* THUMBNAIL GRID & CAPTIONING */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#EBEBE8] pb-2">
                  <h4 className="font-bold text-xs text-[#161616]">
                    Uploaded Photos ({images.length})
                  </h4>
                  <span className="text-[11px] text-[#777777]">
                    Click star to set Cover Image
                  </span>
                </div>

                {images.length === 0 ? (
                  <p className="text-xs text-[#777777] italic py-4 text-center">
                    No photos added yet. Use the upload area above to add photos.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[350px] overflow-y-auto p-1">
                    {images.map((img, index) => {
                      const isCover = coverImageUrl === img.imageUrl;
                      return (
                        <div
                          key={img.id}
                          className={`bg-[#F5F5F3] border rounded p-2 space-y-2 relative group ${
                            isCover ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-[#D8D8D3]'
                          }`}
                        >
                          <div className="aspect-square bg-white rounded overflow-hidden relative">
                            <img
                              src={img.imageUrl}
                              alt={img.caption}
                              className="w-full h-full object-cover"
                            />
                            {isCover && (
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded">
                                Cover
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(img.id)}
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Delete Photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <input
                            type="text"
                            placeholder="Caption..."
                            value={img.caption}
                            onChange={e => handleCaptionChange(img.id, e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-[#D8D8D3] rounded text-[11px] text-[#242424]"
                          />

                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <button
                              type="button"
                              onClick={() => handleSetCover(img.imageUrl)}
                              className={`flex items-center gap-1 font-semibold cursor-pointer ${
                                isCover ? 'text-amber-600' : 'text-[#777777] hover:text-[#161616]'
                              }`}
                            >
                              <Star className={`w-3 h-3 ${isCover ? 'fill-amber-400' : ''}`} />
                              <span>{isCover ? 'Cover' : 'Set Cover'}</span>
                            </button>

                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => handleMove(index, 'up')}
                                disabled={index === 0}
                                className="p-0.5 text-[#777777] hover:text-[#161616] disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMove(index, 'down')}
                                disabled={index === images.length - 1}
                                className="p-0.5 text-[#777777] hover:text-[#161616] disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SAVE / PUBLISH ACTIONS */}
              <div className="pt-4 border-t border-[#EBEBE8] flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={e => setPublished(e.target.checked)}
                    className="rounded cursor-pointer"
                  />
                  <span>Publish Album Immediately</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveAlbum(false)}
                    className="px-4 py-2 bg-[#F0F0ED] hover:bg-[#EBEBE8] text-[#242424] rounded text-xs font-semibold cursor-pointer"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveAlbum(true)}
                    className="px-5 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold cursor-pointer"
                  >
                    Publish Album
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
