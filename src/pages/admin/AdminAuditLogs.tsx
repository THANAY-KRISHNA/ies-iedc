import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { SearchFilterBar } from '../../components/ui/SearchFilterBar';
import { LoadingState } from '../../components/ui/LoadingState';
import { api } from '../../services/api';
import { ActivityLog } from '../../types';
import { History, Shield, Clock } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = logs.filter(l => {
    return (
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.contentSummary.toLowerCase().includes(search.toLowerCase()) ||
      l.contentType.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[#D8D8D3]">
        <h1 className="text-2xl font-black text-[#161616] tracking-tight">
          System Activity &amp; Audit Logs
        </h1>
        <p className="text-xs text-[#777777] mt-1">
          Immutable institutional audit trail tracking every administrative creation, modification, and deletion.
        </p>
      </div>

      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter audit records by administrator, action, or content..."
      />

      {loading ? (
        <LoadingState message="Loading immutable audit trail..." />
      ) : (
        <div className="neu-raised rounded-xl overflow-hidden border border-[#D8D8D3]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#D8D8D3] bg-[#EBEBE8]/50 text-[#777777] uppercase tracking-wider text-[10px]">
                  <th className="p-3.5 font-bold">Timestamp</th>
                  <th className="p-3.5 font-bold">Administrator</th>
                  <th className="p-3.5 font-bold">Role</th>
                  <th className="p-3.5 font-bold">Action</th>
                  <th className="p-3.5 font-bold">Entity Type</th>
                  <th className="p-3.5 font-bold">Action Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBE8]">
                {filtered.map(log => (
                  <tr key={log.id} className="hover:bg-[#EBEBE8]/20 transition-colors">
                    <td className="p-3.5 text-[#777777] whitespace-nowrap font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3.5 font-bold text-[#161616]">{log.userName}</td>
                    <td className="p-3.5">
                      <Badge variant="outline" size="sm">
                        {log.userRole}
                      </Badge>
                    </td>
                    <td className="p-3.5">
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
                    </td>
                    <td className="p-3.5 font-medium text-[#242424]">{log.contentType}</td>
                    <td className="p-3.5 text-[#4A4A4A] max-w-md">{log.contentSummary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
