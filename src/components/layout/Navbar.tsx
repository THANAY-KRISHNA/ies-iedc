import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Lightbulb } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'About', href: '/about', homeHash: '#about' },
    { name: 'What We Do', href: '/workshops', homeHash: '#what-we-do' },
    { name: 'Team', href: '/team', homeHash: null },
    { name: 'Events', href: '/events', homeHash: '#events' },
    { name: 'Achievements', href: '/achievements', homeHash: null },
    { name: 'Ideas', href: '/ideas', homeHash: null },
    { name: 'Startups', href: '/startups', homeHash: null },
    { name: 'Resources', href: '/resources', homeHash: null },
    { name: 'Gallery', href: '/gallery', homeHash: '#gallery' },
    { name: 'News', href: '/news', homeHash: null },
    { name: 'Contact', href: '/contact', homeHash: '#contact' }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: { name: string; href: string; homeHash: string | null }) => {
    if (isHome && link.homeHash) {
      e.preventDefault();
      const el = document.querySelector(link.homeHash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(link.href);
      }
    }
  };

  const handleOpenWizard = () => {
    window.dispatchEvent(new CustomEvent('open-idea-wizard'));
  };

  const handleOpenAdminPortal = () => {
    navigate('/admin');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#EFF1F5]/90 backdrop-blur-lg border-b border-[#DCDFE6] transition-all font-sans shadow-xs">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group shrink-0 select-none">
          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center p-1 shadow-neu-pill-button group-hover:scale-105 transition-transform overflow-hidden border border-black">
            <img src="/logo.png" alt="IES IEDC Emblem" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-[#1E232A] leading-none">
              IES IEDC
            </span>
            <span className="text-[10px] text-[#6C727F] font-medium tracking-wide mt-0.5">
              IES College of Engineering
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Fully Working Routes + 3D Pill Hover) */}
        <nav className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-[#4B515D]">
          {navLinks.map(link => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`px-3.5 py-2 rounded-xl transition-all duration-200 select-none cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#1E232A] shadow-neu-soft-card font-bold border border-white/80'
                    : 'hover:bg-white/80 hover:text-[#1E232A] hover:shadow-neu-pill-button active:scale-95'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenWizard}
            className="px-5 py-2.5 rounded-xl bg-[#2B303A] hover:bg-[#1E232A] active:scale-95 text-white text-xs font-bold font-sans tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-neu-pill-button border border-white/20"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
            <span>Submit Your Idea</span>
          </button>

          <button
            onClick={handleOpenAdminPortal}
            title="IES IEDC CMS Portal"
            className="px-3 py-2.5 rounded-xl bg-white hover:bg-[#F8F9FA] active:scale-95 border border-[#DCDFE6] text-[#4B515D] hover:text-[#1E232A] text-xs font-bold transition-all duration-200 cursor-pointer shadow-neu-pill-button flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#1E232A] inline-block animate-pulse"></span>
            <span className="hidden sm:inline">CMS</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2.5 rounded-xl bg-white border border-[#DCDFE6] text-[#1E232A] shadow-neu-pill-button cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#DCDFE6] bg-[#EFF1F5] p-5 space-y-4 shadow-lg animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-4 border-b border-[#DCDFE6]">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, link);
                }}
                className="px-3.5 py-2.5 text-xs font-bold text-[#4B515D] hover:text-[#1E232A] hover:bg-white rounded-xl shadow-xs transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-1 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenWizard();
              }}
              className="w-full py-3 text-center text-xs font-bold rounded-xl bg-[#2B303A] text-white flex items-center justify-center gap-2 shadow-md"
            >
              <Lightbulb className="w-4 h-4 text-amber-300" />
              <span>Submit Your Idea</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
