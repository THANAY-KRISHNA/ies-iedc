import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Lightbulb,
  Settings,
  BarChart3,
  Eye,
  Target,
  Calendar,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';
import { api } from '../services/api';
import { EventItem, GalleryAlbum, SiteSettings } from '../types';
import { IdeaWizardModal } from '../components/modals/IdeaWizardModal';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [activeNode, setActiveNode] = useState<'innovation' | 'technical' | 'entrepreneurship' | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [galleryAlbums, setGalleryAlbums] = useState<GalleryAlbum[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Handle modal trigger events from Navbar / Footer
  useEffect(() => {
    const handleOpenWizard = () => setWizardOpen(true);
    const handleOpenAdmin = () => navigate('/admin');

    window.addEventListener('open-idea-wizard', handleOpenWizard);
    window.addEventListener('open-admin-drawer', handleOpenAdmin);

    return () => {
      window.removeEventListener('open-idea-wizard', handleOpenWizard);
      window.removeEventListener('open-admin-drawer', handleOpenAdmin);
    };
  }, [navigate]);

  // Fetch real settings, events and gallery data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const [siteSettings, evts, gallery] = await Promise.all([
          api.getSettings(),
          api.getEvents(),
          api.getGallery()
        ]);
        setSettings(siteSettings || null);
        setEvents(evts || []);
        setGalleryAlbums(gallery || []);
      } catch (e) {
        console.error('Error fetching homepage data', e);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full bg-[#EFEFF2] text-[#1E232A] antialiased selection:bg-[#1E232A] selection:text-white">
      {/* ========================================================================= */}
      {/* 01. HERO SECTION (ENHANCED RICH 3D NEUMORPHIC EDITION) */}
      {/* ========================================================================= */}
      <section className="relative w-full px-6 lg:px-16 pt-12 lg:pt-16 pb-20 lg:pb-28 border-b border-[#DCDFE6] overflow-hidden bg-[#EFF1F5]">
        
        {/* Far Left Background Soft Organic Wave Line Accent */}
        <div className="absolute top-0 left-0 w-72 h-full pointer-events-none opacity-40">
          <svg className="w-full h-full text-[#D4D8E2]" viewBox="0 0 200 800" fill="none">
            <path d="M -50,0 Q 180,300 -30,800" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Far Right Background Isometric Blueprint & Floating Labels */}
        <div className="absolute top-12 right-0 w-80 h-full pointer-events-none opacity-20 hidden lg:block select-none">
          <svg className="w-full h-full text-[#6C727F]" viewBox="0 0 300 600" fill="none">
            <g transform="rotate(-15 150 150)">
              <rect x="50" y="50" width="120" height="160" rx="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
              <text x="70" y="100" className="text-[11px] font-sans font-bold fill-[#4A515D] tracking-widest">IDEAS</text>
              <text x="70" y="130" className="text-[11px] font-sans font-bold fill-[#4A515D] tracking-widest">PEOPLE</text>
              <text x="70" y="160" className="text-[11px] font-sans font-bold fill-[#4A515D] tracking-widest">IMPACT</text>
            </g>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          
          {/* Left Column Narrative (6.5 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-5 pr-0 lg:pr-4">
            
            {/* Header Eyebrow */}
            <div className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-[#525866]">
              INNOVATION &amp; ENTREPRENEURSHIP DEVELOPMENT CENTRE
            </div>

            {/* Main Headline & Subtitle */}
            <div className="flex flex-col gap-1">
              <h1 className="font-sans text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#1E232A] leading-none drop-shadow-xs">
                {settings?.heroHeading || 'IES IEDC'}
              </h1>
              <p className="font-sans text-3xl sm:text-4xl text-[#4B515D] font-normal tracking-tight mt-1">
                IES College of Engineering
              </p>
              
              {/* Tagline */}
              <div className="text-base sm:text-lg font-medium text-[#2E333D] tracking-wide mt-2">
                {settings?.tagline || 'Innovate • Create • Entrepreneur'}
              </div>
            </div>

            {/* Description Paragraph */}
            <p className="text-[#525866] text-sm sm:text-base leading-relaxed max-w-lg mt-2">
              {settings?.heroSubtitle || 'An innovation and entrepreneurship platform empowering students to explore ideas, develop skills, build prototypes and take their ideas towards meaningful solutions.'}
            </p>

            {/* Action Buttons (100% Working & Tactile 3D Effects) */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#what-we-do"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('what-we-do')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-b from-[#343A46] to-[#1E232A] text-white text-xs font-bold font-sans tracking-widest uppercase shadow-[8px_8px_20px_rgba(160,168,182,0.5),-8px_-8px_20px_rgba(255,255,255,0.9)] hover:-translate-y-1 hover:shadow-[12px_12px_24px_rgba(160,168,182,0.65)] active:translate-y-0.5 transition-all duration-200 flex items-center gap-2 cursor-pointer group select-none"
              >
                <span>{settings?.heroCtaText || 'EXPLORE IEDC'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={() => setWizardOpen(true)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-b from-white to-[#F4F5F8] text-[#2B303A] text-xs font-bold font-sans tracking-widest uppercase shadow-[8px_8px_20px_rgba(160,168,182,0.5),-8px_-8px_20px_rgba(255,255,255,0.9)] hover:-translate-y-1 active:shadow-neu-hub-inner transition-all duration-200 cursor-pointer border border-white/80 select-none"
              >
                {settings?.heroSecondaryCtaText || 'SUBMIT YOUR IDEA'}
              </button>
            </div>

            {/* Bottom Tagline */}
            <div className="text-[10px] sm:text-xs font-bold font-sans tracking-[0.25em] text-[#848B98] uppercase mt-4">
              BUILDING AN INNOVATION CULTURE. NURTURING FUTURE ENTREPRENEURS.
            </div>
          </div>

          {/* Right Column 3-Card Orbital Neumorphic Diagram (6 cols) */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[500px] sm:min-h-[560px] py-4">
            
            {/* Top Right Handwritten Script "Learning by Doing." */}
            <div className="absolute top-2 right-4 sm:right-8 z-30 flex flex-col items-end select-none">
              <span className="font-handwriting text-3xl sm:text-4xl text-[#727885] rotate-[-6deg] drop-shadow-xs">
                Learning by Doing.
              </span>
              {/* Hand-drawn connecting line stroke */}
              <svg className="w-16 h-8 text-[#989EAB] stroke-current stroke-[1.5] fill-none -mt-1 mr-4" viewBox="0 0 60 30">
                <path d="M 50,2 Q 30,25 2,28" />
              </svg>
            </div>

            {/* Orbital Arc SVG Lines behind the cards */}
            <svg className="absolute inset-0 w-full h-full text-[#BCC1CD] pointer-events-none z-0" viewBox="0 0 500 500" fill="none">
              <path
                d="M 250, 110 C 130, 200 120, 360 140, 390 C 250, 440 370, 420 360, 390 C 370, 310 360, 200 250, 110"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <circle cx="250" cy="110" r="4" fill="#727885" />
              <circle cx="140" cy="390" r="4" fill="#727885" />
              <circle cx="360" cy="390" r="4" fill="#727885" />
            </svg>

            {/* 3 Neumorphic Cards + Center Disc Layout Container */}
            <div className="relative w-full max-w-[500px] h-[480px] sm:h-[520px] flex items-center justify-center">
              
              {/* 1. TOP CARD — INNOVATION */}
              <div
                onClick={() => setActiveNode('innovation')}
                onMouseEnter={() => setActiveNode('innovation')}
                onMouseLeave={() => setActiveNode(null)}
                className={`absolute top-0 left-1/2 -translate-x-1/2 z-10 w-52 sm:w-60 p-6 rounded-[28px] bg-gradient-to-b from-white to-[#F9FAFC] shadow-neu-soft-card border border-white/90 flex flex-col items-center text-center cursor-pointer transition-all duration-300 ${
                  activeNode === 'innovation'
                    ? '-translate-y-3 scale-105 shadow-[20px_20px_40px_rgba(150,158,175,0.65),-20px_-20px_40px_rgba(255,255,255,1)] ring-2 ring-[#1E232A]'
                    : 'hover:-translate-y-2 hover:scale-[1.03]'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-white to-[#F0F2F6] shadow-neu-hub-disc flex items-center justify-center text-[#1E232A]">
                  <Lightbulb className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="font-bold font-sans text-xs sm:text-sm tracking-wider uppercase text-[#1E232A] mt-3">
                  INNOVATION
                </h3>
                <div className="text-[11px] sm:text-xs text-[#6C727F] flex flex-col items-center gap-0.5 mt-2.5 font-normal">
                  <span>Ideation</span>
                  <span>Design Thinking</span>
                  <span>Problem Solving</span>
                </div>
              </div>

              {/* 2. CENTER DISC HUB — IES IEDC (3D Concentric Disc Stack) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#E2E5EB] p-3.5 shadow-[20px_20px_45px_rgba(155,162,176,0.6),-20px_-20px_45px_rgba(255,255,255,1)] border border-white flex items-center justify-center select-none group">
                <div className="w-full h-full rounded-full bg-[#0B0D11] shadow-[inset_6px_6px_14px_rgba(0,0,0,0.85),inset_-6px_-6px_14px_rgba(255,255,255,0.15)] flex items-center justify-center p-2.5 border border-black relative overflow-hidden">
                  {/* Glossy 3D glass highlight curve */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/35 via-white/5 to-transparent pointer-events-none z-20" />
                  <img
                    src="/logo.png"
                    alt="IES IEDC Official Emblem"
                    className="w-full h-full object-cover rounded-full relative z-10 scale-105 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* 3. BOTTOM-LEFT CARD — TECHNICAL */}
              <div
                onClick={() => setActiveNode('technical')}
                onMouseEnter={() => setActiveNode('technical')}
                onMouseLeave={() => setActiveNode(null)}
                className={`absolute bottom-0 left-0 z-10 w-52 sm:w-60 p-6 rounded-[28px] bg-gradient-to-b from-white to-[#F9FAFC] shadow-neu-soft-card border border-white/90 flex flex-col items-center text-center cursor-pointer transition-all duration-300 ${
                  activeNode === 'technical'
                    ? '-translate-y-3 scale-105 shadow-[20px_20px_40px_rgba(150,158,175,0.65),-20px_-20px_40px_rgba(255,255,255,1)] ring-2 ring-[#1E232A]'
                    : 'hover:-translate-y-2 hover:scale-[1.03]'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-white to-[#F0F2F6] shadow-neu-hub-disc flex items-center justify-center text-[#1E232A]">
                  <Settings className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="font-bold font-sans text-xs sm:text-sm tracking-wider uppercase text-[#1E232A] mt-3">
                  TECHNICAL
                </h3>
                <div className="text-[11px] sm:text-xs text-[#6C727F] flex flex-col items-center gap-0.5 mt-2.5 font-normal">
                  <span>Technology</span>
                  <span>Skills</span>
                  <span>Prototyping</span>
                </div>
              </div>

              {/* 4. BOTTOM-RIGHT CARD — ENTREPRENEURSHIP */}
              <div
                onClick={() => setActiveNode('entrepreneurship')}
                onMouseEnter={() => setActiveNode('entrepreneurship')}
                onMouseLeave={() => setActiveNode(null)}
                className={`absolute bottom-0 right-0 z-10 w-52 sm:w-60 p-6 rounded-[28px] bg-gradient-to-b from-white to-[#F9FAFC] shadow-neu-soft-card border border-white/90 flex flex-col items-center text-center cursor-pointer transition-all duration-300 ${
                  activeNode === 'entrepreneurship'
                    ? '-translate-y-3 scale-105 shadow-[20px_20px_40px_rgba(150,158,175,0.65),-20px_-20px_40px_rgba(255,255,255,1)] ring-2 ring-[#1E232A]'
                    : 'hover:-translate-y-2 hover:scale-[1.03]'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-white to-[#F0F2F6] shadow-neu-hub-disc flex items-center justify-center text-[#1E232A]">
                  <BarChart3 className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="font-bold font-sans text-xs sm:text-sm tracking-wider uppercase text-[#1E232A] mt-3">
                  ENTREPRENEURSHIP
                </h3>
                <div className="text-[11px] sm:text-xs text-[#6C727F] flex flex-col items-center gap-0.5 mt-2.5 font-normal">
                  <span>Business</span>
                  <span>Pitching</span>
                  <span>Business Model</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02. OUR VISION & MISSION SECTION */}
      {/* ========================================================================= */}
      <section className="w-full px-6 lg:px-16 py-20 border-b border-[#D8D8D3] bg-[#EBEBE8]/40" id="about">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#777777]">
              — INSTITUTIONAL CHARTER
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#161616] tracking-tight">
              Vision &amp; Mission Mandate
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Vision Card */}
            <div className="p-8 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-soft-card flex flex-col justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#EBEBE8]">
                  <span className="text-xs font-mono font-bold text-[#777777] uppercase tracking-widest">
                    — OUR VISION
                  </span>
                  <div className="w-9 h-9 rounded-full bg-[#F5F5F3] border border-[#D8D8D3] flex items-center justify-center text-[#161616]">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-[#161616]">
                  Our Vision
                </h3>
                <p className="text-base text-[#4A4A4A] leading-relaxed italic font-serif">
                  “{settings?.vision || 'To inculcate an innovation culture among the students, to create future entrepreneurs, and position the institution as a leading learning, innovation, and entrepreneurial hub.'}”
                </p>
              </div>
              <div className="pt-4 border-t border-[#EBEBE8] text-xs font-mono text-[#777777]">
                Established 2016 • KSUM Sanctioned Chapter
              </div>
            </div>

            {/* Mission Card */}
            <div className="p-8 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-soft-card flex flex-col justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#EBEBE8]">
                  <span className="text-xs font-mono font-bold text-[#777777] uppercase tracking-widest">
                    — OUR MISSION
                  </span>
                  <div className="w-9 h-9 rounded-full bg-[#F5F5F3] border border-[#D8D8D3] flex items-center justify-center text-[#161616]">
                    <Target className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-[#161616]">
                  Our Mission
                </h3>
                <p className="text-base text-[#4A4A4A] leading-relaxed italic font-serif">
                  “{settings?.mission || 'To establish an innovation platform by introducing state-of-the-art technologies through promoting student-driven innovation and entrepreneurship.'}”
                </p>
              </div>
              <div className="pt-4 border-t border-[#EBEBE8] text-xs font-mono text-[#777777]">
                Ministry of HRD IIC Partner Node
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. HOW IEDC WORKS: THREE CONNECTED VERTICALS */}
      {/* ========================================================================= */}
      <section className="w-full px-6 lg:px-16 py-20 border-b border-[#D8D8D3]" id="what-we-do">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#777777]">
              — HOW IEDC WORKS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#161616] tracking-tight">
              A Connected Journey
            </h2>
            <p className="text-sm text-[#4A4A4A]">
              From curiosity to real-world impact through three structured verticals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 01 */}
            <div className="p-8 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-soft-card flex flex-col justify-between gap-6 hover:border-[#161616] hover:-translate-y-1.5 transition-all group">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F5F5F3] border border-[#D8D8D3] flex items-center justify-center text-[#161616] group-hover:bg-[#161616] group-hover:text-white transition-colors">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-[#777777] uppercase tracking-wider">
                  01 INNOVATION
                </span>
                <h3 className="font-display text-xl font-bold text-[#161616]">
                  Creative Scoping &amp; Ideation
                </h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  Encouraging creative thinking, problem discovery, and empathetic user research to tackle real engineering and community challenges.
                </p>
              </div>
              <div className="pt-4 border-t border-[#EBEBE8] text-xs font-mono text-[#777777]">
                Design Thinking • Hackathons • Problem Scoping
              </div>
            </div>

            {/* Card 02 */}
            <div className="p-8 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-soft-card flex flex-col justify-between gap-6 hover:border-[#161616] hover:-translate-y-1.5 transition-all group">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F5F5F3] border border-[#D8D8D3] flex items-center justify-center text-[#161616] group-hover:bg-[#161616] group-hover:text-white transition-colors">
                  <Settings className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-[#777777] uppercase tracking-wider">
                  02 TECHNICAL
                </span>
                <h3 className="font-display text-xl font-bold text-[#161616]">
                  Hands-On Fabrication Labs
                </h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  Building technical competence through practical workshops, IoT prototyping, additive manufacturing, and software engineering.
                </p>
              </div>
              <div className="pt-4 border-t border-[#EBEBE8] text-xs font-mono text-[#777777]">
                3D CAD • Robotics • Microcontrollers • AI Suite
              </div>
            </div>

            {/* Card 03 */}
            <div className="p-8 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-soft-card flex flex-col justify-between gap-6 hover:border-[#161616] hover:-translate-y-1.5 transition-all group">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F5F5F3] border border-[#D8D8D3] flex items-center justify-center text-[#161616] group-hover:bg-[#161616] group-hover:text-white transition-colors">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-[#777777] uppercase tracking-wider">
                  03 ENTREPRENEURSHIP
                </span>
                <h3 className="font-display text-xl font-bold text-[#161616]">
                  Venture Incubation
                </h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  Turning working prototypes into sustainable ventures with business model validation, IPR protection, and grant support.
                </p>
              </div>
              <div className="pt-4 border-t border-[#EBEBE8] text-xs font-mono text-[#777777]">
                KSUM Grants • Patent Filing • Pitch Competitions
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04. UPCOMING EVENTS */}
      {/* ========================================================================= */}
      <section className="w-full px-6 lg:px-16 py-20 border-b border-[#D8D8D3] bg-[#EBEBE8]/40" id="events">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#777777]">
                — UPCOMING EVENTS
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#161616] tracking-tight">
                Workshops &amp; Activities
              </h2>
              <p className="text-sm text-[#4A4A4A]">
                Be part of upcoming bootcamps, technical talks, and hackathons.
              </p>
            </div>

            <Link
              to="/events"
              className="text-xs font-mono font-bold text-[#161616] uppercase hover:underline flex items-center gap-1.5 shrink-0"
            >
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length > 0 ? (
              events.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  className="p-6 rounded-2xl bg-white border border-[#D8D8D3] shadow-neu-soft-card flex flex-col justify-between gap-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#777777]">
                      <span className="px-2.5 py-0.5 rounded bg-[#F5F5F3] border border-[#D8D8D3] uppercase font-bold text-[#161616]">
                        {evt.category || 'Event'}
                      </span>
                      <span>{evt.academicYear || '2025–26'}</span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-[#161616]">
                      {evt.title}
                    </h3>
                    
                    <p className="text-xs text-[#4A4A4A] leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EBEBE8] flex items-center justify-between text-xs text-[#777777]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#161616]" />
                      <span>{evt.date}</span>
                    </div>
                    {evt.venue && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#161616]" />
                        <span>{evt.venue}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 rounded-2xl bg-white border border-[#D8D8D3] text-center text-sm text-[#777777]">
                No upcoming events listed at this time. Check back soon!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05. GALLERY PREVIEW */}
      {/* ========================================================================= */}
      <section className="w-full px-6 lg:px-16 py-20 border-b border-[#D8D8D3]" id="gallery">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#777777]">
                — GALLERY
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#161616] tracking-tight">
                Moments That Make the Journey
              </h2>
              <p className="text-sm text-[#4A4A4A]">
                Event highlights, prototyping sessions, and team milestones.
              </p>
            </div>

            <Link
              to="/gallery"
              className="text-xs font-mono font-bold text-[#161616] uppercase hover:underline flex items-center gap-1.5 shrink-0"
            >
              <span>Explore Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {galleryAlbums.slice(0, 3).map((album) => (
              <div
                key={album.id}
                className="group relative aspect-video rounded-2xl bg-white border border-[#D8D8D3] overflow-hidden shadow-neu-soft-card hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate('/gallery')}
              >
                <img
                  src={album.coverImage || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800'}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-mono uppercase text-white/80">{album.academicYear || '2025–26'}</span>
                  <h4 className="font-display text-sm font-bold truncate">{album.title}</h4>
                </div>
              </div>
            ))}

            {/* +24 More Photos Banner Card */}
            <Link
              to="/gallery"
              className="group aspect-video rounded-2xl bg-[#1E232A] text-white border border-[#1E232A] p-6 flex flex-col items-center justify-center text-center gap-2 shadow-lg hover:bg-[#2D303A] transition-colors cursor-pointer"
            >
              <ImageIcon className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-display text-base font-bold">+24 More Photos</span>
              <span className="text-xs font-mono text-[#848B98]">View Event Albums →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06. JOIN IEDC CTA BANNER */}
      {/* ========================================================================= */}
      <section className="relative w-full px-6 lg:px-16 py-24 bg-[#1E232A] text-white border-b border-[#D8D8D3] overflow-hidden">
        
        {/* Handwritten Script Watermark */}
        <div className="absolute top-6 right-8 font-handwriting text-2xl sm:text-3xl text-white/40 select-none">
          Small Ideas Big Impact —
        </div>

        <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          
          <div className="flex flex-col gap-4 max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
              — JOIN IEDC
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Build What Matters.
            </h2>
            <p className="text-base text-neutral-300 leading-relaxed">
              Whether you have an idea, want to build projects, or learn new skills, IES IEDC is your campus launchpad.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              to="/contact"
              className="px-8 py-4 rounded-2xl bg-white text-[#1E232A] text-xs font-bold font-sans tracking-widest uppercase hover:bg-neutral-100 transition-all duration-150 shadow-md flex items-center gap-2"
            >
              <span>JOIN IEDC</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setWizardOpen(true)}
              className="px-8 py-4 rounded-2xl bg-transparent text-white border border-neutral-700 text-xs font-bold font-sans tracking-widest uppercase hover:bg-neutral-800 transition-all duration-150 shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>SUBMIT YOUR IDEA</span>
            </button>
          </div>

        </div>
      </section>

      {/* Idea Wizard Modal */}
      <IdeaWizardModal isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
};
