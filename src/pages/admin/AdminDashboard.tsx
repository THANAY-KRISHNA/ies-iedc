import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { api } from '../../services/api';
import { ActivityLog } from '../../types';
import {
  Calendar,
  Users,
  Award,
  Sparkles,
  Inbox,
  AlertCircle,
  Plus,
  History,
  ArrowRight,
  ShieldCheck,
  Building2,
  ExternalLink
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [st, lg] = await Promise.all([api.getStats(), api.getAuditLogs()]);
        setStats(st);
        setLogs(lg.slice(0, 8));
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingState message="Loading CMS analytics and audit logs..." />;
  }

  return (
    <div className="space-y-10">
      {/* 1. Welcome Banner */}
      <div className="neu-raised rounded-2xl p-6 sm:p-8 border border-[#D8D8D3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="dark" size="sm">
              {user?.role || 'Super Admin'}
            </Badge>
            <span className="text-xs text-[#777777]">Authenticated Session</span>
          </div>
          <h1 className="text-2xl font-black text-[#161616] tracking-tight">
            Welcome, {user?.name || 'Administrator'}
          </h1>
          <p className="text-xs text-[#777777]">
            IES IEDC Institutional Management System • IES College of Engineering
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="outline" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
              Live Website
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Discrepancy / Attention Callout if exists */}
      {stats?.needsReviewCount > 0 && (
        <div className="p-4 bg-[#FFF3E0] border border-[#F3C287] rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#8C4A00] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-[#8C4A00]">
            <p className="font-bold">
              {stats.needsReviewCount} Record Flagged for Administrative Reconciliation
            </p>
            <p className="leading-relaxed">
              Historical document discrepancy found (e.g. IEDC Camp date). You can review or reconcile this record under Events Management.
            </p>
            <Link
              to="/admin/events"
              className="inline-block font-semibold underline hover:text-[#5F3200] pt-1"
            >
              Open Events Manager →
            </Link>
          </div>
        </div>
      )}

      {/* 3. Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="neu-raised rounded-xl p-5 border border-[#D8D8D3] space-y-2">
          <div className="flex items-center justify-between text-[#777777]">
            <span className="text-xs font-semibold">Events &amp; Camps</span>
            <Calendar className="w-4 h-4 text-[#242424]" />
          </div>
          <p className="text-2xl font-black text-[#161616]">{stats?.eventsCount ?? 0}</p>
          <Link
            to="/admin/events"
            className="text-[11px] text-[#4A4A4A] hover:text-[#161616] font-medium flex items-center gap-1 pt-1"
          >
            <span>Manage Events</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="neu-raised rounded-xl p-5 border border-[#D8D8D3] space-y-2">
          <div className="flex items-center justify-between text-[#777777]">
            <span className="text-xs font-semibold">Team Members</span>
            <Users className="w-4 h-4 text-[#242424]" />
          </div>
          <p className="text-2xl font-black text-[#161616]">{stats?.teamMembersCount ?? 0}</p>
          <Link
            to="/admin/team"
            className="text-[11px] text-[#4A4A4A] hover:text-[#161616] font-medium flex items-center gap-1 pt-1"
          >
            <span>Manage Archives</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="neu-raised rounded-xl p-5 border border-[#D8D8D3] space-y-2">
          <div className="flex items-center justify-between text-[#777777]">
            <span className="text-xs font-semibold">Student Ideas</span>
            <Sparkles className="w-4 h-4 text-[#242424]" />
          </div>
          <p className="text-2xl font-black text-[#161616]">{stats?.ideasCount ?? 0}</p>
          <Link
            to="/admin/ideas"
            className="text-[11px] text-[#4A4A4A] hover:text-[#161616] font-medium flex items-center gap-1 pt-1"
          >
            <span>Review Ideas</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="neu-raised rounded-xl p-5 border border-[#D8D8D3] space-y-2">
          <div className="flex items-center justify-between text-[#777777]">
            <span className="text-xs font-semibold">Join Submissions</span>
            <Inbox className="w-4 h-4 text-[#242424]" />
          </div>
          <p className="text-2xl font-black text-[#161616]">{stats?.submissionsCount ?? 0}</p>
          <Link
            to="/admin/submissions"
            className="text-[11px] text-[#4A4A4A] hover:text-[#161616] font-medium flex items-center gap-1 pt-1"
          >
            <span>Review Applicants</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 4. Quick Actions */}
      <div className="neu-raised rounded-2xl p-6 border border-[#D8D8D3] space-y-4">
        <h3 className="text-sm font-bold text-[#161616]">Administrative Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/events?action=new">
            <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              Create Event
            </Button>
          </Link>
          <Link to="/admin/team?action=new">
            <Button variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              Add Team Member
            </Button>
          </Link>
          <Link to="/admin/achievements?action=new">
            <Button variant="outline" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              Add Achievement
            </Button>
          </Link>
          <Link to="/admin/content">
            <Button variant="outline" size="sm">
              Manage Content Tabs
            </Button>
          </Link>
        </div>
      </div>

      {/* 5. Recent System Audit Trail */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#242424]" />
            <h3 className="text-sm font-bold text-[#161616]">Live Audit Activity Trail</h3>
          </div>
          <Link
            to="/admin/logs"
            className="text-xs font-semibold text-[#4A4A4A] hover:text-[#161616] hover:underline"
          >
            View Full Audit Log
          </Link>
        </div>

        <div className="neu-raised rounded-xl overflow-hidden border border-[#D8D8D3] divide-y divide-[#EBEBE8]">
          {logs.map(log => (
            <div key={log.id} className="p-4 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#161616]">{log.userName}</span>
                  <Badge variant="outline" size="sm">
                    {log.userRole}
                  </Badge>
                  <Badge
                    variant={
                      log.action === 'Created'
                        ? 'success'
                        : log.action === 'Deleted'
                        ? 'neutral'
                        : 'dark'
                    }
                    size="sm"
                  >
                    {log.action}
                  </Badge>
                  <span className="text-[11px] text-[#777777] font-medium">
                    {log.contentType}
                  </span>
                </div>
                <p className="text-[#4A4A4A]">{log.contentSummary}</p>
              </div>

              <span className="text-[11px] text-[#777777] shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
