import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { SearchFilterBar } from '../components/ui/SearchFilterBar';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { api } from '../services/api';
import { NewsItem } from '../types';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getNews(search);
        setNews(data);
      } catch (err) {
        console.error('Failed to load news:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [search]);

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SectionHeader
        tag="Circulars &amp; Updates"
        title="News &amp; Official Announcements"
        subtitle="Institutional circulars, Young Innovators Programme schedules, and entrepreneurship summit alerts."
      />

      {/* Search Filter */}
      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search news articles, circulars, or topics..."
      />

      {loading ? (
        <LoadingState message="Loading announcements..." />
      ) : news.length === 0 ? (
        <EmptyState
          title="No news articles found"
          description="Try modifying your search keywords."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map(article => (
            <div
              key={article.id}
              className="neu-raised rounded-xl p-6 border border-[#D8D8D3] space-y-4 flex flex-col justify-between hover:border-[#161616] transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="dark" size="sm">
                    {article.category}
                  </Badge>
                  <span className="text-xs text-[#777777] font-medium">
                    {article.publicationDate}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#161616] leading-snug">{article.title}</h3>

                <p className="text-xs text-[#4A4A4A] leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EBEBE8] flex items-center justify-between text-xs">
                <span className="text-[#777777]">By {article.author}</span>
                <Link
                  to={`/news/${article.slug}`}
                  className="font-semibold text-[#161616] hover:underline flex items-center gap-1"
                >
                  <span>Read Notice</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
