import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Award,
  Sparkles,
  Layers,
  Inbox,
  Settings,
  History,
  LogOut,
  Shield,
  Home,
  Menu,
  X,
  Lock,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../../types';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout, switchRoleUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Team Management', path: '/admin/team', icon: <Users className="w-4 h-4" /> },
    { label: 'Events & Bootcamps', path: '/admin/events', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Achievements', path: '/admin/achievements', icon: <Award className="w-4 h-4" /> },
    { label: 'Student Ideas', path: '/admin/ideas', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Content Management', path: '/admin/content', icon: <Layers className="w-4 h-4" /> },
    { label: 'Join Submissions', path: '/admin/submissions', icon: <Inbox className="w-4 h-4" /> },
    { label: 'Audit Logs', path: '/admin/logs', icon: <History className="w-4 h-4" /> },
    { label: 'Site Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A2232] flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop */}
      <aside className="w-64 shrink-0 bg-[#F1F2F5] border-r border-[#D5D9E0] hidden md:flex flex-col justify-between p-4 shadow-sm">
        <div className="space-y-6">
          {/* Header & Logo */}
          <div className="px-2 pt-2">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-md bg-[#000000] border border-[#D5D9E0] flex items-center justify-center p-1 shadow-neu-button shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGky_twkb-r-fjGH7KFGWD67wikfcOAlvhh9O37tDCkEZpKPz344DIDOO7lXK3JHX-vfoZW4DwyCVUwlYLOfDH8QMzwWP7J93sn9AhqZNVnKxcQavbgtdTv-tumANwqlGEVttorxIZXy36OgyRLIK54b8tteqSIV3l6JwZp9VgVD0bsBeixtAS1ab7LMR2ZJw_zkJPocySdohgwCiSGrHbGoC0Kk1jX9B1usMagjUZpZWLc69Qjs3Z2EzNnqMHp0ceCkE"
                  alt="IES IEDC Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-[#1A365D] leading-tight tracking-tight font-display">
                  IES IEDC CMS
                </h2>
                <p className="text-[10px] text-[#10B981] font-bold uppercase tracking-wider">
                  Nodal Secretariat
                </p>
              </div>
            </Link>
          </div>

          {/* User & Role Badge */}
          <div className="bg-white p-4 rounded-sm border border-[#D5D9E0] shadow-neu-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="truncate">
                <p className="text-xs font-bold text-[#1A365D] truncate">
                  {user?.name || 'Prof. Shahaziya Parvez'}
                </p>
                <p className="text-[10px] text-[#5F6B7D] truncate">{user?.email || 'nodal.officer@iesce.info'}</p>
              </div>
              <Shield className="w-4 h-4 text-[#10B981] shrink-0" />
            </div>

            <div className="flex items-center justify-between text-[11px] bg-[#F1F2F5] px-2.5 py-1.5 rounded border border-[#D5D9E0]">
              <span className="text-[10px] uppercase font-bold text-[#5F6B7D]">Active Role:</span>
              <span className="font-bold text-[#1A365D]">{user?.role || 'Super Admin'}</span>
            </div>

            {/* Quick Testing Role Switcher */}
            <div className="pt-2 border-t border-[#D5D9E0]/60">
              <label className="text-[9px] font-bold uppercase tracking-wider text-[#5F6B7D] block mb-1 font-mono">
                Switch Role Privilege:
              </label>
              <select
                value={user?.role || 'Super Admin'}
                onChange={e => switchRoleUser(e.target.value as UserRole)}
                className="w-full text-xs bg-[#F8F9FA] border border-[#D5D9E0] rounded px-2 py-1.5 text-[#1A2232] focus:outline-none cursor-pointer font-medium"
              >
                <option value="Super Admin">Super Admin (All Permissions)</option>
                <option value="Content Admin">Content Admin (Events &amp; News)</option>
                <option value="Team Admin">Team Admin (Roster &amp; Years)</option>
                <option value="Achievement Admin">Achievement Admin</option>
              </select>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-semibold transition-all ${
                  isActive(item.path)
                    ? 'bg-[#1A365D] text-white shadow-neu-button font-bold'
                    : 'text-[#2B3547] hover:text-[#1A365D] hover:bg-white border border-transparent hover:border-[#D5D9E0]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {isActive(item.path) && <ChevronRight className="w-3.5 h-3.5 text-[#10B981]" />}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Actions & Statutory Watermark */}
        <div className="space-y-3 pt-4 border-t border-[#D5D9E0]">
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#5F6B7D] hover:text-[#1A365D] rounded hover:bg-white transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Public Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          <div className="text-center pt-2 text-[9px] uppercase tracking-widest font-mono text-[#5F6B7D]">
            APJ KTU &amp; KSUM NODE // 2026
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#1A365D] text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-black flex items-center justify-center p-1 border border-[#D5D9E0]/40">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGky_twkb-r-fjGH7KFGWD67wikfcOAlvhh9O37tDCkEZpKPz344DIDOO7lXK3JHX-vfoZW4DwyCVUwlYLOfDH8QMzwWP7J93sn9AhqZNVnKxcQavbgtdTv-tumANwqlGEVttorxIZXy36OgyRLIK54b8tteqSIV3l6JwZp9VgVD0bsBeixtAS1ab7LMR2ZJw_zkJPocySdohgwCiSGrHbGoC0Kk1jX9B1usMagjUZpZWLc69Qjs3Z2EzNnqMHp0ceCkE"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-none font-display">IES IEDC CMS</h2>
            <span className="text-[10px] text-[#10B981] font-mono">{user?.role || 'Super Admin'}</span>
          </div>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 rounded bg-white/10 text-white cursor-pointer"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden bg-[#F1F2F5] border-b border-[#D5D9E0] p-4 space-y-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileNavOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold ${
                isActive(item.path) ? 'bg-[#1A365D] text-white font-bold' : 'text-[#2B3547]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="pt-3 border-t border-[#D5D9E0] flex justify-between items-center text-xs">
            <Link to="/" className="font-semibold text-[#1A365D]">
              Public Website
            </Link>
            <button onClick={handleLogout} className="font-semibold text-red-700">
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-10 max-w-[1700px] overflow-y-auto">{children}</main>
    </div>
  );
};
