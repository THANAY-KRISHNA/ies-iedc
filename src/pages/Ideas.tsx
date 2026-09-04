import React, { useEffect, useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { api } from '../services/api';
import { StudentIdea, Department } from '../types';
import { INITIAL_DEPARTMENTS } from '../data/initialData';
import { Sparkles, Send, CheckCircle2, Cpu, HelpCircle, Layers } from 'lucide-react';

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
        setIdeas(data);
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
      const res = await api.submitIdea(formData);
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
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. Header */}
      <SectionHeader
        tag="Innovation Incubator"
        title="Student Ideas &amp; Project Cell"
        subtitle="Submit technical concepts, hardware designs, or software prototypes for mentorship, patent assistance, and IEDC grants."
      />

      {/* 2. Two-Column Layout: Submission Form + Mentorship Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="submit">
        {/* Form Container */}
        <div className="lg:col-span-2 neu-raised rounded-2xl p-6 sm:p-10 border border-[#D8D8D3] space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#161616]">Submit An Idea For Mentorship</h3>
            <p className="text-xs text-[#777777]">
              Open to all engineering students of IES College of Engineering.
            </p>
          </div>

          {submitSuccess && (
            <div className="p-4 bg-[#EFEFEA] border border-[#C5D5C5] rounded-xl text-xs text-[#1E3A1E] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#1E3A1E] mt-0.5" />
              <div>
                <p className="font-bold">Submission Confirmed</p>
                <p className="mt-1 leading-relaxed">{submitSuccess}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-[#FBE9E7] border border-[#FFAB91] rounded-xl text-xs text-[#D84315]">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-[#242424]">Project / Solution Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Agri-Drone Sensor Hub"
                  value={formData.projectName}
                  onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#242424]">Primary Innovator Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anandhu K"
                  value={formData.studentName}
                  onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-[#242424]">Institutional Email *</label>
                <input
                  type="email"
                  required
                  placeholder="student@iesce.info"
                  value={formData.studentEmail}
                  onChange={e => setFormData({ ...formData, studentEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#242424]">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.studentPhone}
                  onChange={e => setFormData({ ...formData, studentPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#242424]">Engineering Department *</label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2.5 neu-raised-soft rounded-lg text-xs text-[#242424] border border-[#D8D8D3] focus:outline-none"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.code}>
                      {d.code} ({d.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#242424]">Problem Statement *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe the specific real-world bottleneck or societal problem your team is targeting..."
                value={formData.problem}
                onChange={e => setFormData({ ...formData, problem: e.target.value })}
                className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#242424]">Proposed Solution &amp; Approach *</label>
              <textarea
                required
                rows={3}
                placeholder="How does your proposed hardware/software innovation address this problem?"
                value={formData.proposedSolution}
                onChange={e => setFormData({ ...formData, proposedSolution: e.target.value })}
                className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-[#242424]">Technologies / Hardware Used</label>
                <input
                  type="text"
                  placeholder="e.g. ESP32, Python, OpenCV, Flutter, LoRaWAN"
                  value={formData.technology}
                  onChange={e => setFormData({ ...formData, technology: e.target.value })}
                  className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#242424]">Academic Year</label>
                <input
                  type="text"
                  readOnly
                  value={formData.academicYear}
                  className="w-full px-3.5 py-2.5 bg-[#EBEBE8] border border-[#D8D8D3] rounded-lg text-xs text-[#777777]"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={submitting}
                icon={<Send className="w-4 h-4" />}
              >
                Submit Project to IEDC Panel
              </Button>
            </div>
          </form>
        </div>

        {/* Right Info Box */}
        <div className="space-y-6">
          <div className="neu-raised-soft rounded-2xl p-6 border border-[#D8D8D3] space-y-4">
            <h4 className="text-sm font-bold text-[#161616]">Evaluation &amp; Incubation Flow</h4>
            <div className="space-y-3 text-xs text-[#4A4A4A]">
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full neu-inset flex items-center justify-center font-bold text-[10px] shrink-0">
                  1
                </span>
                <p>
                  <strong className="text-[#161616]">Screening:</strong> Reviewed by Department
                  Coordinators for feasibility and IP uniqueness.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full neu-inset flex items-center justify-center font-bold text-[10px] shrink-0">
                  2
                </span>
                <p>
                  <strong className="text-[#161616]">Faculty Mentor:</strong> Assigned a research
                  mentor and laboratory maker-space access.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full neu-inset flex items-center justify-center font-bold text-[10px] shrink-0">
                  3
                </span>
                <p>
                  <strong className="text-[#161616]">YIP &amp; KSUM Escalation:</strong> Recommended
                  for Young Innovators Programme state financial grants.
                </p>
              </div>
            </div>
          </div>

          <div className="neu-raised-soft rounded-2xl p-6 border border-[#D8D8D3] space-y-2">
            <h4 className="text-sm font-bold text-[#161616]">Intellectual Property</h4>
            <p className="text-xs text-[#777777] leading-relaxed">
              Student ideas remain 100% the intellectual property of the student innovators. The
              Centre assists in filing provisional patents through KSUM IPR facilitation cells.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Developing / Accepted Ideas Showcase */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-[#161616]">Incubating Student Innovations</h3>
          <p className="text-xs text-[#777777] mt-1">
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
                className="neu-raised-soft rounded-xl p-6 border border-[#D8D8D3] space-y-4 flex flex-col justify-between"
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

                  <h4 className="text-base font-bold text-[#161616] leading-snug">
                    {idea.projectName}
                  </h4>

                  <p className="text-xs text-[#777777] font-medium">
                    Innovator: <span className="text-[#242424]">{idea.studentName}</span>
                  </p>

                  <div className="space-y-2 text-xs text-[#4A4A4A]">
                    <div>
                      <span className="font-semibold text-[#161616]">Problem: </span>
                      <span className="line-clamp-2">{idea.problem}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#161616]">Solution: </span>
                      <span className="line-clamp-2">{idea.proposedSolution}</span>
                    </div>
                  </div>
                </div>

                {idea.technology && (
                  <div className="pt-3 border-t border-[#EBEBE8]">
                    <span className="text-[11px] font-semibold text-[#777777] block mb-1">
                      Tech Stack:
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#EBEBE8] text-[#242424] border border-[#D8D8D3] inline-block">
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
