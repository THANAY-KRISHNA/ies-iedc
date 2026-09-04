import React, { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { INITIAL_DEPARTMENTS } from '../data/initialData';
import { UserPlus, CheckCircle2, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export const Join: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: 'CSE',
    semester: 'S3',
    rollNumber: '',
    interestAreas: [] as string[],
    previousExperience: '',
    whyJoin: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const availableInterests = [
    'Software & Web Development',
    'AI & Machine Learning',
    'Hardware & IoT Prototyping',
    'Robotics & Automation',
    'Business Model & Pitching',
    'Event Operations & Management',
    'Graphic Design & Media',
    'IPR & Patent Research'
  ];

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interestAreas: prev.interestAreas.includes(interest)
        ? prev.interestAreas.filter(i => i !== interest)
        : [...prev.interestAreas, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitSuccess(null);

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.rollNumber ||
      !formData.whyJoin
    ) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitJoin(formData);
      setSubmitSuccess(
        `Thank you ${formData.fullName}! Your membership application has been submitted to the IEDC Executive Cell. Our team will verify your student credentials and notify you via ${formData.email}.`
      );
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        department: 'CSE',
        semester: 'S3',
        rollNumber: '',
        interestAreas: [],
        previousExperience: '',
        whyJoin: ''
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SectionHeader
        tag="Student Cell Recruitment"
        title="Join IES IEDC (2025–26)"
        subtitle="Become an active student innovator, executive team member, or project lead at IES College of Engineering."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Application Form */}
        <div className="lg:col-span-2 neu-raised rounded-2xl p-6 sm:p-10 border border-[#D8D8D3] space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#161616]">Student Membership Application</h3>
            <p className="text-xs text-[#777777]">
              Open to all semesters and departments of IES College of Engineering.
            </p>
          </div>

          {submitSuccess && (
            <div className="p-4 bg-[#EFEFEA] border border-[#C5D5C5] rounded-xl text-xs text-[#1E3A1E] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#1E3A1E] mt-0.5" />
              <div>
                <p className="font-bold">Application Received</p>
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
                <label className="font-bold text-[#242424]">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anandhu K"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#242424]">College Roll / Reg Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IES23CS012"
                  value={formData.rollNumber}
                  onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
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
                  placeholder="yourname@iesce.info"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#242424]">Phone (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#242424]">Department *</label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2.5 neu-raised-soft rounded-lg text-xs text-[#242424] border border-[#D8D8D3] focus:outline-none"
                >
                  {INITIAL_DEPARTMENTS.map(d => (
                    <option key={d.id} value={d.code}>
                      {d.code} - {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-[#242424]">Current Semester *</label>
                <select
                  value={formData.semester}
                  onChange={e => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-3 py-2.5 neu-raised-soft rounded-lg text-xs text-[#242424] border border-[#D8D8D3] focus:outline-none"
                >
                  {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'].map(sem => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#242424]">Academic Year</label>
                <input
                  type="text"
                  readOnly
                  value="2025–26 (Current)"
                  className="w-full px-3.5 py-2.5 bg-[#EBEBE8] border border-[#D8D8D3] rounded-lg text-xs text-[#777777]"
                />
              </div>
            </div>

            {/* Interest Areas */}
            <div className="space-y-2">
              <label className="font-bold text-[#242424]">Primary Areas of Interest</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {availableInterests.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInterest(item)}
                    className={`px-3 py-2 rounded-lg text-left text-xs transition-colors border cursor-pointer ${
                      formData.interestAreas.includes(item)
                        ? 'bg-[#242424] text-white border-[#161616]'
                        : 'bg-[#F5F5F3] text-[#4A4A4A] border-[#D8D8D3] hover:bg-[#EBEBE8]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#242424]">Why do you want to join IES IEDC? *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe your motivations, aspirations, and what you aim to build or learn..."
                value={formData.whyJoin}
                onChange={e => setFormData({ ...formData, whyJoin: e.target.value })}
                className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#242424]">
                Previous Project or Hackathon Experience (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="List any past projects, workshops attended, or technical tools you are proficient with..."
                value={formData.previousExperience}
                onChange={e => setFormData({ ...formData, previousExperience: e.target.value })}
                className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={submitting}
                icon={<UserPlus className="w-4 h-4" />}
              >
                Submit Membership Application
              </Button>
            </div>
          </form>
        </div>

        {/* Membership perks & responsibilities */}
        <div className="space-y-6">
          <div className="neu-raised-soft rounded-2xl p-6 border border-[#D8D8D3] space-y-4">
            <h4 className="text-sm font-bold text-[#161616]">Member Privileges</h4>
            <div className="space-y-3 text-xs text-[#4A4A4A]">
              <div className="flex gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#161616] shrink-0" />
                <p>
                  <strong>KTU Activity Points:</strong> Earn points for hackathons, bootcamp
                  organization, and executive cell leadership.
                </p>
              </div>
              <div className="flex gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#161616] shrink-0" />
                <p>
                  <strong>Lab Access:</strong> Exclusive access to IEDC Maker Space and IoT
                  prototyping kits.
                </p>
              </div>
              <div className="flex gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#161616] shrink-0" />
                <p>
                  <strong>KSUM Summit Passes:</strong> Fully sponsored passes to attend the annual
                  Kerala IEDC Summit and Women Startup Summits.
                </p>
              </div>
              <div className="flex gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#161616] shrink-0" />
                <p>
                  <strong>Direct Mentorship:</strong> One-on-one sessions with faculty research guides
                  and startup founders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
