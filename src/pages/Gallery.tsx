import React, { useEffect, useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { api } from '../services/api';
import { GalleryAlbum, EventItem } from '../types';
import { Image as ImageIcon, Eye, Calendar, FileText, Download } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeTab, setActiveTab] = useState<'albums' | 'posters'>('albums');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [activePhoto, setActivePhoto] = useState<{ url: string; caption?: string; albumTitle: string } | null>(null);

  const categories = ['All', 'Events', 'Workshops', 'Bootcamp', 'Achievements'];

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [galleryData, eventData] = await Promise.all([
          api.getGallery(selectedCategory),
          api.getEvents()
        ]);
        setAlbums(galleryData);
        setEvents(eventData.filter(e => !!e.posterUrl));
      } catch (err) {
        console.error('Failed to load gallery data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCategory]);

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      <SectionHeader
        tag="Visual Archives & Media"
        title="IEDC Activity Gallery & Event Posters"
        subtitle="Explore photo albums from bootcamps and summits, plus official event posters and documents."
      />

      {/* Main Mode Toggles: Photo Albums vs Event Posters */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#D8D8D3] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('albums')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'albums'
                ? 'neu-button text-[#161616]'
                : 'neu-raised-soft text-[#777777] hover:text-[#161616]'
            }`}
          >
            Photo Albums ({albums.length})
          </button>
          <button
            onClick={() => setActiveTab('posters')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'posters'
                ? 'neu-button text-[#161616]'
                : 'neu-raised-soft text-[#777777] hover:text-[#161616]'
            }`}
          >
            Event Posters &amp; Flyers ({events.length})
          </button>
        </div>

        {/* Category Pills for Albums */}
        {activeTab === 'albums' && (
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#242424] text-white'
                    : 'bg-[#F0F0ED] text-[#4A4A4A] hover:bg-[#EBEBE8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <LoadingState message="Loading activity gallery..." />
      ) : activeTab === 'albums' ? (
        albums.length === 0 ? (
          <EmptyState
            title="No photo albums found"
            description="Try selecting a different category above."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map(album => (
              <div
                key={album.id}
                className="neu-raised rounded-xl overflow-hidden border border-[#D8D8D3] flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Cover Image */}
                  <div
                    onClick={() =>
                      setActivePhoto({
                        url: album.coverImageUrl,
                        caption: album.title,
                        albumTitle: album.title
                      })
                    }
                    className="relative aspect-video bg-[#EBEBE8] overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={album.coverImageUrl}
                      alt={album.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <span className="text-xs font-semibold flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-full">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Full Image</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="dark" size="sm">
                        {album.academicYear}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        {album.category}
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-[#161616] leading-snug">{album.title}</h3>
                  </div>
                </div>

                {/* Sub-gallery preview thumbnails if available */}
                {album.images && album.images.length > 0 && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#EBEBE8] flex items-center gap-2 overflow-x-auto">
                    {album.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setActivePhoto({
                            url: img.imageUrl,
                            caption: img.caption,
                            albumTitle: album.title
                          })
                        }
                        className="w-12 h-12 rounded-md overflow-hidden neu-inset shrink-0 border border-[#D8D8D3] hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        <img
                          src={img.imageUrl}
                          alt={img.caption || 'Thumbnail'}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        /* Event Posters & Flyers Tab */
        events.length === 0 ? (
          <EmptyState
            title="No event posters available"
            description="Official posters will appear here when attached to events."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {events.map(event => (
              <div
                key={event.id}
                className="neu-raised rounded-xl overflow-hidden border border-[#D8D8D3] p-4 flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-3">
                  <div
                    onClick={() =>
                      setActivePhoto({
                        url: event.posterUrl || '',
                        caption: `${event.name} (${event.displayDate || event.startDate})`,
                        albumTitle: event.name
                      })
                    }
                    className="aspect-[3/4] bg-[#EBEBE8] rounded-lg overflow-hidden relative cursor-pointer"
                  >
                    <img
                      src={event.posterUrl}
                      alt={event.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <span className="text-xs font-semibold flex items-center gap-1 bg-black/60 px-3 py-1.5 rounded-full">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Expand Poster</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] px-2 py-0.5 bg-[#F0F0ED] rounded text-[#777777] font-semibold">
                      {event.academicYear} • {event.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#161616] mt-1">{event.name}</h3>
                    <p className="text-xs text-[#777777] mt-0.5">{event.displayDate || event.startDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Lightbox Modal */}
      <Modal
        isOpen={!!activePhoto}
        onClose={() => setActivePhoto(null)}
        title={activePhoto?.albumTitle}
        subtitle={activePhoto?.caption}
        maxWidth="4xl"
      >
        {activePhoto && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-black flex items-center justify-center max-h-[70vh]">
              <img
                src={activePhoto.url}
                alt={activePhoto.caption || 'Full view'}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
            {activePhoto.caption && (
              <p className="text-xs text-[#777777] text-center italic">{activePhoto.caption}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
