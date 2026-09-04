import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Home,
  Calendar,
  Image as ImageIcon,
  Newspaper,
  Users,
  Award,
  BookOpen,
  Sparkles,
  Rocket,
  FolderDown,
  FolderOpen,
  UserCheck,
  Settings,
  ExternalLink,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { UserRole } from '../../types';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout, switchRoleUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const contentNav = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Homepage', path: '/admin/homepage', icon: <Home className="w-4 h-4" /> },
    { label: 'Events', path: '/admin/events', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Gallery', path: '/admin/gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { label: 'Posters & Flyers', path: '/admin/posters', icon: <FolderOpen className="w-4 h-4" /> },
    { label: 'News', path: '/admin/news', icon: <Newspaper className="w-4 h-4" /> },
    { label: 'Team', path: '/admin/team', icon: <Users className="w-4 h-4" /> },
    { label: 'Achievements', path: '/admin/achievements', icon: <Award className="w-4 h-4" /> },
    { label: 'Workshops', path: '/admin/workshops', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Student Ideas', path: '/admin/ideas', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Startups', path: '/admin/startups', icon: <Rocket className="w-4 h-4" /> },
    { label: 'Resources', path: '/admin/resources', icon: <FolderDown className="w-4 h-4" /> },
    { label: 'Media Library', path: '/admin/media', icon: <FolderOpen className="w-4 h-4" /> },
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
    <div className="min-h-screen bg-[#F5F5F3] text-[#242424] flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 bg-[#FFFFFF] border-b border-[#D8D8D3] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="md:hidden p-2 text-[#4A4A4A] hover:text-[#161616] hover:bg-[#F0F0ED] rounded cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#161616] text-[#FFFFFF] font-extrabold text-sm flex items-center justify-center tracking-wider">
              IEDC
            </div>
            <div>
              <h1 className="text-base font-bold text-[#161616] tracking-tight leading-none">
                IES IEDC CMS
              </h1>
              <span className="text-[11px] text-[#777777] font-medium">Content Management System</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#4A4A4A] hover:text-[#161616] bg-[#F0F0ED] hover:bg-[#EBEBE8] border border-[#D8D8D3] rounded transition-colors"
          >
            <span>View Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* User Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F0F0ED] border border-[#D8D8D3] rounded cursor-pointer transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#242424] text-white flex items-center justify-center font-semibold text-xs">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-[#161616] leading-tight truncate max-w-[130px]">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-[#777777] truncate">{user?.role || 'Super Admin'}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#777777]" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] border border-[#D8D8D3] rounded shadow-md py-1 z-40">
                <div className="px-3 py-2 border-b border-[#EBEBE8]">
                  <p className="text-xs font-bold text-[#161616]">{user?.name || 'Administrator'}</p>
                  <p className="text-[11px] text-[#777777] truncate">{user?.email || 'admin@iesce.info'}</p>
                </div>

                <div className="px-3 py-2 border-b border-[#EBEBE8]">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#777777] block mb-1">
                    Role Privileges:
                  </label>
                  <select
                    value={user?.role || 'Super Admin'}
                    onChange={e => {
                      switchRoleUser(e.target.value as UserRole);
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-xs bg-[#F0F0ED] border border-[#D8D8D3] rounded px-2 py-1 text-[#242424] cursor-pointer"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Content Admin">Content Admin</option>
                    <option value="Team Admin">Team Admin</option>
                    <option value="Achievement Admin">Achievement Admin</option>
                  </select>
                </div>

                <Link
                  to="/admin/users"
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full text-left px-3 py-2 text-xs text-[#242424] hover:bg-[#F0F0ED] flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-[#777777]" />
                  <span>My Profile & Users</span>
                </Link>

                <Link
                  to="/admin/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full text-left px-3 py-2 text-xs text-[#242424] hover:bg-[#F0F0ED] flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-[#777777]" />
                  <span>Site Settings</span>
                </Link>

                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-[#EBEBE8] cursor-pointer font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Area: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="w-64 shrink-0 bg-[#FFFFFF] border-r border-[#D8D8D3] hidden md:flex flex-col justify-between p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* CONTENT Section */}
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-2">
                Content
              </p>
              <nav className="space-y-0.5">
                {contentNav.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold transition-all ${
                      isActive(item.path)
                        ? 'bg-[#242424] text-[#FFFFFF] shadow-xs'
                        : 'text-[#4A4A4A] hover:text-[#161616] hover:bg-[#F0F0ED]'
                    }`}
                  >
                    <span className={isActive(item.path) ? 'text-white' : 'text-[#777777]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* WEBSITE Section */}
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-2">
                Website
              </p>
              <nav className="space-y-0.5">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold text-[#4A4A4A] hover:text-[#161616] hover:bg-[#F0F0ED]"
                >
                  <ExternalLink className="w-4 h-4 text-[#777777]" />
                  <span>View Website</span>
                </a>
              </nav>
            </div>

            {/* ACCOUNT Section */}
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-2">
                Account
              </p>
              <nav className="space-y-0.5">
                <Link
                  to="/admin/users"
                  className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold transition-all ${
                    isActive('/admin/users')
                      ? 'bg-[#242424] text-[#FFFFFF]'
                      : 'text-[#4A4A4A] hover:text-[#161616] hover:bg-[#F0F0ED]'
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-[#777777]" />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileDrawerOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/40 flex">
            <div className="w-72 bg-[#FFFFFF] h-full p-4 flex flex-col justify-between overflow-y-auto shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#EBEBE8] pb-3">
                  <span className="font-bold text-sm text-[#161616]">IES IEDC CMS</span>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 text-[#777777] hover:text-[#161616]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-2">
                    Content
                  </p>
                  <nav className="space-y-1">
                    {contentNav.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold ${
                          isActive(item.path)
                            ? 'bg-[#242424] text-[#FFFFFF]'
                            : 'text-[#4A4A4A] hover:bg-[#F0F0ED]'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="pt-4 border-t border-[#EBEBE8]">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-2">
                    Account
                  </p>
                  <nav className="space-y-1">
                    <a
                      href="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#4A4A4A]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Website</span>
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-[1600px] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
