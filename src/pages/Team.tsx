import React, { useEffect, useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { SearchFilterBar } from '../components/ui/SearchFilterBar';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { api } from '../services/api';
import { TeamMember, AcademicYear } from '../types';
import { Mail, Linkedin, UserCheck, Shield } from 'lucide-react';

export const Team: React.FC = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('2025–26');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAcademicYears() {
      try {
        const years = await api.getAcademicYears();
        setAcademicYears(years);
        const current = years.find(y => y.isCurrent);
        if (current) setSelectedYear(current.year);
      } catch (err) {
        console.error('Failed to load academic years:', err);
      }
    }
    loadAcademicYears();
  }, []);

  useEffect(() => {
    async function loadTeam() {
      setLoading(true);
      try {
        const members = await api.getTeam(selectedYear);
        setTeamMembers(members);
      } catch (err) {
        console.error('Failed to load team:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, [selectedYear]);

  // Filtered members
  const filtered = teamMembers.filter(m => {
    const matchesSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.position.toLowerCase().includes(search.toLowerCase()) ||
      (m.department && m.department.toLowerCase().includes(search.toLowerCase()));

    const matchesRole =
      roleFilter === 'All' ||
      (roleFilter === 'Faculty' && (m.roleType === 'Nodal Officer' || m.roleType === 'Assistant Nodal Officer' || m.roleType === 'Department Coordinator')) ||
      (roleFilter === 'Leadership' && (m.roleType === 'Nodal Officer' || m.roleType === 'Assistant Nodal Officer')) ||
      (roleFilter === 'Department Coordinators' && m.roleType === 'Department Coordinator') ||
      (roleFilter === 'Student Leads' && m.roleType === 'Student Lead');

    return matchesSearch && matchesRole;
  });

  // Group by category for clear institutional hierarchy
  const facultyLeadership = filtered.filter(
    m => m.roleType === 'Nodal Officer' || m.roleType === 'Assistant Nodal Officer'
  );
  const departmentCoordinators = filtered.filter(
    m => m.roleType === 'Department Coordinator'
  );
  const studentLeads = filtered.filter(
    m => m.roleType === 'Student Lead'
  );

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. Section Header */}
      <SectionHeader
        tag="Executive Cell"
        title="IEDC Team &amp; Academic Archives"
        subtitle="Institutional leadership, department coordinators, and student executive committee members."
      />

      {/* 2. Academic Year Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Year Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#777777] uppercase tracking-wider mr-2">
            Academic Year:
          </span>
          {academicYears.map(year => (
            <button
              key={year.id}
              onClick={() => setSelectedYear(year.year)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedYear === year.year
                  ? 'neu-button'
                  : 'neu-raised-soft text-[#4A4A4A] hover:text-[#161616]'
              }`}
            >
              {year.year}
              {year.isCurrent && (
                <span className="ml-1.5 text-[10px] px-1.5 py-0.2 bg-[#242424] text-white rounded">
                  Current
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filter & Search */}
        <SearchFilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by member name, designation, or department..."
          filters={[
            {
              name: 'role',
              value: roleFilter,
              placeholder: 'All Roles',
              options: [
                { label: 'Faculty Leadership', value: 'Leadership' },
                { label: 'Department Coordinators', value: 'Department Coordinators' },
                { label: 'Student Executive Leads', value: 'Student Leads' }
              ],
              onChange: setRoleFilter
            }
          ]}
        />
      </div>

      {/* 3. Team Member Cards Grid */}
      {loading ? (
        <LoadingState message={`Loading ${selectedYear} verified team records...`} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={`No team records found for ${selectedYear}`}
          description="Try adjusting your search query or selecting a different academic year archive."
        />
      ) : (
        <div className="space-y-12">
          {/* Section: Faculty Leadership */}
          {facultyLeadership.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#D8D8D3]">
                <Shield className="w-4 h-4 text-[#242424]" />
                <h3 className="text-base font-bold text-[#161616]">
                  Faculty Leadership &amp; Nodal Officers
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {facultyLeadership.map(member => (
                  <div
                    key={member.id}
                    className="neu-raised rounded-xl p-6 border border-[#D8D8D3] flex flex-col sm:flex-row items-start sm:items-center gap-5"
                  >
                    <div className="w-16 h-16 rounded-xl neu-raised border border-[#D8D8D3] flex items-center justify-center text-[#161616] font-extrabold text-xl shrink-0">
                      {member.name
                        .split(' ')
                        .map(n => n[0])
                        .filter((_, i) => i < 2)
                        .join('')}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-bold text-[#161616]">{member.name}</h4>
                        <Badge variant="dark" size="sm">
                          {member.position}
                        </Badge>
                      </div>
                      {member.designation && (
                        <p className="text-xs text-[#777777] font-medium">{member.designation}</p>
                      )}
                      {member.department && (
                        <p className="text-xs text-[#4A4A4A]">Department: {member.department}</p>
                      )}
                      {member.responsibility && (
                        <p className="text-xs text-[#777777] italic pt-1">
                          Role: {member.responsibility}
                        </p>
                      )}

                      <div className="flex items-center gap-3 pt-2">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="text-xs text-[#242424] hover:underline flex items-center gap-1 font-medium"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#777777]" />
                            <span>{member.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Department Coordinators */}
          {departmentCoordinators.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#D8D8D3]">
                <UserCheck className="w-4 h-4 text-[#242424]" />
                <h3 className="text-base font-bold text-[#161616]">
                  Department Faculty Coordinators
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {departmentCoordinators.map(member => (
                  <div
                    key={member.id}
                    className="neu-raised-soft rounded-xl p-5 border border-[#D8D8D3] space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start">
                        <Badge variant="neutral" size="sm">
                          {member.department || 'General'}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-[#161616] leading-snug">{member.name}</h4>
                      <p className="text-xs text-[#777777] font-medium">{member.position}</p>
                      {member.designation && (
                        <p className="text-[11px] text-[#4A4A4A]">{member.designation}</p>
                      )}
                    </div>

                    {member.email && (
                      <div className="pt-2 border-t border-[#EBEBE8]">
                        <a
                          href={`mailto:${member.email}`}
                          className="text-[11px] text-[#4A4A4A] hover:underline flex items-center gap-1 truncate"
                        >
                          <Mail className="w-3 h-3 text-[#777777] shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Student Executive Committee */}
          {studentLeads.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#D8D8D3]">
                <UserCheck className="w-4 h-4 text-[#242424]" />
                <h3 className="text-base font-bold text-[#161616]">
                  Student Executive Committee ({selectedYear})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {studentLeads.map(member => (
                  <div
                    key={member.id}
                    className="neu-raised-soft rounded-xl p-5 border border-[#D8D8D3] space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <Badge variant="outline" size="sm">
                        {member.position}
                      </Badge>
                      <h4 className="text-sm font-bold text-[#161616]">{member.name}</h4>
                      {member.department && (
                        <p className="text-xs text-[#777777]">Dept of {member.department}</p>
                      )}
                      {member.responsibility && (
                        <p className="text-[11px] text-[#4A4A4A] italic leading-relaxed pt-1">
                          "{member.responsibility}"
                        </p>
                      )}
                    </div>

                    {member.email && (
                      <div className="pt-2 border-t border-[#EBEBE8]">
                        <a
                          href={`mailto:${member.email}`}
                          className="text-[11px] text-[#4A4A4A] hover:underline flex items-center gap-1 truncate"
                        >
                          <Mail className="w-3 h-3 text-[#777777] shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
