import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
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
        academicYear: '2024–25',
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
    <div className="fixed inset-0 z-50 bg-[#161616]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-[#D8D8D3] rounded-2xl shadow-neu-card p-6 sm:p-8 flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D8D8D3]">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#777777]">
              PRE-INCUBATION INTAKE
            </span>
            <h3 className="font-display text-xl font-bold text-[#161616]">Submit Your Idea</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#F5F5F3] border border-[#D8D8D3] flex items-center justify-center text-[#777777] hover:text-[#161616] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedMessage ? (
          <div className="py-8 flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#EBEBE8] border border-[#D8D8D3] neu-inset flex items-center justify-center text-[#161616]">
              <CheckCircle2 className="w-8 h-8 text-[#242424]" />
            </div>
            <h4 className="text-lg font-bold text-[#161616]">Proposal Lodged Successfully</h4>
            <p className="text-xs text-[#4A4A4A] max-w-md leading-relaxed">
              {submittedMessage}
            </p>
            <button
              onClick={onClose}
              className="tactile-btn px-6 py-2.5 rounded-xl bg-[#161616] text-white text-xs font-mono uppercase font-semibold cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          <>
            {/* Step Progress Indicator */}
            <div className="flex items-center justify-between text-xs font-mono text-[#777777] pb-2 border-b border-[#D8D8D3]">
              <span>Step 0{currentStep} / 04</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4].map(step => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      step === currentStep
                        ? 'bg-[#161616]'
                        : step < currentStep
                        ? 'bg-[#777777]'
                        : 'bg-[#D8D8D3]'
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
                    <label className="text-xs font-bold uppercase font-mono text-[#161616]">
                      Step 01: Project Title
                    </label>
                    <span className="text-[11px] text-[#777777]">
                      Provide a concise engineering title for your idea.
                    </span>
                  </div>
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Autonomous Spice Sorting Rig"
                    required
                    className="px-3.5 py-2.5 rounded-xl bg-[#F0F0ED] border border-[#D8D8D3] shadow-neu-inset text-xs text-[#161616] placeholder:text-[#777777] focus:outline-none focus:border-[#161616]"
                  />
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase font-mono text-[#161616]">
                      Primary Technology Domain
                    </label>
                    <select
                      value={domain}
                      onChange={e => setDomain(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#F0F0ED] border border-[#D8D8D3] shadow-neu-inset text-xs text-[#161616] focus:outline-none focus:border-[#161616] cursor-pointer"
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
                    <label className="text-xs font-bold uppercase font-mono text-[#161616]">
                      Step 02: Problem Statement
                    </label>
                    <span className="text-[11px] text-[#777777]">
                      What real-world engineering or industrial bottleneck does this solve?
                    </span>
                  </div>
                  <textarea
                    value={problem}
                    onChange={e => setProblem(e.target.value)}
                    placeholder="Describe the acute problem in detail..."
                    rows={4}
                    className="px-3.5 py-2.5 rounded-xl bg-[#F0F0ED] border border-[#D8D8D3] shadow-neu-inset text-xs text-[#161616] placeholder:text-[#777777] focus:outline-none focus:border-[#161616]"
                  />
                </div>
              )}

              {/* Step 3: Your Solution */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase font-mono text-[#161616]">
                      Step 03: Proposed Solution & Technical Delta
                    </label>
                    <span className="text-[11px] text-[#777777]">
                      Outline your novelty, expected hardware/software architecture.
                    </span>
                  </div>
                  <textarea
                    value={solution}
                    onChange={e => setSolution(e.target.value)}
                    placeholder="Detail the innovation or technical approach..."
                    rows={4}
                    className="px-3.5 py-2.5 rounded-xl bg-[#F0F0ED] border border-[#D8D8D3] shadow-neu-inset text-xs text-[#161616] placeholder:text-[#777777] focus:outline-none focus:border-[#161616]"
                  />
                </div>
              )}

              {/* Step 4: Your Details */}
              {currentStep === 4 && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase font-mono text-[#161616]">
                      Step 04: Student & Department Details
                    </label>
                    <span className="text-[11px] text-[#777777]">
                      Contact details for nodal notification.
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Student Lead Name"
                      required
                      className="px-3.5 py-2.5 rounded-xl bg-[#F0F0ED] border border-[#D8D8D3] shadow-neu-inset text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Institutional Email"
                      required
                      className="px-3.5 py-2.5 rounded-xl bg-[#F0F0ED] border border-[#D8D8D3] shadow-neu-inset text-xs text-[#161616] focus:outline-none focus:border-[#161616]"
                    />
                  </div>
                  <select
                    value={dept}
                    onChange={e => setDept(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-[#F0F0ED] border border-[#D8D8D3] shadow-neu-inset text-xs text-[#161616] focus:outline-none focus:border-[#161616] cursor-pointer"
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
              <div className="flex items-center justify-between pt-4 border-t border-[#D8D8D3]">
                <button
                  type="button"
                  disabled={currentStep === 1}
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl bg-[#F5F5F3] border border-[#D8D8D3] text-xs font-mono uppercase text-[#777777] hover:text-[#161616] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="tactile-btn px-6 py-2.5 rounded-xl bg-[#161616] text-white text-xs font-mono uppercase font-semibold shadow-neu-button cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="tactile-btn px-6 py-2.5 rounded-xl bg-[#161616] text-white text-xs font-mono uppercase font-semibold shadow-neu-button cursor-pointer flex items-center gap-1.5"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
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
