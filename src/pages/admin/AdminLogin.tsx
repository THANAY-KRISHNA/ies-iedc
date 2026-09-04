import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Lock, Mail } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your administrator email.');
      return;
    }
    setError(null);
    setLoading(true);
    const success = await login(email);
    setLoading(false);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid credentials or unauthorized administrative account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#242424] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#777777] hover:text-[#161616] mb-2 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Website</span>
        </Link>

        <div className="w-14 h-14 mx-auto rounded bg-[#161616] text-white flex items-center justify-center font-extrabold text-xl tracking-wider">
          IEDC
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[#161616] tracking-tight">IES IEDC</h1>
          <h2 className="text-sm font-semibold text-[#4A4A4A] mt-0.5">Content Management System</h2>
        </div>

        <p className="text-xs text-[#777777] max-w-sm mx-auto">
          Manage website content, events, gallery, team information and announcements.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FFFFFF] rounded border border-[#D8D8D3] p-8 shadow-xs space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#242424] block">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@iesce.info"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616] transition-colors"
                />
                <Mail className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#242424] block">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616] transition-colors"
                />
                <Lock className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded bg-[#161616] hover:bg-[#242424] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
