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

const BASE_URL = '/api';

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
    console.warn(`API call to ${endpoint} failed, utilizing local state fallback.`, error);
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
}

// Local Storage Team Data Helpers
function getStoredTeam(): TeamMember[] {
  try {
    const raw = localStorage.getItem('iedc_team_members');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading iedc_team_members from localStorage', e);
  }
  // Initialize with INITIAL_TEAM_MEMBERS
  try {
    localStorage.setItem('iedc_team_members', JSON.stringify(INITIAL_TEAM_MEMBERS));
  } catch (e) {}
  return INITIAL_TEAM_MEMBERS;
}

function saveStoredTeam(members: TeamMember[]): void {
  try {
    localStorage.setItem('iedc_team_members', JSON.stringify(members));
  } catch (e) {
    console.error('Error saving iedc_team_members to localStorage', e);
  }
}

export const api = {
  // --- PUBLIC ---
  getSettings: () => request<SiteSettings>('/public/settings', undefined, INITIAL_SITE_SETTINGS),
  getAcademicYears: () => request<AcademicYear[]>('/public/academic-years', undefined, INITIAL_ACADEMIC_YEARS),
  // Team Methods (Connected to API backend with reactive local storage fallback)
  getTeam: async (year?: string): Promise<TeamMember[]> => {
    try {
      const serverRes = await request<TeamMember[]>(`/public/team${year ? `?year=${encodeURIComponent(year)}` : ''}`);
      if (serverRes && Array.isArray(serverRes)) return serverRes;
    } catch (e) {}
    let list = getStoredTeam();
    if (year) {
      list = list.filter(m => m.academicYear === year);
    }
    return list.filter(m => m.status !== 'Archived').sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
  },

  adminGetTeam: async (year?: string): Promise<TeamMember[]> => {
    try {
      const serverRes = await request<TeamMember[]>(`/admin/team${year && year !== 'all' ? `?year=${encodeURIComponent(year)}` : ''}`);
      if (serverRes && Array.isArray(serverRes)) return serverRes;
    } catch (e) {}
    let list = getStoredTeam();
    if (year && year !== 'all') {
      list = list.filter(m => m.academicYear === year);
    }
    return list.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
  },

  adminAddTeamMember: async (data: Partial<TeamMember>): Promise<TeamMember> => {
    try {
      const serverMember = await request<TeamMember>('/admin/team', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (serverMember && serverMember.id) {
        const list = getStoredTeam();
        list.unshift(serverMember);
        saveStoredTeam(list);
        return serverMember;
      }
    } catch (e) {
      console.warn('Backend add team member failed, falling back to local storage', e);
    }

    const newMember: TeamMember = {
      id: `tm_${Date.now()}`,
      academicYear: data.academicYear || '2025–26',
      name: data.name || 'New Team Member',
      roleType: data.roleType || 'Student Lead',
      position: data.position || data.roleType || 'Team Member',
      department: data.department || 'CSE',
      responsibility: data.responsibility || '',
      email: data.email || '',
      linkedinUrl: data.linkedinUrl || '',
      photoUrl: data.photoUrl || '',
      sortOrder: data.sortOrder || 99,
      status: data.status || 'Published',
      isFeatured: data.isFeatured || false
    };
    const list = getStoredTeam();
    list.unshift(newMember);
    saveStoredTeam(list);
    return newMember;
  },

  adminUpdateTeamMember: async (id: string, updates: Partial<TeamMember>): Promise<TeamMember> => {
    try {
      const serverMember = await request<TeamMember>(`/admin/team/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      if (serverMember && serverMember.id) {
        const list = getStoredTeam();
        const idx = list.findIndex(m => m.id === id);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...serverMember };
        } else {
          list.unshift(serverMember);
        }
        saveStoredTeam(list);
        return serverMember;
      }
    } catch (e) {
      console.warn('Backend update team member failed, falling back to local storage', e);
    }

    const list = getStoredTeam();
    const idx = list.findIndex(m => m.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      saveStoredTeam(list);
      return list[idx];
    }
    throw new Error('Member not found');
  },

  adminDeleteTeamMember: async (id: string): Promise<{ message: string }> => {
    try {
      const res = await request<{ message: string }>(`/admin/team/${id}`, {
        method: 'DELETE'
      });
      let list = getStoredTeam();
      list = list.filter(m => m.id !== id);
      saveStoredTeam(list);
      return res;
    } catch (e) {
      console.warn('Backend delete team member failed, falling back to local storage', e);
      let list = getStoredTeam();
      list = list.filter(m => m.id !== id);
      saveStoredTeam(list);
      return { message: 'Member deleted successfully' };
    }
  },
  getEvents: (params?: { year?: string; category?: string; status?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.year) searchParams.set('year', params.year);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);
    const qs = searchParams.toString();
    return request<EventItem[]>(`/public/events${qs ? `?${qs}` : ''}`, undefined, INITIAL_EVENTS);
  },
  getEventBySlug: (slug: string) => request<EventItem>(`/public/events/${slug}`, undefined, INITIAL_EVENTS.find(e => e.slug === slug) as EventItem),
  getAchievements: (params?: { year?: string; category?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.year) searchParams.set('year', params.year);
    if (params?.category) searchParams.set('category', params.category);
    const qs = searchParams.toString();
    return request<Achievement[]>(`/public/achievements${qs ? `?${qs}` : ''}`, undefined, INITIAL_ACHIEVEMENTS);
  },
  getStartups: () => request<StartupItem[]>('/public/startups', undefined, INITIAL_STARTUPS),
  getIdeas: () => request<StudentIdea[]>('/public/ideas', undefined, INITIAL_STUDENT_IDEAS),
  submitIdea: (data: Omit<StudentIdea, 'id' | 'status' | 'submittedAt'>) =>
    request<{ message: string; idea: StudentIdea }>('/public/ideas/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  getWorkshops: () => request<WorkshopItem[]>('/public/workshops', undefined, INITIAL_WORKSHOPS),
  getResources: (category?: string) =>
    request<ResourceItem[]>(`/public/resources${category ? `?category=${encodeURIComponent(category)}` : ''}`, undefined, INITIAL_RESOURCES),
  getGallery: (category?: string) =>
    request<GalleryAlbum[]>(`/public/gallery${category ? `?category=${encodeURIComponent(category)}` : ''}`, undefined, INITIAL_GALLERY_ALBUMS),
  getNews: (search?: string) =>
    request<NewsItem[]>(`/public/news${search ? `?search=${encodeURIComponent(search)}` : ''}`, undefined, INITIAL_NEWS),
  getNewsBySlug: (slug: string) => request<NewsItem>(`/public/news/${slug}`, undefined, INITIAL_NEWS.find(n => n.slug === slug) as NewsItem),
  submitJoin: (data: Omit<JoinSubmission, 'id' | 'status' | 'submittedAt'>) =>
    request<{ message: string; submission: JoinSubmission }>('/public/join/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // --- AUTH ---
  getDemoUsers: () => request<{ users: User[] }>('/auth/demo-users'),
  login: (email: string) => {
    const fallbackUser: User = {
      id: 'usr_super',
      name: 'Prof. Shahaziya Parvez',
      email: email || 'nodal.officer@iesce.info',
      role: 'Super Admin',
      lastLogin: new Date().toISOString()
    };
    return request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email })
    }, { user: fallbackUser, token: 'token_usr_super' });
  },
  getMe: () => request<{ user: User }>('/auth/me'),

  // --- ADMIN ---
  getStats: () => request<any>('/admin/stats'),
  getAuditLogs: () => request<ActivityLog[]>('/admin/audit-logs'),

  // Admin Academic Years
  adminAddAcademicYear: (data: Partial<AcademicYear>) =>
    request<AcademicYear>('/admin/academic-years', { method: 'POST', body: JSON.stringify(data) }),

  // Admin Events
  adminGetEvents: (params?: any) => {
    const qs = new URLSearchParams(params || {}).toString();
    return request<EventItem[]>(`/admin/events${qs ? `?${qs}` : ''}`);
  },
  adminAddEvent: (data: Partial<EventItem>) =>
    request<EventItem>('/admin/events', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateEvent: (id: string, updates: Partial<EventItem>) =>
    request<EventItem>(`/admin/events/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  adminDeleteEvent: (id: string) =>
    request<{ message: string }>(`/admin/events/${id}`, { method: 'DELETE' }),

  // Admin Achievements
  adminGetAchievements: (params?: any) => {
    const qs = new URLSearchParams(params || {}).toString();
    return request<Achievement[]>(`/admin/achievements${qs ? `?${qs}` : ''}`);
  },
  adminAddAchievement: (data: Partial<Achievement>) =>
    request<Achievement>('/admin/achievements', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateAchievement: (id: string, updates: Partial<Achievement>) =>
    request<Achievement>(`/admin/achievements/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  adminDeleteAchievement: (id: string) =>
    request<{ message: string }>(`/admin/achievements/${id}`, { method: 'DELETE' }),

  // Admin Ideas
  adminGetIdeas: (params?: any) => {
    const qs = new URLSearchParams(params || {}).toString();
    return request<StudentIdea[]>(`/admin/ideas${qs ? `?${qs}` : ''}`);
  },
  adminUpdateIdea: (id: string, updates: Partial<StudentIdea>) =>
    request<StudentIdea>(`/admin/ideas/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  adminUpdateIdeaStatus: (id: string, data: { status: any; adminNotes?: string }) =>
    request<StudentIdea>(`/admin/ideas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Admin Startups
  adminGetStartups: () => request<StartupItem[]>('/admin/startups'),
  adminAddStartup: (data: Partial<StartupItem>) =>
    request<StartupItem>('/admin/startups', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateStartup: (id: string, updates: Partial<StartupItem>) =>
    request<StartupItem>(`/admin/startups/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  adminDeleteStartup: (id: string) =>
    request<{ message: string }>(`/admin/startups/${id}`, { method: 'DELETE' }),

  // Admin Workshops
  adminGetWorkshops: () => request<WorkshopItem[]>('/admin/workshops'),
  adminAddWorkshop: (data: Partial<WorkshopItem>) =>
    request<WorkshopItem>('/admin/workshops', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateWorkshop: (id: string, updates: Partial<WorkshopItem>) =>
    request<WorkshopItem>(`/admin/workshops/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  adminDeleteWorkshop: (id: string) =>
    request<{ message: string }>(`/admin/workshops/${id}`, { method: 'DELETE' }),

  // Admin Resources
  adminGetResources: (category?: string) =>
    request<ResourceItem[]>(`/admin/resources${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  adminAddResource: (data: Partial<ResourceItem>) =>
    request<ResourceItem>('/admin/resources', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateResource: (id: string, updates: Partial<ResourceItem>) =>
    request<ResourceItem>(`/admin/resources/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  adminDeleteResource: (id: string) =>
    request<{ message: string }>(`/admin/resources/${id}`, { method: 'DELETE' }),

  // Admin Gallery
  adminGetGallery: (category?: string) =>
    request<GalleryAlbum[]>(`/admin/gallery${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  adminAddGalleryAlbum: (data: Partial<GalleryAlbum>) =>
    request<GalleryAlbum>('/admin/gallery', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateGalleryAlbum: (id: string, updates: Partial<GalleryAlbum>) =>
    request<GalleryAlbum>(`/admin/gallery/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),

  // Admin News
  adminGetNews: (params?: any) => {
    const qs = new URLSearchParams(params || {}).toString();
    return request<NewsItem[]>(`/admin/news${qs ? `?${qs}` : ''}`);
  },
  adminAddNews: (data: Partial<NewsItem>) =>
    request<NewsItem>('/admin/news', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateNews: (id: string, updates: Partial<NewsItem>) =>
    request<NewsItem>(`/admin/news/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  adminDeleteNews: (id: string) =>
    request<{ message: string }>(`/admin/news/${id}`, { method: 'DELETE' }),

  // Admin Submissions
  adminGetSubmissions: () => request<JoinSubmission[]>('/admin/submissions'),
  adminUpdateSubmission: (id: string, updates: Partial<JoinSubmission>) =>
    request<JoinSubmission>(`/admin/submissions/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  adminUpdateSubmissionStatus: (id: string, status: any) =>
    request<JoinSubmission>(`/admin/submissions/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Admin Settings
  adminGetSettings: () => request<SiteSettings>('/admin/settings'),
  adminUpdateSettings: (updates: Partial<SiteSettings>) =>
    request<SiteSettings>('/admin/settings', { method: 'PUT', body: JSON.stringify(updates) }),

  // Admin Users
  adminGetUsers: () => request<User[]>('/admin/users'),
  adminUpdateUserRole: (id: string, role: string) =>
    request<User>(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),

  // Media & Upload
  uploadMedia: (fileName: string, fileData: string) =>
    request<{ url: string }>('/upload', {
      method: 'POST',
      body: JSON.stringify({ fileName, fileData })
    }, { url: fileData }),
  adminDeleteGalleryAlbum: (id: string) =>
    request<{ message: string }>(`/admin/gallery/${id}`, { method: 'DELETE' })
};
