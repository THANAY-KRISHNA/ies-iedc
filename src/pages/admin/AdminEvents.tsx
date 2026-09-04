import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { EventItem, AcademicYear } from '../../types';
import { Plus, Edit, Eye, Trash2, CheckCircle2, Archive, Globe, Search, Image as ImageIcon } from 'lucide-react';

export const AdminEvents: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [previewEvent, setPreviewEvent] = useState<EventItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    startTime: '',
    endTime: '',
    venue: '',
    isOnline: false,
    meetingUrl: '',
    organizer: 'IES IEDC',
    resourcePerson: '',
    participantsCount: 0,
    category: 'Workshop' as EventItem['category'],
    academicYear: '2024–25',
    posterUrl: '',
    coverUrl: '',
    registrationRequired: false,
    registrationUrl: '',
    registrationDeadline: '',
    published: true,
    status: 'Upcoming' as EventItem['status']
  });

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
      console.error('Failed to load academic years:', err);
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
      shortDescription: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      startTime: '10:00',
      endTime: '13:00',
      venue: 'Main Auditorium, IESCE',
      isOnline: false,
      meetingUrl: '',
      organizer: 'IES IEDC',
      resourcePerson: '',
      participantsCount: 50,
      category: 'Workshop',
      academicYear: '2024–25',
      posterUrl: '',
      coverUrl: '',
      registrationRequired: true,
      registrationUrl: '',
      registrationDeadline: '',
      published: true,
      status: 'Upcoming'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: EventItem) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      shortDescription: event.description.substring(0, 120),
      description: event.description,
      startDate: event.startDate || new Date().toISOString().split('T')[0],
      endDate: event.endDate || '',
      startTime: '10:00',
      endTime: '13:00',
      venue: event.venue,
      isOnline: !!event.isOnline,
      meetingUrl: '',
      organizer: event.organizer || 'IES IEDC',
      resourcePerson: event.resourcePersons ? event.resourcePersons.join(', ') : '',
      participantsCount: event.participantsCount || 0,
      category: event.category,
      academicYear: event.academicYear,
      posterUrl: event.posterUrl || '',
      coverUrl: event.posterUrl || '',
      registrationRequired: !!event.registrationUrl,
      registrationUrl: event.registrationUrl || '',
      registrationDeadline: '',
      published: event.published,
      status: event.status
    });
    setIsModalOpen(true);
  };

  const handleSave = async (publishedState: boolean) => {
    if (!formData.name || !formData.startDate) return;

    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const resourcePersons = formData.resourcePerson
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload: Partial<EventItem> = {
      name: formData.name,
      slug,
      academicYear: formData.academicYear,
      category: formData.category,
      startDate: formData.startDate,
      endDate: formData.endDate,
      displayDate: formData.startDate + (formData.endDate ? ` – ${formData.endDate}` : ''),
      venue: formData.venue,
      isOnline: formData.isOnline,
      organizer: formData.organizer,
      resourcePersons,
      description: formData.description || formData.shortDescription,
      participantsCount: Number(formData.participantsCount),
      posterUrl: formData.posterUrl,
      registrationUrl: formData.registrationUrl,
      status: formData.status,
      published: publishedState
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
    if (!window.confirm('Are you sure you want to delete this event?')) return;
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
      console.error('Failed to toggle publish state:', err);
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
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] tracking-tight">Events</h1>
            <p className="text-xs text-[#777777] mt-1">
              Add and manage upcoming events, workshops, hackathons and bootcamps.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Event</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[#777777]">Academic Year:</span>
            <button
              onClick={() => setSelectedYear('All')}
              className={`px-3 py-1 text-xs rounded font-medium cursor-pointer ${
                selectedYear === 'All'
                  ? 'bg-[#242424] text-white'
                  : 'bg-[#F0F0ED] text-[#4A4A4A] hover:bg-[#EBEBE8]'
              }`}
            >
              All
            </button>
            {academicYears.map(y => (
              <button
                key={y.id}
                onClick={() => setSelectedYear(y.year)}
                className={`px-3 py-1 text-xs rounded font-medium cursor-pointer ${
                  selectedYear === y.year
                    ? 'bg-[#242424] text-white'
                    : 'bg-[#F0F0ED] text-[#4A4A4A] hover:bg-[#EBEBE8]'
                }`}
              >
                {y.year}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#FFFFFF] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
            />
            <Search className="w-4 h-4 text-[#777777] absolute left-2.5 top-2" />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#777777]">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-[#242424]">No events found</p>
            <p className="text-xs text-[#777777]">Add your first event to display it on the website.</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#161616] text-white rounded text-xs font-semibold cursor-pointer"
            >
              + Add Event
            </button>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#D8D8D3] bg-[#F5F5F3] text-[#777777] font-semibold text-[11px]">
                    <th className="p-3.5">Event</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Venue</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Visibility</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBE8]">
                  {filteredEvents.map(event => (
                    <tr key={event.id} className="hover:bg-[#F0F0ED]/50 transition-colors">
                      <td className="p-3.5">
                        <p className="font-bold text-[#161616]">{event.name}</p>
                        <p className="text-[11px] text-[#777777] truncate max-w-xs">{event.description}</p>
                      </td>
                      <td className="p-3.5 font-medium text-[#242424]">
                        {event.displayDate || event.startDate}
                      </td>
                      <td className="p-3.5 text-[#4A4A4A]">{event.venue}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-[#F0F0ED] rounded text-[10px] font-medium text-[#4A4A4A]">
                          {event.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            event.status === 'Upcoming'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleTogglePublish(event)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer border ${
                            event.published
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {event.published ? 'Published' : 'Draft / Unpublished'}
                        </button>
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => setPreviewEvent(event)}
                          className="p-1 text-[#4A4A4A] hover:text-[#161616] cursor-pointer"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(event)}
                          className="p-1 text-[#4A4A4A] hover:text-[#161616] cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                          title="Delete"
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

        {/* Add / Edit Event Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded border border-[#D8D8D3] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#EBEBE8] pb-3">
                <h3 className="font-bold text-base text-[#161616]">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs text-[#777777] hover:text-[#161616] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-5 text-xs text-[#242424]">
                {/* EVENT DETAILS */}
                <div className="space-y-3">
                  <h4 className="font-bold text-[#777777] uppercase text-[10px] tracking-wider border-b border-[#EBEBE8] pb-1">
                    Event Details
                  </h4>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Event Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AI & Robotics Bootcamp"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Short Description</label>
                    <input
                      type="text"
                      placeholder="Brief overview for event card"
                      value={formData.shortDescription}
                      onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Full Description</label>
                    <textarea
                      rows={3}
                      placeholder="Detailed agenda and outline..."
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424]"
                    />
                  </div>
                </div>

                {/* DATE & TIME */}
                <div className="space-y-3">
                  <h4 className="font-bold text-[#777777] uppercase text-[10px] tracking-wider border-b border-[#EBEBE8] pb-1">
                    Date &amp; Time
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-[#242424]">Start Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-[#242424]">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* LOCATION */}
                <div className="space-y-3">
                  <h4 className="font-bold text-[#777777] uppercase text-[10px] tracking-wider border-b border-[#EBEBE8] pb-1">
                    Location &amp; Format
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-[#242424]">Venue *</label>
                      <input
                        type="text"
                        placeholder="e.g. Main Auditorium / Online"
                        value={formData.venue}
                        onChange={e => setFormData({ ...formData, venue: e.target.value })}
                        className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-[#242424]">Mode</label>
                      <select
                        value={formData.isOnline ? 'Online' : 'Offline'}
                        onChange={e => setFormData({ ...formData, isOnline: e.target.value === 'Online' })}
                        className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                      >
                        <option value="Offline">Offline / On Campus</option>
                        <option value="Online">Online / Virtual</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* EVENT INFORMATION */}
                <div className="space-y-3">
                  <h4 className="font-bold text-[#777777] uppercase text-[10px] tracking-wider border-b border-[#EBEBE8] pb-1">
                    Event Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-[#242424]">Category</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value as EventItem['category'] })}
                        className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                      >
                        <option value="Workshop">Workshop</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Ideathon">Ideathon</option>
                        <option value="Camp">Camp</option>
                        <option value="Orientation">Orientation</option>
                        <option value="Exhibition">Exhibition</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-[#242424]">Academic Year</label>
                      <select
                        value={formData.academicYear}
                        onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                        className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                      >
                        {academicYears.map(y => (
                          <option key={y.id} value={y.year}>
                            {y.year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#242424]">Speaker / Resource Persons</label>
                    <input
                      type="text"
                      placeholder="e.g. Prof. Shahaziya Parvez, Er. Febin M F"
                      value={formData.resourcePerson}
                      onChange={e => setFormData({ ...formData, resourcePerson: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    />
                  </div>
                </div>

                {/* MEDIA */}
                <div className="space-y-3">
                  <h4 className="font-bold text-[#777777] uppercase text-[10px] tracking-wider border-b border-[#EBEBE8] pb-1">
                    Poster Image URL
                  </h4>
                  <input
                    type="text"
                    placeholder="https://... image poster url"
                    value={formData.posterUrl}
                    onChange={e => setFormData({ ...formData, posterUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                {/* REGISTRATION */}
                <div className="space-y-3">
                  <h4 className="font-bold text-[#777777] uppercase text-[10px] tracking-wider border-b border-[#EBEBE8] pb-1">
                    Registration Link
                  </h4>
                  <input
                    type="url"
                    placeholder="https://forms.gle/... or registration link"
                    value={formData.registrationUrl}
                    onChange={e => setFormData({ ...formData, registrationUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                  />
                </div>

                {/* STATUS & ACTIONS */}
                <div className="pt-4 border-t border-[#EBEBE8] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as EventItem['status'] })}
                      className="px-3 py-1.5 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSave(false)}
                      className="px-4 py-2 bg-[#F0F0ED] hover:bg-[#EBEBE8] text-[#242424] rounded text-xs font-semibold cursor-pointer"
                    >
                      Save Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSave(true)}
                      className="px-4 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold cursor-pointer"
                    >
                      Publish Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {previewEvent && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded border border-[#D8D8D3] w-full max-w-lg p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-[#EBEBE8] pb-2">
                <h3 className="font-bold text-sm text-[#161616]">Event Preview</h3>
                <button onClick={() => setPreviewEvent(null)} className="text-xs text-[#777777]">Close</button>
              </div>
              <div className="space-y-2 text-xs text-[#242424]">
                <h2 className="text-base font-bold">{previewEvent.name}</h2>
                <p className="text-[#777777]">{previewEvent.displayDate} • {previewEvent.venue}</p>
                <p className="leading-relaxed">{previewEvent.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
