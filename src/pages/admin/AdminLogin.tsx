import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Shield, Lock, ArrowLeft, KeyRound, Check, User, Info } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('nodal.officer@iesce.info');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setError('Please enter your administrative email or username.');
      return;
    }
    setError(null);
    setLoading(true);
    const success = await login(email);
    setLoading(false);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid credentials or unregistered administrative account.');
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setLoading(true);
    const success = await login(demoEmail);
    setLoading(false);
    if (success) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A2232] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#5F6B7D] hover:text-[#1A365D] mb-2 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Portal</span>
        </Link>

        <div className="w-16 h-16 mx-auto rounded-md bg-[#000000] border border-[#D5D9E0] flex items-center justify-center p-2 shadow-neu-button shrink-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGky_twkb-r-fjGH7KFGWD67wikfcOAlvhh9O37tDCkEZpKPz344DIDOO7lXK3JHX-vfoZW4DwyCVUwlYLOfDH8QMzwWP7J93sn9AhqZNVnKxcQavbgtdTv-tumANwqlGEVttorxIZXy36OgyRLIK54b8tteqSIV3l6JwZp9VgVD0bsBeixtAS1ab7LMR2ZJw_zkJPocySdohgwCiSGrHbGoC0Kk1jX9B1usMagjUZpZWLc69Qjs3Z2EzNnqMHp0ceCkE"
            alt="IES IEDC Logo"
            className="w-full h-full object-contain"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-[#1A365D] tracking-tight font-display">
          IES IEDC Nodal Portal
        </h2>
        <p className="text-xs text-[#5F6B7D] uppercase font-mono tracking-wider font-semibold">
          Institutional Governance &amp; Content Management System
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white rounded-sm p-8 border border-[#D5D9E0] shadow-neu-card space-y-6">
          {/* Credentials Highlight Banner */}
          <div className="p-4 rounded bg-[#F1F2F5] border border-[#D5D9E0] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1A365D]">
              <KeyRound className="w-4 h-4 text-[#10B981]" />
              <span>Official Admin Access Credentials</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#2B3547]">
              <div>
                <span className="font-mono text-[#5F6B7D] block text-[10px] uppercase font-bold">Username / Email:</span>
                <code className="font-mono bg-white px-2 py-0.5 rounded border border-[#D5D9E0] text-[#1A365D] font-bold block mt-0.5">
                  admin
                </code>
                <span className="text-[10px] text-[#5F6B7D]">(or nodal.officer@iesce.info)</span>
              </div>
              <div>
                <span className="font-mono text-[#5F6B7D] block text-[10px] uppercase font-bold">Password:</span>
                <code className="font-mono bg-white px-2 py-0.5 rounded border border-[#D5D9E0] text-[#10B981] font-bold block mt-0.5">
                  admin123
                </code>
                <span className="text-[10px] text-[#5F6B7D]">(or any password)</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-[#1A365D] uppercase tracking-wider text-[11px]">
                Administrative Username / Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin or nodal.officer@iesce.info"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#F8F9FA] border border-[#D5D9E0] rounded text-xs text-[#1A2232] shadow-neu-inset focus:outline-none focus:border-[#1A365D] font-medium"
                />
                <User className="w-4 h-4 text-[#5F6B7D] absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#1A365D] uppercase tracking-wider text-[11px]">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#F8F9FA] border border-[#D5D9E0] rounded text-xs text-[#1A2232] shadow-neu-inset focus:outline-none focus:border-[#1A365D] font-medium"
                />
                <Lock className="w-4 h-4 text-[#5F6B7D] absolute left-3 top-3" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-sm bg-[#1A365D] hover:bg-[#1A2232] text-white shadow-neu-button text-xs font-semibold uppercase tracking-wider transition-all duration-150 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#10B981]" />
                <span>{loading ? 'Authenticating...' : 'Authenticate & Enter CMS Console'}</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Access Triggers */}
          <div className="pt-4 border-t border-[#D5D9E0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#5F6B7D] uppercase tracking-wider font-mono">
                Instant 1-Click Role Logins:
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] font-bold border border-[#10B981]/20">
                4 Roles Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('nodal.officer@iesce.info')}
                className="p-3 rounded bg-[#F1F2F5] border border-[#D5D9E0] text-left hover:border-[#1A365D] transition-colors cursor-pointer"
              >
                <p className="font-bold text-xs text-[#1A365D]">Super Admin (Nodal Officer)</p>
                <p className="text-[10px] text-[#5F6B7D] truncate font-mono">nodal.officer@iesce.info</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('content.iedc@iesce.info')}
                className="p-3 rounded bg-[#F1F2F5] border border-[#D5D9E0] text-left hover:border-[#1A365D] transition-colors cursor-pointer"
              >
                <p className="font-bold text-xs text-[#1A365D]">Content Admin</p>
                <p className="text-[10px] text-[#5F6B7D] truncate font-mono">content.iedc@iesce.info</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('team.iedc@iesce.info')}
                className="p-3 rounded bg-[#F1F2F5] border border-[#D5D9E0] text-left hover:border-[#1A365D] transition-colors cursor-pointer"
              >
                <p className="font-bold text-xs text-[#1A365D]">Team Admin</p>
                <p className="text-[10px] text-[#5F6B7D] truncate font-mono">team.iedc@iesce.info</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('achievements.iedc@iesce.info')}
                className="p-3 rounded bg-[#F1F2F5] border border-[#D5D9E0] text-left hover:border-[#1A365D] transition-colors cursor-pointer"
              >
                <p className="font-bold text-xs text-[#1A365D]">Achievement Admin</p>
                <p className="text-[10px] text-[#5F6B7D] truncate font-mono">achievements.iedc@iesce.info</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
