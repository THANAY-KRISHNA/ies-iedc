import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { SearchFilterBar } from '../../components/ui/SearchFilterBar';
import { LoadingState } from '../../components/ui/LoadingState';
import { api } from '../../services/api';
import { EventItem, AcademicYear } from '../../types';
import { Plus, Edit2, Trash2, AlertCircle, Calendar, Check, X } from 'lucide-react';

export const AdminEvents: React.FC = () => {
  const { hasRole } = useAuth();
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    academicYear: '2024–25',
    category: 'Ideathon' as EventItem['category'],
    displayDate: '',
    startDate: new Date().toISOString().split('T')[0],
    venue: '',
    isOnline: false,
    organizer: 'IES IEDC',
    resourcePersonsText: '',
    description: '',
    participantsCount: 0,
    status: 'Completed' as EventItem['status'],
    needsAdminReview: false,
    adminReviewNote: '',
    published: true
  });

  const isAuthorized = hasRole(['Content Admin']);

  useEffect(() => {
    loadAcademicYears();
    loadEvents();
    if (searchParams.get('action') === 'new') {
      handleOpenAdd();
    }
  }, []);

  async function loadAcademicYears() {
    try {
      const years = await api.getAcademicYears();
      setAcademicYears(years);
    } catch (err) {
      console.error('Failed to load years:', err);
    }
  }

  async function loadEvents() {
    setLoading(true);
    try {
      const list = await api.adminGetEvents();
      setEvents(list);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormData({
      name: '',
      slug: '',
      academicYear: '2024–25',
      category: 'Ideathon',
      displayDate: '',
      startDate: new Date().toISOString().split('T')[0],
      venue: 'Main Auditorium / Seminar Hall',
      isOnline: false,
      organizer: 'IES IEDC',
      resourcePersonsText: '',
      description: '',
      participantsCount: 0,
      status: 'Completed',
      needsAdminReview: false,
      adminReviewNote: '',
      published: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: EventItem) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      slug: event.slug,
      academicYear: event.academicYear,
      category: event.category,
      displayDate: event.displayDate,
      startDate: event.startDate,
      venue: event.venue,
      isOnline: !!event.isOnline,
      organizer: event.organizer || 'IES IEDC',
      resourcePersonsText: event.resourcePersons ? event.resourcePersons.join(', ') : '',
      description: event.description,
      participantsCount: event.participantsCount || 0,
      status: event.status,
      needsAdminReview: !!event.needsAdminReview,
      adminReviewNote: event.adminReviewNote || '',
      published: event.published
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.displayDate) return;

    const slug =
      formData.slug ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const resourcePersons = formData.resourcePersonsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload: Partial<EventItem> = {
      ...formData,
      slug,
      resourcePersons
    };

    try {
      if (editingEvent) {
        await api.adminUpdateEvent(editingEvent.id, payload);
      } else {
        await api.adminAddEvent(payload);
      }
      setIsModalOpen(false);
      loadEvents();
    } catch (err) {
      console.error('Failed to save event:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event record?')) return;
    try {
      await api.adminDeleteEvent(id);
      loadEvents();
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const handleTogglePublish = async (event: EventItem) => {
    try {
      await api.adminUpdateEvent(event.id, { published: !event.published });
      loadEvents();
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesYear = selectedYear === 'All' || e.academicYear === selectedYear;
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());
    return matchesYear && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D8D8D3]">
        <div>
          <h1 className="text-2xl font-black text-[#161616] tracking-tight">
            Events &amp; Bootcamps Management
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            Manage institutional hackathons, ideathons, camps, and YIP training initiatives.
          </p>
        </div>

        {isAuthorized && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Create Event Record
          </Button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#777777] uppercase mr-2">Cycle:</span>
          <button
            onClick={() => setSelectedYear('All')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedYear === 'All'
                ? 'neu-button'
                : 'neu-raised-soft text-[#4A4A4A] hover:text-[#161616]'
            }`}
          >
            All Years
          </button>
          {academicYears.map(y => (
            <button
              key={y.id}
              onClick={() => setSelectedYear(y.year)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedYear === y.year
                  ? 'neu-button'
                  : 'neu-raised-soft text-[#4A4A4A] hover:text-[#161616]'
              }`}
            >
              {y.year}
            </button>
          ))}
        </div>

        <SearchFilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search events by name, venue, category..."
        />
      </div>

      {/* Events Table */}
      {loading ? (
        <LoadingState message="Loading events..." />
      ) : (
        <div className="neu-raised rounded-xl overflow-hidden border border-[#D8D8D3]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#D8D8D3] bg-[#EBEBE8]/50 text-[#777777] uppercase tracking-wider text-[10px]">
                  <th className="p-3.5 font-bold">Event Title</th>
                  <th className="p-3.5 font-bold">Cycle</th>
                  <th className="p-3.5 font-bold">Category</th>
                  <th className="p-3.5 font-bold">Date &amp; Venue</th>
                  <th className="p-3.5 font-bold">Review Status</th>
                  <th className="p-3.5 font-bold">Published</th>
                  <th className="p-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBE8]">
                {filteredEvents.map(event => (
                  <tr key={event.id} className="hover:bg-[#EBEBE8]/20 transition-colors">
                    <td className="p-3.5 font-bold text-[#161616] max-w-xs">
                      {event.name}
                      {event.needsAdminReview && (
                        <span className="flex items-center gap-1 text-[10px] text-[#8C4A00] font-semibold mt-0.5">
                          <AlertCircle className="w-3 h-3 text-[#8C4A00]" />
                          Date Discrepancy Flagged
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <Badge variant="neutral" size="sm">
                        {event.academicYear}
                      </Badge>
                    </td>
                    <td className="p-3.5 font-medium">{event.category}</td>
                    <td className="p-3.5 text-[#4A4A4A]">
                      <div>{event.displayDate}</div>
                      <span className="text-[10px] text-[#777777]">{event.venue}</span>
                    </td>
                    <td className="p-3.5">
                      {event.needsAdminReview ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FFF3E0] text-[#8C4A00] border border-[#F3C287] rounded">
                          Discrepancy Note
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#EFEFEA] text-[#1E3A1E] border border-[#C5D5C5] rounded">
                          Reconciled
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleTogglePublish(event)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer border ${
                          event.published
                            ? 'bg-[#EFEFEA] text-[#1E3A1E] border-[#C5D5C5]'
                            : 'bg-[#F2DFDF] text-[#772222] border-[#D8A8A8]'
                        }`}
                      >
                        {event.published ? 'Live (Yes)' : 'Hidden (No)'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(event)}
                        className="p-1 text-[#4A4A4A] hover:text-[#161616] cursor-pointer"
                        title="Edit Event"
                      >
                        <Edit2 className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-1 text-red-700 hover:text-red-900 cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Event Record' : 'Create Event Record'}
        subtitle="Manage official institutional event parameters."
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Event Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. IDEATHON 2024"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Academic Year</label>
              <select
                value={formData.academicYear}
                onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 neu-raised-soft border border-[#D8D8D3] rounded-lg text-xs"
              >
                {academicYears.map(y => (
                  <option key={y.id} value={y.year}>
                    {y.year}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Category</label>
              <select
                value={formData.category}
                onChange={e =>
                  setFormData({ ...formData, category: e.target.value as EventItem['category'] })
                }
                className="w-full px-3 py-2 neu-raised-soft border border-[#D8D8D3] rounded-lg text-xs"
              >
                <option value="Ideathon">Ideathon</option>
                <option value="Bootcamp">Bootcamp</option>
                <option value="Awareness">Awareness</option>
                <option value="Workshop">Workshop</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Hackathon">Hackathon</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Status</label>
              <select
                value={formData.status}
                onChange={e =>
                  setFormData({ ...formData, status: e.target.value as EventItem['status'] })
                }
                className="w-full px-3 py-2 neu-raised-soft border border-[#D8D8D3] rounded-lg text-xs"
              >
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Display Date String *</label>
              <input
                type="text"
                required
                placeholder="e.g. October 15, 2024 or 12–14 Nov 2024"
                value={formData.displayDate}
                onChange={e => setFormData({ ...formData, displayDate: e.target.value })}
                className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#242424]">Venue *</label>
              <input
                type="text"
                required
                placeholder="e.g. Seminar Hall / CCF Lab"
                value={formData.venue}
                onChange={e => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Resource Persons (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Prof. Shahaziya Parvez, Er. Febin M F, KSUM Officer"
              value={formData.resourcePersonsText}
              onChange={e => setFormData({ ...formData, resourcePersonsText: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#242424]">Event Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 neu-inset rounded-lg text-xs"
            />
          </div>

          {/* Discrepancy & Review Flags */}
          <div className="p-4 neu-raised-soft rounded-xl border border-[#D8D8D3] space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="discrepancy"
                checked={formData.needsAdminReview}
                onChange={e => setFormData({ ...formData, needsAdminReview: e.target.checked })}
                className="rounded text-[#242424] cursor-pointer"
              />
              <label htmlFor="discrepancy" className="font-bold text-[#161616] cursor-pointer">
                Flag for Administrative Reconciliation (Source Date Discrepancy)
              </label>
            </div>

            {formData.needsAdminReview && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#8C4A00]">
                  Administrative Note explaining discrepancy:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Source document notes date as October 2023 for 2024–25 cycle..."
                  value={formData.adminReviewNote}
                  onChange={e => setFormData({ ...formData, adminReviewNote: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF3E0] border border-[#F3C287] rounded-lg text-xs text-[#8C4A00]"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3">
            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={e => setFormData({ ...formData, published: e.target.checked })}
                className="rounded cursor-pointer"
              />
              <span>Publish on Public Website</span>
            </label>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Event
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
