import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Users,
  Award,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  BookOpen,
  Camera,
  Layers,
  Wrench,
  Rocket
} from 'lucide-react';
import { api } from '../services/api';
import { EventItem, TeamMember, StudentIdea } from '../types';
import { IdeaWizardModal } from '../components/modals/IdeaWizardModal';
import { AdminQuickDrawer } from '../components/modals/AdminQuickDrawer';
import { LightboxModal } from '../components/modals/LightboxModal';

export const Home: React.FC = () => {
  // Modal states
  const [wizardOpen, setWizardOpen] = useState(false);
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxCaption, setLightboxCaption] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | undefined>(undefined);

  // Data states
  const [selectedYear, setSelectedYear] = useState('2024–25');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [ideas, setIdeas] = useState<StudentIdea[]>([]);

  // Listen for global navbar & footer modal trigger events
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

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [evts, idList] = await Promise.all([
          api.getEvents(),
          api.getIdeas()
        ]);
        setEvents(evts);
        setIdeas(idList);
      } catch (e) {
        console.error('Error fetching home data', e);
      }
    }
    fetchData();
  }, []);

  // Fetch team based on selected academic year
  useEffect(() => {
    async function fetchTeam() {
      try {
        const members = await api.getTeam(selectedYear);
        setTeamMembers(members);
      } catch (e) {
        console.error('Error fetching team', e);
      }
    }
    fetchTeam();
  }, [selectedYear]);

  const openLightbox = (caption: string, src?: string) => {
    setLightboxCaption(caption);
    setLightboxImage(src);
    setLightboxOpen(true);
  };

  return (
    <div className="flex flex-col gap-20 pb-20 overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 04. EDITORIAL HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative w-full pt-6 sm:pt-12 px-4 sm:px-8 max-w-[1700px] mx-auto">
        <div className="p-8 sm:p-14 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-card relative overflow-hidden engineering-grid">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Narrative Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#777777] uppercase">
                  INNOVATION & ENTREPRENEURSHIP DEVELOPMENT CENTRE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#161616]" />
                <span className="text-[10px] font-mono text-[#777777]">EST. 2016</span>
              </div>

              <div className="flex flex-col gap-1">
                <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-[#161616] tracking-tight leading-none">
                  IES IEDC
                </h1>
                <p className="text-sm sm:text-base font-medium text-[#4A4A4A]">
                  IES College of Engineering, Chittilappilly, Thrissur
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#161616] tracking-wide mt-1">
                  Innovate • Create • Entrepreneur
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed max-w-xl">
                An innovation and entrepreneurship platform where students explore ideas, develop skills, build prototypes and create meaningful solutions.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#what-we-do"
                  className="tactile-btn px-6 py-3 rounded-xl bg-[#161616] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-neu-button flex items-center gap-2"
                >
                  <span>Explore IEDC</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setWizardOpen(true)}
                  className="tactile-btn px-6 py-3 rounded-xl bg-[#F5F5F3] border border-[#D8D8D3] text-[#161616] text-xs font-mono uppercase tracking-wider font-semibold shadow-neu-button hover:bg-[#EBEBE8] cursor-pointer"
                >
                  Submit Your Idea
                </button>
              </div>
            </div>

            {/* Right Interactive 3-Vertical Cluster (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-[#F5F5F3] border border-[#D8D8D3] shadow-neu-flat flex items-center justify-center p-6">
                {/* Center Hub Badge */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border border-[#D8D8D3] shadow-neu-card flex flex-col items-center justify-center text-center p-2 z-20">
                  <div className="w-10 h-10 mb-1">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC012wASupr36I6ELjeIODGS4RVlaVUuIjEwtJxQ9UgbSOwZ3TXu7pZCDTIr8KCwjZd2RdWN6FaJ4ivZ-3oouTAf-iLj4rDfD2elV9YRZwq4GifdA3qtDLnTHzKO1wUcN0aR2vWOsVvvyJohagPgPcPsqhK5xrkilNsyNOB8SFGbjaCYsjpweryQ4pCNW_Rl6tYa6GkSgrewgJXTTHmeBBQPFvUeAd3DDi8bP2UxIEQv8qE2s1j6X0c4l86dS9SNnFjsVM"
                      alt="IEDC Emblem"
                      className="w-full h-full object-contain filter grayscale"
                    />
                  </div>
                  <span className="font-display font-black text-[11px] text-[#161616] tracking-tighter leading-none">
                    TRI-HUB
                  </span>
                  <span className="text-[8px] font-mono text-[#777777] uppercase tracking-wider">
                    ECOSYSTEM
                  </span>
                </div>

                {/* Satellite 1: Innovation */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-2 p-2.5 rounded-xl bg-white border border-[#D8D8D3] shadow-neu-card flex items-center gap-2 z-10">
                  <span className="text-[9px] font-mono font-bold text-[#161616]">01</span>
                  <span className="text-[10px] font-bold text-[#242424] uppercase tracking-wider">
                    INNOVATION
                  </span>
                </div>

                {/* Satellite 2: Technical */}
                <div className="absolute bottom-6 left-2 p-2.5 rounded-xl bg-white border border-[#D8D8D3] shadow-neu-card flex items-center gap-2 z-10">
                  <span className="text-[9px] font-mono font-bold text-[#161616]">02</span>
                  <span className="text-[10px] font-bold text-[#242424] uppercase tracking-wider">
                    TECHNICAL
                  </span>
                </div>

                {/* Satellite 3: Entrepreneurship */}
                <div className="absolute bottom-6 right-2 p-2.5 rounded-xl bg-white border border-[#D8D8D3] shadow-neu-card flex items-center gap-2 z-10">
                  <span className="text-[9px] font-mono font-bold text-[#161616]">03</span>
                  <span className="text-[10px] font-bold text-[#242424] uppercase tracking-wider">
                    ENTREPRENEURSHIP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 07. STATUTORY BODIES & AFFILIATIONS SHOWCASE */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-[1700px] mx-auto">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#EBEBE8]/50 border border-[#D8D8D3] shadow-neu-flat flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-[#D8D8D3]">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#777777] uppercase">
              STATUTORY AFFILIATIONS & INSTITUTIONAL CHARTERS
            </span>
            <span className="text-[11px] text-[#777777] font-mono">
              APJ KTU • AICTE Approved • Government of Kerala
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center">
            {/* KSUM */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="partner-logo-box crop-ksum shadow-neu-button">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlj1Ox7bhemgkYMAxvXtyJYKHVNoGuGCi_xLqcQgx_AAoNQJIG_S1gQvOFuSMqJa5P8ue2l1ZjRpIeJXsldDHwz7oF24vm3GpcFoKmNJuCjlxwIdzdmTiPVQtaZ_osrb323o8TJfS88SxfUvi3Y2q4LTEi5vgEbBqBF6EW67U9chwPrg_VCJI5-2kIQxtxDs5_2kOAMrfVCdWIM2fZ245kilrX7Gbyf5StRQlJDjiEiJF_GI4DVm1P9TMEa02GP5EujCU"
                  alt="Kerala Startup Mission (KSUM)"
                />
              </div>
              <span className="text-[10px] font-mono uppercase text-[#777777] mt-1">
                KSUM PARTNER HUB
              </span>
            </div>

            {/* IIC */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="partner-logo-box crop-iic shadow-neu-button">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs6Xo5P9PGFqR9lbNLwHK0ICH9pbfqpdsMWFm329mDxvMd4KJP6KQCLz-d8BCGF8SECvOlbeYrEBdW24oxWTmV3maJtQuKIR24Vdh_l0Jo8FQ0Cmt7rsw890zlCvAbSDb7bGv6vxHqFLBq45_lh2DG0z1xunwFMUuldQ3HgO5vb6Z6eP_hRRo83BJwzYw"
                  alt="Institution's Innovation Council (IIC)"
                />
              </div>
              <span className="text-[10px] font-mono uppercase text-[#777777] mt-1">
                IIC 3.5 STAR RATED
              </span>
            </div>

            {/* IPL */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="partner-logo-box crop-ipl shadow-neu-button">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvMr2wZaIm5uBnEzPfQymU3IGK2L6PsL877JgwPUHFOQtDborRqOeUJOONtxTk3V4J7GGvHdaTd0dUnENWHc95t-souvoN6DBf4ie1t68iTgB7Z1FKfPzByojC0N4yCPYiwwzMGmjpgVO0WrTW7EJsD21erOXIW8SPigFMvddXGzJqS1fh-TaQYZ4iDdfq37QaHS-o4Wm1N1URT8Xyui7qb6c2fpWm_C-7SrqtIgtm54Fx_j-MiAQs5J5G3tyEeuL-F4k"
                  alt="Innovators Premier League (IPL)"
                />
              </div>
              <span className="text-[10px] font-mono uppercase text-[#777777] mt-1">
                IPL LEAGUE MEMBER
              </span>
            </div>

            {/* IES IEDC */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="partner-logo-box crop-iesiedc shadow-neu-button">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRNxZd1FkTfHyKa4wF_ifGpCl_iJ3fTCwwvmeBdCoqQ3t7dtWUJH2vWdRU-Jv1zCULsDKKEfI4c-CHdczQVSqE96I6u9tYdMJ8ePz0M5m1lGoMNHUO-jk299K3W2b3_tQgKYjRw5SK-NPQwuWyYYrnDmobaO23FLm1WJ0jBJdRgxuzYVglH_BefKaWIQ31-EWkaE5J1RxiA4ciLb3Qy9Q03RgC28sRC-VN-t2hp5JzFJfP46aXAMwyJSSmIbcixAyD7Mo"
                  alt="IES IEDC Institutional Node"
                />
              </div>
              <span className="text-[10px] font-mono uppercase text-[#777777] mt-1">
                NODAL CENTRE #2016
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 08. FOUNDATIONAL MANDATE: VISION & MISSION */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-[1700px] mx-auto" id="about">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-card flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#777777] uppercase">
                INSTITUTIONAL CHARTER // 01
              </span>
              <h2 className="font-display font-bold text-2xl text-[#161616]">Vision</h2>
              <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
                To create an innovation-driven ecosystem that empowers students to convert innovative ideas into viable technical solutions and successful entrepreneurial ventures.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#D8D8D3] flex items-center justify-between text-[11px] font-mono text-[#777777]">
              <span>APJ KTU Cluster Thrissur</span>
              <span>Long-Term Directive</span>
            </div>
          </div>

          {/* Mission */}
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-card flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#777777] uppercase">
                OPERATIONAL MANDATE // 02
              </span>
              <h2 className="font-display font-bold text-2xl text-[#161616]">Mission</h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#161616] mt-2 shrink-0" />
                  <span>Foster innovation, creative thinking, and problem solving among engineering students.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#161616] mt-2 shrink-0" />
                  <span>Support students in turning technical concepts into real prototypes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#161616] mt-2 shrink-0" />
                  <span>Provide mentoring, infrastructure, resources, and industry interaction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#161616] mt-2 shrink-0" />
                  <span>Build entrepreneurial culture through workshops, competitions, and startup initiatives.</span>
                </li>
              </ul>
            </div>
            <div className="pt-6 mt-6 border-t border-[#D8D8D3] flex items-center justify-between text-[11px] font-mono text-[#777777]">
              <span>Four Core Pillars</span>
              <span>Daily Practice</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 09. WHAT WE DO: THE THREE CONNECTED VERTICALS */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-[1700px] mx-auto" id="what-we-do">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#777777] uppercase">
                CORE OPERATIONAL ARCHITECTURE
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#161616]">
                What We Do
              </h2>
            </div>
            <span className="text-xs text-[#777777] font-mono">
              Three interlocked pillars forming a complete innovation pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vertical 1: Innovation */}
            <div className="p-8 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-card flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F3] border border-[#D8D8D3] shadow-neu-button flex items-center justify-center font-mono font-bold text-xs text-[#161616]">
                  01
                </div>
                <h3 className="font-display font-bold text-lg text-[#161616]">Innovation</h3>
                <p className="text-xs text-[#4A4A4A] leading-relaxed">
                  Cultivating creative thinking, design methodologies, structured problem identification, and technical validation across interdisciplinary student clusters.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="px-2 py-0.5 rounded bg-[#F0F0ED] text-[10px] font-mono text-[#4A4A4A]">Ideation Sprints</span>
                  <span className="px-2 py-0.5 rounded bg-[#F0F0ED] text-[10px] font-mono text-[#4A4A4A]">Design Thinking</span>
                  <span className="px-2 py-0.5 rounded bg-[#F0F0ED] text-[10px] font-mono text-[#4A4A4A]">Problem Mapping</span>
                </div>
              </div>
            </div>

            {/* Vertical 2: Technical */}
            <div className="p-8 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-card flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F3] border border-[#D8D8D3] shadow-neu-button flex items-center justify-center font-mono font-bold text-xs text-[#161616]">
                  02
                </div>
                <h3 className="font-display font-bold text-lg text-[#161616]">Technical</h3>
                <p className="text-xs text-[#4A4A4A] leading-relaxed">
                  Rigorous hands-on engineering execution: hackathons, robotics, IoT telemetry, rapid 3D prototyping, PCB fabrication, and software infrastructure development.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="px-2 py-0.5 rounded bg-[#F0F0ED] text-[10px] font-mono text-[#4A4A4A]">Maker Lab</span>
                  <span className="px-2 py-0.5 rounded bg-[#F0F0ED] text-[10px] font-mono text-[#4A4A4A]">Hackathons</span>
                  <span className="px-2 py-0.5 rounded bg-[#F0F0ED] text-[10px] font-mono text-[#4A4A4A]">IoT Firmware</span>
                </div>
              </div>
            </div>

            {/* Vertical 3: Entrepreneurship */}
            <div className="p-8 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-card flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F3] border border-[#D8D8D3] shadow-neu-button flex items-center justify-center font-mono font-bold text-xs text-[#161616]">
                  03
                </div>
                <h3 className="font-display font-bold text-lg text-[#161616]">Entrepreneurship</h3>
                <p className="text-xs text-[#4A4A4A] leading-relaxed">
                  Guiding viable student prototypes toward formal startup registration, investor pitch preparation, KSUM seed grants, and patent filing support.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="px-2 py-0.5 rounded bg-[#F0F0ED] text-[10px] font-mono text-[#4A4A4A]">Pitch Decks</span>
                  <span className="px-2 py-0.5 rounded bg-[#F0F0ED] text-[10px] font-mono text-[#4A4A4A]">KSUM Seed Aid</span>
                  <span className="px-2 py-0.5 rounded bg-[#F0F0ED] text-[10px] font-mono text-[#4A4A4A]">IP & Patents</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. LEARNING BY DOING & DIY SIGNATURE SECTION */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-[1700px] mx-auto">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#161616] text-white shadow-neu-card flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex flex-col gap-3 max-w-2xl">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#D8D8D3] uppercase">
              EDUCATIONAL PHILOSOPHY
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-white">
              Learning by Doing: The DIY Engineering Ethos
            </h2>
            <p className="text-xs sm:text-sm text-[#D8D8D3] leading-relaxed">
              We reject passive theoretical learning. At IES IEDC, every participant is guided to hold solder, configure microcontrollers, write clean code, and directly test prototypes with end users.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setWizardOpen(true)}
              className="px-6 py-3 rounded-xl bg-white text-[#161616] text-xs font-mono uppercase font-semibold hover:bg-[#F0F0ED] cursor-pointer transition-colors shadow-lg"
            >
              Build With Us
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. PROGRAMME PROGRESSION JOURNEY */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-[1700px] mx-auto" id="journey">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#777777] uppercase">
                STUDENT INCUBATION LIFECYCLE
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#161616]">
                Programme Progression Journey
              </h2>
            </div>
            <span className="text-xs text-[#777777] font-mono">
              From fresh engineering admission to verified venture launch
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {[
              { step: '01', title: 'Orientation', desc: 'Induction & culture onboarding' },
              { step: '02', title: 'Ideation', desc: 'Problem definition sprints' },
              { step: '03', title: 'Hands-on', desc: 'Hardware & software labs' },
              { step: '04', title: 'Hackathons', desc: 'Competitive prototype building' },
              { step: '05', title: 'Grants', desc: 'KSUM seed funding aid' },
              { step: '06', title: 'Mentorship', desc: 'Industry & faculty advisory' },
              { step: '07', title: 'Launch', desc: 'Startup pre-incubation' }
            ].map(item => (
              <div
                key={item.step}
                className="p-4 rounded-xl bg-white border border-[#D8D8D3] shadow-neu-flat flex flex-col justify-between gap-2"
              >
                <span className="font-mono text-xs font-bold text-[#161616]">{item.step}</span>
                <span className="font-display text-xs font-bold text-[#161616]">{item.title}</span>
                <span className="text-[11px] text-[#777777] leading-tight">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. VERIFIED EVENTS SHOWCASE */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-[1700px] mx-auto" id="events">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#777777] uppercase">
                VERIFIED SOURCE RECORDS
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#161616]">
                Verified Events Calendar
              </h2>
            </div>
            <span className="text-xs text-[#777777] font-mono">
              6 official historical programmes documented with source citations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(evt => (
              <div
                key={evt.id}
                className="p-6 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-card flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#F0F0ED] border border-[#D8D8D3] text-[#161616] font-semibold">
                      {evt.displayDate || evt.academicYear}
                    </span>
                    <span className="text-[10px] text-[#777777] uppercase tracking-wider">
                      {evt.category}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#161616] leading-snug">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-[#4A4A4A] leading-relaxed line-clamp-3">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D8D8D3] flex items-center justify-between text-[11px] font-mono text-[#777777]">
                  <span>Status: Completed</span>
                  <span className="text-[#161616] font-semibold">{evt.academicYear}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. LEADERSHIP & ACCREDITED TEAM */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-[1700px] mx-auto" id="team">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#777777] uppercase">
                INSTITUTIONAL GOVERNANCE
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#161616]">
                Leadership & Accredited Team
              </h2>
            </div>

            {/* Interactive Academic Year Selector */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F0F0ED] border border-[#D8D8D3] shadow-neu-inset text-xs font-mono">
              {['2024–25', '2025–26', '2023–24'].map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedYear === year
                      ? 'bg-white text-[#161616] font-bold shadow-neu-button'
                      : 'text-[#777777] hover:text-[#161616]'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map(member => (
              <div
                key={member.id}
                className="p-6 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-card flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0F0ED] text-[#777777] uppercase">
                      {member.roleType}
                    </span>
                    <span className="text-[10px] font-mono text-[#777777]">
                      {member.academicYear}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <h3 className="font-display font-bold text-base text-[#161616]">
                      {member.name}
                    </h3>
                    <span className="text-xs font-semibold text-[#4A4A4A] mt-0.5">
                      {member.position}
                    </span>
                    <span className="text-[11px] text-[#777777] mt-0.5">
                      {member.department}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D8D8D3] flex items-center justify-between text-[11px] font-mono text-[#777777]">
                  <span>Accredited Council</span>
                  <span className="text-emerald-700 font-semibold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14. VERIFIED ACHIEVEMENTS (STRICT AUDIT POLICY) */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-[1700px] mx-auto" id="achievements">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#777777] uppercase">
                ACCREDITATION BENCHMARKS
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#161616]">
                Verified Institutional Achievements
              </h2>
            </div>
            <span className="text-xs text-[#777777] font-mono">
              Strict audit policy: zero placeholder entries permitted
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-card flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono uppercase text-[#777777] font-bold">
                  NATIONAL RECOGNITION
                </span>
                <h3 className="font-display font-bold text-lg text-[#161616]">
                  IIC 3.5 Star Rating
                </h3>
                <p className="text-xs text-[#4A4A4A] leading-relaxed">
                  Conferred by Ministry of Education Innovation Cell (MIC), Government of India, for active campus entrepreneurial initiatives.
                </p>
              </div>
              <span className="pt-4 border-t border-[#D8D8D3] text-[10px] font-mono text-[#777777]">
                Government of India MIC Certified
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-card flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono uppercase text-[#777777] font-bold">
                  HACKATHON EXCELLENCE
                </span>
                <h3 className="font-display font-bold text-lg text-[#161616]">
                  Smart India Hackathon Finalist
                </h3>
                <p className="text-xs text-[#4A4A4A] leading-relaxed">
                  Student engineering squad advanced to regional zonal finals addressing Ministry agricultural telemetry challenges.
                </p>
              </div>
              <span className="pt-4 border-t border-[#D8D8D3] text-[10px] font-mono text-[#777777]">
                SIH Regional Zonal Finalist
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-card flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono uppercase text-[#777777] font-bold">
                  STATE PARTNERSHIP
                </span>
                <h3 className="font-display font-bold text-lg text-[#161616]">
                  Kerala Startup Mission Sanction
                </h3>
                <p className="text-xs text-[#4A4A4A] leading-relaxed">
                  Continued grant aid and incubation partnership renewal under KSUM IEDC scheme for student-led technology prototypes.
                </p>
              </div>
              <span className="pt-4 border-t border-[#D8D8D3] text-[10px] font-mono text-[#777777]">
                Kerala Startup Mission Sanctioned
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 15. IDEAS IN MOTION WALL */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-[1700px] mx-auto" id="ideas">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#777777] uppercase">
                STUDENT INCUBATION PIPELINE
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#161616]">
                Ideas in Motion Wall
              </h2>
            </div>
            <button
              onClick={() => setWizardOpen(true)}
              className="tactile-btn px-4 py-2 rounded-xl bg-[#161616] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-neu-button cursor-pointer"
            >
              Lodge Your Proposal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ideas.map(idea => (
              <div
                key={idea.id}
                className="p-6 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-card flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#F0F0ED] border border-[#D8D8D3] text-[#242424] font-semibold">
                      {idea.technology || 'Technology'}
                    </span>
                    <span className="text-[10px] text-[#777777]">
                      {idea.status}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#161616]">
                    {idea.projectName}
                  </h3>

                  <p className="text-xs text-[#4A4A4A] leading-relaxed line-clamp-3">
                    {idea.problem || idea.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D8D8D3] flex items-center justify-between text-[11px] font-mono text-[#777777]">
                  <span>Lead: {idea.studentName}</span>
                  <span>{idea.department}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 17. STARTUPS DIRECTORY PLACEHOLDER (STRICT AUDIT POLICY) */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-[1700px] mx-auto" id="startups">
        <div className="p-8 rounded-2xl bg-[#EBEBE8]/40 border border-[#D8D8D3] shadow-neu-flat flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#777777] uppercase">
              VENTURE REGISTRATION AUDIT
            </span>
            <h3 className="font-display font-bold text-xl text-[#161616]">
              Startups Directory Under Audit
            </h3>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">
              In accordance with our zero-fabrication institutional charter, early-stage student teams currently in prototyping and customer validation are recorded as active ideas before formal MCA incorporation.
            </p>
          </div>
          <button
            onClick={() => setWizardOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-white border border-[#D8D8D3] text-xs font-mono font-semibold uppercase text-[#161616] hover:bg-[#F5F5F3] shadow-neu-button cursor-pointer"
          >
            Apply for Pre-Incubation
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 18. WORKSHOPS & REFERENCE VAULT */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-[1700px] mx-auto" id="workshops">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#777777] uppercase">
                HANDS-ON TECHNICAL CURRICULUM
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#161616]">
                Workshops & Technical Training
              </h2>
            </div>
            <span className="text-xs text-[#777777] font-mono">
              Regular hardware and software masterclasses
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'PCB Design & Etching', instructor: 'Electronics Lab Faculty', desc: 'KiCad schematic capture, layout routing, chemical etching, and testing.' },
              { title: '3D Prototyping & CAD', instructor: 'Mechanical Lab Lead', desc: 'SolidWorks parametric design, slicing parameters, and FDM 3D printing.' },
              { title: 'IoT & Telemetry', instructor: 'Robotics Department', desc: 'ESP32 firmware, MQTT communication, AWS IoT core broker integration.' },
              { title: 'IP & Patent Filing', instructor: 'KSUM IPR Cell', desc: 'Prior art searches, patent specification drafting, and provisional filing.' }
            ].map(w => (
              <div
                key={w.title}
                className="p-6 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-card flex flex-col justify-between gap-3"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-[#777777] uppercase font-bold">
                    TECHNICAL MODULE
                  </span>
                  <h3 className="font-display font-bold text-sm text-[#161616]">
                    {w.title}
                  </h3>
                  <p className="text-xs text-[#4A4A4A] leading-relaxed">
                    {w.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#D8D8D3] text-[10px] font-mono text-[#777777]">
                  By: {w.instructor}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 19. RESOURCES CATEGORY NAVIGATION PILLS */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-[1700px] mx-auto" id="resources">
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#777777] uppercase">
            CAMPUS INNOVATION INFRASTRUCTURE & REFERENCE VAULT
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {[
              'Maker Lab Equipment Access',
              'Rapid 3D Prototyping Suite',
              'KSUM Seed Funding Guidelines',
              'APJ KTU Activity Point Portal',
              'IPR & Patent Documentation',
              'Nodal Advisory Registry'
            ].map(pill => (
              <span
                key={pill}
                className="px-4 py-2 rounded-xl bg-white border border-[#D8D8D3] shadow-neu-flat text-xs font-mono text-[#242424] font-medium"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 20. VISUAL DOCUMENTATION: CAMPUS INNOVATION GALLERY */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-[1700px] mx-auto" id="gallery">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#777777] uppercase">
                CAMPUS PHOTO DOCUMENTATION
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#161616]">
                Innovation Gallery
              </h2>
            </div>
            <span className="text-xs text-[#777777] font-mono">
              Click any photograph to inspect archive record
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Featured Maker Lab Image */}
            <div
              onClick={() =>
                openLightbox(
                  'IES IEDC Maker Lab & Hardware Prototyping Facility',
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuA9ALmZOsdJ6qx82WemXAqE5oVz5PtVW8wm8z_DlWsJBCvBLOZWRG99JEyO3Od5UzsO04FmpfKvyhGPar8L21_dyQBGk2oRFuwqAIn8fHKRJ7hdzjvnsW2LCA7Wuxwkui_IxTfkImUp75oc4t2h4NM7d8P2aCtqsNg3Tr9SmrNzOZEV6vaSa3vFDNJ-gjttI2gtpuwLrvUJWRuoXF15MEeciDec5Q03Y9G3ntJ41GVXYhgA_a8YP6qzqcQ0-izdRRJAoug'
                )
              }
              className="md:col-span-2 relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-[#D8D8D3] shadow-neu-card cursor-pointer group"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9ALmZOsdJ6qx82WemXAqE5oVz5PtVW8wm8z_DlWsJBCvBLOZWRG99JEyO3Od5UzsO04FmpfKvyhGPar8L21_dyQBGk2oRFuwqAIn8fHKRJ7hdzjvnsW2LCA7Wuxwkui_IxTfkImUp75oc4t2h4NM7d8P2aCtqsNg3Tr9SmrNzOZEV6vaSa3vFDNJ-gjttI2gtpuwLrvUJWRuoXF15MEeciDec5Q03Y9G3ntJ41GVXYhgA_a8YP6qzqcQ0-izdRRJAoug"
                alt="Maker Lab"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <span className="text-[10px] font-mono uppercase text-white font-bold">
                  CAMPUS HARDWARE FACILITY
                </span>
                <h3 className="font-display font-bold text-lg text-white">
                  Maker Lab & Hardware Bench
                </h3>
                <span className="text-xs text-[#D8D8D3]">
                  Equipped with 3D printers, oscilloscope rigs, solder rework stations.
                </span>
              </div>
            </div>

            {/* Lightbox Trigger Card 2 */}
            <div
              onClick={() =>
                openLightbox(
                  'Student Innovation Team Field Tests',
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuAbeELhIPWjSf8CNYtdCMVuXWC-Cz_Lpgax7SF8KkNmvK1CVbKNkgLLvJImRINdXQGe4vY-02CPXq3BKsXDkZ5A3uqCjPlCnBYlVtDXOd2nI0w8MzwU-aNIZaUfJoCYijWueXiu_d1WiVaNL5x2OlwW6u0veK_fPfx8KPHU3j_FPIeTx81x0uiiC87gzNDQwYFkK8JDCIQo1wwwk3iQujdMZ3tr1I290QOaEJbH1oVjUsAxytAfIGglS2xkW2UwKSS03nc'
                )
              }
              className="relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-[#D8D8D3] shadow-neu-card cursor-pointer group bg-[#161616] p-6 flex flex-col justify-between"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbeELhIPWjSf8CNYtdCMVuXWC-Cz_Lpgax7SF8KkNmvK1CVbKNkgLLvJImRINdXQGe4vY-02CPXq3BKsXDkZ5A3uqCjPlCnBYlVtDXOd2nI0w8MzwU-aNIZaUfJoCYijWueXiu_d1WiVaNL5x2OlwW6u0veK_fPfx8KPHU3j_FPIeTx81x0uiiC87gzNDQwYFkK8JDCIQo1wwwk3iQujdMZ3tr1I290QOaEJbH1oVjUsAxytAfIGglS2xkW2UwKSS03nc"
                alt="Hackathon Team"
                className="w-full h-40 object-cover rounded-xl filter grayscale group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-[10px] font-mono text-[#777777] uppercase font-bold">
                  HACKATHON SPRINTS
                </span>
                <h3 className="font-display font-bold text-base text-white">
                  Field Testing & Prototype Rigs
                </h3>
                <span className="text-[11px] text-[#777777]">
                  Inspect high-resolution photographic audit records.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 21. CAMPUS NEWS & BULLETINS */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-[1700px] mx-auto" id="news">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#777777] uppercase">
                OFFICIAL ANNOUNCEMENTS
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#161616]">
                Campus Bulletins & News
              </h2>
            </div>
            <span className="text-xs text-[#777777] font-mono">
              Live updates from the Nodal Secretariat
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                date: 'SEP 2025',
                title: 'Academic Year 2025–26 Executive Council Formed',
                desc: 'Official notification regarding appointment of Student Leads across Innovation, Technology, and Entrepreneurship verticals.'
              },
              {
                date: 'AUG 2025',
                title: 'Kerala Startup Mission Idea Grant Call Open',
                desc: 'Sanction for student hardware prototypes up to ₹2 Lakhs per qualified project. Detailed nodal briefing schedule announced.'
              },
              {
                date: 'JUL 2025',
                title: 'Robotics Maker Lab Equipment Upgraded',
                desc: 'Arrival of high-precision multi-material 3D printers and DSO test equipment available for registered project clusters.'
              }
            ].map(n => (
              <div
                key={n.title}
                className="p-6 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-card flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0F0ED] border border-[#D8D8D3] text-[#242424] self-start font-semibold">
                    {n.date}
                  </span>
                  <h3 className="font-display font-bold text-base text-[#161616]">
                    {n.title}
                  </h3>
                  <p className="text-xs text-[#4A4A4A] leading-relaxed">
                    {n.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#D8D8D3] text-[10px] font-mono text-[#777777]">
                  Issued by: IES IEDC Nodal Office
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 22. JOIN IEDC CTA */}
      {/* ========================================================================= */}
      <section className="w-full px-4 sm:px-8 max-w-[1700px] mx-auto">
        <div className="p-8 sm:p-14 rounded-2xl bg-[#161616] text-white shadow-neu-card flex flex-col items-center text-center gap-6 engineering-grid">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#D8D8D3] uppercase">
            BECOME PART OF THE CHARTER
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-white max-w-2xl leading-tight">
            BUILD WHAT MATTERS.
          </h2>
          <p className="text-xs sm:text-sm text-[#D8D8D3] max-w-xl leading-relaxed">
            Whether you have an early electrical schematic or an ambitious software thesis, the IES IEDC ecosystem provides the workbench, funding conduits, and mentorship to bring it to reality.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setWizardOpen(true)}
              className="px-8 py-3.5 rounded-xl bg-white text-[#161616] text-xs font-mono uppercase font-bold tracking-wider hover:bg-[#F0F0ED] cursor-pointer shadow-lg"
            >
              Submit Your Idea
            </button>
            <a
              href="#contact"
              className="px-8 py-3.5 rounded-xl bg-transparent border border-white/40 text-white text-xs font-mono uppercase font-semibold hover:bg-white/10"
            >
              Contact Nodal Office
            </a>
          </div>
        </div>
      </section>

      {/* MODALS */}
      <IdeaWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSubmitted={() => {
          api.getIdeas().then(setIdeas);
        }}
      />

      <AdminQuickDrawer
        isOpen={adminDrawerOpen}
        onClose={() => setAdminDrawerOpen(false)}
        ideaCount={ideas.length}
      />

      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        caption={lightboxCaption}
        imageSrc={lightboxImage}
      />
    </div>
  );
};
