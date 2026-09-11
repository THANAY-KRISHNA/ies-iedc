import {
  AcademicYear,
  TeamMember,
  EventItem,
  Achievement,
  StudentIdea,
  StartupItem,
  WorkshopItem,
  ResourceItem,
  GalleryAlbum,
  NewsItem,
  JoinSubmission,
  ActivityLog,
  SiteSettings,
  User
} from '../types';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_ACADEMIC_YEARS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_EVENTS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_STARTUPS,
  INITIAL_STUDENT_IDEAS,
  INITIAL_WORKSHOPS,
  INITIAL_RESOURCES,
  INITIAL_GALLERY_ALBUMS,
  INITIAL_NEWS
} from '../data/initialData';
import { notifyDataChange } from './realtime';

const BASE_URL = '/api';

function normalizeYear(year?: string): string {
  if (!year) return '';
  return year.replace(/[\u2010-\u2015\u2212-]/g, '-').trim();
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('iedc_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...(options?.headers || {})
      }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || `HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`API call to ${endpoint} failed.`, error);
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
}

export const api = {
  // --- PUBLIC ---
  getSettings: () => request<SiteSettings>('/public/settings', undefined, INITIAL_SITE_SETTINGS),
  getAcademicYears: () => request<AcademicYear[]>('/public/academic-years', undefined, INITIAL_ACADEMIC_YEARS),

  // Team Methods
  getTeam: (year?: string): Promise<TeamMember[]> => {
    const fallback = year && year !== 'all'
      ? INITIAL_TEAM_MEMBERS.filter(m => normalizeYear(m.academicYear) === normalizeYear(year))
      : INITIAL_TEAM_MEMBERS;
    return request<TeamMember[]>(`/public/team${year ? `?year=${encodeURIComponent(year)}` : ''}`, undefined, fallback);
  },

  adminGetTeam: (year?: string): Promise<TeamMember[]> => {
    const fallback = year && year !== 'all'
      ? INITIAL_TEAM_MEMBERS.filter(m => normalizeYear(m.academicYear) === normalizeYear(year))
      : INITIAL_TEAM_MEMBERS;
    return request<TeamMember[]>(`/admin/team${year && year !== 'all' ? `?year=${encodeURIComponent(year)}` : ''}`, undefined, fallback);
  },

  adminAddTeamMember: async (data: Partial<TeamMember>): Promise<TeamMember> => {
    const member = await request<TeamMember>('/admin/team', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    notifyDataChange('team', 'create', member);
    return member;
  },

  adminUpdateTeamMember: async (id: string, updates: Partial<TeamMember>): Promise<TeamMember> => {
    const member = await request<TeamMember>(`/admin/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    notifyDataChange('team', 'update', member);
    return member;
  },

  adminDeleteTeamMember: async (id: string): Promise<{ message: string }> => {
    const result = await request<{ message: string }>(`/admin/team/${id}`, {
      method: 'DELETE'
    });
    notifyDataChange('team', 'delete', { id });
    return result;
  },

  // Events Methods
  getEvents: (params?: { year?: string; category?: string; status?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.year) searchParams.set('year', params.year);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);
    const qs = searchParams.toString();
    return request<EventItem[]>(`/public/events${qs ? `?${qs}` : ''}`, undefined, INITIAL_EVENTS);
  },

  getEventBySlug: (slug: string) =>
    request<EventItem>(`/public/events/${slug}`, undefined, INITIAL_EVENTS.find(e => e.slug === slug) as EventItem),

  // Achievements
  getAchievements: (params?: { year?: string; category?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.year) searchParams.set('year', params.year);
    if (params?.category) searchParams.set('category', params.category);
    const qs = searchParams.toString();
    return request<Achievement[]>(`/public/achievements${qs ? `?${qs}` : ''}`, undefined, INITIAL_ACHIEVEMENTS);
  },

  // Startups & Ideas
  getStartups: () => request<StartupItem[]>('/public/startups', undefined, INITIAL_STARTUPS),
  getIdeas: () => request<StudentIdea[]>('/public/ideas', undefined, INITIAL_STUDENT_IDEAS),
  submitIdea: async (data: Omit<StudentIdea, 'id' | 'status' | 'submittedAt'>) => {
    const res = await request<{ message: string; idea: StudentIdea }>('/public/ideas/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res?.idea) notifyDataChange('ideas', 'create', res.idea);
    return res;
  },

  // Workshops & Resources
  getWorkshops: () => request<WorkshopItem[]>('/public/workshops', undefined, INITIAL_WORKSHOPS),
  getResources: (category?: string) =>
    request<ResourceItem[]>(`/public/resources${category ? `?category=${encodeURIComponent(category)}` : ''}`, undefined, INITIAL_RESOURCES),

  // Gallery & News
  getGallery: (category?: string) =>
    request<GalleryAlbum[]>(`/public/gallery${category ? `?category=${encodeURIComponent(category)}` : ''}`, undefined, INITIAL_GALLERY_ALBUMS),
  getNews: (search?: string) =>
    request<NewsItem[]>(`/public/news${search ? `?search=${encodeURIComponent(search)}` : ''}`, undefined, INITIAL_NEWS),
  getNewsBySlug: (slug: string) =>
    request<NewsItem>(`/public/news/${slug}`, undefined, INITIAL_NEWS.find(n => n.slug === slug) as NewsItem),
  submitJoin: async (data: Omit<JoinSubmission, 'id' | 'status' | 'submittedAt'>) => {
    const res = await request<{ message: string; submission: JoinSubmission }>('/public/join/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res?.submission) notifyDataChange('submissions', 'create', res.submission);
    return res;
  },

  // --- AUTH ---
  getDemoUsers: () => request<{ users: User[] }>('/auth/demo-users'),
  login: (email: string, password?: string) => {
    return request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  getMe: () => request<{ user: User }>('/auth/me'),

  // --- ADMIN ---
  getStats: () => request<any>('/admin/stats'),
  getAuditLogs: () => request<ActivityLog[]>('/admin/audit-logs'),

  // Admin Academic Years
  adminAddAcademicYear: async (data: Partial<AcademicYear>) => {
    const res = await request<AcademicYear>('/admin/academic-years', { method: 'POST', body: JSON.stringify(data) });
    notifyDataChange('academicYears', 'create', res);
    return res;
  },
  adminUpdateAcademicYear: async (id: string, updates: Partial<AcademicYear>) => {
    const res = await request<AcademicYear>(`/admin/academic-years/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(updates) });
    notifyDataChange('academicYears', 'update', res);
    return res;
  },
  adminDeleteAcademicYear: async (id: string) => {
    const res = await request<{ message: string }>(`/admin/academic-years/${encodeURIComponent(id)}`, { method: 'DELETE' });
    notifyDataChange('academicYears', 'delete', { id });
    return res;
  },

  // Admin Events
  adminGetEvents: (params?: any) => {
    const qs = new URLSearchParams(params || {}).toString();
    return request<EventItem[]>(`/admin/events${qs ? `?${qs}` : ''}`);
  },
  adminAddEvent: async (data: Partial<EventItem>) => {
    const event = await request<EventItem>('/admin/events', { method: 'POST', body: JSON.stringify(data) });
    notifyDataChange('events', 'create', event);
    return event;
  },
  adminUpdateEvent: async (id: string, updates: Partial<EventItem>) => {
    const event = await request<EventItem>(`/admin/events/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    notifyDataChange('events', 'update', event);
    return event;
  },
  adminDeleteEvent: async (id: string) => {
    const res = await request<{ message: string }>(`/admin/events/${id}`, { method: 'DELETE' });
    notifyDataChange('events', 'delete', { id });
    return res;
  },

  // Admin Achievements
  adminGetAchievements: (params?: any) => {
    const qs = new URLSearchParams(params || {}).toString();
    return request<Achievement[]>(`/admin/achievements${qs ? `?${qs}` : ''}`);
  },
  adminAddAchievement: async (data: Partial<Achievement>) => {
    const ach = await request<Achievement>('/admin/achievements', { method: 'POST', body: JSON.stringify(data) });
    notifyDataChange('achievements', 'create', ach);
    return ach;
  },
  adminUpdateAchievement: async (id: string, updates: Partial<Achievement>) => {
    const ach = await request<Achievement>(`/admin/achievements/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    notifyDataChange('achievements', 'update', ach);
    return ach;
  },
  adminDeleteAchievement: async (id: string) => {
    const res = await request<{ message: string }>(`/admin/achievements/${id}`, { method: 'DELETE' });
    notifyDataChange('achievements', 'delete', { id });
    return res;
  },

  // Admin Ideas
  adminGetIdeas: (params?: any) => {
    const qs = new URLSearchParams(params || {}).toString();
    return request<StudentIdea[]>(`/admin/ideas${qs ? `?${qs}` : ''}`);
  },
  adminUpdateIdea: async (id: string, updates: Partial<StudentIdea>) => {
    const idea = await request<StudentIdea>(`/admin/ideas/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    notifyDataChange('ideas', 'update', idea);
    return idea;
  },
  adminUpdateIdeaStatus: async (id: string, data: { status: any; adminNotes?: string }) => {
    const idea = await request<StudentIdea>(`/admin/ideas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    notifyDataChange('ideas', 'update', idea);
    return idea;
  },

  // Admin Startups
  adminGetStartups: () => request<StartupItem[]>('/admin/startups'),
  adminAddStartup: async (data: Partial<StartupItem>) => {
    const st = await request<StartupItem>('/admin/startups', { method: 'POST', body: JSON.stringify(data) });
    notifyDataChange('startups', 'create', st);
    return st;
  },
  adminUpdateStartup: async (id: string, updates: Partial<StartupItem>) => {
    const st = await request<StartupItem>(`/admin/startups/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    notifyDataChange('startups', 'update', st);
    return st;
  },
  adminDeleteStartup: async (id: string) => {
    const res = await request<{ message: string }>(`/admin/startups/${id}`, { method: 'DELETE' });
    notifyDataChange('startups', 'delete', { id });
    return res;
  },

  // Admin Workshops
  adminGetWorkshops: () => request<WorkshopItem[]>('/admin/workshops'),
  adminAddWorkshop: async (data: Partial<WorkshopItem>) => {
    const ws = await request<WorkshopItem>('/admin/workshops', { method: 'POST', body: JSON.stringify(data) });
    notifyDataChange('workshops', 'create', ws);
    return ws;
  },
  adminUpdateWorkshop: async (id: string, updates: Partial<WorkshopItem>) => {
    const ws = await request<WorkshopItem>(`/admin/workshops/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    notifyDataChange('workshops', 'update', ws);
    return ws;
  },
  adminDeleteWorkshop: async (id: string) => {
    const res = await request<{ message: string }>(`/admin/workshops/${id}`, { method: 'DELETE' });
    notifyDataChange('workshops', 'delete', { id });
    return res;
  },

  // Admin Resources
  adminGetResources: (category?: string) =>
    request<ResourceItem[]>(`/admin/resources${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  adminAddResource: async (data: Partial<ResourceItem>) => {
    const item = await request<ResourceItem>('/admin/resources', { method: 'POST', body: JSON.stringify(data) });
    notifyDataChange('resources', 'create', item);
    return item;
  },
  adminUpdateResource: async (id: string, updates: Partial<ResourceItem>) => {
    const item = await request<ResourceItem>(`/admin/resources/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    notifyDataChange('resources', 'update', item);
    return item;
  },
  adminDeleteResource: async (id: string) => {
    const res = await request<{ message: string }>(`/admin/resources/${id}`, { method: 'DELETE' });
    notifyDataChange('resources', 'delete', { id });
    return res;
  },

  // Admin Gallery
  adminGetGallery: (category?: string) =>
    request<GalleryAlbum[]>(`/admin/gallery${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  adminAddGalleryAlbum: async (data: Partial<GalleryAlbum>) => {
    const album = await request<GalleryAlbum>('/admin/gallery', { method: 'POST', body: JSON.stringify(data) });
    notifyDataChange('gallery', 'create', album);
    return album;
  },
  adminUpdateGalleryAlbum: async (id: string, updates: Partial<GalleryAlbum>) => {
    const album = await request<GalleryAlbum>(`/admin/gallery/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    notifyDataChange('gallery', 'update', album);
    return album;
  },
  adminDeleteGalleryAlbum: async (id: string) => {
    const res = await request<{ message: string }>(`/admin/gallery/${id}`, { method: 'DELETE' });
    notifyDataChange('gallery', 'delete', { id });
    return res;
  },

  // Admin News
  adminGetNews: (params?: any) => {
    const qs = new URLSearchParams(params || {}).toString();
    return request<NewsItem[]>(`/admin/news${qs ? `?${qs}` : ''}`);
  },
  adminAddNews: async (data: Partial<NewsItem>) => {
    const item = await request<NewsItem>('/admin/news', { method: 'POST', body: JSON.stringify(data) });
    notifyDataChange('news', 'create', item);
    return item;
  },
  adminUpdateNews: async (id: string, updates: Partial<NewsItem>) => {
    const item = await request<NewsItem>(`/admin/news/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    notifyDataChange('news', 'update', item);
    return item;
  },
  adminDeleteNews: async (id: string) => {
    const res = await request<{ message: string }>(`/admin/news/${id}`, { method: 'DELETE' });
    notifyDataChange('news', 'delete', { id });
    return res;
  },

  // Admin Submissions
  adminGetSubmissions: () => request<JoinSubmission[]>('/admin/submissions'),
  adminUpdateSubmission: async (id: string, updates: Partial<JoinSubmission>) => {
    const sub = await request<JoinSubmission>(`/admin/submissions/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    notifyDataChange('submissions', 'update', sub);
    return sub;
  },
  adminUpdateSubmissionStatus: async (id: string, status: any) => {
    const sub = await request<JoinSubmission>(`/admin/submissions/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
    notifyDataChange('submissions', 'update', sub);
    return sub;
  },

  // Admin Settings
  adminGetSettings: () => request<SiteSettings>('/admin/settings'),
  adminUpdateSettings: async (updates: Partial<SiteSettings>) => {
    const settings = await request<SiteSettings>('/admin/settings', { method: 'PUT', body: JSON.stringify(updates) });
    notifyDataChange('settings', 'update', settings);
    return settings;
  },

  // Admin Users
  adminGetUsers: () => request<User[]>('/admin/users'),
  adminUpdateUserRole: async (id: string, role: string) => {
    const user = await request<User>(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) });
    notifyDataChange('users', 'update', user);
    return user;
  },

  // Media & Upload
  uploadMedia: (fileName: string, fileData: string) =>
    request<{ url: string }>('/upload', {
      method: 'POST',
      body: JSON.stringify({ fileName, fileData })
    }, { url: fileData }),

  // Admin Posters & Flyers
  adminGetPosters: () => request<any[]>('/admin/posters', undefined, []),
  adminAddPoster: async (data: any) => {
    const item = await request<any>('/admin/posters', { method: 'POST', body: JSON.stringify(data) });
    notifyDataChange('posters', 'create', item);
    return item;
  },
  adminDeletePoster: async (id: string) => {
    const res = await request<{ message: string }>(`/admin/posters/${id}`, { method: 'DELETE' });
    notifyDataChange('posters', 'delete', { id });
    return res;
  },

  // Admin Media Library
  adminGetMedia: () => request<any[]>('/admin/media', undefined, []),
  adminAddMedia: async (data: any) => {
    const item = await request<any>('/admin/media', { method: 'POST', body: JSON.stringify(data) });
    notifyDataChange('media', 'create', item);
    return item;
  },
  adminDeleteMedia: async (id: string) => {
    const res = await request<{ message: string }>(`/admin/media/${id}`, { method: 'DELETE' });
    notifyDataChange('media', 'delete', { id });
    return res;
  }
};
