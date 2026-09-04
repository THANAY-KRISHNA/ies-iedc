import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { api } from '../services/api';
import { NewsItem } from '../types';
import { Calendar, User, ArrowLeft } from 'lucide-react';

export const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        const item = await api.getNewsBySlug(slug);
        setArticle(item);
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return <LoadingState message="Loading announcement..." />;
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#161616]">Article Not Found</h2>
        <p className="text-sm text-[#777777]">The requested article or circular was not found.</p>
        <Link to="/news">
          <Button variant="primary">Return to News</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777777] hover:text-[#161616] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Circulars</span>
        </Link>
      </div>

      <article className="neu-raised rounded-2xl p-8 md:p-12 border border-[#D8D8D3] space-y-8">
        <div className="space-y-4 pb-6 border-b border-[#EBEBE8]">
          <div className="flex items-center gap-2">
            <Badge variant="dark">{article.category}</Badge>
            <Badge variant="neutral">{article.academicYear}</Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#161616] tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#777777] pt-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#242424]" />
              <span>Published on {article.publicationDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#242424]" />
              <span>Issued by {article.author}</span>
            </div>
          </div>
        </div>

        {/* Lead excerpt */}
        <div className="p-4 neu-raised-soft rounded-xl border border-[#D8D8D3] text-sm text-[#242424] font-medium leading-relaxed italic">
          {article.excerpt}
        </div>

        {/* Article Body */}
        <div className="text-sm text-[#4A4A4A] leading-relaxed whitespace-pre-line space-y-4">
          {article.content}
        </div>
      </article>
    </div>
  );
};
