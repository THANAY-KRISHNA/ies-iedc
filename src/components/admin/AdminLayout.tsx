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
  FileText,
  Inbox,
  Settings,
  History,
  LogOut,
  Shield,
  Layers,
  Home,
  Menu,
  X
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
    { label: 'Audit Activity Logs', path: '/admin/logs', icon: <History className="w-4 h-4" /> },
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
    <div className="min-h-screen bg-[#F5F5F3] text-[#242424] flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="w-64 shrink-0 bg-[#EBEBE8] border-r border-[#D8D8D3] hidden md:flex flex-col justify-between p-4">
        <div className="space-y-6">
          {/* Header & Logo */}
          <div className="px-2 pt-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5F5F3] neu-raised flex items-center justify-center font-black text-xs text-[#242424] border border-[#D8D8D3]">
                IES
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-[#242424] leading-tight tracking-tight">Admin Console</h2>
                <p className="text-[10px] text-[#777777] font-bold uppercase tracking-wider">IES IEDC CMS</p>
              </div>
            </Link>
          </div>

          {/* User & Role Badge */}
          <div className="neu-raised-card p-4 rounded-2xl border border-[#D8D8D3] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="truncate">
                <p className="text-xs font-bold text-[#242424] truncate">
                  {user?.name || 'Authorized Admin'}
                </p>
                <p className="text-[10px] text-[#777777] truncate">{user?.email}</p>
              </div>
              <Shield className="w-4 h-4 text-[#242424] shrink-0" />
            </div>
            <Badge variant="dark" size="sm" className="w-full justify-center">
              {user?.role || 'Super Admin'}
            </Badge>

            {/* Quick Testing Role Switcher */}
            <div className="pt-2 border-t border-[#D8D8D3]">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#777777] block mb-1">
                Active Role Filter:
              </label>
              <select
                value={user?.role || 'Super Admin'}
                onChange={e => switchRoleUser(e.target.value as UserRole)}
                className="w-full text-xs bg-[#FFFFFF] border border-[#D8D8D3] rounded-lg px-2.5 py-1.5 text-[#242424] focus:outline-none cursor-pointer font-medium"
              >
                <option value="Super Admin">Super Admin (All Access)</option>
                <option value="Content Admin">Content Admin (Events, News)</option>
                <option value="Team Admin">Team Admin (Team, Years)</option>
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
                className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive(item.path)
                    ? 'neu-inset text-[#242424]'
                    : 'text-[#4A4A4A] hover:text-[#242424] hover:bg-[#E4E4DF]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Actions & Editorial Watermark */}
        <div className="space-y-3 pt-4 border-t border-[#D8D8D3]">
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#4A4A4A] hover:text-[#242424] rounded-xl hover:bg-[#E4E4DF] transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>View Public Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#772222] hover:bg-[#F2DFDF] rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          <div className="text-center pt-2 opacity-50 text-[9px] uppercase tracking-widest font-black text-[#777777]">
            IEDC ARCHIVE 2025 • CMS
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#EBEBE8] border-b border-[#D8D8D3] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg neu-raised flex items-center justify-center font-black text-xs text-[#161616]">
            IEDC
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#161616]">CMS Console</h2>
            <span className="text-[10px] text-[#777777]">{user?.role}</span>
          </div>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 neu-raised rounded-lg text-[#242424]"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden bg-[#EBEBE8] border-b border-[#D8D8D3] p-4 space-y-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileNavOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                isActive(item.path) ? 'neu-inset font-bold text-[#161616]' : 'text-[#4A4A4A]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="pt-2 border-t border-[#D8D8D3] flex justify-between">
            <Link to="/" className="text-xs font-semibold text-[#161616]">
              Public Website
            </Link>
            <button onClick={handleLogout} className="text-xs font-semibold text-red-700">
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
