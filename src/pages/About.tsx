import React from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Badge } from '../components/ui/Badge';
import { CheckCircle2, ShieldCheck, Target, Award, Building, BookOpen, Lightbulb, Cpu, Rocket } from 'lucide-react';

export const About: React.FC = () => {
  const objectives = [
    {
      title: 'Culture of Innovation',
      desc: 'To promote an innovation driven entrepreneurship culture among the students'
    },
    {
      title: 'Commercially Viable Solutions',
      desc: 'To develop and promote commercially viable innovative products and solutions from the students.'
    },
    {
      title: 'Technopreneurship Spirit',
      desc: 'To promote a spirit of enterprise among budding technopreneurs'
    },
    {
      title: 'Industry-Academia Bridge',
      desc: 'To bridge the gap between Industry and Academia'
    }
  ];

  const functions = [
    'To create awareness and interest among faculties and students through workshops and Hackathons and FDPs',
    'To motivate, support and mentor students for identification, development and commercialisation of their innovative ideas',
    'To create a platform for the young brains to develop their skills and to give proper technological exposure',
    'To provide Technology & Management Skill Training to the students and Faculties in building their innovative product or solution.',
    'To create specialization hubs for promoting the culture of Entrepreneurship among the student communities.'
  ];

  const programmePhases = [
    {
      phase: 'Phase 1: Innovation Phase',
      icon: Lightbulb,
      title: 'Ideation & Mindset',
      description: 'Students experience innovation thinking, tools of innovation and an innovation mindset. Students gain experience in design thinking and ideation which helps develop a perspective towards social and community problems.'
    },
    {
      phase: 'Phase 2: Technical Phase',
      icon: Cpu,
      title: 'Skill Appreciation & Prototyping',
      description: 'Students undergo skill appreciation workshops and are introduced to new technologies, future of work, computational thinking, and sectoral areas to upgrade skills in their chosen fields.'
    },
    {
      phase: 'Phase 3: Entrepreneurship Phase',
      icon: Rocket,
      title: 'Business & Commercialisation',
      description: 'Students are exposed to business and entrepreneurship through workshops and case studies. Tools such as Business Canvas Modelling and Design Thinking workshops guide student teams toward solving identified problems.'
    }
  ];

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
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
            The Institute has an Innovation and Entrepreneurship Development Cell (IES IEDC) established in 2016. Innovation and Entrepreneurship Development Centre (IEDC) is a flagship initiative of Kerala Startup Mission to promote innovation and entrepreneurship among the student and academic fraternity in the educational institutions in the State of Kerala and considered as an umbrella programme that would play an instrumental role in fostering innovation culture in Academic institutions.
          </p>
          <p>
            It is a student's organization established in the institution devoted in promoting the spirit of entrepreneurship among themselves. It also aims to conduct ED courses for students with the help of Kerala Startup Mission, MSME &amp; EDI, India.
          </p>
          <p>
            IES IEDC organizes seminars and various workshops periodically. Successful entrepreneurs are invited for interactive sessions with the students, for making the students understand business ethics and start-up procedures. The cell also organizes idea competitions and mentors them to transform their ideas into reality. Officials from different sectors are also invited as guest speakers for sessions to provide guidance on financial and registration aspects of startups.
          </p>

          <div className="pt-4 flex flex-wrap gap-2">
            <Badge variant="dark">KSUM Flagship Initiative</Badge>
            <Badge variant="neutral">Established in 2016</Badge>
            <Badge variant="neutral">MSME &amp; EDI Partner</Badge>
            <Badge variant="neutral">Autonomous Student Governance</Badge>
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
              <span className="font-semibold text-[#161616]">Kerala Startup Mission (KSUM)</span>
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
            "To inculcate an innovation culture among the students, to create future entrepreneurs and position the institution as a learning, innovation and entrepreneurial hub."
          </p>
        </div>

        <div className="neu-raised-soft rounded-xl p-8 border border-[#D8D8D3] space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#242424]" />
            <h3 className="text-base font-bold text-[#161616]">Official Mission</h3>
          </div>
          <p className="text-sm text-[#4A4A4A] italic leading-relaxed">
            "To establish an innovation platform by introducing the State-of-the-art technologies through promoting innovation and entrepreneurship."
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* 5. Functions of IEDC */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-[#161616]">Functions of IEDC</h3>
          <p className="text-xs text-[#777777] mt-1">
            Core responsibilities and operational activities mandated for IES IEDC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {functions.map((func, i) => (
            <div
              key={i}
              className="neu-raised-soft rounded-xl p-6 border border-[#D8D8D3] flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-[#161616] shrink-0 mt-0.5" />
              <p className="text-xs text-[#4A4A4A] leading-relaxed">{func}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Programme Design of IEDC */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-[#161616]">Programme Design of IEDC</h3>
          <p className="text-xs text-[#777777] mt-1">
            Structured 3-phase progression vertical (Innovation, Technical, Entrepreneurship).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programmePhases.map((phase, i) => {
            const Icon = phase.icon;
            return (
              <div
                key={i}
                className="neu-raised rounded-xl p-6 border border-[#D8D8D3] space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg neu-inset flex items-center justify-center text-[#161616]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#777777]">
                      {phase.phase}
                    </span>
                    <h4 className="text-sm font-bold text-[#161616]">{phase.title}</h4>
                  </div>
                </div>
                <p className="text-xs text-[#4A4A4A] leading-relaxed">{phase.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Ecosystem Collaborations */}
      <div className="neu-raised rounded-2xl p-8 md:p-12 border border-[#D8D8D3] space-y-6">
        <h3 className="text-lg font-bold text-[#161616]">Ecosystem Collaborations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="neu-raised-soft rounded-lg p-5 border border-[#D8D8D3] space-y-2">
            <h4 className="text-sm font-bold text-[#161616]">Kerala Startup Mission (KSUM)</h4>
            <p className="text-xs text-[#777777] leading-relaxed">
              State flagship initiative promoting innovation and entrepreneurship across educational institutions in Kerala.
            </p>
          </div>
          <div className="neu-raised-soft rounded-lg p-5 border border-[#D8D8D3] space-y-2">
            <h4 className="text-sm font-bold text-[#161616]">MSME &amp; EDI India</h4>
            <p className="text-xs text-[#777777] leading-relaxed">
              National entrepreneurship promotion institutes facilitating ED courses, skill development, and industrial guidance.
            </p>
          </div>
          <div className="neu-raised-soft rounded-lg p-5 border border-[#D8D8D3] space-y-2">
            <h4 className="text-sm font-bold text-[#161616]">IES Innovation Cell</h4>
            <p className="text-xs text-[#777777] leading-relaxed">
              Interdisciplinary faculty and student body representing CE, ME, CSE, EEE, ECE, R&amp;AI, DS, and S&amp;H departments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

