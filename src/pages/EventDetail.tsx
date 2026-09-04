import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { api } from '../services/api';
import { EventItem } from '../types';
import {
  Calendar,
  MapPin,
  Users,
  Award,
  AlertCircle,
  ArrowLeft,
  Share2,
  ExternalLink
} from 'lucide-react';

export const EventDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        const item = await api.getEventBySlug(slug);
        setEvent(item);
      } catch (err) {
        console.error('Error loading event:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return <LoadingState message="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#161616]">Event Not Found</h2>
        <p className="text-sm text-[#777777]">The requested event could not be found.</p>
        <Link to="/events">
          <Button variant="primary">Return to Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back link */}
      <div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777777] hover:text-[#161616] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {/* Main card */}
      <div className="neu-raised rounded-2xl p-8 md:p-12 border border-[#D8D8D3] space-y-8">
        {/* Header tags */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#EBEBE8]">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="dark">{event.academicYear}</Badge>
            <Badge variant="neutral">{event.category}</Badge>
            <Badge
              variant={
                event.status === 'Completed'
                  ? 'success'
                  : event.status === 'Upcoming'
                  ? 'warning'
                  : 'neutral'
              }
            >
              {event.status}
            </Badge>
          </div>

          <span className="text-xs text-[#777777] font-medium">
            Organizer: {event.organizer || 'IES IEDC'}
          </span>
        </div>

        {/* Title & Discrepancy Note */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#161616] tracking-tight">
            {event.name}
          </h1>

          {event.needsAdminReview && (
            <div className="p-4 bg-[#FFF3E0] border border-[#F3C287] rounded-xl text-xs text-[#8C4A00] space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 text-[#8C4A00]" />
                <span>Administrative Review Note (Data Anomaly)</span>
              </div>
              <p className="leading-relaxed">
                {event.adminReviewNote ||
                  'Official source documents record inconsistent chronological data (e.g. October 2023 for 2024–25 academic cycle). Maintained as verified with review notice.'}
              </p>
            </div>
          )}
        </div>

        {/* Quick Facts Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 neu-raised-soft rounded-xl border border-[#D8D8D3]">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#777777]">
              <Calendar className="w-3.5 h-3.5 text-[#242424]" />
              <span>Event Date</span>
            </div>
            <p className="text-sm font-bold text-[#161616]">{event.displayDate}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#777777]">
              <MapPin className="w-3.5 h-3.5 text-[#242424]" />
              <span>Venue</span>
            </div>
            <p className="text-sm font-bold text-[#161616]">{event.venue}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#777777]">
              <Users className="w-3.5 h-3.5 text-[#242424]" />
              <span>Participation</span>
            </div>
            <p className="text-sm font-bold text-[#161616]">
              {event.participantsCount
                ? `${event.participantsCount} Participants`
                : event.teamsCount
                ? `${event.teamsCount} Teams`
                : 'Campus Wide'}
            </p>
          </div>
        </div>

        {/* Full Description */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#161616]">About This Event</h3>
          <p className="text-sm text-[#4A4A4A] leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Resource Persons */}
        {event.resourcePersons && event.resourcePersons.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-[#EBEBE8]">
            <h3 className="text-sm font-bold text-[#161616]">Resource Persons &amp; Mentors</h3>
            <div className="flex flex-wrap gap-2">
              {event.resourcePersons.map((rp, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 neu-raised-soft rounded-lg text-xs font-semibold text-[#242424] border border-[#D8D8D3]"
                >
                  {rp}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Teams Stats if Ideathon */}
        {event.teamsSelectedCount && (
          <div className="p-4 neu-inset rounded-xl flex items-center justify-between text-xs">
            <span className="text-[#4A4A4A]">Teams Selected for State/Zonal Incubation:</span>
            <span className="font-bold text-[#161616] text-sm">
              {event.teamsSelectedCount} Teams
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
