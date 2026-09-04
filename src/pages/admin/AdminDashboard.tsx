import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
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
  ArrowRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const activity = await api.getAuditLogs();
        setLogs(activity.slice(0, 10));
      } catch (err) {
        console.error('Failed to load recent updates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Add Event',
      desc: 'Publish upcoming workshop, webinar, hackathon or session.',
      icon: <Calendar className="w-5 h-5 text-[#242424]" />,
      link: '/admin/events?action=new',
      btnText: '+ Add Event'
    },
    {
      title: 'Upload Gallery Photos',
      desc: 'Create event album and bulk upload 20/30/50 photos.',
      icon: <ImageIcon className="w-5 h-5 text-[#242424]" />,
      link: '/admin/gallery?action=new',
      btnText: '+ Upload Gallery Photos'
    },
    {
      title: 'Upload Posters & Flyers',
      desc: 'Upload event posters, flyers, banners, and documents.',
      icon: <ImageIcon className="w-5 h-5 text-[#242424]" />,
      link: '/admin/posters',
      btnText: '+ Upload Posters & Flyers'
    },
    {
      title: 'Add Announcement',
      desc: 'Post latest news, call for ideas, or result notice.',
      icon: <Newspaper className="w-5 h-5 text-[#242424]" />,
      link: '/admin/news?action=new',
      btnText: '+ Add Announcement'
    },
    {
      title: 'Add Team Member',
      desc: 'Add executive lead, coordinator, or nodal officer.',
      icon: <Users className="w-5 h-5 text-[#242424]" />,
      link: '/admin/team?action=new',
      btnText: '+ Add Team Member'
    },
    {
      title: 'Add Achievement',
      desc: 'Record student win, patent, grant, or competition result.',
      icon: <Award className="w-5 h-5 text-[#242424]" />,
      link: '/admin/achievements?action=new',
      btnText: '+ Add Achievement'
    },
    {
      title: 'Edit Homepage',
      desc: 'Update hero text, vision, mission, and featured content.',
      icon: <Home className="w-5 h-5 text-[#242424]" />,
      link: '/admin/homepage',
      btnText: 'Edit Homepage'
    }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#161616] tracking-tight">
          IES IEDC Content Manager
        </h1>
        <p className="text-xs text-[#777777] mt-1">
          Manage and update your website content from one place.
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map(action => (
            <Link
              key={action.title}
              to={action.link}
              className="bg-[#FFFFFF] border border-[#D8D8D3] hover:border-[#161616] rounded p-5 space-y-3 transition-colors group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded bg-[#F0F0ED] flex items-center justify-center">
                  {action.icon}
                </div>
                <h3 className="font-bold text-sm text-[#161616] group-hover:text-black">
                  {action.title}
                </h3>
                <p className="text-xs text-[#777777] leading-relaxed">
                  {action.desc}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-[#161616] group-hover:underline">
                <span>{action.btnText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Updates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider">
            Recent Updates
          </h2>
          <span className="text-[11px] text-[#777777]">Real database updates</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-4 space-y-3">
          {loading ? (
            <p className="text-xs text-[#777777]">Loading updates...</p>
          ) : logs.length === 0 ? (
            <p className="text-xs text-[#777777] py-4 text-center">No recent updates.</p>
          ) : (
            <div className="divide-y divide-[#EBEBE8]">
              {logs.map(log => (
                <div key={log.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#161616]">{log.userName}</span>
                      <span className="px-1.5 py-0.5 bg-[#F0F0ED] text-[10px] text-[#4A4A4A] rounded font-medium">
                        {log.action}
                      </span>
                      <span className="text-[11px] text-[#777777] font-medium">
                        {log.contentType}
                      </span>
                    </div>
                    <p className="text-[#4A4A4A]">{log.contentSummary}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#777777] shrink-0 font-mono">
                    <Clock className="w-3 h-3 text-[#777777]" />
                    <span>{new Date(log.timestamp).toLocaleDateString()}</span>
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
