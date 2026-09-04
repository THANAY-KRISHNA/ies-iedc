import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SearchFilterBar } from '../../components/ui/SearchFilterBar';
import { LoadingState } from '../../components/ui/LoadingState';
import { api } from '../../services/api';
import { JoinSubmission } from '../../types';
import { Inbox, Mail, Phone, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const AdminSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<JoinSubmission[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function loadSubmissions() {
    setLoading(true);
    try {
      const data = await api.adminGetSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (id: string, status: JoinSubmission['status']) => {
    try {
      await api.adminUpdateSubmissionStatus(id, status);
      loadSubmissions();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = submissions.filter(s => {
    return (
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#D8D8D3]">
        <h1 className="text-2xl font-black text-[#161616] tracking-tight">
          Student Membership Applications
        </h1>
        <p className="text-xs text-[#777777] mt-1">
          Review incoming student registrations for the 2025–26 academic cycle.
        </p>
      </div>

      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter applicants by student name, roll number, or department..."
      />

      {loading ? (
        <LoadingState message="Loading membership applications..." />
      ) : (
        <div className="neu-raised rounded-xl overflow-hidden border border-[#D8D8D3]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#D8D8D3] bg-[#EBEBE8]/50 text-[#777777] uppercase tracking-wider text-[10px]">
                  <th className="p-3.5 font-bold">Applicant Details</th>
                  <th className="p-3.5 font-bold">Dept &amp; Roll</th>
                  <th className="p-3.5 font-bold">Interests</th>
                  <th className="p-3.5 font-bold">Motivation</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBE8]">
                {filtered.map(sub => (
                  <tr key={sub.id} className="hover:bg-[#EBEBE8]/20 transition-colors">
                    <td className="p-3.5">
                      <strong className="text-[#161616] block">{sub.fullName}</strong>
                      <div className="text-[11px] text-[#777777] flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {sub.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {sub.phone}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 text-[#242424]">
                      <div>
                        {sub.department} ({sub.semester})
                      </div>
                      <span className="text-[10px] text-[#777777] font-mono">{sub.rollNumber}</span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {sub.interestAreas?.map((area, i) => (
                          <span
                            key={i}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-[#EBEBE8] text-[#242424] border border-[#D8D8D3]"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 text-[#4A4A4A] max-w-xs truncate text-[11px]">
                      {sub.whyJoin}
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          sub.status === 'Accepted'
                            ? 'success'
                            : sub.status === 'Rejected'
                            ? 'neutral'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {sub.status !== 'Accepted' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateStatus(sub.id, 'Accepted')}
                        >
                          Accept
                        </Button>
                      )}
                      {sub.status !== 'Rejected' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(sub.id, 'Rejected')}
                        >
                          Decline
                        </Button>
                      )}
                    </td>
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
