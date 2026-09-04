import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Lightbulb,
  Cpu,
  Rocket,
  Eye,
  Target,
  Calendar,
  MapPin,
  Image as ImageIcon,
  MousePointer
} from 'lucide-react';
import { api } from '../services/api';
import { EventItem, GalleryAlbum } from '../types';
import { IdeaWizardModal } from '../components/modals/IdeaWizardModal';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [activeNode, setActiveNode] = useState<'innovation' | 'technical' | 'entrepreneurship'>('innovation');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [galleryAlbums, setGalleryAlbums] = useState<GalleryAlbum[]>([]);

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

  // Fetch real events and gallery data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const [evts, gallery] = await Promise.all([
          api.getEvents(),
          api.getGallery()
        ]);
        setEvents(evts || []);
        setGalleryAlbums(gallery || []);
      } catch (e) {
        console.error('Error fetching homepage data', e);
      }
    }
    fetchData();
  }, []);

  const nodeDetails = {
    innovation: {
      number: '01',
      title: 'INNOVATION',
      subtitle: 'Problem Discovery & Creative Scoping',
      desc: 'Emphasizing problem identification, empathetic user research, and design thinking frameworks to turn observations into scalable project briefs.',
      icon: Lightbulb,
      tagColor: 'bg-[#161616] text-white border-[#161616]'
    },
    technical: {
      number: '02',
      title: 'TECHNICAL',
      subtitle: 'Hands-on Prototyping & DIY Labs',
      desc: 'Delivering direct exposure to hardware fabrication, IoT microcontrollers, software development, additive 3D printing, and generative AI toolchains.',
      icon: Cpu,
      tagColor: 'bg-[#161616] text-white border-[#161616]'
    },
    entrepreneurship: {
      number: '03',
      title: 'ENTREPRENEURSHIP',
      subtitle: 'Startup Incubation & Market Readiness',
      desc: 'Translating functional prototypes into sustainable ventures with business model validation, IPR guidance, and Kerala Startup Mission (KSUM) grant support.',
      icon: Rocket,
      tagColor: 'bg-[#161616] text-white border-[#161616]'
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#F5F5F3] text-[#242424] antialiased selection:bg-[#161616] selection:text-white">
      {/* ========================================================================= */}
      {/* 01. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative w-full px-6 lg:px-16 pt-12 sm:pt-16 pb-20 sm:pb-28 border-b border-[#D8D8D3] overflow-hidden">
        {/* Architectural grid background pattern */}
        <div className="absolute inset-0 bg-[linear-[#EBEBE8]_1px,transparent_1px] bg-[size:32px_32px] opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Narrative (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Header Eyebrow */}
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-widest uppercase text-[#777777]">
              <span className="w-2 h-2 rounded-full bg-[#161616]"></span>
              INNOVATION &amp; ENTREPRENEURSHIP DEVELOPMENT CENTRE
            </div>

            {/* Main Title & Subtitle */}
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#161616] leading-[1.05]">
                IES IEDC
              </h1>
              <p className="font-sans text-xl sm:text-2xl font-semibold text-[#4A4A4A]">
                IES College of Engineering
              </p>
              
              {/* Tagline Pill */}
              <div className="pt-2">
                <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#EBEBE8] border border-[#D8D8D3] text-xs font-mono font-bold tracking-widest uppercase text-[#242424]">
                  INNOVATE • CREATE • ENTREPRENEUR
                </span>
              </div>
            </div>

            {/* Editorial Description */}
            <p className="text-base sm:text-lg text-[#4A4A4A] leading-relaxed max-w-2xl pt-1">
              A student-driven space where ideas become experiments, skills become solutions, and curiosity becomes entrepreneurship.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#what-we-do"
                className="px-7 py-3.5 rounded-md bg-[#161616] text-white text-sm font-semibold tracking-wide hover:bg-[#242424] transition-all duration-150 shadow-sm flex items-center gap-2 cursor-pointer group"
              >
                <span>Explore IEDC</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={() => setWizardOpen(true)}
                className="px-7 py-3.5 rounded-md bg-white text-[#161616] text-sm font-semibold tracking-wide hover:bg-[#F0F0ED] border border-[#D8D8D3] transition-all duration-150 shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>💡 Submit Your Idea</span>
              </button>
            </div>

            {/* Scroll Indicator */}
            <div className="pt-8 flex items-center gap-2 text-xs font-mono text-[#777777]">
              <MousePointer className="w-3.5 h-3.5 text-[#161616]" />
              <span>Scroll to explore</span>
            </div>
          </div>

          {/* Right Interactive 3-Vertical Orbital Hub (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Handwritten Script Watermark */}
            <div className="absolute -top-8 right-2 font-serif italic text-base sm:text-lg text-[#777777]/80 select-none z-10">
              Ideas for a Brighter Tomorrow —
            </div>

            {/* Orbital Interactive Diagram Container */}
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center p-4">
              
              {/* Outer Dashed Orbital SVG Ring */}
              <svg className="absolute inset-0 w-full h-full text-[#D8D8D3]" viewBox="0 0 400 400" fill="none">
                <circle cx="200" cy="200" r="145" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
                
                {/* Orbital Path Curved Text Labels */}
                <path id="orbitPath" d="M 200, 55 A 145,145 0 1,1 199.9,55" fill="none" />
                <text className="text-[10px] font-mono font-semibold uppercase fill-[#777777] tracking-[0.3em]">
                  <textPath href="#orbitPath" startOffset="10%">LEARN</textPath>
                  <textPath href="#orbitPath" startOffset="43%">BUILD</textPath>
                  <textPath href="#orbitPath" startOffset="76%">GROW</textPath>
                </text>
              </svg>

              {/* Central Neumorphic Hub Badge */}
              <div className="z-10 w-36 h-36 rounded-full bg-white border border-[#D8D8D3] shadow-lg flex flex-col items-center justify-center text-center p-4 transition-all">
                <div className="w-10 h-10 rounded-full bg-[#161616] text-white flex items-center justify-center font-bold text-xs font-mono mb-1.5 shadow">
                  IES
                </div>
                <span className="font-display font-extrabold text-sm text-[#161616]">IES IEDC</span>
                <span className="text-[9px] font-mono font-medium text-[#777777] uppercase tracking-tighter leading-tight mt-0.5">
                  IES COLLEGE OF ENGINEERING
                </span>
              </div>

              {/* 3 Orbiting Node Cards */}
              
              {/* Node 1: INNOVATION (Top Center) */}
              <button
                onClick={() => setActiveNode('innovation')}
                onMouseEnter={() => setActiveNode('innovation')}
                className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 px-4 py-2.5 rounded-full border transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-md ${
                  activeNode === 'innovation'
                    ? 'bg-[#161616] text-white border-[#161616] scale-110'
                    : 'bg-white text-[#242424] border-[#D8D8D3] hover:border-[#161616]'
                }`}
              >
                <Lightbulb className={`w-4 h-4 ${activeNode === 'innovation' ? 'text-amber-300' : 'text-amber-500'}`} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">01 INNOVATION</span>
              </button>

              {/* Node 2: TECHNICAL (Bottom Left) */}
              <button
                onClick={() => setActiveNode('technical')}
                onMouseEnter={() => setActiveNode('technical')}
                className={`absolute bottom-6 left-2 z-20 px-4 py-2.5 rounded-full border transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-md ${
                  activeNode === 'technical'
                    ? 'bg-[#161616] text-white border-[#161616] scale-110'
                    : 'bg-white text-[#242424] border-[#D8D8D3] hover:border-[#161616]'
                }`}
              >
                <Cpu className={`w-4 h-4 ${activeNode === 'technical' ? 'text-indigo-300' : 'text-indigo-500'}`} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">02 TECHNICAL</span>
              </button>

              {/* Node 3: ENTREPRENEURSHIP (Bottom Right) */}
              <button
                onClick={() => setActiveNode('entrepreneurship')}
                onMouseEnter={() => setActiveNode('entrepreneurship')}
                className={`absolute bottom-6 right-2 z-20 px-4 py-2.5 rounded-full border transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-md ${
                  activeNode === 'entrepreneurship'
                    ? 'bg-[#161616] text-white border-[#161616] scale-110'
                    : 'bg-white text-[#242424] border-[#D8D8D3] hover:border-[#161616]'
                }`}
              >
                <Rocket className={`w-4 h-4 ${activeNode === 'entrepreneurship' ? 'text-emerald-300' : 'text-emerald-500'}`} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">03 ENTREPRENEURSHIP</span>
              </button>
            </div>

            {/* Active Node Detail Card */}
            <div className="w-full max-w-[420px] mt-4 p-4 rounded-lg bg-white border border-[#D8D8D3] shadow-sm flex flex-col gap-2 transition-all">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${nodeDetails[activeNode].tagColor}`}>
                  Vertical {nodeDetails[activeNode].number}
                </span>
                <span className="text-xs font-mono text-[#777777]">Interactive Node</span>
              </div>
              <h4 className="font-display text-sm font-bold text-[#161616]">
                {nodeDetails[activeNode].title} — <span className="text-xs font-normal text-[#4A4A4A]">{nodeDetails[activeNode].subtitle}</span>
              </h4>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                {nodeDetails[activeNode].desc}
              </p>
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
            <div className="p-8 rounded-xl bg-white border border-[#D8D8D3] shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-shadow">
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
                  “To inculcate an innovation culture among the students, to create future entrepreneurs, and position the institution as a leading learning, innovation, and entrepreneurial hub.”
                </p>
              </div>
              <div className="pt-4 border-t border-[#EBEBE8] text-xs font-mono text-[#777777]">
                Established 2016 • KSUM Sanctioned Chapter
              </div>
            </div>

            {/* Mission Card */}
            <div className="p-8 rounded-xl bg-white border border-[#D8D8D3] shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-shadow">
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
                  “To establish an innovation platform by introducing state-of-the-art technologies through promoting student-driven innovation and entrepreneurship.”
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
            <div className="p-8 rounded-xl bg-white border border-[#D8D8D3] shadow-sm flex flex-col justify-between gap-6 hover:border-[#161616] transition-colors group">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#F5F5F3] border border-[#D8D8D3] flex items-center justify-center text-[#161616] group-hover:bg-[#161616] group-hover:text-white transition-colors">
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
            <div className="p-8 rounded-xl bg-white border border-[#D8D8D3] shadow-sm flex flex-col justify-between gap-6 hover:border-[#161616] transition-colors group">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#F5F5F3] border border-[#D8D8D3] flex items-center justify-center text-[#161616] group-hover:bg-[#161616] group-hover:text-white transition-colors">
                  <Cpu className="w-6 h-6" />
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
            <div className="p-8 rounded-xl bg-white border border-[#D8D8D3] shadow-sm flex flex-col justify-between gap-6 hover:border-[#161616] transition-colors group">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#F5F5F3] border border-[#D8D8D3] flex items-center justify-center text-[#161616] group-hover:bg-[#161616] group-hover:text-white transition-colors">
                  <Rocket className="w-6 h-6" />
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
                  className="p-6 rounded-xl bg-white border border-[#D8D8D3] shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-shadow"
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
              <div className="col-span-full p-8 rounded-xl bg-white border border-[#D8D8D3] text-center text-sm text-[#777777]">
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
                className="group relative aspect-video rounded-xl bg-white border border-[#D8D8D3] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
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
              className="group aspect-video rounded-xl bg-[#161616] text-white border border-[#161616] p-6 flex flex-col items-center justify-center text-center gap-2 shadow-sm hover:bg-[#242424] transition-colors cursor-pointer"
            >
              <ImageIcon className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-display text-base font-bold">+24 More Photos</span>
              <span className="text-xs font-mono text-[#777777]">View Event Albums →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06. JOIN IEDC CTA BANNER */}
      {/* ========================================================================= */}
      <section className="relative w-full px-6 lg:px-16 py-24 bg-[#161616] text-white border-b border-[#D8D8D3] overflow-hidden">
        
        {/* Handwritten Script Watermark */}
        <div className="absolute top-6 right-8 font-serif italic text-base sm:text-xl text-white/40 select-none">
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
              className="px-7 py-3.5 rounded-md bg-white text-[#161616] text-sm font-semibold tracking-wide hover:bg-neutral-100 transition-all duration-150 shadow-md flex items-center gap-2"
            >
              <span>Join IEDC</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setWizardOpen(true)}
              className="px-7 py-3.5 rounded-md bg-transparent text-white border border-neutral-700 text-sm font-semibold tracking-wide hover:bg-neutral-800 transition-all duration-150 shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>💡 Submit Your Idea</span>
            </button>
          </div>

        </div>
      </section>

      {/* Idea Wizard Modal */}
      <IdeaWizardModal isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
};
