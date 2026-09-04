import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, PlusCircle, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'About', href: isHome ? '#about' : '/#about' },
    { name: 'What We Do', href: isHome ? '#what-we-do' : '/#what-we-do' },
    { name: 'Affiliations', href: isHome ? '#affiliations' : '/#affiliations' },
    { name: 'Philosophy', href: isHome ? '#philosophy' : '/#philosophy' },
    { name: 'Pipeline', href: isHome ? '#pipeline' : '/#pipeline' },
    { name: 'Events', href: isHome ? '#events' : '/#events' },
    { name: 'Team', href: isHome ? '#team' : '/#team' },
    { name: 'Ideas', href: isHome ? '#ideas' : '/#ideas' },
    { name: 'Startups', href: isHome ? '#startups' : '/#startups' },
    { name: 'Resources', href: isHome ? '#resources' : '/#resources' },
    { name: 'Contact', href: isHome ? '#contact' : '/#contact' }
  ];

  const handleOpenWizard = () => {
    window.dispatchEvent(new CustomEvent('open-idea-wizard'));
  };

  const handleOpenAdminDrawer = () => {
    window.dispatchEvent(new CustomEvent('open-admin-drawer'));
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F8F9FA]/95 backdrop-blur-md border-b border-[#D5D9E0]/80 transition-all">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between gap-4">
        {/* Official Wordmark & Logo Mark Lockup */}
        <Link to="/" className="flex items-center gap-3.5 group shrink-0">
          <div className="w-[46px] h-[46px] rounded-[6px] bg-[#000000] border border-[#D5D9E0] flex items-center justify-center overflow-hidden shadow-neu-button group-hover:border-[#10B981] transition-colors p-1">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGky_twkb-r-fjGH7KFGWD67wikfcOAlvhh9O37tDCkEZpKPz344DIDOO7lXK3JHX-vfoZW4DwyCVUwlYLOfDH8QMzwWP7J93sn9AhqZNVnKxcQavbgtdTv-tumANwqlGEVttorxIZXy36OgyRLIK54b8tteqSIV3l6JwZp9VgVD0bsBeixtAS1ab7LMR2ZJw_zkJPocySdohgwCiSGrHbGoC0Kk1jX9B1usMagjUZpZWLc69Qjs3Z2EzNnqMHp0ceCkE"
              alt="IES IEDC Official Emblem"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-tight text-[#1A365D] leading-none">
                IES IEDC
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] uppercase font-bold tracking-wider">
                KSUM &amp; IIC
              </span>
            </div>
            <span className="text-[11px] text-[#5F6B7D] tracking-wide font-normal mt-0.5">
              IES College of Engineering
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-[13px] font-medium text-[#2B3547]">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="px-3 py-1.5 rounded transition-all duration-150 active:scale-[0.96] active:shadow-neu-inset hover:bg-[#F1F2F5] hover:text-[#1A365D] select-none cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Triggers */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleOpenWizard}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-sm bg-[#1A365D] hover:bg-[#1A2232] text-white shadow-neu-button text-[12px] font-semibold tracking-wider uppercase transition-all duration-150 active:scale-95 active:shadow-neu-inset flex items-center gap-1.5 select-none cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#10B981]" />
            <span>Submit Idea</span>
          </button>

          <button
            onClick={handleOpenAdminDrawer}
            title="IEDC Staff & Nodal Officer Portal"
            className="px-3 py-2 sm:py-2.5 rounded-sm bg-[#F1F2F5] hover:bg-[#E9EBEF] border border-[#D5D9E0]/80 text-[#5F6B7D] hover:text-[#1A365D] text-[11px] font-medium uppercase tracking-wider transition-all duration-150 active:scale-95 active:shadow-neu-inset flex items-center gap-1.5 select-none cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
            <span>{user ? user.role.split(' ')[0] : 'Admin CMS'}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-sm bg-[#F1F2F5] border border-[#D5D9E0] text-[#1A365D] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#D5D9E0] bg-[#F8F9FA] p-4 space-y-3 shadow-neu-card">
          <div className="grid grid-cols-2 gap-1.5 pb-3 border-b border-[#D5D9E0]">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-semibold text-[#2B3547] hover:text-[#1A365D] hover:bg-[#F1F2F5] rounded transition-colors"
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
              className="flex-1 py-2.5 text-center text-xs font-bold rounded bg-[#1A365D] text-white uppercase tracking-wider"
            >
              Submit Idea
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenAdminDrawer();
              }}
              className="flex-1 py-2.5 text-center text-xs font-bold rounded bg-[#F1F2F5] border border-[#D5D9E0] text-[#1A365D] uppercase tracking-wider"
            >
              Admin CMS
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
