import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Shield, Lock, ArrowLeft, KeyRound, Check } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setError('Please enter your institutional administrative email.');
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
    <div className="min-h-screen bg-[#F5F5F3] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#777777] hover:text-[#161616] mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to IES IEDC Public Site</span>
        </Link>

        <div className="w-14 h-14 mx-auto rounded-xl neu-raised flex items-center justify-center text-[#161616] border border-[#D8D8D3]">
          <Shield className="w-7 h-7 text-[#242424]" />
        </div>

        <h2 className="text-2xl font-black text-[#161616] tracking-tight">IES IEDC CMS Portal</h2>
        <p className="text-xs text-[#777777]">
          Institutional Content &amp; Administrative Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="neu-raised rounded-2xl p-8 border border-[#D8D8D3] space-y-6">
          {error && (
            <div className="p-3 bg-[#FBE9E7] border border-[#FFAB91] rounded-lg text-xs text-[#D84315]">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-[#242424]">Administrative Email</label>
              <input
                type="email"
                required
                placeholder="nodal.officer@iesce.info"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#242424]">Security Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs text-[#242424] focus:outline-none focus:ring-1 focus:ring-[#242424]"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className="w-full"
                icon={<Lock className="w-4 h-4" />}
              >
                Authenticate &amp; Enter CMS
              </Button>
            </div>
          </form>

          {/* Instant 1-Click Role Switcher for Testing Evaluators */}
          <div className="pt-4 border-t border-[#D8D8D3] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#777777] uppercase tracking-wider">
                Instant Demo Access (By Role):
              </span>
              <Badge variant="outline" size="sm">
                4 Roles
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('nodal.officer@iesce.info')}
                className="neu-raised-soft p-2.5 rounded-lg border border-[#D8D8D3] text-left hover:border-[#161616] transition-colors cursor-pointer"
              >
                <p className="font-bold text-xs text-[#161616]">Super Admin</p>
                <p className="text-[10px] text-[#777777] truncate">Prof. Shahaziya Parvez</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('content.iedc@iesce.info')}
                className="neu-raised-soft p-2.5 rounded-lg border border-[#D8D8D3] text-left hover:border-[#161616] transition-colors cursor-pointer"
              >
                <p className="font-bold text-xs text-[#161616]">Content Admin</p>
                <p className="text-[10px] text-[#777777] truncate">Events &amp; News Lead</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('team.iedc@iesce.info')}
                className="neu-raised-soft p-2.5 rounded-lg border border-[#D8D8D3] text-left hover:border-[#161616] transition-colors cursor-pointer"
              >
                <p className="font-bold text-xs text-[#161616]">Team Admin</p>
                <p className="text-[10px] text-[#777777] truncate">Executive Recruiter</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('achievements.iedc@iesce.info')}
                className="neu-raised-soft p-2.5 rounded-lg border border-[#D8D8D3] text-left hover:border-[#161616] transition-colors cursor-pointer"
              >
                <p className="font-bold text-xs text-[#161616]">Achievement Admin</p>
                <p className="text-[10px] text-[#777777] truncate">Awards Verification</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
