import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const handleOpenAdmin = () => {
    window.dispatchEvent(new CustomEvent('open-admin-drawer'));
  };

  return (
    <footer className="w-full bg-[#EAECEF] border-t border-[#D5D9E0] py-16 px-6 lg:px-12 text-[#1A2232]" id="contact">
      <div className="max-w-[1700px] mx-auto flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base text-[#1A365D]">IES IEDC</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F2F5] border border-[#D5D9E0] text-[#5F6B7D] uppercase font-semibold">
                Est. 2016
              </span>
            </div>
            <span className="text-xs font-medium text-[#1A365D]">IES College of Engineering</span>
            <p className="text-xs text-[#5F6B7D] leading-relaxed">
              Chittilappilly, Thrissur, Kerala 680551.<br />
              Affiliated with APJ Abdul Kalam Technological University &amp; Approved by AICTE.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A365D]">
              Institutional Affiliation
            </span>
            <p className="text-xs text-[#5F6B7D] leading-relaxed">
              Recognized partner hub under Kerala Startup Mission (KSUM), Department of Electronics &amp; IT, Government of Kerala.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-[#1A365D] font-semibold">
              <span>Nodal Code: KL-TCR-IES-2016</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A365D]">
              Directory Navigation
            </span>
            <div className="flex flex-col gap-1.5 text-xs text-[#5F6B7D]">
              <a className="hover:text-[#1A365D] transition-colors" href="#about">Institutional Vision &amp; Mission</a>
              <a className="hover:text-[#1A365D] transition-colors" href="#what-we-do">Three Connected Verticals</a>
              <a className="hover:text-[#1A365D] transition-colors" href="#affiliations">Partner Affiliations</a>
              <a className="hover:text-[#1A365D] transition-colors" href="#events">Verified Activity Calendar</a>
              <a className="hover:text-[#1A365D] transition-colors" href="#team">Nodal Officers &amp; Roster</a>
              <a className="hover:text-[#1A365D] transition-colors" href="#ideas">Idea Incubation Portal</a>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A365D]">
              Nodal Administration
            </span>
            <p className="text-xs text-[#5F6B7D] leading-relaxed">
              Administrative access is restricted to verified faculty nodal officers and designated student leads.
            </p>
            <button
              className="text-left text-xs font-semibold text-[#1A365D] hover:underline uppercase tracking-wider pt-2 flex items-center gap-1.5 cursor-pointer"
              onClick={handleOpenAdmin}
            >
              <span>Institutional CMS Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-[#D5D9E0] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#5F6B7D]">
          <span>© {new Date().getFullYear()} IES IEDC — IES College of Engineering. All rights reserved.</span>
          <span>KSUM Partner Hub • Ministry of HRD IIC Node</span>
        </div>
      </div>
    </footer>
  );
};
