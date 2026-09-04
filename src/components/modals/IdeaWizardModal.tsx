import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Loader2, Send } from 'lucide-react';
import { api } from '../../services/api';

interface IdeaWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export const IdeaWizardModal: React.FC<IdeaWizardModalProps> = ({ isOpen, onClose, onSubmitted }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Robotics & Automation');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dept, setDept] = useState('Robotics & AI');

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSubmittedMessage(null);
    }
  }, [isOpen]);

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

  const handleNext = () => {
    if (currentStep === 1 && !title.trim()) {
      alert('Please provide a project title.');
      return;
    }
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitIdea({
        projectName: title,
        studentName: name || 'Anonymous Student',
        studentEmail: email || 'student@iesce.info',
        department: dept,
        academicYear: '2025–26',
        problem: problem || 'Engineering problem statement',
        proposedSolution: solution || 'Technical solution delta',
        technology: domain,
        description: problem ? `${problem} | ${solution}` : 'Student innovation proposal'
      });
      setSubmittedMessage(`Proposal "${title}" lodged with IES IEDC Nodal Secretariat for preliminary scrutiny.`);
      if (onSubmitted) onSubmitted();
    } catch (err: any) {
      alert(err.message || 'Failed to lodge proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#161616]/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-gradient-to-b from-white to-[#F8F9FC] border border-white rounded-[32px] shadow-[24px_24px_48px_rgba(150,158,172,0.65),-24px_-24px_48px_rgba(255,255,255,1)] p-6 sm:p-8 flex flex-col gap-6 max-h-[92vh] overflow-y-auto relative">
        
        {/* Subtle Top Accent Rim */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#1E232A]/20 to-transparent rounded-t-[32px]" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E5EC]">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#6C727F]">
              PRE-INCUBATION INTAKE
            </span>
            <h3 className="font-sans text-2xl font-black text-[#1E232A]">Submit Your Idea</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-[#EFF1F5] shadow-neu-hub-inner border border-white flex items-center justify-center text-[#6C727F] hover:text-[#1E232A] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedMessage ? (
          <div className="py-8 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EBF7F1] border border-[#A8E0C4] flex items-center justify-center text-[#10B981] shadow-sm">
              <CheckCircle2 className="w-9 h-9 text-[#10B981]" />
            </div>
            <h4 className="text-xl font-bold text-[#1E232A]">Proposal Lodged Successfully</h4>
            <p className="text-xs text-[#525866] max-w-md leading-relaxed">
              {submittedMessage}
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-2xl bg-gradient-to-b from-[#343A46] to-[#1E232A] text-white text-xs font-bold font-mono uppercase tracking-widest cursor-pointer shadow-md"
            >
              Close Window
            </button>
          </div>
        ) : (
          <>
            {/* Step Progress Indicator */}
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#6C727F] pb-2 border-b border-[#E2E5EC]">
              <span>Step 0{currentStep} / 04</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map(step => (
                  <div
                    key={step}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      step === currentStep
                        ? 'bg-[#1E232A] scale-110 shadow-xs'
                        : step < currentStep
                        ? 'bg-[#6C727F]'
                        : 'bg-[#DCDFE6]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Form Steps */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Step 1: Your Idea */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1E232A]">
                      Step 01: Project Title *
                    </label>
                    <span className="text-[11px] text-[#6C727F]">
                      Provide a concise engineering title for your idea.
                    </span>
                  </div>
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Autonomous Spice Sorting Rig"
                    required
                    className="px-4 py-3 rounded-xl bg-[#EFF1F5] shadow-neu-hub-inner border border-[#DCDFE6]/80 text-xs text-[#1E232A] placeholder:text-[#888E9B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E232A] transition-all"
                  />
                  <div className="flex flex-col gap-1 mt-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1E232A]">
                      Primary Technology Domain
                    </label>
                    <select
                      value={domain}
                      onChange={e => setDomain(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-[#EFF1F5] shadow-neu-hub-inner border border-[#DCDFE6]/80 text-xs text-[#1E232A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E232A] cursor-pointer transition-all font-medium"
                    >
                      <option value="Robotics & Automation">Robotics & Automation</option>
                      <option value="Artificial Intelligence / ML">Artificial Intelligence / ML</option>
                      <option value="Embedded Systems & IoT">Embedded Systems & IoT</option>
                      <option value="Mechanical & Fabrication">Mechanical & Fabrication</option>
                      <option value="Sustainable & Green Tech">Sustainable & Green Tech</option>
                      <option value="Software & Web Platform">Software & Web Platform</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: The Problem */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1E232A]">
                      Step 02: Problem Statement *
                    </label>
                    <span className="text-[11px] text-[#6C727F]">
                      What real-world engineering or industrial bottleneck does this solve?
                    </span>
                  </div>
                  <textarea
                    value={problem}
                    onChange={e => setProblem(e.target.value)}
                    placeholder="Describe the acute problem in detail..."
                    rows={4}
                    className="px-4 py-3 rounded-xl bg-[#EFF1F5] shadow-neu-hub-inner border border-[#DCDFE6]/80 text-xs text-[#1E232A] placeholder:text-[#888E9B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E232A] transition-all"
                  />
                </div>
              )}

              {/* Step 3: Your Solution */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1E232A]">
                      Step 03: Proposed Solution & Technical Delta *
                    </label>
                    <span className="text-[11px] text-[#6C727F]">
                      Outline your novelty, expected hardware/software architecture.
                    </span>
                  </div>
                  <textarea
                    value={solution}
                    onChange={e => setSolution(e.target.value)}
                    placeholder="Detail the innovation or technical approach..."
                    rows={4}
                    className="px-4 py-3 rounded-xl bg-[#EFF1F5] shadow-neu-hub-inner border border-[#DCDFE6]/80 text-xs text-[#1E232A] placeholder:text-[#888E9B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E232A] transition-all"
                  />
                </div>
              )}

              {/* Step 4: Your Details */}
              {currentStep === 4 && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1E232A]">
                      Step 04: Student & Department Details
                    </label>
                    <span className="text-[11px] text-[#6C727F]">
                      Contact details for nodal notification.
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Student Lead Name *"
                      required
                      className="px-4 py-3 rounded-xl bg-[#EFF1F5] shadow-neu-hub-inner border border-[#DCDFE6]/80 text-xs text-[#1E232A] placeholder:text-[#888E9B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E232A] transition-all"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Institutional Email *"
                      required
                      className="px-4 py-3 rounded-xl bg-[#EFF1F5] shadow-neu-hub-inner border border-[#DCDFE6]/80 text-xs text-[#1E232A] placeholder:text-[#888E9B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E232A] transition-all"
                    />
                  </div>
                  <select
                    value={dept}
                    onChange={e => setDept(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-[#EFF1F5] shadow-neu-hub-inner border border-[#DCDFE6]/80 text-xs text-[#1E232A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E232A] cursor-pointer transition-all font-medium"
                  >
                    <option value="Robotics & AI">Dept: Robotics & AI</option>
                    <option value="Computer Science">Dept: Computer Science & Engg</option>
                    <option value="Mechanical Engg">Dept: Mechanical Engg</option>
                    <option value="Electrical & Electronics">Dept: Electrical & Electronics</option>
                    <option value="Electronics & Comm.">Dept: Electronics & Comm.</option>
                    <option value="Civil Engg">Dept: Civil Engg</option>
                  </select>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E2E5EC]">
                <button
                  type="button"
                  disabled={currentStep === 1}
                  onClick={handlePrev}
                  className="px-5 py-2.5 rounded-xl bg-[#EFF1F5] shadow-neu-pill-button border border-white text-xs font-mono uppercase font-bold text-[#6C727F] hover:text-[#1E232A] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-b from-[#343A46] to-[#1E232A] text-white text-xs font-mono uppercase font-bold shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-b from-[#343A46] to-[#1E232A] text-white text-xs font-mono uppercase font-bold shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5 text-amber-300" />}
                    <span>Submit Proposal</span>
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
