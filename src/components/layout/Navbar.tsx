import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plus, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'About', href: isHome ? '#about' : '/#about' },
    { name: 'What We Do', href: isHome ? '#what-we-do' : '/#what-we-do' },
    { name: 'Journey', href: isHome ? '#journey' : '/#journey' },
    { name: 'Events', href: isHome ? '#events' : '/#events' },
    { name: 'Team', href: isHome ? '#team' : '/#team' },
    { name: 'Achievements', href: isHome ? '#achievements' : '/#achievements' },
    { name: 'Ideas', href: isHome ? '#ideas' : '/#ideas' },
    { name: 'Startups', href: isHome ? '#startups' : '/#startups' },
    { name: 'Workshops', href: isHome ? '#workshops' : '/#workshops' },
    { name: 'Resources', href: isHome ? '#resources' : '/#resources' },
    { name: 'Gallery', href: isHome ? '#gallery' : '/#gallery' },
    { name: 'News', href: isHome ? '#news' : '/#news' },
    { name: 'Contact', href: isHome ? '#contact' : '/#contact' }
  ];

  const handleOpenWizard = () => {
    window.dispatchEvent(new CustomEvent('open-idea-wizard'));
  };

  const handleOpenAdminDrawer = () => {
    window.dispatchEvent(new CustomEvent('open-admin-drawer'));
  };

  return (
    <header className="sticky top-4 z-40 w-full px-4 sm:px-8 md:px-12 max-w-[1700px] mx-auto">
      <div className="bg-white/90 backdrop-blur-md border border-[#E5E5E0] shadow-neu-flat rounded-xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4 transition-all">
        {/* Brand Mark Lockup */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-lg bg-[#161616] border border-[#D8D8D3] flex items-center justify-center overflow-hidden p-1 shadow-neu-button transition-transform group-hover:scale-105">
            <img
              alt="IES IEDC Bulb Logo"
              className="w-full h-full object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe2kzE2vPRLhxzqZsdHzF6N-egDPm7YSKJGkgEZ4YMzGBUeZpr9MX9X6FOTuU9ZL6sP8PhJu4PDuJrgGnvz1xjuPUwiENGio5jaIV3YKLnOHzFYQwHQfTPlkwWTWUCNbxxbq0iWcJnokvAlQ667EFu5_2nfVzIOJF0s0qpxDDXoSfglpt4woNI-Y6yGW4dnWmbVdVkSG3sZfdBAWHwTpUCvc4Ds2ggczKpevOBp_pLOPhzVMMBwwSwsy7jaXDyH7bFgoU"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-[#161616] text-sm sm:text-base tracking-tight leading-none">
              IES IEDC
            </span>
            <span className="text-[10px] text-[#777777] uppercase tracking-wider mt-0.5 font-medium">
              IES College of Engineering
            </span>
          </div>
        </Link>

        {/* Monochromatic Center Links */}
        <nav className="hidden xl:flex items-center gap-1 text-[12px] font-medium text-[#4A4A4A]">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="px-2.5 py-1.5 rounded-lg transition-all hover:text-[#161616] hover:bg-[#EBEBE8]/60"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleOpenWizard}
            className="tactile-btn px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#161616] text-white text-[11px] font-semibold uppercase tracking-wider shadow-neu-button flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Idea</span>
          </button>

          <button
            onClick={handleOpenAdminDrawer}
            title="IEDC Nodal Admin CMS"
            className="tactile-btn px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-[#F0F0ED] border border-[#D8D8D3] text-[#777777] hover:text-[#161616] text-[11px] font-medium uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{user ? user.role.split(' ')[0] : 'Admin'}</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-[#F0F0ED] border border-[#D8D8D3] text-[#161616] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-2 bg-white/95 backdrop-blur-md border border-[#D8D8D3] rounded-2xl shadow-neu-card p-4 space-y-2">
          <div className="grid grid-cols-2 gap-1 pb-3 border-b border-[#EBEBE8]">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-semibold text-[#4A4A4A] hover:text-[#161616] hover:bg-[#F5F5F3] rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-2 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenWizard();
              }}
              className="flex-1 py-2 text-center text-xs font-bold rounded-lg bg-[#161616] text-white uppercase tracking-wider"
            >
              Submit Idea
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenAdminDrawer();
              }}
              className="flex-1 py-2 text-center text-xs font-bold rounded-lg bg-[#F0F0ED] border border-[#D8D8D3] text-[#242424] uppercase tracking-wider"
            >
              Admin CMS
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
