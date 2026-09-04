import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Linkedin, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#EBEBE8] border-t border-[#D8D8D3] py-16 px-6 lg:px-16 text-[#242424]" id="contact">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg text-[#161616]">IES IEDC</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#D8D8D3] text-[#777777] uppercase font-bold">
                Est. 2016
              </span>
            </div>
            <span className="text-xs font-semibold text-[#4A4A4A]">IES College of Engineering</span>
            <p className="text-xs text-[#777777] leading-relaxed">
              Chittilappilly, Thrissur, Kerala 680551.<br />
              Affiliated with APJ Abdul Kalam Technological University &amp; Approved by AICTE.
            </p>
          </div>

          {/* Col 2: Institutional Framework */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#161616]">
              Institutional Affiliation
            </span>
            <p className="text-xs text-[#777777] leading-relaxed">
              Recognized partner hub under Kerala Startup Mission (KSUM), Department of Electronics &amp; IT, Government of Kerala.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs font-mono text-[#161616] font-semibold">
              <span>Nodal Code: KL-TCR-IES-2016</span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#161616]">
              Quick Navigation
            </span>
            <div className="flex flex-col gap-2 text-xs text-[#777777]">
              <a className="hover:text-[#161616] transition-colors" href="#about">About &amp; Mandate</a>
              <a className="hover:text-[#161616] transition-colors" href="#what-we-do">How IEDC Works</a>
              <a className="hover:text-[#161616] transition-colors" href="#events">Upcoming Events</a>
              <a className="hover:text-[#161616] transition-colors" href="#gallery">Photo Gallery</a>
              <Link className="hover:text-[#161616] transition-colors" to="/team">Team &amp; Officers</Link>
              <Link className="hover:text-[#161616] transition-colors" to="/contact">Get in Touch</Link>
            </div>
          </div>

          {/* Col 4: Nodal Portal */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#161616]">
              Nodal Office Access
            </span>
            <p className="text-xs text-[#777777] leading-relaxed">
              Administrative CMS access for nodal officers and executive leads to manage events, gallery photos, and team updates.
            </p>
            <Link
              to="/admin"
              className="text-left text-xs font-mono font-bold text-[#161616] hover:underline uppercase tracking-wider pt-2 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Nodal Officer Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-[#D8D8D3] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#777777]">
          <span>© {new Date().getFullYear()} IES IEDC — IES College of Engineering. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#161616] transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#161616] transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#161616] transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
