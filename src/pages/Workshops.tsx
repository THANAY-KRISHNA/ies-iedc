import React, { useEffect, useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { api } from '../services/api';
import { WorkshopItem } from '../types';
import { Calendar, MapPin, CheckCircle, ExternalLink, Award, Users } from 'lucide-react';

export const Workshops: React.FC = () => {
  const [workshops, setWorkshops] = useState<WorkshopItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getWorkshops();
        setWorkshops(data);
      } catch (err) {
        console.error('Failed to load workshops:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SectionHeader
        tag="Skill Development"
        title="Workshops, Bootcamps &amp; Masterclasses"
        subtitle="Hands-on technical workshops, product development masterclasses, and design thinking bootcamps."
      />

      {loading ? (
        <LoadingState message="Loading workshops records..." />
      ) : workshops.length === 0 ? (
        <EmptyState
          title="No upcoming workshops scheduled"
          description="Check back soon for announcements regarding upcoming IEDC technical training bootcamps."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map(ws => (
            <div
              key={ws.id}
              className="neu-raised rounded-xl p-6 border border-[#D8D8D3] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="dark" size="sm">
                    {ws.academicYear}
                  </Badge>
                  <Badge
                    variant={ws.status === 'Completed' ? 'neutral' : 'success'}
                    size="sm"
                  >
                    {ws.status}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-[#161616] leading-snug">{ws.title}</h3>

                <div className="space-y-1 text-xs text-[#777777]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#242424]" />
                    <span>{ws.displayDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#242424]" />
                    <span>{ws.venue}</span>
                  </div>
                </div>

                <p className="text-xs text-[#4A4A4A] leading-relaxed line-clamp-3">
                  {ws.description}
                </p>

                {ws.topicsCovered && ws.topicsCovered.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-[#777777] block mb-1">
                      Curriculum Topics:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {ws.topicsCovered.map((topic, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#EBEBE8] text-[#242424] border border-[#D8D8D3]"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#EBEBE8] flex items-center justify-between text-xs">
                <span className="text-[#777777]">
                  {ws.certificateProvided ? 'KTU Activity Points eligible' : 'Workshop'}
                </span>
                {ws.registrationUrl ? (
                  <a
                    href={ws.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#161616] hover:underline flex items-center gap-1"
                  >
                    <span>Register</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="font-semibold text-[#242424]">Completed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
