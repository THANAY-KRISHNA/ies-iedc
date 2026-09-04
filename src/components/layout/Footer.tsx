import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const handleOpenAdmin = () => {
    window.dispatchEvent(new CustomEvent('open-admin-drawer'));
  };

  return (
    <footer className="w-full bg-[#EBEBE8] border-t border-[#D8D8D3] pt-16 pb-12 px-6 lg:px-12 text-[#4A4A4A] text-xs" id="contact">
      <div className="max-w-[1700px] mx-auto flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base text-[#161616]">IES IEDC</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#D8D8D3] text-[#777777] font-mono">
                EST. 2016
              </span>
            </div>
            <span className="font-medium text-[#242424]">IES College of Engineering</span>
            <p className="text-[#777777] leading-relaxed">
              Chittilappilly, Thrissur, Kerala 680551.<br />
              Affiliated with APJ Abdul Kalam Technological University & Approved by AICTE.
            </p>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#161616]">
              Institutional Mandate
            </span>
            <p className="text-[#777777] leading-relaxed">
              Recognized partner hub under Kerala Startup Mission (KSUM), Department of Electronics & IT, Government of Kerala.
            </p>
            <span className="text-[11px] font-mono text-[#242424] font-semibold">
              Nodal: KL-TCR-IES-2016
            </span>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#161616]">
              Navigation
            </span>
            <div className="flex flex-col gap-1.5 text-[#777777]">
              <a className="hover:text-[#161616] transition-colors" href="#about">About & Charter</a>
              <a className="hover:text-[#161616] transition-colors" href="#what-we-do">Connected Verticals</a>
              <a className="hover:text-[#161616] transition-colors" href="#events">Verified Calendar</a>
              <a className="hover:text-[#161616] transition-colors" href="#team">Nodal Officers</a>
              <a className="hover:text-[#161616] transition-colors" href="#ideas">Idea Wall</a>
            </div>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#161616]">
              Nodal Administration
            </span>
            <p className="text-[#777777] leading-relaxed">
              Administrative gateway is restricted to appointed faculty nodal officers and verified student council leads.
            </p>
            <button
              onClick={handleOpenAdmin}
              className="self-start text-xs font-semibold text-[#161616] hover:underline uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <span>Institutional CMS Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom line with understated Admin trigger */}
        <div className="pt-8 border-t border-[#D8D8D3] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#777777] text-[11px] font-mono">
          <span>© 2016–2026 IES IEDC. IES College of Engineering. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>Kerala Startup Mission Sanctioned Hub</span>
            <span>•</span>
            <button
              onClick={handleOpenAdmin}
              className="hover:text-[#161616] underline cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
