import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ExternalLink, ShieldCheck, Check, Save, KeyRound } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'intake' | 'events' | 'creds' | 'audit'>('intake');
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
    <div className="fixed inset-0 z-50 bg-[#1A2232]/60 backdrop-blur-sm flex items-center justify-end font-sans">
      <div className="w-full max-w-2xl h-full bg-white border-l border-[#D5D9E0] shadow-neu-card flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Admin Topbar */}
        <div className="p-6 bg-white border-b border-[#D5D9E0] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#000000] border border-[#D5D9E0] flex items-center justify-center p-1 shadow-neu-button shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGky_twkb-r-fjGH7KFGWD67wikfcOAlvhh9O37tDCkEZpKPz344DIDOO7lXK3JHX-vfoZW4DwyCVUwlYLOfDH8QMzwWP7J93sn9AhqZNVnKxcQavbgtdTv-tumANwqlGEVttorxIZXy36OgyRLIK54b8tteqSIV3l6JwZp9VgVD0bsBeixtAS1ab7LMR2ZJw_zkJPocySdohgwCiSGrHbGoC0Kk1jX9B1usMagjUZpZWLc69Qjs3Z2EzNnqMHp0ceCkE"
                alt="Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base text-[#1A365D]">
                IES IEDC Nodal CMS Workspace
              </span>
              <span className="text-[10px] font-mono text-[#5F6B7D]">
                Route: /admin // Institutional Governance
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              onClick={onClose}
              className="px-3.5 py-2 rounded-sm bg-[#1A365D] hover:bg-[#1A2232] text-white text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-neu-button"
            >
              <span>Full Console</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#10B981]" />
            </Link>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded bg-[#F1F2F5] border border-[#D5D9E0] flex items-center justify-center text-[#5F6B7D] hover:text-[#1A365D] cursor-pointer transition-colors"
              aria-label="Close admin drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Admin Body */}
        <div className="p-6 flex flex-col gap-6 flex-1">
          {/* Credentials Quick Banner */}
          <div className="p-4 rounded-sm bg-[#F1F2F5] border border-[#D5D9E0] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-[#10B981]" />
              <div className="flex flex-col text-xs">
                <span className="font-bold text-[#1A365D]">Nodal Admin Login Credentials:</span>
                <span className="text-[11px] text-[#5F6B7D] font-mono">
                  Username: <strong className="text-[#1A365D]">admin</strong> (or <strong className="text-[#1A365D]">nodal.officer@iesce.info</strong>) • Password: <strong className="text-[#10B981]">admin123</strong>
                </span>
              </div>
            </div>
            <Link
              to="/admin/login"
              onClick={onClose}
              className="px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#1A365D] text-white shrink-0 hover:bg-[#1A2232]"
            >
              Login Portal
            </Link>
          </div>

          {/* Database Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded bg-[#F1F2F5] border border-[#D5D9E0] shadow-neu-flat flex flex-col">
              <span className="text-[9px] font-mono uppercase font-bold text-[#5F6B7D]">
                Accredited Team
              </span>
              <span className="font-display text-xl font-bold text-[#1A365D] mt-1">8</span>
              <span className="text-[10px] text-[#5F6B7D]">AY 2024–25</span>
            </div>
            <div className="p-4 rounded bg-[#F1F2F5] border border-[#D5D9E0] shadow-neu-flat flex flex-col">
              <span className="text-[9px] font-mono uppercase font-bold text-[#5F6B7D]">
                Verified Events
              </span>
              <span className="font-display text-xl font-bold text-[#1A365D] mt-1">6</span>
              <span className="text-[10px] text-[#5F6B7D]">Audited Records</span>
            </div>
            <div className="p-4 rounded bg-[#F1F2F5] border border-[#D5D9E0] shadow-neu-flat flex flex-col">
              <span className="text-[9px] font-mono uppercase font-bold text-[#5F6B7D]">
                Pending Ideas
              </span>
              <span className="font-display text-xl font-bold text-[#1A365D] mt-1">
                {ideaCount}
              </span>
              <span className="text-[10px] text-[#5F6B7D]">Intake Queue</span>
            </div>
            <div className="p-4 rounded bg-[#F1F2F5] border border-[#D5D9E0] shadow-neu-flat flex flex-col">
              <span className="text-[9px] font-mono uppercase font-bold text-[#5F6B7D]">
                Verified Startups
              </span>
              <span className="font-display text-xl font-bold text-[#1A365D] mt-1">0</span>
              <span className="text-[10px] text-[#5F6B7D]">Zero Fabrication</span>
            </div>
          </div>

          {/* CMS Management Tabs */}
          <div className="p-1 rounded bg-[#F1F2F5] border border-[#D5D9E0] shadow-neu-inset flex items-center gap-1 text-[11px] font-mono">
            <button
              onClick={() => setActiveTab('intake')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeTab === 'intake'
                  ? 'bg-white border border-[#D5D9E0] text-[#1A365D] font-bold shadow-neu-button'
                  : 'text-[#5F6B7D] hover:text-[#1A365D]'
              }`}
            >
              Ideas Queue
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-white border border-[#D5D9E0] text-[#1A365D] font-bold shadow-neu-button'
                  : 'text-[#5F6B7D] hover:text-[#1A365D]'
              }`}
            >
              Events Log
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-white border border-[#D5D9E0] text-[#1A365D] font-bold shadow-neu-button'
                  : 'text-[#5F6B7D] hover:text-[#1A365D]'
              }`}
            >
              Private Notes
            </button>
          </div>

          {/* Tab: Ideas Intake Queue */}
          {activeTab === 'intake' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono uppercase font-bold text-[#5F6B7D]">
                Live Pre-Incubation Intake
              </span>
              <div className="p-4 rounded bg-white border border-[#D5D9E0] shadow-neu-card flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-display text-xs font-bold text-[#1A365D]">
                      Autonomous Agricultural Crop Sorting Rig
                    </span>
                    <span className="text-[11px] text-[#5F6B7D]">
                      Dept: Robotics &amp; AI • Lead: Anand Menon
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F1F2F5] border border-[#D5D9E0] text-[#1A2232] font-semibold">
                    {approvedIdea ? 'Lab Access Approved' : archivedIdea ? 'Archived' : 'Under Scrutiny'}
                  </span>
                </div>
                <p className="text-xs text-[#2B3547]">
                  Provisional bench access requested for camera calibration tests.
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-[#D5D9E0]">
                  <button
                    disabled={approvedIdea}
                    onClick={() => setApprovedIdea(true)}
                    className="px-3.5 py-1.5 rounded bg-[#1A365D] text-white text-[10px] font-semibold uppercase hover:bg-[#1A2232] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {approvedIdea ? 'Access Granted' : 'Approve Lab Access'}
                  </button>
                  <button
                    disabled={archivedIdea}
                    onClick={() => setArchivedIdea(true)}
                    className="px-3.5 py-1.5 rounded bg-[#F1F2F5] border border-[#D5D9E0] text-[#5F6B7D] hover:text-[#1A365D] text-[10px] font-semibold uppercase cursor-pointer transition-colors disabled:opacity-50"
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
              <span className="text-[10px] font-mono uppercase font-bold text-[#5F6B7D]">
                Statutory Verification Queue
              </span>
              <div className="p-4 rounded bg-white border border-[#D5D9E0] shadow-neu-flat flex flex-col gap-2">
                <span className="text-xs font-bold text-[#1A365D]">
                  Residential IEDC Innovation Camp
                </span>
                <span className="text-[11px] text-[#5F6B7D]">
                  Source note: [Needs Admin Review - Date Inconsistency in Source Record: 09/01/2026 – 10/01/2025]
                </span>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    disabled={verifiedEventFlag}
                    onClick={() => setVerifiedEventFlag(true)}
                    className="px-3.5 py-1.5 rounded bg-[#1A365D] text-white text-[10px] font-semibold uppercase hover:bg-[#1A2232] cursor-pointer transition-colors disabled:opacity-50"
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
              <span className="text-[10px] font-mono uppercase font-bold text-[#5F6B7D]">
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
                className="px-3.5 py-2.5 rounded bg-[#F1F2F5] border border-[#D5D9E0] shadow-neu-inset text-xs text-[#1A2232] focus:outline-none"
              />
              <div className="flex items-center justify-between">
                {savedNotesMessage && (
                  <span className="text-[11px] font-mono text-[#10B981] flex items-center gap-1 font-bold">
                    <Check className="w-3.5 h-3.5" /> Notes recorded securely
                  </span>
                )}
                <button
                  onClick={() => setSavedNotesMessage(true)}
                  className="ml-auto px-4 py-2 rounded bg-[#1A365D] text-white text-xs font-semibold uppercase hover:bg-[#1A2232] cursor-pointer transition-colors flex items-center gap-1.5 shadow-neu-button"
                >
                  <Save className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Save Notes</span>
                </button>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-auto pt-6 border-t border-[#D5D9E0] text-[11px] font-mono text-[#5F6B7D] leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
            <span>
              APJ Abdul Kalam Technological University &amp; Kerala Startup Mission statutory audit log enabled. All edits cryptographically signed.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
