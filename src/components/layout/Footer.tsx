import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Youtube, ExternalLink, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#EBEBE8] border-t border-[#D8D8D3] py-16 px-6 lg:px-16 text-[#242424]" id="contact">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Col 1: Brand Info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center p-1 shadow-xs overflow-hidden border border-black shrink-0">
                <img src="/logo.png" alt="IES IEDC Emblem" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-base text-[#161616]">IES IEDC</span>
                <span className="text-[10px] font-mono text-[#777777]">Est. 2016</span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#333333]">IES College of Engineering</span>
            <p className="text-xs text-[#666666] leading-relaxed">
              Chittilappilly, Thrissur, Kerala 680551.<br />
              Affiliated with APJ Abdul Kalam Technological University &amp; Approved by AICTE.
            </p>
          </div>

          {/* Col 2: Institutional Affiliation */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#161616]">
              Institutional Affiliation
            </span>
            <p className="text-xs text-[#666666] leading-relaxed">
              Recognized partner hub under Kerala Startup Mission (KSUM), Department of Electronics &amp; IT, Government of Kerala.
            </p>
            <div className="inline-flex items-center gap-1.5 pt-1 text-xs font-mono text-[#161616] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Code: KL-TCR-IES-2016</span>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#161616]">
              Quick Navigation
            </span>
            <div className="flex flex-col gap-2 text-xs text-[#666666]">
              <Link className="hover:text-[#161616] transition-colors" to="/about">About &amp; Mandate</Link>
              <Link className="hover:text-[#161616] transition-colors" to="/workshops">How IEDC Works</Link>
              <Link className="hover:text-[#161616] transition-colors" to="/events">Upcoming Events</Link>
              <Link className="hover:text-[#161616] transition-colors" to="/gallery">Photo Gallery</Link>
              <Link className="hover:text-[#161616] transition-colors" to="/team">Team &amp; Officers</Link>
            </div>
          </div>

          {/* Col 4: Innovation Programs */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#161616]">
              Innovation Hub
            </span>
            <div className="flex flex-col gap-2 text-xs text-[#666666]">
              <Link className="hover:text-[#161616] transition-colors" to="/ideas">Student Ideas Showcase</Link>
              <Link className="hover:text-[#161616] transition-colors" to="/startups">Incubated Startups</Link>
              <Link className="hover:text-[#161616] transition-colors" to="/achievements">Verified Achievements</Link>
              <Link className="hover:text-[#161616] transition-colors" to="/resources">Learning Resources</Link>
              <Link className="hover:text-[#161616] transition-colors" to="/contact">Get in Touch</Link>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-[#D8D8D3] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#777777]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© {new Date().getFullYear()} IES IEDC — IES College of Engineering. All rights reserved.</span>
            <span className="hidden sm:inline text-[#AAAAAA]">|</span>
            <span className="text-[11px] text-[#888888]">
              Developed by{' '}
              <a
                href="https://www.linkedin.com/in/thanay-krishna-c-u-a1b67831b"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#333333] hover:text-[#161616] hover:underline transition-colors"
              >
                THANAY KRISHNA C U
              </a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#161616] transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#161616] transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#161616] transition-colors" aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
