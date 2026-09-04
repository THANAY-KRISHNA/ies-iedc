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
  ExternalLink,
  CheckCircle2,
  FileText
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
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="bg-white rounded-sm p-6 sm:p-8 border border-[#D5D9E0] shadow-neu-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] font-mono font-bold uppercase border border-[#10B981]/20">
              {user?.role || 'Super Admin'}
            </span>
            <span className="text-xs text-[#5F6B7D] font-mono">• Authenticated Nodal Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A365D] tracking-tight font-display">
            Welcome, {user?.name || 'Prof. Shahaziya Parvez'}
          </h1>
          <p className="text-xs text-[#5F6B7D]">
            IES IEDC Institutional Management System • IES College of Engineering (Nodal Code: KL-TCR-IES-2016)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/">
            <button className="px-4 py-2 rounded-sm bg-[#F1F2F5] hover:bg-[#E9EBEF] border border-[#D5D9E0] text-xs font-semibold text-[#1A365D] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-neu-button">
              <span>View Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#10B981]" />
            </button>
          </Link>
        </div>
      </div>

      {/* Discrepancy Callout */}
      {stats?.needsReviewCount > 0 && (
        <div className="p-4 bg-[#FFF8E7] border border-[#F59E0B]/40 rounded-sm flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-[#1A2232]">
            <p className="font-bold text-[#1A365D]">
              {stats.needsReviewCount} Record Flagged for Statutory Audit Reconciliation
            </p>
            <p className="leading-relaxed text-[#5F6B7D]">
              Historical document inconsistency annotated: [Residential IEDC Innovation Camp - Date Inconsistency in Source Record].
            </p>
            <Link
              to="/admin/events"
              className="inline-block font-semibold text-[#1A365D] underline hover:text-[#10B981] pt-1"
            >
              Open Events Audit Manager →
            </Link>
          </div>
        </div>
      )}

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-sm p-5 border border-[#D5D9E0] shadow-neu-card space-y-2">
          <div className="flex items-center justify-between text-[#5F6B7D]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A365D]">Events &amp; Bootcamps</span>
            <Calendar className="w-4 h-4 text-[#10B981]" />
          </div>
          <p className="text-3xl font-extrabold text-[#1A365D] font-display">{stats?.eventsCount ?? 0}</p>
          <Link
            to="/admin/events"
            className="text-[11px] text-[#5F6B7D] hover:text-[#1A365D] font-medium flex items-center gap-1 pt-1"
          >
            <span>Manage Records</span>
            <ArrowRight className="w-3 h-3 text-[#10B981]" />
          </Link>
        </div>

        <div className="bg-white rounded-sm p-5 border border-[#D5D9E0] shadow-neu-card space-y-2">
          <div className="flex items-center justify-between text-[#5F6B7D]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A365D]">Accredited Team</span>
            <Users className="w-4 h-4 text-[#1A365D]" />
          </div>
          <p className="text-3xl font-extrabold text-[#1A365D] font-display">{stats?.teamMembersCount ?? 0}</p>
          <Link
            to="/admin/team"
            className="text-[11px] text-[#5F6B7D] hover:text-[#1A365D] font-medium flex items-center gap-1 pt-1"
          >
            <span>Manage Executive Roster</span>
            <ArrowRight className="w-3 h-3 text-[#10B981]" />
          </Link>
        </div>

        <div className="bg-white rounded-sm p-5 border border-[#D5D9E0] shadow-neu-card space-y-2">
          <div className="flex items-center justify-between text-[#5F6B7D]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A365D]">Student Proposals</span>
            <Sparkles className="w-4 h-4 text-[#FF6B35]" />
          </div>
          <p className="text-3xl font-extrabold text-[#1A365D] font-display">{stats?.ideasCount ?? 0}</p>
          <Link
            to="/admin/ideas"
            className="text-[11px] text-[#5F6B7D] hover:text-[#1A365D] font-medium flex items-center gap-1 pt-1"
          >
            <span>Review Intake Queue</span>
            <ArrowRight className="w-3 h-3 text-[#10B981]" />
          </Link>
        </div>

        <div className="bg-white rounded-sm p-5 border border-[#D5D9E0] shadow-neu-card space-y-2">
          <div className="flex items-center justify-between text-[#5F6B7D]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1A365D]">Join Submissions</span>
            <Inbox className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <p className="text-3xl font-extrabold text-[#1A365D] font-display">{stats?.submissionsCount ?? 0}</p>
          <Link
            to="/admin/submissions"
            className="text-[11px] text-[#5F6B7D] hover:text-[#1A365D] font-medium flex items-center gap-1 pt-1"
          >
            <span>Review Applicants</span>
            <ArrowRight className="w-3 h-3 text-[#10B981]" />
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-sm p-6 border border-[#D5D9E0] shadow-neu-card space-y-4">
        <h3 className="text-sm font-bold text-[#1A365D] uppercase tracking-wider font-display">
          Administrative Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/events?action=new">
            <button className="px-4 py-2 rounded-sm bg-[#1A365D] hover:bg-[#1A2232] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-neu-button cursor-pointer">
              <Plus className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Create Event Record</span>
            </button>
          </Link>
          <Link to="/admin/team?action=new">
            <button className="px-4 py-2 rounded-sm bg-[#F1F2F5] hover:bg-[#E9EBEF] border border-[#D5D9E0] text-[#1A365D] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-neu-button cursor-pointer">
              <Plus className="w-3.5 h-3.5 text-[#1A365D]" />
              <span>Add Team Member</span>
            </button>
          </Link>
          <Link to="/admin/achievements?action=new">
            <button className="px-4 py-2 rounded-sm bg-[#F1F2F5] hover:bg-[#E9EBEF] border border-[#D5D9E0] text-[#1A365D] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-neu-button cursor-pointer">
              <Plus className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>Add Achievement</span>
            </button>
          </Link>
          <Link to="/admin/content">
            <button className="px-4 py-2 rounded-sm bg-[#F1F2F5] hover:bg-[#E9EBEF] border border-[#D5D9E0] text-[#5F6B7D] hover:text-[#1A365D] text-xs font-semibold uppercase tracking-wider shadow-neu-button cursor-pointer">
              Manage Content Vault
            </button>
          </Link>
        </div>
      </div>

      {/* Audit Activity Trail */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#1A365D]" />
            <h3 className="text-sm font-bold text-[#1A365D] uppercase tracking-wider font-display">
              Live Audit Activity Trail
            </h3>
          </div>
          <Link
            to="/admin/logs"
            className="text-xs font-semibold text-[#5F6B7D] hover:text-[#1A365D] hover:underline"
          >
            View Full Audit Log →
          </Link>
        </div>

        <div className="bg-white rounded-sm overflow-hidden border border-[#D5D9E0] shadow-neu-card divide-y divide-[#D5D9E0]/60">
          {logs.map(log => (
            <div key={log.id} className="p-4 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1A365D]">{log.userName}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F2F5] border border-[#D5D9E0] font-mono text-[#5F6B7D]">
                    {log.userRole}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] font-mono font-bold">
                    {log.action}
                  </span>
                  <span className="text-[11px] text-[#5F6B7D] font-mono">
                    {log.contentType}
                  </span>
                </div>
                <p className="text-[#2B3547]">{log.contentSummary}</p>
              </div>

              <span className="text-[11px] font-mono text-[#5F6B7D] shrink-0">
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
