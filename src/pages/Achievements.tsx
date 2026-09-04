import React, { useEffect, useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { api } from '../services/api';
import { Achievement, AcademicYear } from '../types';
import { Award, CheckCircle, Calendar, ShieldCheck, Trophy } from 'lucide-react';

export const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadYears() {
      try {
        const years = await api.getAcademicYears();
        setAcademicYears(years);
      } catch (err) {
        console.error('Error loading academic years:', err);
      }
    }
    loadYears();
  }, []);

  useEffect(() => {
    async function loadAchievements() {
      setLoading(true);
      try {
        const data = await api.getAchievements({
          year: selectedYear === 'All' ? undefined : selectedYear
        });
        setAchievements(data);
      } catch (err) {
        console.error('Error loading achievements:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAchievements();
  }, [selectedYear]);

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. Header */}
      <SectionHeader
        tag="Student Recognitions"
        title="Institutional &amp; Student Achievements"
        subtitle="Verified state and national awards, hackathon recognitions, and Kerala Startup Mission certifications."
      />

      {/* 2. Academic Year Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#777777] uppercase tracking-wider mr-2">
          Academic Year:
        </span>
        <button
          onClick={() => setSelectedYear('All')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
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
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedYear === y.year
                ? 'neu-button'
                : 'neu-raised-soft text-[#4A4A4A] hover:text-[#161616]'
            }`}
          >
            {y.year}
            {y.isCurrent && (
              <span className="ml-1 text-[10px] px-1 py-0.2 bg-[#242424] text-white rounded">
                Current
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 3. Achievements List or Verified Empty State */}
      {loading ? (
        <LoadingState message="Loading verified achievement records..." />
      ) : achievements.length === 0 ? (
        <EmptyState
          icon={<Trophy className="w-6 h-6 text-[#777777]" />}
          title="Achievements will be updated by the IEDC team."
          description={`Verified competitive awards, state grant disbursements, and hackathon finalists for ${selectedYear} are currently being audited by the Achievement Admin panel.`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className="neu-raised rounded-xl p-6 border border-[#D8D8D3] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="dark" size="sm">
                    {ach.academicYear}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1E3A1E] bg-[#EFEFEA] px-2 py-0.5 rounded border border-[#C5D5C5]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A1E]" />
                    Verified Entry
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#161616] leading-snug">{ach.title}</h3>

                <div className="space-y-1 text-xs text-[#777777]">
                  <p>
                    <strong className="text-[#242424]">Recipients:</strong> {ach.recipients}
                  </p>
                  <p>
                    <strong className="text-[#242424]">Category:</strong> {ach.category}
                  </p>
                </div>

                <p className="text-xs text-[#4A4A4A] leading-relaxed">{ach.description}</p>
              </div>

              {ach.verificationInfo && (
                <div className="pt-3 border-t border-[#EBEBE8] text-[11px] text-[#777777]">
                  <span className="font-semibold text-[#242424]">Verification: </span>
                  {ach.verificationInfo}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
