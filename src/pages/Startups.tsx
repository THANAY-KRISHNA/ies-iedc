import React, { useEffect, useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { StartupItem } from '../types';
import { Rocket, ExternalLink, ShieldCheck, Building2, CheckCircle, Sparkles } from 'lucide-react';

export const Startups: React.FC = () => {
  const [startups, setStartups] = useState<StartupItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStartups() {
      try {
        const data = await api.getStartups();
        setStartups(data);
      } catch (err) {
        console.error('Failed to load startups:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStartups();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. Header */}
      <SectionHeader
        tag="Enterprise Incubation"
        title="Campus Startups &amp; Ventures"
        subtitle="Student-founded technology ventures, registered entities, and pre-incubation companies from IES College of Engineering."
      />

      {/* 2. Startups Showcase or Strict Empty State */}
      {loading ? (
        <LoadingState message="Loading campus startup records..." />
      ) : startups.length === 0 ? (
        <EmptyState
          icon={<Rocket className="w-6 h-6 text-[#777777]" />}
          title="Startups will be updated by the IEDC team."
          description="Official student-led companies undergoing incorporation and KSUM validation will be listed here after formal administrative review."
          action={
            <Link to="/ideas#submit">
              <Button variant="primary" icon={<Sparkles className="w-4 h-4" />}>
                Submit Startup Idea for Incubation
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map(startup => (
            <div
              key={startup.id}
              className="neu-raised rounded-xl p-6 border border-[#D8D8D3] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="dark" size="sm">
                    {startup.department || 'IESCE'}
                  </Badge>
                  <Badge variant="success" size="sm">
                    {startup.status}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-[#161616]">{startup.name}</h3>

                <p className="text-xs text-[#777777]">
                  <strong className="text-[#242424]">Founders:</strong> {startup.founderTeam}
                </p>

                <p className="text-xs text-[#4A4A4A] leading-relaxed line-clamp-3">
                  {startup.description}
                </p>

                <div className="space-y-1 text-xs text-[#4A4A4A]">
                  <p>
                    <strong className="text-[#161616]">Problem Solved:</strong>{' '}
                    {startup.problemSolved}
                  </p>
                  <p>
                    <strong className="text-[#161616]">Product / Service:</strong>{' '}
                    {startup.productService}
                  </p>
                </div>
              </div>

              {startup.websiteUrl && (
                <div className="pt-3 border-t border-[#EBEBE8]">
                  <a
                    href={startup.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#161616] hover:underline"
                  >
                    <span>Visit Company Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. Incubation Support Offerings */}
      <div className="neu-raised rounded-2xl p-8 md:p-12 border border-[#D8D8D3] space-y-8">
        <div className="max-w-2xl space-y-2">
          <h3 className="text-xl font-bold text-[#161616]">Campus Pre-Incubation Facilities</h3>
          <p className="text-xs text-[#777777] leading-relaxed">
            IES IEDC provides students with physical, technological, and regulatory support to turn
            academic research into viable startups.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="neu-raised-soft rounded-xl p-5 border border-[#D8D8D3] space-y-2">
            <h4 className="text-sm font-bold text-[#161616]">Maker Space &amp; Fab Lab</h4>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              Equipped with 3D printers, PCB prototyping, IoT sensors, and high-performance computing
              workstations.
            </p>
          </div>

          <div className="neu-raised-soft rounded-xl p-5 border border-[#D8D8D3] space-y-2">
            <h4 className="text-sm font-bold text-[#161616]">KSUM Seed Assistance</h4>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              Direct guidance to apply for Kerala Startup Mission early-stage idea grants of up to ₹2
              Lakhs.
            </p>
          </div>

          <div className="neu-raised-soft rounded-xl p-5 border border-[#D8D8D3] space-y-2">
            <h4 className="text-sm font-bold text-[#161616]">Legal &amp; IP Protection</h4>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              Assistance with company incorporation (Pvt Ltd / LLP), GST registration, and patent
              filing support.
            </p>
          </div>

          <div className="neu-raised-soft rounded-xl p-5 border border-[#D8D8D3] space-y-2">
            <h4 className="text-sm font-bold text-[#161616]">Academic Credits</h4>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              Activity points and student entrepreneurship attendance incentives under university
              guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
