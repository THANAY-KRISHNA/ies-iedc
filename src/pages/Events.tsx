import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { SearchFilterBar } from '../components/ui/SearchFilterBar';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { EventItem, AcademicYear } from '../types';
import { Calendar, MapPin, Users, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadYears() {
      try {
        const years = await api.getAcademicYears();
        setAcademicYears(years);
      } catch (err) {
        console.error('Failed to load years:', err);
      }
    }
    loadYears();
  }, []);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const data = await api.getEvents({
          year: selectedYear === 'All' ? undefined : selectedYear,
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          status: selectedStatus === 'All' ? undefined : selectedStatus,
          search: search || undefined
        });
        setEvents(data);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [selectedYear, selectedCategory, selectedStatus, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. Header */}
      <SectionHeader
        tag="Institutional Archives"
        title="Events, Bootcamps &amp; Ideathons"
        subtitle="Chronological record of verified IEDC initiatives, workshops, hackathons, and YIP programmes."
      />

      {/* 2. Search & Filters */}
      <div className="space-y-4">
        {/* Year Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#777777] uppercase tracking-wider mr-2">
            Academic Year:
          </span>
          <button
            onClick={() => setSelectedYear('All')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedYear === 'All'
                ? 'neu-button'
                : 'neu-raised-soft text-[#4A4A4A] hover:text-[#161616]'
            }`}
          >
            All Years
          </button>
          {academicYears.map(y => (
            <button
              key={y.id}
              onClick={() => setSelectedYear(y.year)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedYear === y.year
                  ? 'neu-button'
                  : 'neu-raised-soft text-[#4A4A4A] hover:text-[#161616]'
              }`}
            >
              {y.year}
            </button>
          ))}
        </div>

        {/* Search bar & selects */}
        <SearchFilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search events by title, venue, resource persons..."
          filters={[
            {
              name: 'category',
              value: selectedCategory,
              placeholder: 'All Categories',
              options: [
                { label: 'Ideathon', value: 'Ideathon' },
                { label: 'Bootcamp', value: 'Bootcamp' },
                { label: 'Awareness', value: 'Awareness' },
                { label: 'Workshop', value: 'Workshop' },
                { label: 'Exhibition', value: 'Exhibition' }
              ],
              onChange: setSelectedCategory
            },
            {
              name: 'status',
              value: selectedStatus,
              placeholder: 'All Statuses',
              options: [
                { label: 'Completed', value: 'Completed' },
                { label: 'Upcoming', value: 'Upcoming' },
                { label: 'Ongoing', value: 'Ongoing' }
              ],
              onChange: setSelectedStatus
            }
          ]}
        />
      </div>

      {/* 3. Events Grid */}
      {loading ? (
        <LoadingState message="Loading verified event records..." />
      ) : events.length === 0 ? (
        <EmptyState
          title="No events found"
          description="Try broadening your search query or removing filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div
              key={event.id}
              className="neu-raised rounded-xl p-6 border border-[#D8D8D3] flex flex-col justify-between hover:border-[#161616] transition-colors"
            >
              <div className="space-y-4">
                {/* Meta header */}
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="neutral" size="sm">
                    {event.academicYear}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" size="sm">
                      {event.category}
                    </Badge>
                    <Badge
                      variant={
                        event.status === 'Completed'
                          ? 'success'
                          : event.status === 'Upcoming'
                          ? 'warning'
                          : 'dark'
                      }
                      size="sm"
                    >
                      {event.status}
                    </Badge>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#161616] leading-snug">{event.name}</h3>

                {/* Date & Venue */}
                <div className="space-y-1.5 text-xs text-[#777777]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 shrink-0 text-[#242424]" />
                    <span className="font-medium text-[#4A4A4A]">{event.displayDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-[#242424]" />
                    <span>{event.venue}</span>
                  </div>
                  {event.participantsCount && (
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 shrink-0 text-[#242424]" />
                      <span>{event.participantsCount} Registered Participants</span>
                    </div>
                  )}
                </div>

                {/* Source anomaly / review notice */}
                {event.needsAdminReview && (
                  <div className="p-3 bg-[#FFF3E0] border border-[#F3C287] rounded-lg text-xs text-[#8C4A00] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Source Date Discrepancy</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {event.adminReviewNote ||
                        'Official source document indicates October 2023; pending administrative reconciliation.'}
                    </p>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-[#4A4A4A] leading-relaxed line-clamp-3">
                  {event.description}
                </p>

                {/* Resource Persons */}
                {event.resourcePersons && event.resourcePersons.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-[#777777] block mb-1">
                      Resource Persons / Mentors:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {event.resourcePersons.map((rp, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded bg-[#EBEBE8] text-[#242424] border border-[#D8D8D3]"
                        >
                          {rp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Action */}
              <div className="pt-4 mt-6 border-t border-[#EBEBE8] flex items-center justify-between">
                <span className="text-[11px] text-[#777777]">
                  {event.organizer || 'IES IEDC'}
                </span>
                <Link
                  to={`/events/${event.slug}`}
                  className="text-xs font-semibold text-[#161616] hover:underline flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
