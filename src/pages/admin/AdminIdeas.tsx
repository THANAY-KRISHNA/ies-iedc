import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { StudentIdea } from '../../types';
import { Sparkles, Edit, Search, Lock, ShieldAlert } from 'lucide-react';

export const AdminIdeas: React.FC = () => {
  const [ideas, setIdeas] = useState<StudentIdea[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Review Modal
  const [selectedIdea, setSelectedIdea] = useState<StudentIdea | null>(null);
  const [status, setStatus] = useState<StudentIdea['status']>('New');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadIdeas();
  }, []);

  async function loadIdeas() {
    setLoading(true);
    try {
      const data = await api.adminGetIdeas();
      setIdeas(data);
    } catch (err) {
      console.error('Failed to load student ideas:', err);
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
    setSaving(true);
    try {
      await api.adminUpdateIdeaStatus(selectedIdea.id, { status, adminNotes });
      setSelectedIdea(null);
      loadIdeas();
    } catch (err) {
      console.error('Failed to update idea status:', err);
    } finally {
      setSaving(false);
    }
  };

  const filteredIdeas = ideas.filter(
    i =>
      i.projectName.toLowerCase().includes(search.toLowerCase()) ||
      i.studentName.toLowerCase().includes(search.toLowerCase()) ||
      i.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="pb-4 border-b border-[#D8D8D3]">
          <h1 className="text-2xl font-bold text-[#161616] tracking-tight">Student Ideas</h1>
          <p className="text-xs text-[#777777] mt-1">
            Review student project submissions, assign mentors, and track development.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search student ideas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#FFFFFF] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
          />
          <Search className="w-4 h-4 text-[#777777] absolute left-2.5 top-2" />
        </div>

        {/* Ideas Table */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#777777]">Loading student submissions...</div>
        ) : filteredIdeas.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-12 text-center text-xs text-[#777777]">
            No student ideas submitted yet.
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#D8D8D3] bg-[#F5F5F3] text-[#777777] font-semibold text-[11px]">
                    <th className="p-3.5">Student / Team</th>
                    <th className="p-3.5">Idea Name</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Submission Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBE8]">
                  {filteredIdeas.map(idea => (
                    <tr key={idea.id} className="hover:bg-[#F0F0ED]/50 transition-colors">
                      <td className="p-3.5">
                        <p className="font-bold text-[#161616]">{idea.studentName}</p>
                        <p className="text-[11px] text-[#777777]">{idea.studentEmail}</p>
                      </td>
                      <td className="p-3.5 font-bold text-[#161616] max-w-xs">{idea.projectName}</td>
                      <td className="p-3.5 text-[#4A4A4A]">{idea.department}</td>
                      <td className="p-3.5 text-[#777777]">
                        {new Date(idea.submittedAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            idea.status === 'Accepted' || idea.status === 'Developing'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : idea.status === 'Under Review'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-[#F0F0ED] text-[#4A4A4A] border border-[#D8D8D3]'
                          }`}
                        >
                          {idea.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleOpenReview(idea)}
                          className="px-3 py-1 bg-[#F0F0ED] hover:bg-[#EBEBE8] border border-[#D8D8D3] rounded text-xs font-semibold cursor-pointer"
                        >
                          Review &amp; Notes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {selectedIdea && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded border border-[#D8D8D3] w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#EBEBE8] pb-3">
                <div>
                  <h3 className="font-bold text-base text-[#161616]">{selectedIdea.projectName}</h3>
                  <p className="text-xs text-[#777777]">
                    Submitted by {selectedIdea.studentName} ({selectedIdea.department})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedIdea(null)}
                  className="text-xs text-[#777777] hover:text-[#161616] cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="space-y-4 text-xs text-[#242424]">
                <div className="p-3 bg-[#F5F5F3] border border-[#D8D8D3] rounded space-y-2">
                  <div>
                    <span className="font-bold text-[#161616] block">Problem Statement:</span>
                    <p className="text-[#4A4A4A] mt-0.5">{selectedIdea.problem}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#161616] block">Proposed Solution:</span>
                    <p className="text-[#4A4A4A] mt-0.5">{selectedIdea.proposedSolution}</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateStatus} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Status</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value as StudentIdea['status'])}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    >
                      <option value="New">New</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Developing">Developing</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* PRIVATE INTERNAL NOTES SECTION */}
                  <div className="space-y-1.5 p-3 bg-amber-50/60 border border-amber-200 rounded">
                    <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                      <Lock className="w-3.5 h-3.5" />
                      <span>PRIVATE INTERNAL NOTES (STRICTLY CONFIDENTIAL)</span>
                    </div>
                    <p className="text-[10px] text-amber-700">
                      These notes are for internal team use only and MUST NEVER APPEAR on the public website.
                    </p>
                    <textarea
                      rows={3}
                      placeholder="Add confidential evaluation notes, mentor assignment, contact logs..."
                      value={adminNotes}
                      onChange={e => setAdminNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded text-xs text-[#242424]"
                    />
                  </div>

                  <div className="pt-3 border-t border-[#EBEBE8] flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedIdea(null)}
                      className="px-4 py-2 bg-[#F0F0ED] hover:bg-[#EBEBE8] rounded text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold"
                    >
                      {saving ? 'Saving...' : 'Save Notes & Status'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
