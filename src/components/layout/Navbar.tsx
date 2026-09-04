import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'About', href: isHome ? '#about' : '/#about' },
    { name: 'What We Do', href: isHome ? '#what-we-do' : '/#what-we-do' },
    { name: 'Team', href: isHome ? '#team' : '/#team' },
    { name: 'Events', href: isHome ? '#events' : '/#events' },
    { name: 'Achievements', href: isHome ? '#achievements' : '/#achievements' },
    { name: 'Ideas', href: isHome ? '#ideas' : '/#ideas' },
    { name: 'Startups', href: isHome ? '#startups' : '/#startups' },
    { name: 'Resources', href: isHome ? '#resources' : '/#resources' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'News', href: isHome ? '#news' : '/#news' },
    { name: 'Contact', href: isHome ? '#contact' : '/#contact' }
  ];

  const handleOpenWizard = () => {
    window.dispatchEvent(new CustomEvent('open-idea-wizard'));
  };

  const handleOpenAdminPortal = () => {
    navigate('/admin');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F5F5F3]/90 backdrop-blur-md border-b border-[#D8D8D3]/80 transition-all font-sans">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded bg-[#161616] text-white flex items-center justify-center p-1 font-extrabold text-xs tracking-wider shadow-xs">
            IEDC
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-[#161616] leading-none">
              IES IEDC
            </span>
            <span className="text-[10px] text-[#777777] font-medium tracking-wide mt-0.5">
              IES College of Engineering
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-medium text-[#4A4A4A]">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="px-3 py-1.5 rounded transition-all duration-150 hover:bg-[#EBEBE8] hover:text-[#161616] active:bg-[#D8D8D3] select-none cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenWizard}
            className="px-4 py-2 rounded bg-[#161616] hover:bg-[#242424] active:bg-black text-white text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Submit Your Idea</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleOpenAdminPortal}
            title="IES IEDC CMS Portal"
            className="px-2.5 py-2 rounded bg-[#F0F0ED] hover:bg-[#EBEBE8] border border-[#D8D8D3] text-[#4A4A4A] hover:text-[#161616] text-xs font-medium transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#161616] inline-block"></span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded bg-[#F0F0ED] border border-[#D8D8D3] text-[#161616] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#D8D8D3] bg-[#F5F5F3] p-4 space-y-3 shadow-md">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#D8D8D3]">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-semibold text-[#4A4A4A] hover:text-[#161616] hover:bg-[#EBEBE8] rounded transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-1 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenWizard();
              }}
              className="w-full py-2.5 text-center text-xs font-bold rounded bg-[#161616] text-white flex items-center justify-center gap-1.5"
            >
              <span>Submit Your Idea</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
