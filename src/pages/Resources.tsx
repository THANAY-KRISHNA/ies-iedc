import React, { useEffect, useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { api } from '../services/api';
import { ResourceItem } from '../types';
import { FileText, Download, ExternalLink, BookOpen, Layers } from 'lucide-react';

export const Resources: React.FC = () => {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  const categories = [
    'All',
    'Startup Guides',
    'Business Model Canvas',
    'IPR Resources',
    'Project Ideas'
  ];

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getResources(selectedCategory);
        setResources(data);
      } catch (err) {
        console.error('Failed to load resources:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SectionHeader
        tag="Knowledge Repository"
        title="Innovation &amp; Entrepreneurship Resources"
        subtitle="Pitch deck guidelines, patent manuals, business model templates, and curated guides for student innovators."
      />

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'neu-button'
                : 'neu-raised-soft text-[#4A4A4A] hover:text-[#161616]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState message="Loading resource repository..." />
      ) : resources.length === 0 ? (
        <EmptyState
          title="No resources found in this category"
          description="Try selecting a different resource category above."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(res => (
            <div
              key={res.id}
              className="neu-raised rounded-xl p-6 border border-[#D8D8D3] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="dark" size="sm">
                    {res.category}
                  </Badge>
                  {res.fileType && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                      {res.fileType}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#161616] leading-snug">{res.title}</h3>

                {res.authorOrSource && (
                  <p className="text-xs text-[#777777]">Source: {res.authorOrSource}</p>
                )}

                <p className="text-xs text-[#4A4A4A] leading-relaxed">{res.description}</p>
              </div>

              {res.linkUrl && (
                <div className="pt-3 border-t border-[#EBEBE8]">
                  <a
                    href={res.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#161616] hover:underline"
                  >
                    <span>Access Resource Material</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
