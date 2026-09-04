import React from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { CheckCircle2, ShieldCheck, Target, Award, Building, BookOpen } from 'lucide-react';

export const About: React.FC = () => {
  const objectives = [
    {
      title: 'Culture of Innovation & Entrepreneurship',
      desc: 'To cultivate an innovation-driven entrepreneurial mindset among engineering students, encouraging creative thinking and problem-solving methodologies.'
    },
    {
      title: 'Mentorship & Venture Facilitation',
      desc: 'To provide dedicated mentorship from industry veterans, alumni founders, and research mentors to help transform innovative ideas into viable ventures.'
    },
    {
      title: 'IPR & Technological Protection',
      desc: 'To conduct intellectual property rights (IPR) awareness workshops and facilitate patent filing, copyright, and trademark procedures for student innovations.'
    },
    {
      title: 'Prototyping & Incubation Support',
      desc: 'To provide laboratory infrastructure, maker space equipment, and early-stage seed assistance to validate prototypes.'
    },
    {
      title: 'Industry & Ecosystem Linkage',
      desc: 'To bridge academic talent with Kerala Startup Mission (KSUM), MSME development institutes, EDI, and leading angel investor networks.'
    },
    {
      title: 'Diversity & Women Entrepreneurship',
      desc: 'To encourage women engineering scholars to lead technology startups and participate in state and national startup summits.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. Header */}
      <SectionHeader
        tag="Institutional Mandate"
        title="About IES IEDC"
        subtitle="Innovation and Entrepreneurship Development Centre at IES College of Engineering, Chittilappilly, Thrissur."
      />

      {/* 2. Overview & Established Year */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-5 text-sm text-[#4A4A4A] leading-relaxed">
          <p className="text-base font-semibold text-[#161616]">
            Established in 2016, the Innovation and Entrepreneurship Development Centre (IEDC) at IES
            College of Engineering functions as a flagship node under the Kerala Startup Mission
            (KSUM) institutional network.
          </p>
          <p>
            The Centre is committed to creating an institutional ecosystem where students from all
            engineering departments—including Civil, Mechanical, Computer Science, Electrical,
            Electronics, Robotics &amp; AI, and Data Science—can collaborate to solve pressing
            societal and industrial problems.
          </p>
          <p>
            Through state-level hackathons, ideation camps, design thinking workshops, and mentorship
            sessions with Kerala Startup Mission officers, IES IEDC provides students with a
            structured bridge between engineering curricula and real-world technology entrepreneurship.
          </p>

          <div className="pt-4 flex flex-wrap gap-2">
            <Badge variant="dark">KSUM Approved Centre</Badge>
            <Badge variant="neutral">Established in 2016</Badge>
            <Badge variant="neutral">Autonomous Student Governance</Badge>
            <Badge variant="neutral">Faculty Mentorship Panel</Badge>
          </div>
        </div>

        {/* Fact Card */}
        <div className="neu-raised rounded-xl p-6 border border-[#D8D8D3] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg neu-inset flex items-center justify-center text-[#161616]">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#161616]">IES Campus</h4>
              <p className="text-xs text-[#777777]">Chittilappilly, Thrissur</p>
            </div>
          </div>

          <div className="border-t border-[#EBEBE8] pt-3 space-y-2 text-xs text-[#4A4A4A]">
            <div className="flex justify-between py-1 border-b border-[#F0F0ED]">
              <span className="text-[#777777]">Established:</span>
              <span className="font-semibold text-[#161616]">2016</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F0ED]">
              <span className="text-[#777777]">Nodal Agency:</span>
              <span className="font-semibold text-[#161616]">Kerala Startup Mission</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F0ED]">
              <span className="text-[#777777]">Host College:</span>
              <span className="font-semibold text-[#161616]">IES College of Engineering</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#777777]">Institutional Code:</span>
              <span className="font-semibold text-[#161616]">IESCE / IEDC</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Vision and Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="neu-raised-soft rounded-xl p-8 border border-[#D8D8D3] space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#242424]" />
            <h3 className="text-base font-bold text-[#161616]">Official Vision</h3>
          </div>
          <p className="text-sm text-[#4A4A4A] italic leading-relaxed">
            "To become a premier centre of excellence in fostering innovation, technology-driven
            entrepreneurship, and sustainable ventures that contribute to societal transformation."
          </p>
        </div>

        <div className="neu-raised-soft rounded-xl p-8 border border-[#D8D8D3] space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#242424]" />
            <h3 className="text-base font-bold text-[#161616]">Official Mission</h3>
          </div>
          <p className="text-sm text-[#4A4A4A] italic leading-relaxed">
            "To nurture an innovation-driven entrepreneurial ecosystem, provide mentorship and incubation
            support, encourage interdisciplinary research, and empower students to build viable
            commercial solutions."
          </p>
        </div>
      </div>

      {/* 4. Official Objectives */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-[#161616]">Official Objectives</h3>
          <p className="text-xs text-[#777777] mt-1">
            Governing goals guiding all institutional initiatives and academic programmes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((obj, i) => (
            <div
              key={i}
              className="neu-raised-soft rounded-xl p-6 border border-[#D8D8D3] space-y-2.5"
            >
              <div className="w-7 h-7 rounded-md neu-inset flex items-center justify-center text-xs font-bold text-[#242424]">
                0{i + 1}
              </div>
              <h4 className="text-sm font-bold text-[#161616]">{obj.title}</h4>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">{obj.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Governance & Ecosystem Partners */}
      <div className="neu-raised rounded-2xl p-8 md:p-12 border border-[#D8D8D3] space-y-6">
        <h3 className="text-lg font-bold text-[#161616]">Ecosystem Collaborations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="neu-raised-soft rounded-lg p-5 border border-[#D8D8D3] space-y-2">
            <h4 className="text-sm font-bold text-[#161616]">Kerala Startup Mission (KSUM)</h4>
            <p className="text-xs text-[#777777] leading-relaxed">
              State nodal agency for entrepreneurship development providing funding grants, IEDC summits, and mentorship access.
            </p>
          </div>
          <div className="neu-raised-soft rounded-lg p-5 border border-[#D8D8D3] space-y-2">
            <h4 className="text-sm font-bold text-[#161616]">MSME / EDI India</h4>
            <p className="text-xs text-[#777777] leading-relaxed">
              National entrepreneurship promotion initiatives facilitating enterprise development and industrial training workshops.
            </p>
          </div>
          <div className="neu-raised-soft rounded-lg p-5 border border-[#D8D8D3] space-y-2">
            <h4 className="text-sm font-bold text-[#161616]">IES Innovation Cell</h4>
            <p className="text-xs text-[#777777] leading-relaxed">
              Interdisciplinary faculty committee representing all 8 academic engineering departments of IES College of Engineering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
