import React, { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Mail, Phone, MapPin, Send, CheckCircle2, Building, ExternalLink } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SectionHeader
        tag="Campus Coordination"
        title="Contact IES IEDC Cell"
        subtitle="Connect with our faculty nodal officers, student leads, or visit the IEDC innovation maker-space on campus."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="neu-raised rounded-2xl p-6 border border-[#D8D8D3] space-y-4">
            <h3 className="text-base font-bold text-[#161616]">Campus Address</h3>
            <div className="space-y-3 text-xs text-[#4A4A4A]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#242424] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#161616]">IES College of Engineering</p>
                  <p>Innovation &amp; Entrepreneurship Development Centre (IEDC)</p>
                  <p>Chittilappilly, Thrissur,</p>
                  <p>Kerala — 680551, India</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Mail className="w-4 h-4 text-[#242424] shrink-0" />
                <a
                  href="mailto:iedc@iesce.info"
                  className="text-xs font-semibold text-[#161616] hover:underline"
                >
                  iedc@iesce.info
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#242424] shrink-0" />
                <span className="text-xs font-semibold text-[#161616]">0487 230 9999</span>
              </div>
            </div>
          </div>

          <div className="neu-raised rounded-2xl p-6 border border-[#D8D8D3] space-y-3">
            <h3 className="text-sm font-bold text-[#161616]">Faculty Contacts</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#EBEBE8] rounded-lg border border-[#D8D8D3]">
                <p className="font-bold text-[#161616]">Prof. Shahaziya Parvez</p>
                <p className="text-[11px] text-[#777777]">Nodal Officer, IES IEDC</p>
                <p className="text-[11px] text-[#4A4A4A]">Assistant Professor, Dept of CSE</p>
                <a
                  href="mailto:nodal.officer@iesce.info"
                  className="text-[11px] text-[#161616] hover:underline block mt-1"
                >
                  nodal.officer@iesce.info
                </a>
              </div>

              <div className="p-3 bg-[#EBEBE8] rounded-lg border border-[#D8D8D3]">
                <p className="font-bold text-[#161616]">Er. Febin M F</p>
                <p className="text-[11px] text-[#777777]">Assistant Nodal Officer</p>
                <p className="text-[11px] text-[#4A4A4A]">Assistant Professor, Dept of ME</p>
                <a
                  href="mailto:asst.nodal@iesce.info"
                  className="text-[11px] text-[#161616] hover:underline block mt-1"
                >
                  asst.nodal@iesce.info
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Send Direct Message Form */}
        <div className="lg:col-span-2 neu-raised rounded-2xl p-6 sm:p-10 border border-[#D8D8D3] space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#161616]">Send an Official Inquiry</h3>
            <p className="text-xs text-[#777777]">
              Submit queries regarding partnerships, hackathons, mentorship, or student innovation support.
            </p>
          </div>

          {submitted && (
            <div className="p-4 bg-[#EFEFEA] border border-[#C5D5C5] rounded-xl text-xs text-[#1E3A1E] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#1E3A1E] mt-0.5" />
              <div>
                <p className="font-bold">Message Sent Successfully</p>
                <p className="mt-1">
                  Thank you for contacting IES IEDC. The coordination office will review your inquiry.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-[#242424]">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anandhu K"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#242424]">Your Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#242424]">Subject</label>
              <input
                type="text"
                placeholder="e.g. Industry Partnership / Student Project Mentorship"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#242424]">Message *</label>
              <textarea
                required
                rows={4}
                placeholder="Enter details of your inquiry or proposal..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
              />
            </div>

            <Button type="submit" variant="primary" icon={<Send className="w-4 h-4" />}>
              Send Inquiry to IEDC
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
