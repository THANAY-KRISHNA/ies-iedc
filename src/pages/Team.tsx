import React, { useEffect, useState, useCallback } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { SearchFilterBar } from '../components/ui/SearchFilterBar';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { api } from '../services/api';
import { useRealtimeSync } from '../services/realtime';
import { TeamMember, AcademicYear } from '../types';
import { ROLE_RESPONSIBILITIES } from '../data/initialData';
import { Mail, Linkedin, Shield, User, Award, ArrowUpRight, CheckCircle2 } from 'lucide-react';

// Neutral photo placeholder getter
const getPhotoUrl = (member: TeamMember): string => {
  if (member.photoUrl && member.photoUrl.trim() !== '') {
    return member.photoUrl;
  }
  return '';
};

// Role ordering hierarchy for structured organization
const ROLE_ORDER: string[] = [
  'Nodal Officer',
  'Assistant Nodal Officer',
  'Department Coordinator',
  'IEDC Lead',
  'CEO',
  'CFO',
  'CMO',
  'COO',
  'CTO',
  'CCO',
  'IPR & Research',
  'IPR & Research Lead',
  'Women Lead',
  'Women Innovation Lead',
  'Community',
  'Community Lead',
  'Quality & Operations',
  'Finance',
  'Creative & Innovation',
  'Technology',
  'Branding & Marketing',
  'Web Development',
  'Student Lead',
  'Executive Lead',
  'Core Member'
];

export const Team: React.FC = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('2025–26');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('');
  const [viewMode, setViewMode] = useState<'roster' | 'hierarchy'>('roster');


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

  const loadTeam = useCallback(async () => {
    setLoading(true);
    try {
      const members = await api.getTeam(selectedYear);
      setTeamMembers(members);
    } catch (err) {
      console.error('Failed to load team:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  useRealtimeSync(['team', 'academicYears'], loadTeam);

  // Filtered members by search and role filter dropdown
  const publishedMembers = teamMembers.filter(m => m.status === 'Published');
  const filtered = publishedMembers.filter(m => {
    const matchesSearch =
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.position.toLowerCase().includes(search.toLowerCase()) ||
      m.roleType.toLowerCase().includes(search.toLowerCase()) ||
      (m.department && m.department.toLowerCase().includes(search.toLowerCase()));

    const matchesRole =
      roleFilter === 'All' ||
      (roleFilter === 'Faculty' && (m.roleType === 'Nodal Officer' || m.roleType === 'Assistant Nodal Officer' || m.roleType === 'Department Coordinator')) ||
      (roleFilter === 'Leadership' && (m.roleType === 'Nodal Officer' || m.roleType === 'Assistant Nodal Officer' || m.roleType === 'CEO' || m.roleType === 'IEDC Lead')) ||
      (roleFilter === 'Department Coordinators' && m.roleType === 'Department Coordinator') ||
      (roleFilter === 'Executive Team' && m.roleType !== 'Nodal Officer' && m.roleType !== 'Assistant Nodal Officer' && m.roleType !== 'Department Coordinator');

    return matchesSearch && matchesRole;
  });

  // Extract distinct effective roles for role-based grouping
  const getMemberEffectiveRole = (m: TeamMember): string => {
    if (m.roleType === 'Nodal Officer') return 'Nodal Officer';
    if (m.roleType === 'Assistant Nodal Officer') return 'Assistant Nodal Officer';
    if (m.roleType === 'Department Coordinator') return 'Department Coordinator';
    if (m.roleType === 'IEDC Lead') return 'IEDC Lead';
    
    // For Executive Lead / Student Lead, position or roleType might define role
    if (['CEO', 'CFO', 'CMO', 'COO', 'CTO', 'CCO'].includes(m.roleType)) return m.roleType;
    if (['CEO', 'CFO', 'CMO', 'COO', 'CTO', 'CCO'].includes(m.position)) return m.position;

    if (m.position && m.position !== 'Student Lead' && m.position !== 'Executive Lead') {
      return m.position;
    }
    return m.roleType;
  };

  // Group members by role
  const groupedRoles: { role: string; members: TeamMember[] }[] = [];
  
  // Faculty Leadership is always isolated at top
  const facultyLeaders = filtered.filter(
    m => m.roleType === 'Nodal Officer' || m.roleType === 'Assistant Nodal Officer'
  );
  
  const deptCoordinators = filtered.filter(
    m => m.roleType === 'Department Coordinator'
  );

  // Remaining student executive members grouped by role
  const studentExecs = filtered.filter(
    m => m.roleType !== 'Nodal Officer' && m.roleType !== 'Assistant Nodal Officer' && m.roleType !== 'Department Coordinator'
  );

  // Group student executive team by their effective roles
  const roleMap: Record<string, TeamMember[]> = {};
  studentExecs.forEach(member => {
    const roleKey = getMemberEffectiveRole(member);
    if (!roleMap[roleKey]) {
      roleMap[roleKey] = [];
    }
    roleMap[roleKey].push(member);
  });

  // Sort groups by ROLE_ORDER
  const sortedRoleKeys = Object.keys(roleMap).sort((a, b) => {
    const indexA = ROLE_ORDER.indexOf(a) !== -1 ? ROLE_ORDER.indexOf(a) : 99;
    const indexB = ROLE_ORDER.indexOf(b) !== -1 ? ROLE_ORDER.indexOf(b) : 99;
    return indexA - indexB;
  });

  sortedRoleKeys.forEach(key => {
    groupedRoles.push({
      role: key,
      members: roleMap[key].sort((a, b) => a.sortOrder - b.sortOrder)
    });
  });

  // Generate Quick Navigation Jump Links
  const navTabs: { id: string; label: string }[] = [];
  if (facultyLeaders.length > 0) navTabs.push({ id: 'faculty-leadership', label: 'Faculty Leadership' });
  if (deptCoordinators.length > 0) navTabs.push({ id: 'dept-coordinators', label: 'Department Faculty' });
  groupedRoles.forEach(g => {
    const slugId = `role-${g.role.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    navTabs.push({ id: slugId, label: g.role });
  });

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans text-[#161616]">
      {/* 1. Header Intro */}
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <Badge variant="dark" size="md">
          IES IEDC EXECUTIVE &amp; GOVERNING BODY
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#161616]">
          Meet the Team Building IES IEDC
        </h1>
        <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed">
          Students, faculty leads, and institutional mentors collaborating to nurture an ecosystem of innovation, technology, and student entrepreneurship at IES College of Engineering.
        </p>
      </div>

      {/* 2. View Mode Toggle & Academic Year Selector */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setViewMode('roster')}
          className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            viewMode === 'roster'
              ? 'bg-[#161616] text-white shadow-md'
              : 'neu-button text-[#4A4A4A] hover:text-[#161616]'
          }`}
        >
          Executive Team Roster
        </button>
        <button
          onClick={() => setViewMode('hierarchy')}
          className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            viewMode === 'hierarchy'
              ? 'bg-[#161616] text-white shadow-md'
              : 'neu-button text-[#4A4A4A] hover:text-[#161616]'
          }`}
        >
          Institutional Hierarchy Structure
        </button>
      </div>

      {viewMode === 'hierarchy' ? (
        /* ======================================================== */
        /* IES IEDC INSTITUTIONAL HIERARCHY TREE VIEW              */
        /* ======================================================== */
        <div className="neu-raised rounded-2xl p-6 sm:p-10 border border-[#D8D8D3] space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <Badge variant="dark" size="sm">
              INSTITUTIONAL STRUCTURE &amp; GOVERNANCE HIERARCHY
            </Badge>
            <h2 className="text-2xl font-extrabold text-[#161616]">
              IES IEDC Organisational Tree
            </h2>
            <p className="text-xs text-[#777777]">
              Multi-tiered structure connecting faculty nodal leadership, executive student leads, domain verticals, and department representatives.
            </p>
          </div>

          {/* Hierarchy Chart Tree Node Grid */}
          <div className="space-y-8">
            {/* Level 1: Apex Governance */}
            <div className="flex justify-center">
              <div className="neu-raised rounded-xl p-4 bg-[#161616] text-white text-center w-72 shadow-lg">
                <span className="text-[10px] uppercase font-bold text-gray-400">Apex Body</span>
                <h3 className="text-sm font-extrabold">Innovation &amp; Entrepreneurship Development Centre</h3>
                <p className="text-[11px] text-gray-300">IES College of Engineering</p>
              </div>
            </div>

            {/* Level 2: Executive Committee */}
            <div className="flex justify-center gap-6 flex-wrap">
              <div className="neu-raised-soft rounded-lg p-3 bg-[#242424] text-white text-center w-56 border border-[#333]">
                <span className="text-[9px] uppercase font-bold text-gray-400">Institute Council</span>
                <h4 className="text-xs font-bold">Institute Innovation Council (IIC)</h4>
              </div>
              <div className="neu-raised-soft rounded-lg p-3 bg-[#242424] text-white text-center w-56 border border-[#333]">
                <span className="text-[9px] uppercase font-bold text-gray-400">Governing Body</span>
                <h4 className="text-xs font-bold">Executive Committee</h4>
              </div>
            </div>

            {/* Level 3: Nodal Officers & Student Leads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="neu-raised rounded-lg p-3 text-center border-l-4 border-rose-500 bg-[#FFFFFF]">
                <span className="text-[10px] font-bold text-[#777777]">Nodal Officer I</span>
                <p className="text-xs font-bold text-[#161616]">Ms. Shahaziya Parvez M</p>
                <span className="text-[10px] text-[#777777]">R&amp;AI HOD / Asst. Prof</span>
              </div>
              <div className="neu-raised rounded-lg p-3 text-center border-l-4 border-rose-400 bg-[#FFFFFF]">
                <span className="text-[10px] font-bold text-[#777777]">Nodal Officer II</span>
                <p className="text-xs font-bold text-[#161616]">Ms. Prabhavathi P</p>
                <span className="text-[10px] text-[#777777]">S&amp;H Asst. Prof</span>
              </div>
              <div className="neu-raised rounded-lg p-3 text-center border-l-4 border-emerald-500 bg-[#FFFFFF]">
                <span className="text-[10px] font-bold text-[#777777]">Student Lead I (CEO)</span>
                <p className="text-xs font-bold text-[#161616]">Student Lead / CEO</p>
                <span className="text-[10px] text-[#777777]">Overall Coordination</span>
              </div>
              <div className="neu-raised rounded-lg p-3 text-center border-l-4 border-emerald-400 bg-[#FFFFFF]">
                <span className="text-[10px] font-bold text-[#777777]">Student Lead II</span>
                <p className="text-xs font-bold text-[#161616]">Student Lead II / Ex-CEO</p>
                <span className="text-[10px] text-[#777777]">Guidance &amp; Mentorship</span>
              </div>
            </div>

            {/* Level 4: Domain Verticals */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#777777] block text-center">
                Domain Executive Verticals &amp; Responsibilities
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {[
                  { role: 'Quality & Operations', lead: 'COO', desc: 'File management, reports, permission letters' },
                  { role: 'Finance Lead', lead: 'CFO', desc: 'Financial activities & budget' },
                  { role: 'Creative & Innovation', lead: 'CCO', desc: 'Logo/poster design & branding' },
                  { role: 'Technology Lead', lead: 'CTO', desc: 'KSUM link & technical forms' },
                  { role: 'Branding & Marketing', lead: 'CMO', desc: 'Notice boards, social media, press' },
                  { role: 'Community Lead', lead: 'Community', desc: 'Student, alumni & mentor community' },
                  { role: 'Women Innovation', lead: 'Women Lead', desc: 'Women participation in startup' },
                  { role: 'IPR & Research', lead: 'IPR Lead', desc: 'Intellectual property rights' }
                ].map((item, idx) => (
                  <div key={idx} className="neu-raised-soft rounded-lg p-3 border border-[#D8D8D3] text-center space-y-1">
                    <span className="text-[9px] font-extrabold uppercase text-[#777777] block">{item.lead}</span>
                    <h5 className="text-[11px] font-bold text-[#161616] leading-tight">{item.role}</h5>
                    <p className="text-[9px] text-[#777777] leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Level 5: Department Representatives */}
            <div className="neu-raised-soft rounded-xl p-4 border border-[#D8D8D3] text-center space-y-2">
              <span className="text-[10px] font-bold uppercase text-[#777777]">Departmental Coordinators &amp; Representatives</span>
              <div className="flex flex-wrap justify-center gap-2">
                {['CE (Civil)', 'ME (Mechanical)', 'CSE (Computer Science)', 'EEE (Electrical)', 'ECE (Electronics)', 'R&AI (Robotics)', 'DS (Data Science)', 'S&H (Science & Humanities)'].map((dept, i) => (
                  <span key={i} className="px-2.5 py-1 text-[11px] font-semibold bg-[#FFFFFF] border border-[#D8D8D3] rounded-md text-[#161616]">
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* TEAM ROSTER VIEW                                         */
        /* ======================================================== */
        <div className="neu-raised rounded-2xl p-6 border border-[#D8D8D3] space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#EBEBE8] pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#777777] uppercase tracking-wider mr-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#161616]" />
                Academic Year:
              </span>
              {academicYears.map(year => (
                <button
                  key={year.id}
                  onClick={() => setSelectedYear(year.year)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                    selectedYear === year.year
                      ? 'bg-[#161616] text-white shadow-md'
                      : 'neu-button text-[#4A4A4A] hover:text-[#161616]'
                  }`}
                >
                  <span>{year.year}</span>
                  {year.isCurrent && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500 text-white rounded font-extrabold uppercase">
                      Current
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="text-xs font-semibold text-[#777777] bg-[#F5F5F3] px-3 py-1.5 rounded-lg border border-[#D8D8D3]">
              Active Roster: <strong className="text-[#161616]">{filtered.length} Verified Members</strong>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <SearchFilterBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search member name, role, department, or responsibility..."
            filters={[
              {
                name: 'role',
                value: roleFilter,
                placeholder: 'Filter All Roles',
                options: [
                  { label: 'Faculty Leadership', value: 'Faculty' },
                  { label: 'Department Faculty', value: 'Department Coordinators' },
                  { label: 'Student Executive Team', value: 'Executive Team' }
                ],
                onChange: setRoleFilter
              }
            ]}
          />

          {/* 3. Sticky Quick-Role Navigation Links */}
          {!loading && navTabs.length > 0 && (
            <div className="pt-2 border-t border-[#EBEBE8]">
              <p className="text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-2.5">
                Quick Role Jump:
              </p>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {navTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      activeTab === tab.id
                        ? 'bg-[#242424] text-white border-[#242424] shadow-sm'
                        : 'bg-[#F0F0ED] text-[#4A4A4A] border-[#D8D8D3] hover:bg-[#EBEBE8] hover:text-[#161616]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading & Empty States */}
      {loading ? (
        <LoadingState message={`Loading ${selectedYear} verified team roster & photographs...`} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={`No published team members found for ${selectedYear}`}
          description="Try clearing your search terms or select another academic year archive."
        />
      ) : (
        <div className="space-y-16">
          {/* ======================================================== */}
          {/* 1. FACULTY LEADERSHIP SECTION                             */}
          {/* ======================================================== */}
          {facultyLeaders.length > 0 && (
            <section id="faculty-leadership" className="space-y-6 pt-4">
              <div className="flex items-center gap-3 pb-3 border-b-2 border-[#161616]">
                <Shield className="w-6 h-6 text-[#161616]" />
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#777777]">
                    Governing Body
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#161616]">
                    Faculty Leadership &amp; Nodal Officers
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {facultyLeaders.map(member => (
                  <div
                    key={member.id}
                    className="neu-raised rounded-2xl p-6 border border-[#D8D8D3] flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-all duration-300 hover:shadow-xl group"
                  >
                    {/* Member Photo Frame */}
                    <div className="relative w-36 h-44 sm:w-40 sm:h-48 rounded-xl overflow-hidden neu-raised border-2 border-[#FFFFFF] shrink-0 bg-[#EBEBE8] flex items-center justify-center">
                      {member.photoUrl && member.photoUrl.trim() !== '' ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                          <div className="w-12 h-12 rounded-full neu-inset flex items-center justify-center text-[#777777] bg-[#E0E0DD]">
                            <User className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-bold text-[#777777]">Photo Pending</span>
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#161616]/90 backdrop-blur-md text-white text-[10px] font-extrabold rounded">
                        {member.roleType}
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 space-y-3 text-center sm:text-left">
                      <div>
                        <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">
                          {member.department ? `Dept. of ${member.department}` : 'Institutional Lead'}
                        </span>
                        <h3 className="text-xl font-extrabold text-[#161616] leading-snug">
                          {member.name}
                        </h3>
                        {member.designation && (
                          <p className="text-xs font-semibold text-[#4A4A4A] mt-0.5">
                            {member.designation}
                          </p>
                        )}
                      </div>

                      <p className="text-xs text-[#242424] bg-[#F5F5F3] p-3 rounded-xl border border-[#D8D8D3] italic leading-relaxed">
                        "{member.responsibility || ROLE_RESPONSIBILITIES[member.roleType] || 'Coordinates and leads IEDC initiatives.'}"
                      </p>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#161616] hover:underline bg-[#FFFFFF] px-3 py-1.5 rounded-lg border border-[#D8D8D3] neu-raised-soft"
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
            </section>
          )}

          {/* ======================================================== */}
          {/* 2. DEPARTMENT FACULTY COORDINATORS SECTION               */}
          {/* ======================================================== */}
          {deptCoordinators.length > 0 && (
            <section id="dept-coordinators" className="space-y-6 pt-4">
              <div className="flex items-center gap-3 pb-3 border-b-2 border-[#242424]">
                <User className="w-5 h-5 text-[#242424]" />
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#777777]">
                    Departmental Oversight
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#161616]">
                    Department Faculty Coordinators
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {deptCoordinators.map(member => (
                  <div
                    key={member.id}
                    className="neu-raised-soft rounded-2xl p-5 border border-[#D8D8D3] flex flex-col justify-between space-y-4 group hover:border-[#161616] transition-all"
                  >
                    <div className="space-y-3">
                      {/* Photo Thumbnail */}
                      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#EBEBE8] border border-[#D8D8D3] flex items-center justify-center">
                        {member.photoUrl && member.photoUrl.trim() !== '' ? (
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-3 text-center space-y-1">
                            <div className="w-10 h-10 rounded-full neu-inset flex items-center justify-center text-[#777777] bg-[#E0E0DD]">
                              <User className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold text-[#777777]">Photo Pending</span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant="dark" size="sm">
                            {member.department || 'General'}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-[#161616] group-hover:text-black">
                          {member.name}
                        </h4>
                        <p className="text-xs text-[#777777] font-semibold">{member.position}</p>
                        {member.responsibility && (
                          <p className="text-[11px] text-[#4A4A4A] italic pt-1 leading-relaxed">
                            {member.responsibility}
                          </p>
                        )}
                      </div>
                    </div>

                    {member.email && (
                      <div className="pt-2 border-t border-[#EBEBE8]">
                        <a
                          href={`mailto:${member.email}`}
                          className="text-[11px] text-[#4A4A4A] hover:text-[#161616] hover:underline flex items-center gap-1.5 truncate font-medium"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#777777] shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ======================================================== */}
          {/* 3. DYNAMIC ROLE-BASED STUDENT EXECUTIVE SECTIONS         */}
          {/* ======================================================== */}
          {groupedRoles.map(group => {
            const slugId = `role-${group.role.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
            const roleDesc = ROLE_RESPONSIBILITIES[group.role] || 'Student executive role managing key operations of IES IEDC.';

            // Dynamic grid layout based on number of members in role
            const isSingle = group.members.length === 1;
            const isDual = group.members.length === 2;

            return (
              <section key={group.role} id={slugId} className="space-y-6 pt-4">
                {/* Role Section Heading Header */}
                <div className="flex items-center justify-between pb-3 border-b-2 border-[#161616]">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#777777]">
                      Student Executive Role
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#161616]">
                      {group.role}
                    </h2>
                  </div>
                  <Badge variant="outline" size="md">
                    {group.members.length} {group.members.length === 1 ? 'Member' : 'Members'}
                  </Badge>
                </div>

                {/* Role Description Header */}
                {roleDesc && (
                  <p className="text-xs sm:text-sm text-[#4A4A4A] italic bg-[#F5F5F3] px-4 py-2.5 rounded-xl border border-[#D8D8D3] max-w-3xl">
                    <strong>Role Summary:</strong> {roleDesc}
                  </p>
                )}

                {/* Member Cards Layout */}
                <div
                  className={`grid gap-6 ${
                    isSingle
                      ? 'grid-cols-1 max-w-md mx-auto'
                      : isDual
                      ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  }`}
                >
                  {group.members.map(member => (
                    <div
                      key={member.id}
                      className="neu-raised rounded-2xl overflow-hidden border border-[#D8D8D3] flex flex-col justify-between group hover:border-[#161616] hover:shadow-xl transition-all duration-300 bg-[#FFFFFF]"
                    >
                      {/* Photo Section */}
                      <div className="relative w-full h-56 bg-[#EBEBE8] overflow-hidden flex items-center justify-center border-b border-[#D8D8D3]">
                        {member.photoUrl && member.photoUrl.trim() !== '' ? (
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4 text-center space-y-1.5">
                            <div className="w-14 h-14 rounded-full neu-inset flex items-center justify-center text-[#777777] bg-[#E0E0DD]">
                              <User className="w-7 h-7" />
                            </div>
                            <span className="text-xs font-bold text-[#4A4A4A]">Photo Pending</span>
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2.5 py-1 bg-[#161616]/90 backdrop-blur-md text-white text-[10px] font-extrabold rounded-lg shadow">
                            {group.role}
                          </span>
                          {member.department && (
                            <span className="px-2 py-1 bg-[#FFFFFF]/90 backdrop-blur-md text-[#161616] text-[10px] font-extrabold rounded-lg shadow">
                              {member.department}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h3 className="text-base font-extrabold text-[#161616] leading-tight group-hover:text-black">
                            {member.name}
                          </h3>
                          <p className="text-xs font-semibold text-[#777777]">
                            {member.position || group.role}
                          </p>
                          {member.responsibility && (
                            <p className="text-xs text-[#4A4A4A] italic leading-relaxed pt-1 border-t border-[#EBEBE8]">
                              "{member.responsibility}"
                            </p>
                          )}
                        </div>

                        {/* Social / Contact links */}
                        {(member.email || member.linkedinUrl) && (
                          <div className="pt-3 border-t border-[#EBEBE8] flex items-center justify-between gap-2">
                            {member.email && (
                              <a
                                href={`mailto:${member.email}`}
                                className="text-[11px] font-bold text-[#4A4A4A] hover:text-[#161616] flex items-center gap-1.5 truncate"
                              >
                                <Mail className="w-3.5 h-3.5 text-[#777777] shrink-0" />
                                <span className="truncate">{member.email}</span>
                              </a>
                            )}
                            {member.linkedinUrl && (
                              <a
                                href={member.linkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 bg-[#F0F0ED] hover:bg-[#161616] text-[#242424] hover:text-white rounded-lg transition-colors shrink-0"
                                title="LinkedIn Profile"
                              >
                                <Linkedin className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};

