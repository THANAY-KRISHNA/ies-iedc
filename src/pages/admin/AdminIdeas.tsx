import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { SearchFilterBar } from '../../components/ui/SearchFilterBar';
import { LoadingState } from '../../components/ui/LoadingState';
import { api } from '../../services/api';
import { StudentIdea } from '../../types';
import { Sparkles, Edit2, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';

export const AdminIdeas: React.FC = () => {
  const [ideas, setIdeas] = useState<StudentIdea[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Review Modal
  const [selectedIdea, setSelectedIdea] = useState<StudentIdea | null>(null);
  const [status, setStatus] = useState<StudentIdea['status']>('New');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadIdeas();
  }, []);

  async function loadIdeas() {
    setLoading(true);
    try {
      const data = await api.adminGetIdeas();
      setIdeas(data);
    } catch (err) {
      console.error('Failed to load ideas:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenReview = (idea: StudentIdea) => {
    setSelectedIdea(idea);
    setStatus(idea.status);
    setAdminNotes(idea.adminNotes || '');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIdea) return;
    try {
      await api.adminUpdateIdeaStatus(selectedIdea.id, { status, adminNotes });
      setSelectedIdea(null);
      loadIdeas();
    } catch (err) {
      console.error('Failed to update idea status:', err);
    }
  };

  const filteredIdeas = ideas.filter(i => {
    return (
      i.projectName.toLowerCase().includes(search.toLowerCase()) ||
      i.studentName.toLowerCase().includes(search.toLowerCase()) ||
      i.department.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D8D8D3]">
        <div>
          <h1 className="text-2xl font-black text-[#161616] tracking-tight">
            Student Innovation &amp; Idea Cell
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            Review student project pitches, allocate faculty mentors, and promote to KSUM incubation.
          </p>
        </div>
      </div>

      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search proposals by student name, project title, or department..."
      />

      {loading ? (
        <LoadingState message="Loading submitted student proposals..." />
      ) : (
        <div className="neu-raised rounded-xl overflow-hidden border border-[#D8D8D3]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#D8D8D3] bg-[#EBEBE8]/50 text-[#777777] uppercase tracking-wider text-[10px]">
                  <th className="p-3.5 font-bold">Project Name</th>
                  <th className="p-3.5 font-bold">Innovator / Dept</th>
                  <th className="p-3.5 font-bold">Technology</th>
                  <th className="p-3.5 font-bold">Submitted Date</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBE8]">
                {filteredIdeas.map(idea => (
                  <tr key={idea.id} className="hover:bg-[#EBEBE8]/20 transition-colors">
                    <td className="p-3.5 font-bold text-[#161616] max-w-xs">{idea.projectName}</td>
                    <td className="p-3.5">
                      <span className="font-semibold text-[#242424] block">{idea.studentName}</span>
                      <span className="text-[10px] text-[#777777]">
                        {idea.department} • {idea.studentEmail || 'No email'}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#4A4A4A]">{idea.technology || '—'}</td>
                    <td className="p-3.5 text-[#777777]">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={
                          idea.status === 'Accepted' || idea.status === 'Developing'
                            ? 'success'
                            : idea.status === 'Under Review'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {idea.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenReview(idea)}
                        icon={<Edit2 className="w-3.5 h-3.5" />}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={!!selectedIdea}
        onClose={() => setSelectedIdea(null)}
        title={selectedIdea?.projectName}
        subtitle={`Submitted by ${selectedIdea?.studentName} (${selectedIdea?.department})`}
        maxWidth="2xl"
      >
        {selectedIdea && (
          <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
            <div className="space-y-2 p-3 bg-[#EBEBE8] rounded-xl border border-[#D8D8D3]">
              <div>
                <strong className="text-[#161616] block">Problem Statement:</strong>
                <p className="text-[#4A4A4A] mt-0.5">{selectedIdea.problem}</p>
              </div>
              <div>
                <strong className="text-[#161616] block">Proposed Solution:</strong>
                <p className="text-[#4A4A4A] mt-0.5">{selectedIdea.proposedSolution}</p>
              </div>
              {selectedIdea.studentPhone && (
                <p className="text-[11px] text-[#777777]">
                  Contact Phone: <strong>{selectedIdea.studentPhone}</strong>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Incubation Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as StudentIdea['status'])}
                  className="w-full px-3 py-2 neu-raised-soft border border-[#D8D8D3] rounded-lg text-xs"
                >
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Developing">Developing (Public Showcase)</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#242424]">Public Showcase Notice</label>
                <p className="text-[11px] text-[#777777] pt-2">
                  Status 'Accepted' or 'Developing' will feature this project in the Student
                  Incubator showcase.
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Mentor / Administrative Feedback</label>
              <textarea
                rows={3}
                placeholder="Notes on screening, assigned faculty guide, or next steps..."
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedIdea(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Evaluation
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
