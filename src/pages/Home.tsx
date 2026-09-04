import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowDown,
  Lightbulb,
  PlusCircle,
  Lock,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  BookOpen,
  Camera,
  Layers,
  Wrench,
  Rocket,
  Shield,
  Send,
  HelpCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { EventItem, TeamMember, StudentIdea } from '../types';
import { IdeaWizardModal } from '../components/modals/IdeaWizardModal';
import { AdminQuickDrawer } from '../components/modals/AdminQuickDrawer';

export const Home: React.FC = () => {
  // Modal states
  const [wizardOpen, setWizardOpen] = useState(false);
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);

  // Tab Filter States
  const [eventFilter, setEventFilter] = useState('all');
  const [teamTab, setTeamTab] = useState('2024-25');

  // Data states
  const [events, setEvents] = useState<EventItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Global event listeners for modal triggers from Navbar/Footer
  useEffect(() => {
    const handleOpenWizard = () => setWizardOpen(true);
    const handleOpenAdmin = () => setAdminDrawerOpen(true);

    window.addEventListener('open-idea-wizard', handleOpenWizard);
    window.addEventListener('open-admin-drawer', handleOpenAdmin);

    return () => {
      window.removeEventListener('open-idea-wizard', handleOpenWizard);
      window.removeEventListener('open-admin-drawer', handleOpenAdmin);
    };
  }, []);

  // Fetch API data
  useEffect(() => {
    async function fetchData() {
      try {
        const evts = await api.getEvents();
        setEvents(evts);
      } catch (e) {
        console.error('Error fetching home data', e);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const yearQuery = teamTab === '2024-25' ? '2024–25' : teamTab === '2023-24' ? '2023–24' : '2025–26';
        const members = await api.getTeam(yearQuery);
        setTeamMembers(members);
      } catch (e) {
        console.error('Error fetching team data', e);
      }
    }
    fetchTeam();
  }, [teamTab]);

  return (
    <div className="flex flex-col w-full bg-[#F8F9FA] text-[#1A2232] antialiased overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 01. EDITORIAL HERO SECTION */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pt-12 pb-16 border-b border-[#D5D9E0]/60 bg-white/60">
        <div className="max-w-[1700px] mx-auto flex flex-col gap-10">
          {/* Top Editorial Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#D5D9E0]/60 text-xs font-mono uppercase tracking-wider text-[#5F6B7D]">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="px-2.5 py-1 rounded bg-[#F1F2F5] border border-[#D5D9E0] text-[#1A365D] font-bold tracking-widest text-[10px]">
                INNOVATION &amp; ENTREPRENEURSHIP DEVELOPMENT CENTRE
              </span>
              <span className="text-[#D5D9E0] hidden sm:inline">•</span>
              <span className="px-2 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-[10px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                KSUM SANCTIONED HUB
              </span>
              <span className="px-2 py-0.5 rounded bg-[#F1F2F5] text-[#5F6B7D] border border-[#D5D9E0] text-[10px] font-semibold">
                MINISTRY OF HRD IIC
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#1A2232] font-sans text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#1A365D]"></span>
              <span>GOVT. OF KERALA / APJ KTU AFFILIATED</span>
            </div>
          </div>

          {/* Main Editorial Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 text-[#10B981] font-bold text-xs uppercase tracking-widest font-display">
                  <span className="w-2 h-0.5 bg-[#10B981]"></span>
                  Innovate • Create • Entrepreneur
                </div>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#1A365D] leading-[1.05]">
                  IES IEDC
                </h1>
                <p className="font-display text-xl sm:text-2xl text-[#2B3547] font-medium tracking-tight mt-1">
                  IES College of Engineering, Chittilappilly, Thrissur
                </p>
              </div>

              <div className="p-6 sm:p-7 rounded-sm bg-[#F1F2F5] border border-[#D5D9E0] shadow-neu-flat border-l-4 border-l-[#1A365D] flex flex-col gap-3">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#1A365D]">
                  <span>Verified Institutional Charter</span>
                  <span className="font-mono text-[#5F6B7D] text-[10px]">EST. 2016 // REG. KL-TCR-IES</span>
                </div>
                <p className="text-sm sm:text-base text-[#2B3547] leading-relaxed font-normal">
                  Established in 2016 under the aegis of the Kerala Startup Mission (KSUM), IES IEDC serves as an apex student-driven innovation body fostering technological competence, design thinking, and venture ideation.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 pt-2">
                <a
                  href="#what-we-do"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-sm bg-[#1A365D] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#1A2232] transition-all duration-150 active:scale-95 active:shadow-neu-inset shadow-neu-button flex items-center justify-center gap-2 select-none"
                >
                  <span>Explore IEDC</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setWizardOpen(true)}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-sm bg-white text-[#1A365D] text-xs font-semibold tracking-wider uppercase hover:bg-[#F1F2F5] border border-[#D5D9E0] transition-all duration-150 active:scale-95 active:shadow-neu-inset shadow-neu-button flex items-center justify-center gap-2 cursor-pointer select-none"
                >
                  <Lightbulb className="w-4 h-4 text-[#10B981]" />
                  <span>Submit Your Idea</span>
                </button>
              </div>
            </div>

            {/* Right Architectural Credential Anchor (5 cols) */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col gap-6 relative overflow-hidden">
                {/* Top Emblem & ID Bar */}
                <div className="flex items-center justify-between pb-5 border-b border-[#D5D9E0]/60">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-md bg-[#000000] border border-[#D5D9E0] flex items-center justify-center overflow-hidden shadow-neu-button shrink-0 p-1">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPXx29sBB589d6ZZ8RFQvHqyJThD0_bxUv_WqBhkexSPHfMFa2J77ZoKmDO0G94AwzRxy4pZbswkeHcnW17jZxkW2IYTG4hPt3zH7ZBJ1n2yMLy0Y29baeoMOXRyKkIqMfkKdbU64kyIjx_sARkCzGzTk2fkhIt944OKmAVSIChGi0JmZv807ti1zV0nyC26Svc_kSpi4xthhKtnAciL7icqDjGaj-Q9dYToCwmbBpvLUX8JI4HgQMizs3mgR5bwo3SM0"
                        alt="Official IES IEDC Brand Emblem"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-display font-bold text-sm text-[#1A365D]">Institutional Testbed</span>
                      <span className="text-[11px] text-[#5F6B7D] font-mono uppercase">Empirical Sandbox</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-[#10B981]/10 text-[#10B981] font-mono text-[10px] font-bold border border-[#10B981]/20 uppercase tracking-wide">
                    Active Chapter
                  </span>
                </div>

                {/* 3 Verticals Summary */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#5F6B7D] font-mono">
                    Operational Framework
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    <div className="p-3 rounded bg-[#F1F2F5] border border-[#D5D9E0]/70 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                        <span className="text-xs font-bold text-[#1A365D]">Innovation &amp; Design</span>
                      </div>
                      <span className="text-[11px] text-[#5F6B7D] font-mono">Vertical 01</span>
                    </div>
                    <div className="p-3 rounded bg-[#F1F2F5] border border-[#D5D9E0]/70 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1A365D]"></span>
                        <span className="text-xs font-bold text-[#1A365D]">Technical Exposure</span>
                      </div>
                      <span className="text-[11px] text-[#5F6B7D] font-mono">Vertical 02</span>
                    </div>
                    <div className="p-3 rounded bg-[#F1F2F5] border border-[#D5D9E0]/70 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]"></span>
                        <span className="text-xs font-bold text-[#1A365D]">Entrepreneurship</span>
                      </div>
                      <span className="text-[11px] text-[#5F6B7D] font-mono">Vertical 03</span>
                    </div>
                  </div>
                </div>

                {/* Ethos Tagline Pill */}
                <div className="pt-4 border-t border-[#D5D9E0]/60 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-[#10B981]" />
                    <span className="font-bold text-[#1A2232]">Learning by Doing (DIY)</span>
                  </div>
                  <span className="text-[#5F6B7D] font-mono text-[10px]">7 DEPARTMENTS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02. OFFICIAL AFFILIATIONS & STRATEGIC ECOSYSTEM */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-10 bg-[#F1F2F5]/60 border-b border-[#D5D9E0]/60" id="affiliations">
        <div className="max-w-[1700px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              <span className="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest">
                Official Affiliations &amp; Strategic Ecosystem
              </span>
            </div>
            <span className="text-xs text-[#5F6B7D] font-mono uppercase tracking-wider">
              Statutory Bodies &amp; Frameworks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Partner 1: KSUM */}
            <div className="p-4 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-3 hover:border-[#1A365D]/50 transition-all">
              <div className="flex items-center justify-between pb-2 border-b border-[#D5D9E0]/60">
                <span className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-wider">Apex State Body</span>
                <span className="text-[10px] font-mono text-[#5F6B7D]">KL-TCR-IES</span>
              </div>
              <div className="py-2 flex items-center justify-center bg-[#0e131b] rounded border border-[#D5D9E0]/40">
                <div className="logo-crop-box crop-ksum">
                  <img
                    alt="Kerala Startup Mission IEDC - IES College of Engineering"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuANJ-mJAqf3uKPgkGwDihOomqkVW9KwuI_jbyedaVwIGdt46fs9C-yY9P4VyY-YYoIa0DREuZZEEFFcO4KzEWGNPkCGn-mOnLrJf01_eh3IuvRlcBOhlJm-Va79EqmwwN2962_miS3m9NoYSdRZzs9JaIGCykqtTEvIRFDDfk-2XNgj9eSaBX0yFZtcpEgLP5VGrz63A-6mCG5n-ENyLSK061y7NhMPnBI8AleavQIsTQ0beDyOwX_2k-G-K4kpubHauMU"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h4 className="font-display text-xs font-bold text-[#1A365D]">Kerala Startup Mission (KSUM)</h4>
                <p className="text-[11px] text-[#5F6B7D] leading-tight mt-0.5">Sanctioned partner hub &amp; grant disbursal nodal center</p>
              </div>
            </div>

            {/* Partner 2: IIC */}
            <div className="p-4 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-3 hover:border-[#1A365D]/50 transition-all">
              <div className="flex items-center justify-between pb-2 border-b border-[#D5D9E0]/60">
                <span className="text-[10px] font-bold text-[#1A365D] uppercase tracking-wider">Central Initiative</span>
                <span className="text-[10px] font-mono text-[#5F6B7D]">Ministry of HRD</span>
              </div>
              <div className="py-2 flex items-center justify-center bg-[#0e131b] rounded border border-[#D5D9E0]/40">
                <div className="logo-crop-box crop-iic">
                  <img
                    alt="Institution's Innovation Council (Ministry of HRD Initiative)"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSxU7hjZauOllcG3rTsjuGL1_JA3wLDe_hr7FOkVjV-Q0RuDWsvsxz6qh7DjHDcCnKxtJ5h_I33zo0r6KYKqrn2_LT13LyPNxTie2r51err03in73523dOv8LwYWtn0UsAzXVk1t-KwqFcn1a7TLwdgCNnHRT7axIbAp4QPF_4ZsqwfAlfR0Fz1Yqz97MpUkDS3Er0HxC3oIIGnwiwPsw5p37_4yO5JWn2WvsML7oibxuur2kOO8QeiAqq1yfDTziJyEk"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h4 className="font-display text-xs font-bold text-[#1A365D]">Institution's Innovation Council</h4>
                <p className="text-[11px] text-[#5F6B7D] leading-tight mt-0.5">MoE / AICTE nationwide campus innovation chapter</p>
              </div>
            </div>

            {/* Partner 3: IPL */}
            <div className="p-4 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-3 hover:border-[#1A365D]/50 transition-all">
              <div className="flex items-center justify-between pb-2 border-b border-[#D5D9E0]/60">
                <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider">State Competition</span>
                <span className="text-[10px] font-mono text-[#5F6B7D]">KSUM Initiative</span>
              </div>
              <div className="py-2 flex items-center justify-center bg-[#0e131b] rounded border border-[#D5D9E0]/40">
                <div className="logo-crop-box crop-ipl">
                  <img
                    alt="IPL Innovators Premier League"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeE1P_2WnJoMfSjl-EROf5Tex5dsf8DgOOExt7IAYHlM0x4CeadjidaVJVRtZKYHl6HCx1DBSewOZ--gykxlrgz_fDG5MiGM1N-LFuAiRyPvbSwJgH7ZX6KZVr8A41j4d9JLQj8dTanHjtQYpUwAM7F5Y9p1ZImFIrKsQqzWF--QAd8ugaOv1fOQfo0VQ6DobOBYZ6EFbhbRUd_okKqrPjksPgrvfL7l0y9K6aR-iFO6wstzYpYPtzo1-HjVb2RtK9360"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h4 className="font-display text-xs font-bold text-[#1A365D]">Innovators' Premier League</h4>
                <p className="text-[11px] text-[#5F6B7D] leading-tight mt-0.5">Competitive challenge leagues &amp; collegiate hackathons</p>
              </div>
            </div>

            {/* Partner 4: IES IEDC */}
            <div className="p-4 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-3 hover:border-[#10B981]/60 transition-all">
              <div className="flex items-center justify-between pb-2 border-b border-[#D5D9E0]/60">
                <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">Collegiate Apex</span>
                <span className="text-[10px] font-mono text-[#5F6B7D]">Est. 2016</span>
              </div>
              <div className="py-2 flex items-center justify-center bg-[#0e131b] rounded border border-[#D5D9E0]/40">
                <div className="w-[145px] h-[58px] bg-[#000000] rounded flex items-center justify-center p-1.5">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_CQAW5wQQgLVy2XXJlptw34nHrZZj7XVkly_Quu7ESCrzXk4pGSqCVwr2tLPop3_fAMpS_tz4l_y8pxpAnE9UhSJ8oooFS4IvXu6YNplaglaG-NxyEuNd5rP8In3V7tB3pGxNByazmO0x_DN05ZK9jEvkJjKgFJSFPinlpxj3-Yqx58z6X0XpgFwcPXUziBDiHcWXJgSmsEuE2VDNXI-W1vHKJyJ1ouiCAR_-o5Fi5Ay2KquZx7pkyQXZ6Xi1Z4epBws"
                    alt="IES IEDC Official Emblem"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h4 className="font-display text-xs font-bold text-[#1A365D]">IES IEDC Centre</h4>
                <p className="text-[11px] text-[#5F6B7D] leading-tight mt-0.5">Autonomous pre-incubation facility &amp; maker testbed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. VISION & MISSION DUAL PILLARS */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-16 bg-[#F1F2F5]/40 border-b border-[#D5D9E0]/50" id="about">
        <div className="max-w-[1700px] mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-1 max-w-xl">
            <span className="text-[11px] font-bold text-[#10B981] uppercase tracking-widest">Core Governance</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1A365D]">Vision &amp; Mission Mandate</h2>
            <p className="text-sm text-[#5F6B7D]">Statutory founding statements ratified by College Governance and aligned with KSUM operational charters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision Stone Tablet */}
            <div className="p-8 lg:p-10 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-8 border-l-4 border-l-[#10B981]">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#D5D9E0]/60">
                  <span className="text-[11px] font-bold text-[#5F6B7D] uppercase tracking-widest">Section 01 // Vision</span>
                  <span className="material-symbols-outlined text-[20px] text-[#10B981]">visibility</span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#1A365D]">Institutional Vision</h3>
                <blockquote className="text-base sm:text-lg text-[#2B3547] leading-relaxed font-serif italic text-[#1A2232]/90">
                  “To inculcate an innovation culture among the students, to create future entrepreneurs and position the institution as a learning, innovation and entrepreneurial hub.”
                </blockquote>
              </div>
              <div className="pt-4 border-t border-[#D5D9E0]/60 flex items-center gap-2 text-[11px] text-[#5F6B7D] uppercase font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                <span>Mandated by IES Board of Governance • Est. 2016</span>
              </div>
            </div>

            {/* Mission Stone Tablet */}
            <div className="p-8 lg:p-10 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-8 border-l-4 border-l-[#1A365D]">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#D5D9E0]/60">
                  <span className="text-[11px] font-bold text-[#5F6B7D] uppercase tracking-widest">Section 02 // Mission</span>
                  <span className="material-symbols-outlined text-[20px] text-[#1A365D]">flag</span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#1A365D]">Institutional Mission</h3>
                <blockquote className="text-base sm:text-lg text-[#2B3547] leading-relaxed font-serif italic text-[#1A2232]/90">
                  “To establish an innovation platform by introducing the State-of-the-art technologies through promoting innovation and entrepreneurship.”
                </blockquote>
              </div>
              <div className="pt-4 border-t border-[#D5D9E0]/60 flex items-center gap-2 text-[11px] text-[#5F6B7D] uppercase font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A365D]"></span>
                <span>In Alignment with Kerala Startup Mission (KSUM) Directives</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04. WHAT WE DO: THREE CONNECTED VERTICALS */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-16 border-b border-[#D5D9E0]/50" id="what-we-do">
        <div className="max-w-[1700px] mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-widest">Programmatic Scope</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1A365D]">The Three Connected Verticals</h2>
              <p className="text-sm text-[#5F6B7D]">An integrated operational pipeline guiding raw curiosity into defensible technical enterprises.</p>
            </div>
            <div className="text-[11px] font-mono text-[#5F6B7D] uppercase tracking-wider bg-[#F1F2F5] px-3 py-1.5 rounded border border-[#D5D9E0]">
              Framework: Discovery → Build → Deploy
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vertical 01 */}
            <div className="p-8 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-8 group hover:border-[#10B981]/60 transition-colors">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded bg-[#F1F2F5] shadow-neu-button flex items-center justify-center border border-[#D5D9E0] text-[#10B981]">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-[#10B981] tracking-widest uppercase">Vertical 01</span>
                <h3 className="font-display text-xl font-bold text-[#1A365D]">Innovation &amp; Design</h3>
                <p className="text-sm text-[#2B3547]/90 leading-relaxed font-normal">
                  Emphasizing problem discovery, empathetic research, and design thinking frameworks. Students dismantle regional socio-technical hurdles through unstructured ideation sprints, root-cause analyses, and peer critique.
                </p>
              </div>
              <div className="pt-4 border-t border-[#D5D9E0]/60 flex flex-col gap-1 text-[12px]">
                <span className="font-semibold text-[#1A365D] text-[11px] uppercase tracking-wider">Milestone Outcomes</span>
                <span className="text-[#5F6B7D]">Problem Matrix • Reverse Engineering Labs • Design Validation</span>
              </div>
            </div>

            {/* Vertical 02 */}
            <div className="p-8 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-8 group hover:border-[#1A365D]/60 transition-colors">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded bg-[#F1F2F5] shadow-neu-button flex items-center justify-center border border-[#D5D9E0] text-[#1A365D]">
                  <Wrench className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-[#1A365D] tracking-widest uppercase">Vertical 02</span>
                <h3 className="font-display text-xl font-bold text-[#1A365D]">Technical Exposure</h3>
                <p className="text-sm text-[#2B3547]/90 leading-relaxed font-normal">
                  Delivering rigorous hands-on exposure to advanced manufacturing, additive 3D fabrication, robotics, microcontrollers, embedded IoT firmware, and generative AI toolchains under faculty and alumni guidance.
                </p>
              </div>
              <div className="pt-4 border-t border-[#D5D9E0]/60 flex flex-col gap-1 text-[12px]">
                <span className="font-semibold text-[#1A365D] text-[11px] uppercase tracking-wider">Milestone Outcomes</span>
                <span className="text-[#5F6B7D]">Functional Prototypes • Hardware Testbeds • Open Repositories</span>
              </div>
            </div>

            {/* Vertical 03 */}
            <div className="p-8 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-8 group hover:border-[#FF6B35]/60 transition-colors">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded bg-[#F1F2F5] shadow-neu-button flex items-center justify-center border border-[#D5D9E0] text-[#FF6B35]">
                  <Rocket className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-[#FF6B35] tracking-widest uppercase">Vertical 03</span>
                <h3 className="font-display text-xl font-bold text-[#1A365D]">Entrepreneurship</h3>
                <p className="text-sm text-[#2B3547]/90 leading-relaxed font-normal">
                  Translating working prototypes into defensible market artifacts: provisional patent drafting, KSUM grant preparation, business model defense, and company incorporation advisory.
                </p>
              </div>
              <div className="pt-4 border-t border-[#D5D9E0]/60 flex flex-col gap-1 text-[12px]">
                <span className="font-semibold text-[#1A365D] text-[11px] uppercase tracking-wider">Milestone Outcomes</span>
                <span className="text-[#5F6B7D]">IPR Filings • Business Model Canvas (BMC) • Seed Grant Readiness</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05. PHILOSOPHY HIGHLIGHT: LEARNING BY DOING & DIY */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-16 bg-[#F1F2F5]/40 border-b border-[#D5D9E0]/50" id="philosophy">
        <div className="max-w-[1700px] mx-auto">
          <div className="p-8 lg:p-14 rounded-sm bg-[#F1F2F5] border border-[#D5D9E0] shadow-neu-card flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="flex flex-col gap-4 max-w-2xl">
              <span className="text-[11px] font-bold text-[#10B981] uppercase tracking-widest">Foundational Ethos</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A365D] tracking-tight">
                “Learning by Doing” &amp; <br className="hidden sm:inline" />Do It Yourself (DIY)
              </h2>
              <p className="text-[#2B3547] text-base sm:text-lg leading-relaxed pt-2">
                Exploring ideas, testing prototypes, interdisciplinary team problem-solving, and practical technological immersion. We believe engineering education achieves potency only when theoretical formulae encounter tangible fabrication.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0 lg:w-80">
              <div className="p-4 rounded bg-white border border-[#D5D9E0] shadow-neu-flat flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#10B981]" />
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-[#1A365D]">Empirical Prototyping</span>
                  <span className="text-[11px] text-[#5F6B7D]">Iterate rapidly in hardware and software</span>
                </div>
              </div>
              <div className="p-4 rounded bg-white border border-[#D5D9E0] shadow-neu-flat flex items-center gap-3">
                <Users className="w-6 h-6 text-[#FF6B35]" />
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-[#1A365D]">Interdisciplinary Synergy</span>
                  <span className="text-[11px] text-[#5F6B7D]">Cross-pollination across all 7 departments</span>
                </div>
              </div>
              <div className="p-4 rounded bg-white border border-[#D5D9E0] shadow-neu-flat flex items-center gap-3">
                <Shield className="w-6 h-6 text-[#1A365D]" />
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-[#1A365D]">Institutional Rigor</span>
                  <span className="text-[11px] text-[#5F6B7D]">Mentorship by accredited faculty &amp; KSUM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06. PROGRAMME PROGRESSION JOURNEY (8 STAGES) */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-16 border-b border-[#D5D9E0]/50" id="pipeline">
        <div className="max-w-[1700px] mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest">Incubation Roadmap</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1A365D]">Programme Progression Journey</h2>
              <p className="text-sm text-[#5F6B7D]">Official chronological trajectory adapted from Kerala Startup Mission guidelines.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#5F6B7D] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              <span>8 Milestones from Mindset to Venture</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { step: '01', title: 'Innovation Mindset', desc: 'Attitude formulation & inquiry' },
              { step: '02', title: 'Design Thinking', desc: 'Human-centric problem scoping' },
              { step: '03', title: 'Ideation Sprints', desc: 'Empirical hypothesis tests' },
              { step: '04', title: 'Skill Exposure', desc: '3D CAD, robotics & AI tools' },
              { step: '05', title: 'Business Basics', desc: 'Cost structures & IPR basics' },
              { step: '06', title: 'Case Studies', desc: 'Enterprise analysis & critique' },
              { step: '07', title: 'Model Canvas', desc: 'Formal BMC formulation' }
            ].map(item => (
              <div
                key={item.step}
                className="p-4 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-flat flex flex-col justify-between gap-4"
              >
                <span className="text-[11px] font-mono font-bold text-[#5F6B7D]">{item.step}</span>
                <div className="flex flex-col gap-1">
                  <span className="font-display text-xs font-bold text-[#1A365D]">{item.title}</span>
                  <span className="text-[11px] text-[#5F6B7D] leading-snug">{item.desc}</span>
                </div>
              </div>
            ))}

            {/* Step 8 Highlighted */}
            <div className="p-4 rounded-sm bg-[#1A365D] border-2 border-[#10B981] shadow-neu-button flex flex-col justify-between gap-4 text-white">
              <span className="text-[11px] font-mono font-bold text-[#10B981]">08</span>
              <div className="flex flex-col gap-1">
                <span className="font-display text-xs font-extrabold text-white">Prototype / Venture</span>
                <span className="text-[11px] text-white/80 font-medium leading-snug">Venture incubation &amp; grants</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 07. VERIFIED EVENTS & ACTIVITIES */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-16 bg-[#F1F2F5]/30 border-b border-[#D5D9E0]/50" id="events">
        <div className="max-w-[1700px] mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest">Institutional Calendar</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1A365D]">Verified Events &amp; Activities</h2>
              <p className="text-sm text-[#5F6B7D]">Authoritative records documented by the IEDC Nodal Secretariat across academic years.</p>
            </div>
            {/* Filter Tabs */}
            <div className="p-1 rounded-sm bg-[#F1F2F5] border border-[#D5D9E0]/80 shadow-neu-inset flex items-center gap-1 text-[12px]">
              {['all', '2025-26', '2024-25', '2023-24'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setEventFilter(tab)}
                  className={`px-3 py-1.5 rounded-sm font-medium uppercase tracking-wider transition-all duration-150 cursor-pointer select-none ${
                    eventFilter === tab
                      ? 'bg-[#1A365D] text-white'
                      : 'text-[#5F6B7D] hover:text-[#1A365D]'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab === '2025-26' ? '2025–26' : tab === '2024-25' ? '2024–25' : '2023–24'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Event 1 */}
            {(eventFilter === 'all' || eventFilter === '2025-26') && (
              <div className="p-8 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-[#F1F2F5] border border-[#D5D9E0] font-semibold uppercase text-[#1A365D]">AY 2025–26</span>
                    <span className="text-[#5F6B7D] font-medium">104 Participants</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#1A365D]">IEDC Annual Institutional Orientation</h3>
                  <p className="text-sm text-[#2B3547]/80 leading-relaxed">
                    Comprehensive orientation introducing the student body to KSUM grants, campus pre-incubation facilities, and the innovation roadmap for the academic calendar.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#D5D9E0]/60 flex items-center justify-between text-xs text-[#5F6B7D]">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> 21/03/2026</span>
                  <span className="font-semibold text-[#10B981] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Verified Record
                  </span>
                </div>
              </div>
            )}

            {/* Event 2 */}
            {(eventFilter === 'all' || eventFilter === '2025-26') && (
              <div className="p-8 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-[#F1F2F5] border border-[#D5D9E0] font-semibold uppercase text-[#1A365D]">AY 2025–26</span>
                    <span className="text-[#5F6B7D] font-medium">Workshop</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#1A365D]">Innovation Workshop &amp; Prototyping Sprints</h3>
                  <p className="text-sm text-[#2B3547]/80 leading-relaxed">
                    Intensive design session facilitating interdisciplinary engineering teams in rapid problem formulation and initial low-fidelity mockups.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#D5D9E0]/60 flex items-center justify-between text-xs text-[#5F6B7D]">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> 28/02/2026</span>
                  <span className="font-semibold text-[#10B981] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Verified Record
                  </span>
                </div>
              </div>
            )}

            {/* Event 3 */}
            {(eventFilter === 'all' || eventFilter === '2025-26') && (
              <div className="p-8 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-[#F1F2F5] border border-[#D5D9E0] font-semibold uppercase text-[#1A365D]">AY 2025–26</span>
                    <span className="text-[#5F6B7D] font-medium">Technical Series</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#1A365D]">AI Tools &amp; Modern Capabilities Suite</h3>
                  <p className="text-sm text-[#2B3547]/80 leading-relaxed">
                    Exploration of foundational models, generative pipelines, and automating engineering workflows using modern AI tools suite.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#D5D9E0]/60 flex items-center justify-between text-xs text-[#5F6B7D]">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> 17/02/2026</span>
                  <span className="font-semibold text-[#10B981] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Verified Record
                  </span>
                </div>
              </div>
            )}

            {/* Event 4 */}
            {(eventFilter === 'all' || eventFilter === '2025-26') && (
              <div className="p-8 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-[#F1F2F5] border border-[#D5D9E0] font-semibold uppercase text-[#1A365D]">AY 2025–26</span>
                    <span className="px-2 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 font-semibold text-[10px] uppercase tracking-wider">Archival Notice</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#1A365D]">Residential IEDC Innovation Camp</h3>
                  <p className="text-sm text-[#2B3547]/80 leading-relaxed">
                    Overnight hackathon and venture refinement residential camp designed to accelerate pending student proposals.
                  </p>
                  <div className="p-3 rounded bg-[#F1F2F5] border border-[#D5D9E0] text-[11px] text-[#1A2232] font-medium">
                    [Needs Admin Review - Date Inconsistency in Source Record: 09/01/2026 – 10/01/2025]
                  </div>
                </div>
                <div className="pt-4 border-t border-[#D5D9E0]/60 flex items-center justify-between text-xs text-[#5F6B7D]">
                  <span className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-[#F59E0B]" /> Source Log Annotation</span>
                  <span className="font-semibold text-[#1A2232]">Audit Documented</span>
                </div>
              </div>
            )}

            {/* Event 5 */}
            {(eventFilter === 'all' || eventFilter === '2024-25') && (
              <div className="p-8 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-[#F1F2F5] border border-[#D5D9E0] font-semibold uppercase text-[#1A365D]">AY 2024–25</span>
                    <span className="text-[#5F6B7D] font-medium">SIH Official</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#1A365D]">Smart India Hackathon Internal Screening</h3>
                  <p className="text-sm text-[#2B3547]/80 leading-relaxed">
                    Rigorous evaluation round featuring campus teams contending for national nomination. Exactly 12 elite teams selected for submission.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#D5D9E0]/60 flex items-center justify-between text-xs text-[#5F6B7D]">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#FF6B35]" /> 12 Teams Selected</span>
                  <span className="font-semibold text-[#1A365D]">National Level</span>
                </div>
              </div>
            )}

            {/* Event 6 */}
            {(eventFilter === 'all' || eventFilter === '2023-24') && (
              <div className="p-8 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-[#F1F2F5] border border-[#D5D9E0] font-semibold uppercase text-[#1A365D]">AY 2023–24</span>
                    <span className="text-[#5F6B7D] font-medium">Expert Webinar</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#1A365D]">IPR Webinar: Drafting &amp; Filing Safeguards</h3>
                  <p className="text-sm text-[#2B3547]/80 leading-relaxed">
                    Expert presentation by Dr. Joe Gnanaraj on safeguarding academic technical novelty under Indian Patent Law.
                  </p>
                </div>
                <div className="pt-4 border-t border-[#D5D9E0]/60 flex items-center justify-between text-xs text-[#5F6B7D]">
                  <span className="flex items-center gap-1.5"><Award className="w-4 h-4" /> Dr Joe Gnanaraj</span>
                  <span className="font-semibold text-[#1A2232]">Archive Log</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 08. VERIFIED TEAM STRUCTURE */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-16 border-b border-[#D5D9E0]/50" id="team">
        <div className="max-w-[1700px] mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest">Leadership &amp; Roster</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1A365D]">Verified Team Structure</h2>
              <p className="text-sm text-[#5F6B7D]">Accredited nodal governance and student executive committees.</p>
            </div>
            {/* Academic Year Selector */}
            <div className="p-1 rounded-sm bg-[#F1F2F5] border border-[#D5D9E0]/80 shadow-neu-inset flex items-center gap-1 text-[12px]">
              <button
                onClick={() => setTeamTab('2024-25')}
                className={`px-3 py-1.5 rounded-sm font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  teamTab === '2024-25' ? 'bg-[#1A365D] text-white' : 'text-[#5F6B7D] hover:text-[#1A365D]'
                }`}
              >
                2024–25 Verified
              </button>
              <button
                onClick={() => setTeamTab('2025-26')}
                className={`px-3 py-1.5 rounded-sm font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  teamTab === '2025-26' ? 'bg-[#1A365D] text-white' : 'text-[#5F6B7D] hover:text-[#1A365D]'
                }`}
              >
                2025–26 (Structure)
              </button>
              <button
                onClick={() => setTeamTab('2023-24')}
                className={`px-3 py-1.5 rounded-sm font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  teamTab === '2023-24' ? 'bg-[#1A365D] text-white' : 'text-[#5F6B7D] hover:text-[#1A365D]'
                }`}
              >
                2023–24 Archive
              </button>
            </div>
          </div>

          {/* 2024-25 Roster Pane */}
          {teamTab === '2024-25' && (
            <div className="flex flex-col gap-10">
              {/* Nodal Officers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex items-start gap-5">
                  <div className="w-12 h-12 rounded bg-[#F1F2F5] shadow-neu-button flex items-center justify-center border border-[#D5D9E0] shrink-0 text-[#1A365D]">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-[#10B981] uppercase tracking-widest">Nodal Officer</span>
                    <h3 className="font-display text-xl font-bold text-[#1A365D]">Shahaziya Parvez</h3>
                    <span className="text-xs text-[#2B3547]">Head of Department / Asst Professor • Robotics &amp; AI</span>
                    <span className="text-[11px] text-[#5F6B7D] pt-2">Official KSUM Nodal Point of Contact</span>
                  </div>
                </div>

                <div className="p-8 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex items-start gap-5">
                  <div className="w-12 h-12 rounded bg-[#F1F2F5] shadow-neu-button flex items-center justify-center border border-[#D5D9E0] shrink-0 text-[#1A365D]">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-widest">Assistant Nodal Officer</span>
                    <h3 className="font-display text-xl font-bold text-[#1A365D]">Prabhavathi P</h3>
                    <span className="text-xs text-[#2B3547]">Assistant Professor • Science &amp; Humanities</span>
                    <span className="text-[11px] text-[#5F6B7D] pt-2">Operations &amp; Compliance Oversight</span>
                  </div>
                </div>
              </div>

              {/* Student Executive Grid */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#D5D9E0]/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1A365D]">Student Executive Council (2024–25)</span>
                  <span className="text-[11px] text-[#5F6B7D]">Published Roster</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="p-4 rounded bg-white border border-[#D5D9E0] shadow-neu-flat flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-[#10B981]">IEDC Lead (Joint)</span>
                    <span className="text-sm font-bold text-[#1A365D]">Edwin Joy</span>
                    <span className="text-[11px] text-[#5F6B7D]">Lead Exec</span>
                  </div>
                  <div className="p-4 rounded bg-white border border-[#D5D9E0] shadow-neu-flat flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-[#10B981]">IEDC Lead (Joint)</span>
                    <span className="text-sm font-bold text-[#1A365D]">Fathima Dilsha</span>
                    <span className="text-[11px] text-[#5F6B7D]">Lead Exec</span>
                  </div>
                  <div className="p-4 rounded bg-white border border-[#D5D9E0] shadow-neu-flat flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-[#1A365D]">Student Lead I</span>
                    <span className="text-sm font-bold text-[#1A365D]">Ajmal P R</span>
                    <span className="text-[11px] text-[#5F6B7D]">Outreach</span>
                  </div>
                  <div className="p-4 rounded bg-white border border-[#D5D9E0] shadow-neu-flat flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-[#1A365D]">Student Lead II</span>
                    <span className="text-sm font-bold text-[#1A365D]">Rudhra V S</span>
                    <span className="text-[11px] text-[#5F6B7D]">Execution</span>
                  </div>
                  <div className="p-4 rounded bg-white border border-[#D5D9E0] shadow-neu-flat flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-[#FF6B35]">Women's Lead</span>
                    <span className="text-sm font-bold text-[#1A365D]">Nidha</span>
                    <span className="text-[11px] text-[#5F6B7D]">Initiatives</span>
                  </div>
                  <div className="p-4 rounded bg-white border border-[#D5D9E0] shadow-neu-flat flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-[#5F6B7D]">Finance</span>
                    <span className="text-sm font-bold text-[#1A365D]">Liya &amp; Vishnu</span>
                    <span className="text-[11px] text-[#5F6B7D]">Treasury</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2025-26 Roster Pane */}
          {teamTab === '2025-26' && (
            <div className="p-12 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col items-center text-center gap-4 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#F1F2F5] shadow-neu-button flex items-center justify-center border border-[#D5D9E0] text-[#10B981]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold text-[#5F6B7D] uppercase tracking-widest">Academic Year 2025–26</span>
                <h3 className="font-display text-xl font-bold text-[#1A365D]">Structure Ready for CMS Entry</h3>
                <p className="text-sm text-[#2B3547]/80 leading-relaxed">
                  The student executive council for AY 2025–26 is currently undergoing scrutiny and will be published via the institutional CMS upon completion of annual induction protocols.
                </p>
              </div>
              <button
                className="mt-2 px-5 py-2.5 rounded bg-[#F1F2F5] border border-[#D5D9E0] text-xs font-semibold uppercase tracking-wider text-[#1A365D] hover:bg-[#E9EBEF] transition-all cursor-pointer"
                onClick={() => setAdminDrawerOpen(true)}
              >
                Nodal CMS Access →
              </button>
            </div>
          )}

          {/* 2023-24 Roster Pane */}
          {teamTab === '2023-24' && (
            <div className="p-8 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col gap-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#D5D9E0]/60">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1A365D]">Academic Year 2023–24 Alumni Leads</span>
                <span className="text-[11px] text-[#5F6B7D] uppercase font-semibold">Archived Log</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded bg-[#F1F2F5] border border-[#D5D9E0] flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#5F6B7D] uppercase">Student Lead</span>
                  <span className="text-base font-bold text-[#1A365D]">Shabeer Mohammed</span>
                  <span className="text-xs text-[#5F6B7D]">AY 2023–24</span>
                </div>
                <div className="p-4 rounded bg-[#F1F2F5] border border-[#D5D9E0] flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#5F6B7D] uppercase">Student Lead</span>
                  <span className="text-base font-bold text-[#1A365D]">Nafih Najeeb</span>
                  <span className="text-xs text-[#5F6B7D]">AY 2023–24</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 09. STUDENT IDEAS / PRE-INCUBATION CALLOUT */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-16 bg-[#F1F2F5]/30 border-b border-[#D5D9E0]/50" id="ideas">
        <div className="max-w-[1700px] mx-auto flex flex-col gap-12">
          <div className="p-8 lg:p-12 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex flex-col gap-3 max-w-2xl">
              <span className="text-[11px] font-bold text-[#10B981] uppercase tracking-widest">Campus Pre-Incubation</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1A365D]">
                Have an Idea? Submit for Incubation
              </h2>
              <p className="text-sm sm:text-base text-[#2B3547] leading-relaxed">
                Transform your engineering project or technological hypothesis into an accredited enterprise. Submissions receive structured faculty review, lab prototyping support, and guidance on KSUM Idea Grant applications.
              </p>
            </div>
            <div className="shrink-0 w-full lg:w-auto">
              <button
                onClick={() => setWizardOpen(true)}
                className="w-full lg:w-auto px-8 py-4 rounded-sm bg-[#1A365D] text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#1A2232] transition-all shadow-neu-button flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#10B981]" />
                <span>Submit Your Idea</span>
              </button>
            </div>
          </div>

          {/* 4-Step Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded bg-[#F1F2F5] border border-[#D5D9E0]/80 shadow-neu-flat flex flex-col gap-2">
              <span className="font-mono text-xs font-bold text-[#10B981]">01 // PROPOSAL</span>
              <h4 className="font-display text-base font-bold text-[#1A365D]">Formulate Statement</h4>
              <p className="text-xs text-[#5F6B7D] leading-relaxed">Define the acute industrial or civic problem and your proposed technical delta.</p>
            </div>
            <div className="p-6 rounded bg-[#F1F2F5] border border-[#D5D9E0]/80 shadow-neu-flat flex flex-col gap-2">
              <span className="font-mono text-xs font-bold text-[#1A365D]">02 // SCRUTINY</span>
              <h4 className="font-display text-base font-bold text-[#1A365D]">Nodal Review</h4>
              <p className="text-xs text-[#5F6B7D] leading-relaxed">Department coordinators evaluate feasibility, prior art, and ethical compliance.</p>
            </div>
            <div className="p-6 rounded bg-[#F1F2F5] border border-[#D5D9E0]/80 shadow-neu-flat flex flex-col gap-2">
              <span className="font-mono text-xs font-bold text-[#FF6B35]">03 // PROTOTYPING</span>
              <h4 className="font-display text-base font-bold text-[#1A365D]">Lab Access</h4>
              <p className="text-xs text-[#5F6B7D] leading-relaxed">Access IEDC additive manufacturing, microcontroller kits, and testbench facilities.</p>
            </div>
            <div className="p-6 rounded bg-[#F1F2F5] border border-[#D5D9E0]/80 shadow-neu-flat flex flex-col gap-2">
              <span className="font-mono text-xs font-bold text-[#F59E0B]">04 // INCUBATION</span>
              <h4 className="font-display text-base font-bold text-[#1A365D]">Grant Defense</h4>
              <p className="text-xs text-[#5F6B7D] leading-relaxed">Defend your Business Model Canvas before KSUM for institutional seed grant funding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. COMPLIANCE & VERIFIED AUDIT SECTIONS */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-16 border-b border-[#D5D9E0]/50" id="achievements">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Official Achievements */}
          <div className="p-8 lg:p-10 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D5D9E0]/60">
                <span className="text-[11px] font-bold text-[#10B981] uppercase tracking-widest">Institutional Audit</span>
                <Shield className="w-5 h-5 text-[#10B981]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1A365D]">Official Achievements</h3>
              <p className="text-sm text-[#2B3547]/90 leading-relaxed font-normal">
                Verified achievements will be published here. (Achievements are updated directly by the IEDC administration upon confirmation with the College Academic Board and KSUM).
              </p>
            </div>
            <div className="pt-4 border-t border-[#D5D9E0]/60 text-[11px] text-[#5F6B7D] font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              <span>Zero unverified metrics policy</span>
            </div>
          </div>

          {/* Startups Directory */}
          <div className="p-8 lg:p-10 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col justify-between gap-6" id="startups">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D5D9E0]/60">
                <span className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-widest">Campus Ventures</span>
                <Rocket className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#1A365D]">Verified Startups Index</h3>
              <p className="text-sm text-[#2B3547]/90 leading-relaxed font-normal">
                Verified campus startups and venture disclosures will be published here. Student founders may submit pre-incubation requests through the Ideas portal.
              </p>
            </div>
            <div className="pt-4 border-t border-[#D5D9E0]/60 text-[11px] text-[#5F6B7D] font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A365D]"></span>
              <span>Pre-Incubation Pipeline Synchronized</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. WORKSHOPS & RESOURCES */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-16 bg-[#F1F2F5]/30 border-b border-[#D5D9E0]/50" id="resources">
        <div className="max-w-[1700px] mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest">Reference Vault</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1A365D]">Workshops &amp; Resources</h2>
              <p className="text-sm text-[#5F6B7D]">Official blueprints, filing manuals, and incubator frameworks for students.</p>
            </div>
            <span className="text-xs text-[#5F6B7D] font-mono uppercase">Curated Institutional Kits</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded bg-white border border-[#D5D9E0] shadow-neu-flat flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#1A365D] uppercase tracking-wider">IPR Documentation</span>
                <h4 className="font-display text-base font-bold text-[#1A365D]">Patent Claim Guidelines</h4>
                <p className="text-xs text-[#5F6B7D] leading-relaxed">Provisional application drafting and prior-art search protocols via InPASS for undergraduate student inventors.</p>
              </div>
              <div className="pt-3 border-t border-[#D5D9E0]/60 flex items-center justify-between text-xs">
                <span className="text-[#5F6B7D] text-[11px]">PDF Manual</span>
                <span className="font-semibold text-[#1A365D] text-[11px] uppercase tracking-wider">Verified Spec</span>
              </div>
            </div>

            <div className="p-6 rounded bg-white border border-[#D5D9E0] shadow-neu-flat flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#1A365D] uppercase tracking-wider">Business Canvas</span>
                <h4 className="font-display text-base font-bold text-[#1A365D]">Osterwalder BMC Template</h4>
                <p className="text-xs text-[#5F6B7D] leading-relaxed">High-resolution 9-box business model canvas formatted specifically for collegiate engineering defense.</p>
              </div>
              <div className="pt-3 border-t border-[#D5D9E0]/60 flex items-center justify-between text-xs">
                <span className="text-[#5F6B7D] text-[11px]">A3 Canvas Kit</span>
                <span className="font-semibold text-[#1A365D] text-[11px] uppercase tracking-wider">Verified Spec</span>
              </div>
            </div>

            <div className="p-6 rounded bg-white border border-[#D5D9E0] shadow-neu-flat flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#1A365D] uppercase tracking-wider">KSUM Grants</span>
                <h4 className="font-display text-base font-bold text-[#1A365D]">KSUM Idea Grant Norms</h4>
                <p className="text-xs text-[#5F6B7D] leading-relaxed">Eligibility checklists and milestone requirements for accessing Kerala Startup Mission financial schemes.</p>
              </div>
              <div className="pt-3 border-t border-[#D5D9E0]/60 flex items-center justify-between text-xs">
                <span className="text-[#5F6B7D] text-[11px]">Scheme Manual</span>
                <span className="font-semibold text-[#1A365D] text-[11px] uppercase tracking-wider">Verified Spec</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. CAMPUS NEWS & DISPATCHES */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-16 border-b border-[#D5D9E0]/50" id="news">
        <div className="max-w-[1700px] mx-auto flex flex-col gap-10">
          <div className="flex items-center justify-between pb-3 border-b border-[#D5D9E0]/60">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#1A365D]"></span>
              <h3 className="font-display text-xl font-bold text-[#1A365D]">Campus Innovation Dispatches</h3>
            </div>
            <span className="text-xs font-semibold text-[#5F6B7D] uppercase tracking-wider">IESCE Bulletin</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded bg-white border border-[#D5D9E0] shadow-neu-flat flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-[#FF6B35]">Notice</span>
                <h4 className="font-display text-base font-bold text-[#1A365D]">Smart India Hackathon 2024 Nominations</h4>
                <p className="text-xs text-[#5F6B7D] leading-relaxed">12 internal project teams nominated for national level scrutiny following college stage review.</p>
              </div>
              <span className="text-[11px] text-[#2B3547] font-medium">Archival Dispatch</span>
            </div>

            <div className="p-6 rounded bg-white border border-[#D5D9E0] shadow-neu-flat flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-[#10B981]">Workshop Series</span>
                <h4 className="font-display text-base font-bold text-[#1A365D]">Additive Fabrication Lab Expansion</h4>
                <p className="text-xs text-[#5F6B7D] leading-relaxed">Lab access protocols updated for undergraduate robotics and mechanical prototyping teams.</p>
              </div>
              <span className="text-[11px] text-[#2B3547] font-medium">Campus Bulletin</span>
            </div>

            <div className="p-6 rounded bg-white border border-[#D5D9E0] shadow-neu-flat flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase font-bold text-[#1A365D]">Webinar</span>
                <h4 className="font-display text-base font-bold text-[#1A365D]">IPR Guidance by Dr. Biju K</h4>
                <p className="text-xs text-[#5F6B7D] leading-relaxed">Comprehensive session conducted for 100+ registered engineering participants on patent filing.</p>
              </div>
              <span className="text-[11px] text-[#2B3547] font-medium">Event Log Archive</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. JOIN IEDC CTA BANNER */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-6 lg:px-12 py-16 bg-[#F1F2F5]/50">
        <div className="max-w-5xl mx-auto p-10 lg:p-14 rounded-sm bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col sm:flex-row sm:items-center justify-between gap-8 text-center sm:text-left">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-[#10B981] uppercase tracking-widest">Student Chapter Enrollment</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1A365D]">Join the IEDC Student Movement</h2>
            <p className="text-sm text-[#5F6B7D] max-w-lg">Open to all students across all engineering branches. No prior founder experience required.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => setWizardOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-sm bg-[#1A365D] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#1A2232] transition-all shadow-neu-button flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#10B981]" />
              <span>Apply as Student Member</span>
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Modals */}
      {wizardOpen && <IdeaWizardModal isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />}
      {adminDrawerOpen && <AdminQuickDrawer isOpen={adminDrawerOpen} onClose={() => setAdminDrawerOpen(false)} />}
    </div>
  );
};
