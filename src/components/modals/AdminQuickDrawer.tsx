import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ExternalLink, ShieldCheck, Check, Save } from 'lucide-react';

interface AdminQuickDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ideaCount?: number;
}

export const AdminQuickDrawer: React.FC<AdminQuickDrawerProps> = ({
  isOpen,
  onClose,
  ideaCount = 3
}) => {
  const [activeTab, setActiveTab] = useState<'intake' | 'events' | 'audit'>('intake');
  const [notes, setNotes] = useState('');
  const [savedNotesMessage, setSavedNotesMessage] = useState(false);
  const [approvedIdea, setApprovedIdea] = useState(false);
  const [archivedIdea, setArchivedIdea] = useState(false);
  const [verifiedEventFlag, setVerifiedEventFlag] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#161616]/60 backdrop-blur-sm flex items-center justify-end">
      <div className="w-full max-w-2xl h-full bg-white border-l border-[#D8D8D3] shadow-neu-card flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Admin Topbar */}
        <div className="p-6 bg-white border-b border-[#D8D8D3] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#161616] flex items-center justify-center p-1.5 shadow-neu-button">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA85vqhvqmFHteDuKjDOlRELD1n1zM_mnfqa5m30puW7c-MPndtpbzXTGmG0sSPFu3cs_dr8GiODzNTUZ6yVhdapE2ggGB0T8w3fHDGTv_ThRCRh_RJvrQ4ft_aghYlQ7RApEQQIGXKyBLeTGjVtosA11uBjNqgVaOvU4FhcEPfKYwS7_4wbt7JSdWv1VYYtYFJAvVZUroeQu7QXVeqlkWZQpP01yMFLoXeidZXtx3PIpOlNctpT9lpV-TP52zTmPSpebk"
                alt="Emblem"
                className="w-full h-full object-contain filter grayscale"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm text-[#161616]">
                IES IEDC Nodal CMS Workspace
              </span>
              <span className="text-[10px] font-mono text-[#777777]">
                Route: /admin // Institutional Governance
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#242424] text-white text-[11px] font-mono uppercase font-semibold flex items-center gap-1 hover:bg-[#161616] transition-colors"
            >
              <span>Full Console</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#F5F5F3] border border-[#D8D8D3] flex items-center justify-center text-[#777777] hover:text-[#161616] cursor-pointer transition-colors"
              aria-label="Close admin drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Admin Body */}
        <div className="p-6 flex flex-col gap-6 flex-1">
          {/* Database Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#F5F5F3]/70 border border-[#D8D8D3] shadow-neu-flat flex flex-col">
              <span className="text-[9px] font-mono uppercase font-bold text-[#777777]">
                Accredited Team
              </span>
              <span className="font-display text-xl font-bold text-[#161616] mt-1">8</span>
              <span className="text-[10px] text-[#777777]">AY 2024–25</span>
            </div>
            <div className="p-4 rounded-xl bg-[#F5F5F3]/70 border border-[#D8D8D3] shadow-neu-flat flex flex-col">
              <span className="text-[9px] font-mono uppercase font-bold text-[#777777]">
                Verified Events
              </span>
              <span className="font-display text-xl font-bold text-[#161616] mt-1">6</span>
              <span className="text-[10px] text-[#777777]">Audited Records</span>
            </div>
            <div className="p-4 rounded-xl bg-[#F5F5F3]/70 border border-[#D8D8D3] shadow-neu-flat flex flex-col">
              <span className="text-[9px] font-mono uppercase font-bold text-[#777777]">
                Pending Ideas
              </span>
              <span className="font-display text-xl font-bold text-[#161616] mt-1">
                {ideaCount}
              </span>
              <span className="text-[10px] text-[#777777]">Intake Queue</span>
            </div>
            <div className="p-4 rounded-xl bg-[#F5F5F3]/70 border border-[#D8D8D3] shadow-neu-flat flex flex-col">
              <span className="text-[9px] font-mono uppercase font-bold text-[#777777]">
                Verified Startups
              </span>
              <span className="font-display text-xl font-bold text-[#161616] mt-1">0</span>
              <span className="text-[10px] text-[#777777]">Zero Fabrication</span>
            </div>
          </div>

          {/* CMS Management Tabs */}
          <div className="p-1 rounded-xl bg-[#F0F0ED] border border-[#D8D8D3] shadow-neu-inset flex items-center gap-1 text-[11px] font-mono">
            <button
              onClick={() => setActiveTab('intake')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'intake'
                  ? 'bg-white border border-[#D8D8D3] text-[#161616] font-semibold shadow-neu-button'
                  : 'text-[#777777] hover:text-[#161616]'
              }`}
            >
              Ideas Queue
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-white border border-[#D8D8D3] text-[#161616] font-semibold shadow-neu-button'
                  : 'text-[#777777] hover:text-[#161616]'
              }`}
            >
              Events Log
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-white border border-[#D8D8D3] text-[#161616] font-semibold shadow-neu-button'
                  : 'text-[#777777] hover:text-[#161616]'
              }`}
            >
              Private Notes
            </button>
          </div>

          {/* Tab: Ideas Intake Queue */}
          {activeTab === 'intake' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono uppercase font-bold text-[#777777]">
                Live Pre-Incubation Intake
              </span>
              <div className="p-4 rounded-xl bg-white border border-[#D8D8D3] shadow-neu-card flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-display text-xs font-bold text-[#161616]">
                      Autonomous Agricultural Crop Sorting Rig
                    </span>
                    <span className="text-[11px] text-[#777777]">
                      Dept: Robotics & AI • Lead: Anand Menon
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0F0ED] border border-[#D8D8D3] text-[#242424]">
                    {approvedIdea ? 'Lab Access Approved' : archivedIdea ? 'Archived' : 'Under Scrutiny'}
                  </span>
                </div>
                <p className="text-xs text-[#4A4A4A]">
                  Provisional bench access requested for camera calibration tests.
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-[#D8D8D3]">
                  <button
                    disabled={approvedIdea}
                    onClick={() => setApprovedIdea(true)}
                    className="px-3 py-1 rounded bg-[#161616] text-white text-[10px] font-mono uppercase font-semibold hover:bg-black transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {approvedIdea ? 'Access Granted' : 'Approve Lab Access'}
                  </button>
                  <button
                    disabled={archivedIdea}
                    onClick={() => setArchivedIdea(true)}
                    className="px-3 py-1 rounded bg-[#F5F5F3] border border-[#D8D8D3] text-[#777777] hover:text-[#161616] text-[10px] font-mono uppercase cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {archivedIdea ? 'Archived' : 'Archive'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Events Log */}
          {activeTab === 'events' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono uppercase font-bold text-[#777777]">
                Statutory Verification Queue
              </span>
              <div className="p-4 rounded-xl bg-white border border-[#D8D8D3] shadow-neu-flat flex flex-col gap-2">
                <span className="text-xs font-bold text-[#161616]">
                  Residential IEDC Innovation Camp
                </span>
                <span className="text-[11px] text-[#777777]">
                  Source note: [Needs Admin Review - Date Inconsistency in Source Record: 09/01/2026 – 10/01/2025]
                </span>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    disabled={verifiedEventFlag}
                    onClick={() => setVerifiedEventFlag(true)}
                    className="px-3 py-1 rounded bg-[#161616] text-white text-[10px] font-mono uppercase font-semibold hover:bg-black cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {verifiedEventFlag ? 'Audit Flag Confirmed' : 'Verify Audit Flag'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Private Notes */}
          {activeTab === 'audit' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono uppercase font-bold text-[#777777]">
                Private Nodal Secretariat Log
              </span>
              <textarea
                value={notes}
                onChange={e => {
                  setNotes(e.target.value);
                  setSavedNotesMessage(false);
                }}
                rows={4}
                placeholder="Enter private faculty review annotations..."
                className="px-3.5 py-2.5 rounded-xl bg-[#F0F0ED] border border-[#D8D8D3] shadow-neu-inset text-xs text-[#161616] focus:outline-none"
              />
              <div className="flex items-center justify-between">
                {savedNotesMessage && (
                  <span className="text-[11px] font-mono text-green-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Notes recorded securely
                  </span>
                )}
                <button
                  onClick={() => setSavedNotesMessage(true)}
                  className="ml-auto px-4 py-2 rounded bg-[#161616] text-white text-xs font-mono uppercase font-semibold hover:bg-black cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notes</span>
                </button>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-auto pt-6 border-t border-[#D8D8D3] text-[11px] font-mono text-[#777777] leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#161616] shrink-0 mt-0.5" />
            <span>
              APJ Abdul Kalam Technological University & Kerala Startup Mission statutory audit log enabled. All edits cryptographically signed.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
