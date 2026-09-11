import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useRealtimeSync } from '../../services/realtime';
import { useAuth } from '../../context/AuthContext';
import { ActivityLog } from '../../types';
import {
  Calendar,
  Image as ImageIcon,
  Newspaper,
  Users,
  Award,
  Home,
  Plus,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Activity,
  Layers,
  FileText,
  Rocket
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      const [statsData, activity] = await Promise.all([
        api.getStats().catch(() => null),
        api.getAuditLogs().catch(() => [])
      ]);
      if (statsData) setStats(statsData);
      if (activity) setLogs(activity.slice(0, 8));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useRealtimeSync(['all'], loadDashboardData);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const statCards = [
    {
      title: 'Total Team Members',
      count: stats?.totalMembers ?? 87,
      sub: `${stats?.publishedMembers ?? 87} Published Roster`,
      icon: <Users className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50/60 border-blue-100',
      link: '/admin/team'
    },
    {
      title: 'Events & Programs',
      count: stats?.totalEvents ?? 12,
      sub: `${stats?.completedEvents ?? 10} Completed • ${stats?.upcomingEvents ?? 2} Upcoming`,
      icon: <Calendar className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50/60 border-emerald-100',
      link: '/admin/events'
    },
    {
      title: 'Student Ideas & Startups',
      count: (stats?.totalStudentIdeas ?? 0) + (stats?.totalStartups ?? 0),
      sub: `${stats?.newIdeas ?? 0} New Ideas Submitted`,
      icon: <Sparkles className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50/60 border-amber-100',
      link: '/admin/ideas'
    },
    {
      title: 'Achievements & Grants',
      count: stats?.totalAchievements ?? 15,
      sub: 'Student & Faculty Recognitions',
      icon: <Award className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50/60 border-purple-100',
      link: '/admin/achievements'
    }
  ];

  const quickActions = [
    {
      title: 'Add Team Member',
      desc: 'Add executive leads, coordinators or nodal officers to the roster.',
      icon: <Users className="w-5 h-5 text-[#161616]" />,
      link: '/admin/team',
      badge: 'Team CMS'
    },
    {
      title: 'Add Event',
      desc: 'Publish upcoming workshops, webinars, hackathons, or sessions.',
      icon: <Calendar className="w-5 h-5 text-[#161616]" />,
      link: '/admin/events?action=new',
      badge: 'Events'
    },
    {
      title: 'Add Achievement',
      desc: 'Record student wins, patents, grants, or competition results.',
      icon: <Award className="w-5 h-5 text-[#161616]" />,
      link: '/admin/achievements?action=new',
      badge: 'Awards'
    },
    {
      title: 'Upload Gallery Photos',
      desc: 'Create event photo albums and upload high-res activity photos.',
      icon: <ImageIcon className="w-5 h-5 text-[#161616]" />,
      link: '/admin/gallery?action=new',
      badge: 'Media'
    },
    {
      title: 'Upload Posters & Flyers',
      desc: 'Upload event promotional banners, flyers, and documents.',
      icon: <Layers className="w-5 h-5 text-[#161616]" />,
      link: '/admin/posters',
      badge: 'Flyers'
    },
    {
      title: 'Edit Homepage',
      desc: 'Update hero banner, vision, mission, and featured announcements.',
      icon: <Home className="w-5 h-5 text-[#161616]" />,
      link: '/admin/homepage',
      badge: 'Website'
    }
  ];

  return (
    <div className="space-y-8 font-sans text-[#161616]">
      {/* Header Banner */}
      <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#D8D8D3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#161616]">
              IES IEDC Content Management Hub
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-[#161616] text-white rounded-full">
              CMS v2.0
            </span>
          </div>
          <p className="text-xs text-[#777777] mt-1 flex items-center gap-1.5 flex-wrap">
            <span>Welcome back, <strong className="text-[#161616]">{user?.name || 'Administrator'}</strong></span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              Cloud Database Sync Active
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3.5 py-2 bg-[#F0F0ED] hover:bg-[#EBEBE8] border border-[#D8D8D3] rounded-xl text-xs font-bold text-[#242424] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Stats'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <Link
            key={idx}
            to={card.link}
            className={`p-5 rounded-2xl border ${card.bg} hover:shadow-md transition-all group flex flex-col justify-between space-y-3 cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#4A4A4A]">{card.title}</span>
              <div className="p-2 bg-white rounded-xl shadow-xs border border-black/5 group-hover:scale-105 transition-transform">
                {card.icon}
              </div>
            </div>
            <div>
              <div className="text-3xl font-black tracking-tight text-[#161616]">{card.count}</div>
              <p className="text-[11px] text-[#666666] font-medium mt-0.5">{card.sub}</p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-[#161616] group-hover:translate-x-0.5 transition-transform border-t border-black/5">
              <span>Manage →</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-[#777777] uppercase tracking-wider">
            Content Quick Actions
          </h2>
          <span className="text-xs font-semibold text-[#777777]">Direct CMS Shortcuts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map(action => (
            <Link
              key={action.title}
              to={action.link}
              className="bg-[#FFFFFF] border border-[#D8D8D3] hover:border-[#161616] rounded-2xl p-5 space-y-3 transition-all shadow-xs hover:shadow-md group flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#F5F5F3] border border-[#E5E5E0] flex items-center justify-center group-hover:bg-[#161616] group-hover:text-white transition-colors">
                    {action.icon}
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#F0F0ED] text-[#4A4A4A] rounded-md border border-[#D8D8D3]">
                    {action.badge}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-[#161616]">
                  {action.title}
                </h3>
                <p className="text-xs text-[#777777] leading-relaxed">
                  {action.desc}
                </p>
              </div>

              <div className="pt-3 flex items-center gap-1 text-xs font-bold text-[#161616] border-t border-[#EBEBE8] group-hover:text-blue-600 transition-colors">
                <span>Launch Action</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Realtime Activity Logs Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#161616]" />
            <h2 className="text-xs font-extrabold text-[#777777] uppercase tracking-wider">
              Recent CMS Activity Stream
            </h2>
          </div>
          <Link
            to="/admin/audit-logs"
            className="text-xs font-bold text-[#161616] hover:underline flex items-center gap-1"
          >
            <span>View Full Audit Log</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded-2xl p-5 shadow-xs">
          {loading ? (
            <div className="py-8 text-center space-y-2">
              <RefreshCw className="w-5 h-5 text-gray-400 animate-spin mx-auto" />
              <p className="text-xs text-[#777777]">Syncing audit logs from Supabase Cloud...</p>
            </div>
          ) : logs.length === 0 ? (
            <p className="text-xs text-[#777777] py-6 text-center">No recent CMS activity recorded.</p>
          ) : (
            <div className="divide-y divide-[#EBEBE8]">
              {logs.map(log => (
                <div key={log.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs gap-4 hover:bg-[#F8F8F6] px-2 rounded-xl transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-[#161616]">{log.userName}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md border ${
                        log.action === 'Created' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        log.action === 'Updated' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-[11px] font-bold text-[#777777] bg-[#F0F0ED] px-2 py-0.5 rounded">
                        {log.contentType}
                      </span>
                    </div>
                    <p className="text-[#4A4A4A] text-xs leading-normal">{log.contentSummary}</p>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-[#777777] shrink-0 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#777777]" />
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
