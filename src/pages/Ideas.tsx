import React, { useEffect, useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { api } from '../services/api';
import { StudentIdea, Department } from '../types';
import { INITIAL_DEPARTMENTS } from '../data/initialData';
import { Sparkles, Send, CheckCircle2, Cpu, HelpCircle, Layers, ShieldCheck, Rocket } from 'lucide-react';

export const Ideas: React.FC = () => {
  const [ideas, setIdeas] = useState<StudentIdea[]>([]);
  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [formData, setFormData] = useState({
    projectName: '',
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    department: 'CSE',
    academicYear: '2025–26',
    problem: '',
    proposedSolution: '',
    technology: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadIdeas() {
      try {
        const data = await api.getIdeas();
        setIdeas(data || []);
      } catch (err) {
        console.error('Failed to load ideas:', err);
      } finally {
        setLoading(false);
      }
    }
    loadIdeas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitSuccess(null);

    if (
      !formData.projectName ||
      !formData.studentName ||
      !formData.studentEmail ||
      !formData.problem ||
      !formData.proposedSolution
    ) {
      setErrorMessage('Please fill in all mandatory fields before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitIdea(formData);
      setSubmitSuccess(
        `Thank you ${formData.studentName}! Your idea "${formData.projectName}" has been recorded. The IEDC Executive Committee will review it and reach out to your institutional email.`
      );
      setFormData({
        projectName: '',
        studentName: '',
        studentEmail: '',
        studentPhone: '',
        department: 'CSE',
        academicYear: '2025–26',
        problem: '',
        proposedSolution: '',
        technology: '',
        description: ''
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit idea. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-16 bg-[#EFF1F5]">
      {/* 1. Header */}
      <SectionHeader
        tag="Innovation Incubator"
        title="Student Ideas &amp; Project Cell"
        subtitle="Submit technical concepts, hardware designs, or software prototypes for mentorship, patent assistance, and IEDC grants."
      />

      {/* 2. Two-Column Layout: Submission Form + Mentorship Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="submit">
        
        {/* Form Outer Container (ENHANCED RICH 3D NEUMORPHIC BOX) */}
        <div className="lg:col-span-2 rounded-[32px] bg-gradient-to-b from-white to-[#F8F9FC] shadow-[18px_18px_36px_rgba(165,172,185,0.55),-18px_-18px_36px_rgba(255,255,255,0.95)] border border-white p-6 sm:p-10 space-y-6 relative overflow-hidden">
          
          {/* Subtle Top Highlight Accent Rim */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#2B303A]/20 to-transparent" />

          <div className="space-y-1 pb-2 border-b border-[#E2E5EC]">
            <h3 className="text-2xl font-black font-sans text-[#1E232A] tracking-tight">
              Submit An Idea For Mentorship
            </h3>
            <p className="text-xs font-medium text-[#6C727F]">
              Open to all engineering students of IES College of Engineering.
            </p>
          </div>

          {submitSuccess && (
            <div className="p-4 bg-[#EBF7F1] border border-[#A8E0C4] rounded-2xl text-xs text-[#125332] flex items-start gap-3 shadow-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#10B981] mt-0.5" />
              <div>
                <p className="font-bold">Submission Confirmed</p>
                <p className="mt-1 leading-relaxed">{submitSuccess}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-[#FDEAE8] border border-[#F8B4AF] rounded-2xl text-xs text-[#9B1C1C] shadow-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="font-bold text-[#1E232A] tracking-wide uppercase text-[11px]">
                  Project / Solution Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Agri-Drone Sensor Hub"
                  value={formData.projectName}
                  onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full px-4 py-3 bg-[#EFF1F5] shadow-neu-hub-inner rounded-xl text-xs text-[#1E232A] placeholder:text-[#888E9B] border border-[#DCDFE6]/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E232A] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-[#1E232A] tracking-wide uppercase text-[11px]">
                  Primary Innovator Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anandhu K"
                  value={formData.studentName}
                  onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-4 py-3 bg-[#EFF1F5] shadow-neu-hub-inner rounded-xl text-xs text-[#1E232A] placeholder:text-[#888E9B] border border-[#DCDFE6]/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E232A] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="font-bold text-[#1E232A] tracking-wide uppercase text-[11px]">
                  Institutional Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@iesce.info"
                  value={formData.studentEmail}
                  onChange={e => setFormData({ ...formData, studentEmail: e.target.value })}
                  className="w-full px-4 py-3 bg-[#EFF1F5] shadow-neu-hub-inner rounded-xl text-xs text-[#1E232A] placeholder:text-[#888E9B] border border-[#DCDFE6]/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E232A] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-[#1E232A] tracking-wide uppercase text-[11px]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.studentPhone}
                  onChange={e => setFormData({ ...formData, studentPhone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#EFF1F5] shadow-neu-hub-inner rounded-xl text-xs text-[#1E232A] placeholder:text-[#888E9B] border border-[#DCDFE6]/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E232A] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-[#1E232A] tracking-wide uppercase text-[11px]">
                  Engineering Department *
                </label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 bg-[#EFF1F5] shadow-neu-hub-inner rounded-xl text-xs text-[#1E232A] border border-[#DCDFE6]/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E232A] cursor-pointer transition-all font-medium"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.code}>
                      {d.code} ({d.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-[#1E232A] tracking-wide uppercase text-[11px]">
                Problem Statement *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe the specific real-world bottleneck or societal problem your team is targeting..."
                value={formData.problem}
                onChange={e => setFormData({ ...formData, problem: e.target.value })}
                className="w-full px-4 py-3 bg-[#EFF1F5] shadow-neu-hub-inner rounded-xl text-xs text-[#1E232A] placeholder:text-[#888E9B] border border-[#DCDFE6]/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E232A] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-[#1E232A] tracking-wide uppercase text-[11px]">
                Proposed Solution &amp; Approach *
              </label>
              <textarea
                required
                rows={3}
                placeholder="How does your proposed hardware/software innovation address this problem?"
                value={formData.proposedSolution}
                onChange={e => setFormData({ ...formData, proposedSolution: e.target.value })}
                className="w-full px-4 py-3 bg-[#EFF1F5] shadow-neu-hub-inner rounded-xl text-xs text-[#1E232A] placeholder:text-[#888E9B] border border-[#DCDFE6]/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E232A] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="font-bold text-[#1E232A] tracking-wide uppercase text-[11px]">
                  Technologies / Hardware Used
                </label>
                <input
                  type="text"
                  placeholder="e.g. ESP32, Python, OpenCV, Flutter, LoRaWAN"
                  value={formData.technology}
                  onChange={e => setFormData({ ...formData, technology: e.target.value })}
                  className="w-full px-4 py-3 bg-[#EFF1F5] shadow-neu-hub-inner rounded-xl text-xs text-[#1E232A] placeholder:text-[#888E9B] border border-[#DCDFE6]/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1E232A] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-[#1E232A] tracking-wide uppercase text-[11px]">
                  Academic Year
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.academicYear}
                  className="w-full px-4 py-3 bg-[#E5E8EF] border border-[#DCDFE6] rounded-xl text-xs text-[#6C727F] font-bold select-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* 3D Tactile Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-b from-[#343A46] to-[#1E232A] text-white text-xs font-bold font-sans tracking-widest uppercase shadow-[8px_8px_20px_rgba(160,168,182,0.5),-8px_-8px_20px_rgba(255,255,255,0.9)] hover:-translate-y-1 hover:shadow-[12px_12px_24px_rgba(160,168,182,0.65)] active:translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 select-none"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>{submitting ? 'Submitting Proposal...' : 'SUBMIT PROJECT TO IEDC PANEL'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Sidebar (Matching 3D Cards) */}
        <div className="space-y-6">
          <div className="rounded-[28px] bg-gradient-to-b from-white to-[#F8F9FC] shadow-[14px_14px_28px_rgba(165,172,185,0.45),-14px_-14px_28px_rgba(255,255,255,0.95)] p-6 sm:p-7 border border-white space-y-4">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-[#1E232A]" />
              <h4 className="text-sm font-extrabold text-[#1E232A]">Evaluation &amp; Incubation Flow</h4>
            </div>
            <div className="space-y-4 text-xs text-[#525866]">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#EFF1F5] shadow-neu-hub-inner flex items-center justify-center font-bold text-[11px] text-[#1E232A] shrink-0 border border-white">
                  1
                </span>
                <p>
                  <strong className="text-[#1E232A]">Screening:</strong> Reviewed by Department
                  Coordinators for feasibility and IP uniqueness.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#EFF1F5] shadow-neu-hub-inner flex items-center justify-center font-bold text-[11px] text-[#1E232A] shrink-0 border border-white">
                  2
                </span>
                <p>
                  <strong className="text-[#1E232A]">Faculty Mentor:</strong> Assigned a research
                  mentor and laboratory maker-space access.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#EFF1F5] shadow-neu-hub-inner flex items-center justify-center font-bold text-[11px] text-[#1E232A] shrink-0 border border-white">
                  3
                </span>
                <p>
                  <strong className="text-[#1E232A]">YIP &amp; KSUM Escalation:</strong> Recommended
                  for Young Innovators Programme state financial grants.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-gradient-to-b from-white to-[#F8F9FC] shadow-[14px_14px_28px_rgba(165,172,185,0.45),-14px_-14px_28px_rgba(255,255,255,0.95)] p-6 sm:p-7 border border-white space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#1E232A]" />
              <h4 className="text-sm font-extrabold text-[#1E232A]">Intellectual Property</h4>
            </div>
            <p className="text-xs text-[#6C727F] leading-relaxed pt-1">
              Student ideas remain 100% the intellectual property of the student innovators. The
              Centre assists in filing provisional patents through KSUM IPR facilitation cells.
            </p>
          </div>
        </div>

      </div>

      {/* 3. Developing / Accepted Ideas Showcase */}
      <div className="space-y-6 pt-6 border-t border-[#DCDFE6]">
        <div>
          <h3 className="text-2xl font-black font-sans text-[#1E232A] tracking-tight">
            Incubating Student Innovations
          </h3>
          <p className="text-xs text-[#6C727F] mt-1 font-medium">
            Projects currently undergoing prototype validation or pre-incubation.
          </p>
        </div>

        {loading ? (
          <LoadingState message="Loading student innovation showcase..." />
        ) : ideas.length === 0 ? (
          <EmptyState
            title="No public projects currently showcased"
            description="Submit your innovation idea above to be featured in the IES IEDC showcase."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map(idea => (
              <div
                key={idea.id}
                className="rounded-[24px] bg-gradient-to-b from-white to-[#F8F9FC] shadow-neu-soft-card p-6 border border-white space-y-4 flex flex-col justify-between hover:-translate-y-1.5 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="dark" size="sm">
                      {idea.department}
                    </Badge>
                    <Badge variant="success" size="sm">
                      {idea.status}
                    </Badge>
                  </div>

                  <h4 className="text-base font-bold text-[#1E232A] leading-snug">
                    {idea.projectName}
                  </h4>

                  <p className="text-xs text-[#6C727F] font-medium">
                    Innovator: <span className="text-[#1E232A] font-bold">{idea.studentName}</span>
                  </p>

                  <div className="space-y-2 text-xs text-[#525866]">
                    <div>
                      <span className="font-semibold text-[#1E232A]">Problem: </span>
                      <span className="line-clamp-2">{idea.problem}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#1E232A]">Solution: </span>
                      <span className="line-clamp-2">{idea.proposedSolution}</span>
                    </div>
                  </div>
                </div>

                {idea.technology && (
                  <div className="pt-3 border-t border-[#EBEBE8]">
                    <span className="text-[11px] font-semibold text-[#6C727F] block mb-1">
                      Tech Stack:
                    </span>
                    <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[#EFF1F5] text-[#1E232A] border border-[#DCDFE6] inline-block font-mono font-bold shadow-xs">
                      {idea.technology}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
