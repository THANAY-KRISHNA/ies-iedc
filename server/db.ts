import fs from 'fs';
import path from 'path';
import {
  AcademicYear,
  Department,
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
} from '../src/types';
import {
  INITIAL_USERS,
  INITIAL_ACADEMIC_YEARS,
  INITIAL_DEPARTMENTS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_EVENTS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_STARTUPS,
  INITIAL_STUDENT_IDEAS,
  INITIAL_WORKSHOPS,
  INITIAL_RESOURCES,
  INITIAL_GALLERY_ALBUMS,
  INITIAL_NEWS,
  INITIAL_SITE_SETTINGS
} from '../src/data/initialData';
import { isSupabaseConfigured, supabaseAdmin } from './supabase';

export interface PosterMediaItem {
  id: string;
  title: string;
  url: string;
  fileType: 'image' | 'document';
  eventId?: string;
  eventName?: string;
  uploadedAt: string;
  size: string;
}

export interface MediaLibraryItem {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  size: string;
}

export interface DatabaseState {
  users: User[];
  academicYears: AcademicYear[];
  departments: Department[];
  teamMembers: TeamMember[];
  events: EventItem[];
  achievements: Achievement[];
  studentIdeas: StudentIdea[];
  startups: StartupItem[];
  workshops: WorkshopItem[];
  resources: ResourceItem[];
  galleryAlbums: GalleryAlbum[];
  news: NewsItem[];
  submissions: JoinSubmission[];
  activityLogs: ActivityLog[];
  siteSettings: SiteSettings;
  posters: PosterMediaItem[];
  mediaItems: MediaLibraryItem[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'iedc_db.json');

// Helper conversion functions for DB <-> Application Types
function mapTeamMemberFromDb(row: any): TeamMember {
  return {
    id: row.id,
    academicYear: row.academic_year_id || '2025–26',
    name: row.name,
    roleType: row.role_type || 'Student Lead',
    position: row.position || row.role_type || 'Team Member',
    department: row.department_code || 'CSE',
    designation: row.designation || '',
    responsibility: row.responsibility || '',
    email: row.email || '',
    linkedinUrl: row.linkedin_url || '',
    photoUrl: row.photo_url || '',
    sortOrder: typeof row.sort_order === 'number' ? row.sort_order : 99,
    status: row.status || 'Published',
    isFeatured: !!row.is_featured
  };
}

function cleanDeptCode(dept?: string): string {
  if (!dept) return 'CSE';
  const code = dept.split(' - ')[0].trim().toUpperCase();
  return code.substring(0, 10);
}

function mapTeamMemberToDb(data: Partial<TeamMember>) {
  const nameStr = (data.name || 'Team Member').trim().substring(0, 150);
  const roleTypeStr = (data.roleType || 'Student Lead').trim().substring(0, 50);
  const positionStr = (data.position || data.roleType || 'Team Member').trim().substring(0, 100);
  const deptCode = cleanDeptCode(data.department);
  const yearId = (data.academicYear || '2025–26').trim().substring(0, 32);

  return {
    id: data.id,
    academic_year_id: yearId,
    name: nameStr,
    role_type: roleTypeStr,
    position: positionStr,
    department_code: deptCode,
    designation: (data.designation || '').substring(0, 150),
    responsibility: data.responsibility || '',
    email: (data.email || '').substring(0, 150),
    linkedin_url: data.linkedinUrl || '',
    photo_url: data.photoUrl || '',
    sort_order: typeof data.sortOrder === 'number' ? data.sortOrder : 99,
    status: (data.status || 'Published').substring(0, 20),
    is_featured: !!data.isFeatured,
    updated_at: new Date().toISOString()
  };
}

function mapEventFromDb(row: any): EventItem {
  return {
    id: row.id,
    slug: row.slug || row.id,
    name: row.name,
    academicYear: row.academic_year_id || '2025–26',
    date: row.display_date || row.start_date || '',
    startDate: row.start_date || new Date().toISOString().split('T')[0],
    endDate: row.end_date || undefined,
    venue: row.venue || 'IESCE Campus',
    isOnline: !!row.is_online,
    organizer: row.organizer || 'IES IEDC',
    resourcePersons: Array.isArray(row.resource_persons) ? row.resource_persons : [],
    category: row.category || 'Workshop',
    description: row.description || '',
    participantsCount: row.participants_count || 0,
    teamsCount: row.teams_count || 0,
    teamsSelectedCount: row.teams_selected_count || 0,
    posterUrl: row.poster_url || '',
    galleryUrls: Array.isArray(row.gallery_urls) ? row.gallery_urls : [],
    registrationUrl: row.registration_url || '',
    status: row.status || 'Completed',
    needsAdminReview: !!row.needs_admin_review,
    adminReviewNote: row.admin_review_note || '',
    published: row.published !== false
  };
}

function mapEventToDb(data: Partial<EventItem>) {
  return {
    id: data.id,
    slug: data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : data.id),
    name: data.name,
    academic_year_id: data.academicYear || '2025–26',
    display_date: data.date,
    start_date: data.startDate || new Date().toISOString().split('T')[0],
    end_date: data.endDate || null,
    venue: data.venue || 'IESCE Campus',
    is_online: !!data.isOnline,
    organizer: data.organizer || 'IES IEDC',
    resource_persons: data.resourcePersons || [],
    category: data.category || 'Workshop',
    description: data.description || '',
    participants_count: data.participantsCount || 0,
    teams_count: data.teamsCount || 0,
    teams_selected_count: data.teamsSelectedCount || 0,
    poster_url: data.posterUrl || '',
    gallery_urls: data.galleryUrls || [],
    registration_url: data.registrationUrl || '',
    status: data.status || 'Completed',
    needs_admin_review: !!data.needsAdminReview,
    admin_review_note: data.adminReviewNote || '',
    published: data.published !== false,
    updated_at: new Date().toISOString()
  };
}

class DatabaseEngine {
  private memoryState: DatabaseState;

  constructor() {
    this.memoryState = this.loadInitialMemory();
  }

  private loadInitialMemory(): DatabaseState {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          users: parsed.users || INITIAL_USERS,
          academicYears: parsed.academicYears || INITIAL_ACADEMIC_YEARS,
          departments: parsed.departments || INITIAL_DEPARTMENTS,
          teamMembers: parsed.teamMembers || INITIAL_TEAM_MEMBERS,
          events: parsed.events || INITIAL_EVENTS,
          achievements: parsed.achievements || INITIAL_ACHIEVEMENTS,
          studentIdeas: parsed.studentIdeas || INITIAL_STUDENT_IDEAS,
          startups: parsed.startups || INITIAL_STARTUPS,
          workshops: parsed.workshops || INITIAL_WORKSHOPS,
          resources: parsed.resources || INITIAL_RESOURCES,
          galleryAlbums: parsed.galleryAlbums || INITIAL_GALLERY_ALBUMS,
          news: parsed.news || INITIAL_NEWS,
          submissions: parsed.submissions || [],
          activityLogs: parsed.activityLogs || [],
          siteSettings: parsed.siteSettings || INITIAL_SITE_SETTINGS,
          posters: parsed.posters || [],
          mediaItems: parsed.mediaItems || []
        };
      }
    } catch {}

    return {
      users: INITIAL_USERS,
      academicYears: INITIAL_ACADEMIC_YEARS,
      departments: INITIAL_DEPARTMENTS,
      teamMembers: INITIAL_TEAM_MEMBERS,
      events: INITIAL_EVENTS,
      achievements: INITIAL_ACHIEVEMENTS,
      studentIdeas: INITIAL_STUDENT_IDEAS,
      startups: INITIAL_STARTUPS,
      workshops: INITIAL_WORKSHOPS,
      resources: INITIAL_RESOURCES,
      galleryAlbums: INITIAL_GALLERY_ALBUMS,
      news: INITIAL_NEWS,
      submissions: [],
      activityLogs: [],
      siteSettings: INITIAL_SITE_SETTINGS,
      posters: [],
      mediaItems: []
    };
  }

  private saveMemory(state: DatabaseState) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Failed to write local backup DB file:', err);
    }
  }

  // --- LOG ACTIVITY ---
  public async logActivity(log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog> {
    const newLog: ActivityLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    this.memoryState.activityLogs.unshift(newLog);

    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('activity_logs').insert({
          id: newLog.id,
          user_name: newLog.userName,
          user_role: newLog.userRole,
          action: newLog.action,
          content_type: newLog.contentType,
          content_id: newLog.contentId,
          content_summary: newLog.contentSummary,
          timestamp: newLog.timestamp
        });
      } catch (e) {
        console.warn('Supabase logActivity warning:', e);
      }
    }
    this.saveMemory(this.memoryState);
    return newLog;
  }

  public async getActivityLogs(): Promise<ActivityLog[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin.from('activity_logs').select('*').order('timestamp', { ascending: false }).limit(100);
        if (!error && data && data.length > 0) {
          return data.map(r => ({
            id: r.id,
            userName: r.user_name,
            userRole: r.user_role,
            action: r.action,
            contentType: r.content_type,
            contentId: r.content_id,
            contentSummary: r.content_summary,
            timestamp: r.timestamp
          }));
        }
      } catch (e) {}
    }
    return this.memoryState.activityLogs;
  }

  // --- USERS ---
  public async getUsers(): Promise<User[]> {
    return this.memoryState.users;
  }

  public async updateUserRole(id: string, role: string, actor = 'Admin'): Promise<User | null> {
    const user = this.memoryState.users.find(u => u.id === id);
    if (!user) return null;
    user.role = role as any;
    await this.logActivity({
      userName: actor,
      userRole: 'Super Admin',
      action: 'Updated',
      contentType: 'User Role',
      contentId: id,
      contentSummary: `Updated ${user.name} role to ${role}`
    });
    return user;
  }

  // --- ACADEMIC YEARS ---
  public async getAcademicYears(): Promise<AcademicYear[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin.from('academic_years').select('*').order('year_name', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(r => ({
            id: r.id,
            year: r.year_name,
            isCurrent: !!r.is_current,
            notes: r.notes || ''
          }));
        }
      } catch (e) {}
    }
    return this.memoryState.academicYears;
  }

  public async addAcademicYear(year: AcademicYear, actor = 'Admin'): Promise<AcademicYear> {
    const idx = this.memoryState.academicYears.findIndex(y => y.id === year.id);
    if (idx !== -1) {
      this.memoryState.academicYears[idx] = year;
    } else {
      this.memoryState.academicYears.unshift(year);
    }

    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('academic_years').upsert({
          id: year.id,
          year_name: year.year,
          is_current: year.isCurrent,
          notes: year.notes
        });
      } catch (e) {
        console.warn('Supabase addAcademicYear error:', e);
      }
    }
    this.saveMemory(this.memoryState);
    await this.logActivity({
      userName: actor,
      userRole: 'Admin',
      action: 'Created',
      contentType: 'Academic Year',
      contentId: year.id,
      contentSummary: `Added academic year ${year.year}`
    });
    return year;
  }

  // --- TEAM MEMBERS ---
  public async getTeam(academicYear?: string, publishedOnly = false): Promise<TeamMember[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabaseAdmin.from('team_members').select('*');
        if (academicYear && academicYear !== 'all') {
          query = query.eq('academic_year_id', academicYear);
        }
        if (publishedOnly) {
          query = query.eq('status', 'Published');
        }
        const { data, error } = await query.order('sort_order', { ascending: true });
        if (!error && data) {
          const list = data.map(mapTeamMemberFromDb);
          if (list.length > 0) return list;
        } else if (error) {
          console.warn('Supabase getTeam error, serving local list:', error.message);
        }
      } catch (e) {
        console.warn('Failed querying team from Supabase:', e);
      }
    }

    let list = this.memoryState.teamMembers;
    if (academicYear && academicYear !== 'all') {
      list = list.filter(m => m.academicYear === academicYear);
    }
    if (publishedOnly) {
      list = list.filter(m => m.status === 'Published');
    }
    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public async addTeamMember(data: Omit<TeamMember, 'id'>, actor = 'Admin'): Promise<TeamMember> {
    const newMember: TeamMember = {
      ...data,
      id: `tm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };

    // Update memory backup
    this.memoryState.teamMembers.unshift(newMember);
    this.saveMemory(this.memoryState);

    if (isSupabaseConfigured()) {
      try {
        if (newMember.academicYear) {
          try {
            await supabaseAdmin.from('academic_years').upsert({
              id: newMember.academicYear,
              year_name: newMember.academicYear,
              is_current: false
            });
          } catch (e) {}
        }

        const dbRow = mapTeamMemberToDb(newMember);

        if (dbRow.department_code) {
          try {
            await supabaseAdmin.from('departments').upsert({
              id: `dept_${dbRow.department_code}`,
              code: dbRow.department_code,
              name: newMember.department || dbRow.department_code
            });
          } catch (e) {}
        }
        const { data: insertedRow, error } = await supabaseAdmin
          .from('team_members')
          .insert(dbRow)
          .select()
          .single();

        if (error) {
          console.error('Supabase addTeamMember INSERT Error:', error.message);
        } else if (insertedRow) {
          const syncedMember = mapTeamMemberFromDb(insertedRow);
          // Sync back to memory
          const idx = this.memoryState.teamMembers.findIndex(m => m.id === newMember.id);
          if (idx !== -1) this.memoryState.teamMembers[idx] = syncedMember;
          await this.logActivity({
            userName: actor,
            userRole: 'Team Admin',
            action: 'Created',
            contentType: 'Team Member',
            contentId: syncedMember.id,
            contentSummary: `Added team member ${syncedMember.name} (${syncedMember.position}) to Supabase`
          });
          return syncedMember;
        }
      } catch (e) {
        console.error('Failed to insert team member to Supabase:', e);
      }
    }

    await this.logActivity({
      userName: actor,
      userRole: 'Team Admin',
      action: 'Created',
      contentType: 'Team Member',
      contentId: newMember.id,
      contentSummary: `Added team member ${newMember.name} (${newMember.position})`
    });
    return newMember;
  }

  public async updateTeamMember(id: string, updates: Partial<TeamMember>, actor = 'Admin'): Promise<TeamMember | null> {
    const idx = this.memoryState.teamMembers.findIndex(m => m.id === id);
    let updatedMember: TeamMember | null = idx !== -1 ? { ...this.memoryState.teamMembers[idx], ...updates } : null;

    if (updatedMember) {
      this.memoryState.teamMembers[idx] = updatedMember;
      this.saveMemory(this.memoryState);
    }

    if (isSupabaseConfigured()) {
      try {
        const dbUpdates = mapTeamMemberToDb({ id, ...updates });
        const { data: row, error } = await supabaseAdmin
          .from('team_members')
          .update(dbUpdates)
          .eq('id', id)
          .select()
          .single();

        if (!error && row) {
          updatedMember = mapTeamMemberFromDb(row);
          if (idx !== -1) this.memoryState.teamMembers[idx] = updatedMember;
        } else if (error) {
          console.error('Supabase updateTeamMember Error:', error.message);
        }
      } catch (e) {
        console.error('Failed updating team member in Supabase:', e);
      }
    }

    if (updatedMember) {
      await this.logActivity({
        userName: actor,
        userRole: 'Team Admin',
        action: updates.status === 'Archived' ? 'Archived' : 'Updated',
        contentType: 'Team Member',
        contentId: id,
        contentSummary: `Updated team member ${updatedMember.name}`
      });
    }
    return updatedMember;
  }

  public async deleteTeamMember(id: string, actor = 'Admin'): Promise<boolean> {
    const idx = this.memoryState.teamMembers.findIndex(m => m.id === id);
    const memberName = idx !== -1 ? this.memoryState.teamMembers[idx].name : id;

    if (idx !== -1) {
      this.memoryState.teamMembers.splice(idx, 1);
      this.saveMemory(this.memoryState);
    }

    let success = idx !== -1;

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabaseAdmin.from('team_members').delete().eq('id', id);
        if (!error) {
          success = true;
        } else {
          console.error('Supabase deleteTeamMember Error:', error.message);
        }
      } catch (e) {
        console.error('Failed deleting team member from Supabase:', e);
      }
    }

    if (success) {
      await this.logActivity({
        userName: actor,
        userRole: 'Team Admin',
        action: 'Deleted',
        contentType: 'Team Member',
        contentId: id,
        contentSummary: `Removed team member ${memberName}`
      });
    }
    return success;
  }

  // --- EVENTS ---
  public async getEvents(params: { year?: string; category?: string; status?: string; search?: string; publishedOnly?: boolean }): Promise<EventItem[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabaseAdmin.from('events').select('*');
        if (params.year && params.year !== 'all') {
          query = query.eq('academic_year_id', params.year);
        }
        if (params.category && params.category !== 'All') {
          query = query.eq('category', params.category);
        }
        if (params.status && params.status !== 'All') {
          query = query.eq('status', params.status);
        }
        if (params.publishedOnly) {
          query = query.eq('published', true);
        }
        const { data, error } = await query.order('start_date', { ascending: false });
        if (!error && data && data.length > 0) {
          let list = data.map(mapEventFromDb);
          if (params.search) {
            const s = params.search.toLowerCase();
            list = list.filter(e => e.name.toLowerCase().includes(s) || e.description.toLowerCase().includes(s));
          }
          return list;
        }
      } catch (e) {}
    }

    let list = this.memoryState.events;
    if (params.year && params.year !== 'all') list = list.filter(e => e.academicYear === params.year);
    if (params.category && params.category !== 'All') list = list.filter(e => e.category === params.category);
    if (params.status && params.status !== 'All') list = list.filter(e => e.status === params.status);
    if (params.publishedOnly) list = list.filter(e => e.published);
    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(s) || e.description.toLowerCase().includes(s));
    }
    return list;
  }

  public async getEventBySlug(slug: string): Promise<EventItem | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin.from('events').select('*').eq('slug', slug).single();
        if (!error && data) return mapEventFromDb(data);
      } catch (e) {}
    }
    return this.memoryState.events.find(e => e.slug === slug || e.id === slug) || null;
  }

  public async addEvent(data: Omit<EventItem, 'id'>, actor = 'Admin'): Promise<EventItem> {
    const newEvent: EventItem = {
      ...data,
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug: data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `evt-${Date.now()}`)
    };

    this.memoryState.events.unshift(newEvent);
    this.saveMemory(this.memoryState);

    if (isSupabaseConfigured()) {
      try {
        const dbRow = mapEventToDb(newEvent);
        const { data: row, error } = await supabaseAdmin.from('events').insert(dbRow).select().single();
        if (!error && row) {
          const synced = mapEventFromDb(row);
          const idx = this.memoryState.events.findIndex(e => e.id === newEvent.id);
          if (idx !== -1) this.memoryState.events[idx] = synced;
          await this.logActivity({
            userName: actor,
            userRole: 'Content Admin',
            action: 'Created',
            contentType: 'Event',
            contentId: synced.id,
            contentSummary: `Created event ${synced.name} in Supabase`
          });
          return synced;
        }
      } catch (e) {
        console.error('Failed to insert event to Supabase:', e);
      }
    }

    await this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: 'Created',
      contentType: 'Event',
      contentId: newEvent.id,
      contentSummary: `Created event ${newEvent.name}`
    });
    return newEvent;
  }

  public async updateEvent(id: string, updates: Partial<EventItem>, actor = 'Admin'): Promise<EventItem | null> {
    const idx = this.memoryState.events.findIndex(e => e.id === id);
    let updated: EventItem | null = idx !== -1 ? { ...this.memoryState.events[idx], ...updates } : null;

    if (updated) {
      this.memoryState.events[idx] = updated;
      this.saveMemory(this.memoryState);
    }

    if (isSupabaseConfigured()) {
      try {
        const dbUpdates = mapEventToDb({ id, ...updates });
        const { data: row, error } = await supabaseAdmin.from('events').update(dbUpdates).eq('id', id).select().single();
        if (!error && row) {
          updated = mapEventFromDb(row);
          if (idx !== -1) this.memoryState.events[idx] = updated;
        }
      } catch (e) {}
    }

    if (updated) {
      await this.logActivity({
        userName: actor,
        userRole: 'Content Admin',
        action: 'Updated',
        contentType: 'Event',
        contentId: id,
        contentSummary: `Updated event ${updated.name}`
      });
    }
    return updated;
  }

  public async deleteEvent(id: string, actor = 'Admin'): Promise<boolean> {
    const idx = this.memoryState.events.findIndex(e => e.id === id);
    const eventName = idx !== -1 ? this.memoryState.events[idx].name : id;

    if (idx !== -1) {
      this.memoryState.events.splice(idx, 1);
      this.saveMemory(this.memoryState);
    }

    let success = idx !== -1;
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabaseAdmin.from('events').delete().eq('id', id);
        if (!error) success = true;
      } catch (e) {}
    }

    if (success) {
      await this.logActivity({
        userName: actor,
        userRole: 'Content Admin',
        action: 'Deleted',
        contentType: 'Event',
        contentId: id,
        contentSummary: `Deleted event ${eventName}`
      });
    }
    return success;
  }

  // --- ACHIEVEMENTS ---
  public async getAchievements(params: { year?: string; category?: string; publishedOnly?: boolean }): Promise<Achievement[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabaseAdmin.from('achievements').select('*');
        if (params.year && params.year !== 'all') query = query.eq('academic_year_id', params.year);
        if (params.category && params.category !== 'All') query = query.eq('category', params.category);
        if (params.publishedOnly) query = query.eq('published', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(r => ({
            id: r.id,
            title: r.title,
            academicYear: r.academic_year_id || '2025–26',
            category: r.category,
            recipients: r.recipients,
            description: r.description,
            dateAwarded: r.date_awarded,
            verificationInfo: r.verification_info,
            certificateUrl: r.certificate_url,
            imageUrl: r.image_url,
            published: r.published !== false
          }));
        }
      } catch (e) {}
    }

    let list = this.memoryState.achievements;
    if (params.year && params.year !== 'all') list = list.filter(a => a.academicYear === params.year);
    if (params.category && params.category !== 'All') list = list.filter(a => a.category === params.category);
    if (params.publishedOnly) list = list.filter(a => a.published);
    return list;
  }

  public async addAchievement(data: Omit<Achievement, 'id'>, actor = 'Admin'): Promise<Achievement> {
    const item: Achievement = {
      ...data,
      id: `ach_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    this.memoryState.achievements.unshift(item);
    this.saveMemory(this.memoryState);

    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('achievements').insert({
          id: item.id,
          title: item.title,
          academic_year_id: item.academicYear,
          category: item.category,
          recipients: item.recipients,
          description: item.description,
          date_awarded: item.dateAwarded || null,
          verification_info: item.verificationInfo || null,
          certificate_url: item.certificateUrl || null,
          image_url: item.imageUrl || null,
          published: item.published !== false
        });
      } catch (e) {}
    }

    await this.logActivity({
      userName: actor,
      userRole: 'Achievement Admin',
      action: 'Created',
      contentType: 'Achievement',
      contentId: item.id,
      contentSummary: `Added achievement ${item.title}`
    });
    return item;
  }

  public async updateAchievement(id: string, updates: Partial<Achievement>, actor = 'Admin'): Promise<Achievement | null> {
    const idx = this.memoryState.achievements.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.memoryState.achievements[idx] = { ...this.memoryState.achievements[idx], ...updates };
    this.saveMemory(this.memoryState);

    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('achievements').update({
          title: updates.title,
          category: updates.category,
          recipients: updates.recipients,
          description: updates.description,
          date_awarded: updates.dateAwarded,
          verification_info: updates.verificationInfo,
          published: updates.published
        }).eq('id', id);
      } catch (e) {}
    }
    return this.memoryState.achievements[idx];
  }

  public async deleteAchievement(id: string, actor = 'Admin'): Promise<boolean> {
    const idx = this.memoryState.achievements.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.memoryState.achievements.splice(idx, 1);
      this.saveMemory(this.memoryState);
    }
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('achievements').delete().eq('id', id);
      } catch (e) {}
    }
    return idx !== -1;
  }

  // --- STARTUPS ---
  public async getStartups(publishedOnly = false): Promise<StartupItem[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabaseAdmin.from('startups').select('*');
        if (publishedOnly) query = query.eq('published', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(r => ({
            id: r.id,
            name: r.name,
            founderTeam: r.founder_team,
            department: r.department_code,
            academicYear: r.academic_year_id || '2025–26',
            problemSolved: r.problem_solved,
            productService: r.product_service,
            description: r.description,
            logoUrl: r.logo_url,
            websiteUrl: r.website_url,
            socialMediaUrl: r.social_media_url,
            status: r.status || 'Ideation',
            published: r.published !== false
          }));
        }
      } catch (e) {}
    }
    let list = this.memoryState.startups;
    if (publishedOnly) list = list.filter(s => s.published);
    return list;
  }

  public async addStartup(data: Omit<StartupItem, 'id'>, actor = 'Admin'): Promise<StartupItem> {
    const item: StartupItem = {
      ...data,
      id: `stp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    this.memoryState.startups.unshift(item);
    this.saveMemory(this.memoryState);

    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('startups').insert({
          id: item.id,
          name: item.name,
          founder_team: item.founderTeam,
          department_code: item.department,
          academic_year_id: item.academicYear,
          problem_solved: item.problemSolved,
          product_service: item.productService,
          description: item.description,
          logo_url: item.logoUrl,
          website_url: item.websiteUrl,
          status: item.status,
          published: item.published !== false
        });
      } catch (e) {}
    }
    return item;
  }

  public async updateStartup(id: string, updates: Partial<StartupItem>, actor = 'Admin'): Promise<StartupItem | null> {
    const idx = this.memoryState.startups.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.memoryState.startups[idx] = { ...this.memoryState.startups[idx], ...updates };
    this.saveMemory(this.memoryState);
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('startups').update({
          name: updates.name,
          founder_team: updates.founderTeam,
          description: updates.description,
          status: updates.status,
          published: updates.published
        }).eq('id', id);
      } catch (e) {}
    }
    return this.memoryState.startups[idx];
  }

  public async deleteStartup(id: string, actor = 'Admin'): Promise<boolean> {
    const idx = this.memoryState.startups.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.memoryState.startups.splice(idx, 1);
      this.saveMemory(this.memoryState);
    }
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('startups').delete().eq('id', id);
      } catch (e) {}
    }
    return idx !== -1;
  }

  // --- WORKSHOPS ---
  public async getWorkshops(publishedOnly = false): Promise<WorkshopItem[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabaseAdmin.from('workshops').select('*');
        if (publishedOnly) query = query.eq('published', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(r => ({
            id: r.id,
            title: r.title,
            academicYear: r.academic_year_id || '2025–26',
            date: r.display_date,
            venue: r.venue,
            isOnline: !!r.is_online,
            speakers: r.speakers || [],
            mentors: r.mentors || [],
            description: r.description,
            topicsCovered: r.topics_covered || [],
            registrationUrl: r.registration_url,
            certificateProvided: r.certificate_provided !== false,
            learningMaterialsUrl: r.learning_materials_url,
            photos: r.photos || [],
            status: r.status || 'Past',
            published: r.published !== false
          }));
        }
      } catch (e) {}
    }
    let list = this.memoryState.workshops;
    if (publishedOnly) list = list.filter(w => w.published);
    return list;
  }

  public async addWorkshop(data: Omit<WorkshopItem, 'id'>, actor = 'Admin'): Promise<WorkshopItem> {
    const item: WorkshopItem = {
      ...data,
      id: `ws_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    this.memoryState.workshops.unshift(item);
    this.saveMemory(this.memoryState);

    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('workshops').insert({
          id: item.id,
          title: item.title,
          academic_year_id: item.academicYear,
          display_date: item.date,
          venue: item.venue,
          is_online: item.isOnline,
          speakers: item.speakers || [],
          description: item.description,
          status: item.status,
          published: item.published !== false
        });
      } catch (e) {}
    }
    return item;
  }

  public async updateWorkshop(id: string, updates: Partial<WorkshopItem>, actor = 'Admin'): Promise<WorkshopItem | null> {
    const idx = this.memoryState.workshops.findIndex(w => w.id === id);
    if (idx === -1) return null;
    this.memoryState.workshops[idx] = { ...this.memoryState.workshops[idx], ...updates };
    this.saveMemory(this.memoryState);
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('workshops').update({
          title: updates.title,
          display_date: updates.date,
          venue: updates.venue,
          description: updates.description,
          published: updates.published
        }).eq('id', id);
      } catch (e) {}
    }
    return this.memoryState.workshops[idx];
  }

  public async deleteWorkshop(id: string, actor = 'Admin'): Promise<boolean> {
    const idx = this.memoryState.workshops.findIndex(w => w.id === id);
    if (idx !== -1) {
      this.memoryState.workshops.splice(idx, 1);
      this.saveMemory(this.memoryState);
    }
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('workshops').delete().eq('id', id);
      } catch (e) {}
    }
    return idx !== -1;
  }

  // --- RESOURCES ---
  public async getResources(category?: string, publishedOnly = false): Promise<ResourceItem[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabaseAdmin.from('resources').select('*');
        if (category && category !== 'All') query = query.eq('category', category);
        if (publishedOnly) query = query.eq('published', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(r => ({
            id: r.id,
            title: r.title,
            category: r.category,
            description: r.description,
            authorOrSource: r.author_or_source,
            linkUrl: r.link_url,
            fileType: r.file_type,
            dateAdded: r.date_added,
            published: r.published !== false
          }));
        }
      } catch (e) {}
    }
    let list = this.memoryState.resources;
    if (category && category !== 'All') list = list.filter(r => r.category === category);
    if (publishedOnly) list = list.filter(r => r.published);
    return list;
  }

  public async addResource(data: Omit<ResourceItem, 'id'>, actor = 'Admin'): Promise<ResourceItem> {
    const item: ResourceItem = {
      ...data,
      id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    this.memoryState.resources.unshift(item);
    this.saveMemory(this.memoryState);
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('resources').insert({
          id: item.id,
          title: item.title,
          category: item.category,
          description: item.description,
          author_or_source: item.authorOrSource,
          link_url: item.linkUrl,
          file_type: item.fileType,
          published: item.published !== false
        });
      } catch (e) {}
    }
    return item;
  }

  public async updateResource(id: string, updates: Partial<ResourceItem>, actor = 'Admin'): Promise<ResourceItem | null> {
    const idx = this.memoryState.resources.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.memoryState.resources[idx] = { ...this.memoryState.resources[idx], ...updates };
    this.saveMemory(this.memoryState);
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('resources').update({
          title: updates.title,
          category: updates.category,
          description: updates.description,
          link_url: updates.linkUrl,
          published: updates.published
        }).eq('id', id);
      } catch (e) {}
    }
    return this.memoryState.resources[idx];
  }

  public async deleteResource(id: string, actor = 'Admin'): Promise<boolean> {
    const idx = this.memoryState.resources.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.memoryState.resources.splice(idx, 1);
      this.saveMemory(this.memoryState);
    }
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('resources').delete().eq('id', id);
      } catch (e) {}
    }
    return idx !== -1;
  }

  // --- GALLERY ---
  public async getGallery(category?: string, publishedOnly = false): Promise<GalleryAlbum[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabaseAdmin.from('gallery_albums').select('*, gallery_images(*)');
        if (category && category !== 'All') query = query.eq('category', category);
        if (publishedOnly) query = query.eq('published', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(r => ({
            id: r.id,
            title: r.title,
            academicYear: r.academic_year_id || '2025–26',
            category: r.category,
            coverImageUrl: r.cover_image_url,
            images: Array.isArray(r.gallery_images)
              ? r.gallery_images.map((img: any, i: number) => ({
                  id: img.id,
                  albumId: r.id,
                  imageUrl: img.image_url || img.url || '',
                  caption: img.caption || '',
                  sortOrder: typeof img.sort_order === 'number' ? img.sort_order : i
                }))
              : [],
            published: r.published !== false,
            createdAt: r.created_at || new Date().toISOString()
          }));
        }
      } catch (e) {}
    }
    let list = this.memoryState.galleryAlbums;
    if (category && category !== 'All') list = list.filter(g => g.category === category);
    if (publishedOnly) list = list.filter(g => g.published);
    return list;
  }

  public async addGalleryAlbum(data: Omit<GalleryAlbum, 'id'>, actor = 'Admin'): Promise<GalleryAlbum> {
    const album: GalleryAlbum = {
      ...data,
      id: `alb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    this.memoryState.galleryAlbums.unshift(album);
    this.saveMemory(this.memoryState);

    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('gallery_albums').insert({
          id: album.id,
          title: album.title,
          academic_year_id: album.academicYear,
          category: album.category,
          cover_image_url: album.coverImageUrl,
          published: album.published !== false
        });

        if (album.images && album.images.length > 0) {
          const imgRows = album.images.map((img, i) => ({
            id: img.id || `img_${Date.now()}_${i}`,
            album_id: album.id,
            image_url: img.imageUrl || (img as any).url || '',
            caption: img.caption || '',
            sort_order: i
          }));
          await supabaseAdmin.from('gallery_images').insert(imgRows);
        }
      } catch (e) {}
    }
    return album;
  }

  public async updateGalleryAlbum(id: string, updates: Partial<GalleryAlbum>, actor = 'Admin'): Promise<GalleryAlbum | null> {
    const idx = this.memoryState.galleryAlbums.findIndex(g => g.id === id);
    if (idx === -1) return null;
    this.memoryState.galleryAlbums[idx] = { ...this.memoryState.galleryAlbums[idx], ...updates };
    this.saveMemory(this.memoryState);

    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('gallery_albums').update({
          title: updates.title,
          category: updates.category,
          cover_image_url: updates.coverImageUrl,
          published: updates.published
        }).eq('id', id);
      } catch (e) {}
    }
    return this.memoryState.galleryAlbums[idx];
  }

  public async deleteGalleryAlbum(id: string, actor = 'Admin'): Promise<boolean> {
    const idx = this.memoryState.galleryAlbums.findIndex(g => g.id === id);
    if (idx !== -1) {
      this.memoryState.galleryAlbums.splice(idx, 1);
      this.saveMemory(this.memoryState);
    }
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('gallery_albums').delete().eq('id', id);
      } catch (e) {}
    }
    return idx !== -1;
  }

  // --- NEWS ---
  public async getNews(params: { status?: string; search?: string; publishedOnly?: boolean }): Promise<NewsItem[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabaseAdmin.from('news').select('*');
        if (params.status && params.status !== 'All') query = query.eq('status', params.status);
        if (params.publishedOnly) query = query.eq('status', 'Published');
        const { data, error } = await query.order('publication_date', { ascending: false });
        if (!error && data && data.length > 0) {
          let list = data.map(r => ({
            id: r.id,
            slug: r.slug,
            title: r.title,
            category: r.category,
            excerpt: r.excerpt,
            content: r.content,
            featuredImageUrl: r.featured_image_url,
            author: r.author,
            publicationDate: r.publication_date,
            academicYear: r.academic_year_id || '2025–26',
            status: r.status || 'Published'
          }));
          if (params.search) {
            const s = params.search.toLowerCase();
            list = list.filter(n => n.title.toLowerCase().includes(s) || n.content.toLowerCase().includes(s));
          }
          return list;
        }
      } catch (e) {}
    }

    let list = this.memoryState.news;
    if (params.publishedOnly) list = list.filter(n => n.status === 'Published');
    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter(n => n.title.toLowerCase().includes(s) || n.content.toLowerCase().includes(s));
    }
    return list;
  }

  public async getNewsBySlug(slug: string): Promise<NewsItem | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin.from('news').select('*').eq('slug', slug).single();
        if (!error && data) {
          return {
            id: data.id,
            slug: data.slug,
            title: data.title,
            category: data.category,
            excerpt: data.excerpt,
            content: data.content,
            featuredImageUrl: data.featured_image_url,
            author: data.author,
            publicationDate: data.publication_date,
            academicYear: data.academic_year_id || '2025–26',
            status: data.status || 'Published'
          };
        }
      } catch (e) {}
    }
    return this.memoryState.news.find(n => n.slug === slug || n.id === slug) || null;
  }

  public async addNews(data: Omit<NewsItem, 'id'>, actor = 'Admin'): Promise<NewsItem> {
    const article: NewsItem = {
      ...data,
      id: `news_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug: data.slug || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `news-${Date.now()}`)
    };
    this.memoryState.news.unshift(article);
    this.saveMemory(this.memoryState);

    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('news').insert({
          id: article.id,
          slug: article.slug,
          title: article.title,
          category: article.category,
          excerpt: article.excerpt,
          content: article.content,
          featured_image_url: article.featuredImageUrl,
          author: article.author,
          publication_date: article.publicationDate || new Date().toISOString().split('T')[0],
          academic_year_id: article.academicYear,
          status: article.status
        });
      } catch (e) {}
    }

    return article;
  }

  public async updateNews(id: string, updates: Partial<NewsItem>, actor = 'Admin'): Promise<NewsItem | null> {
    const idx = this.memoryState.news.findIndex(n => n.id === id);
    if (idx === -1) return null;
    this.memoryState.news[idx] = { ...this.memoryState.news[idx], ...updates };
    this.saveMemory(this.memoryState);

    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('news').update({
          title: updates.title,
          category: updates.category,
          excerpt: updates.excerpt,
          content: updates.content,
          featured_image_url: updates.featuredImageUrl,
          status: updates.status
        }).eq('id', id);
      } catch (e) {}
    }
    return this.memoryState.news[idx];
  }

  public async deleteNews(id: string, actor = 'Admin'): Promise<boolean> {
    const idx = this.memoryState.news.findIndex(n => n.id === id);
    if (idx !== -1) {
      this.memoryState.news.splice(idx, 1);
      this.saveMemory(this.memoryState);
    }
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('news').delete().eq('id', id);
      } catch (e) {}
    }
    return idx !== -1;
  }

  // --- STUDENT IDEAS & SUBMISSIONS ---
  public async getIdeas(params?: { status?: string; search?: string }): Promise<StudentIdea[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabaseAdmin.from('student_ideas').select('*');
        if (params?.status && params.status !== 'All') query = query.eq('status', params.status);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(r => ({
            id: r.id,
            projectName: r.project_name,
            studentName: r.student_name,
            studentEmail: r.student_email,
            studentPhone: r.student_phone,
            department: r.department_code,
            academicYear: r.academic_year_id || '2025–26',
            problem: r.problem,
            proposedSolution: r.proposed_solution,
            technology: r.technology,
            description: r.description,
            imageUrl: r.image_url,
            status: r.status || 'New',
            adminNotes: r.admin_notes,
            submittedAt: r.submitted_at
          }));
        }
      } catch (e) {}
    }

    let list = this.memoryState.studentIdeas;
    if (params?.status && params.status !== 'All') list = list.filter(i => i.status === params.status);
    return list;
  }

  public async submitIdea(data: Omit<StudentIdea, 'id' | 'status' | 'submittedAt'>): Promise<StudentIdea> {
    const idea: StudentIdea = {
      ...data,
      id: `idea_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'New',
      submittedAt: new Date().toISOString()
    };
    this.memoryState.studentIdeas.unshift(idea);
    this.saveMemory(this.memoryState);

    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('student_ideas').insert({
          id: idea.id,
          project_name: idea.projectName,
          student_name: idea.studentName,
          student_email: idea.studentEmail,
          student_phone: idea.studentPhone,
          department_code: idea.department,
          academic_year_id: idea.academicYear,
          problem: idea.problem,
          proposed_solution: idea.proposedSolution,
          technology: idea.technology,
          description: idea.description,
          image_url: idea.imageUrl,
          status: 'New',
          submitted_at: idea.submittedAt
        });
      } catch (e) {}
    }
    return idea;
  }

  public async updateIdea(id: string, updates: Partial<StudentIdea>, actor = 'Admin'): Promise<StudentIdea | null> {
    const idx = this.memoryState.studentIdeas.findIndex(i => i.id === id);
    if (idx === -1) return null;
    this.memoryState.studentIdeas[idx] = { ...this.memoryState.studentIdeas[idx], ...updates };
    this.saveMemory(this.memoryState);
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('student_ideas').update({
          status: updates.status,
          admin_notes: updates.adminNotes
        }).eq('id', id);
      } catch (e) {}
    }
    return this.memoryState.studentIdeas[idx];
  }

  // --- JOIN SUBMISSIONS ---
  public async getSubmissions(): Promise<JoinSubmission[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin.from('join_submissions').select('*').order('submitted_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(r => ({
            id: r.id,
            fullName: r.full_name,
            email: r.email,
            phone: r.phone,
            department: r.department_code,
            semester: r.semester,
            rollNumber: r.roll_number,
            interestAreas: r.interest_areas || [],
            previousExperience: r.previous_experience || '',
            whyJoin: r.why_join,
            status: r.status || 'New',
            adminNotes: r.admin_notes,
            submittedAt: r.submitted_at
          }));
        }
      } catch (e) {}
    }
    return this.memoryState.submissions;
  }

  public async submitJoin(data: Omit<JoinSubmission, 'id' | 'status' | 'submittedAt'>): Promise<JoinSubmission> {
    const sub: JoinSubmission = {
      ...data,
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'New',
      submittedAt: new Date().toISOString()
    };
    this.memoryState.submissions.unshift(sub);
    this.saveMemory(this.memoryState);

    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('join_submissions').insert({
          id: sub.id,
          full_name: sub.fullName,
          email: sub.email,
          phone: sub.phone,
          department_code: sub.department,
          semester: sub.semester,
          roll_number: sub.rollNumber,
          interest_areas: sub.interestAreas,
          previous_experience: sub.previousExperience,
          why_join: sub.whyJoin,
          status: 'New',
          submitted_at: sub.submittedAt
        });
      } catch (e) {}
    }
    return sub;
  }

  public async updateSubmission(id: string, updates: Partial<JoinSubmission>, actor = 'Admin'): Promise<JoinSubmission | null> {
    const idx = this.memoryState.submissions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.memoryState.submissions[idx] = { ...this.memoryState.submissions[idx], ...updates };
    this.saveMemory(this.memoryState);
    if (isSupabaseConfigured()) {
      try {
        await supabaseAdmin.from('join_submissions').update({
          status: updates.status,
          admin_notes: updates.adminNotes
        }).eq('id', id);
      } catch (e) {}
    }
    return this.memoryState.submissions[idx];
  }

  // --- SITE SETTINGS ---
  public async getSiteSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin.from('site_settings').select('*');
        if (!error && data && data.length > 0) {
          const settings = { ...this.memoryState.siteSettings };
          data.forEach(r => {
            if (r.key && r.value) {
              (settings as any)[r.key] = r.value;
            }
          });
          return settings;
        }
      } catch (e) {}
    }
    return this.memoryState.siteSettings;
  }

  public async updateSiteSettings(updates: Partial<SiteSettings>, actor = 'Admin'): Promise<SiteSettings> {
    this.memoryState.siteSettings = { ...this.memoryState.siteSettings, ...updates };
    this.saveMemory(this.memoryState);

    if (isSupabaseConfigured()) {
      try {
        const keys = Object.keys(updates) as (keyof SiteSettings)[];
        for (const k of keys) {
          await supabaseAdmin.from('site_settings').upsert({
            key: k,
            value: updates[k],
            updated_at: new Date().toISOString()
          });
        }
      } catch (e) {}
    }

    await this.logActivity({
      userName: actor,
      userRole: 'Super Admin',
      action: 'Updated',
      contentType: 'Site Settings',
      contentId: 'site_settings',
      contentSummary: 'Updated global site settings & hero content'
    });
    return this.memoryState.siteSettings;
  }

  // --- POSTERS & MEDIA ---
  public async getPosters(): Promise<PosterMediaItem[]> {
    return this.memoryState.posters;
  }

  public async addPoster(item: Omit<PosterMediaItem, 'id' | 'uploadedAt'>, actor = 'Admin'): Promise<PosterMediaItem> {
    const poster: PosterMediaItem = {
      ...item,
      id: `post_${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    this.memoryState.posters.unshift(poster);
    this.saveMemory(this.memoryState);
    return poster;
  }

  public async deletePoster(id: string, actor = 'Admin'): Promise<boolean> {
    const idx = this.memoryState.posters.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.memoryState.posters.splice(idx, 1);
      this.saveMemory(this.memoryState);
    }
    return idx !== -1;
  }

  public async getMediaItems(): Promise<MediaLibraryItem[]> {
    return this.memoryState.mediaItems;
  }

  public async addMediaItem(item: Omit<MediaLibraryItem, 'id' | 'uploadedAt'>, actor = 'Admin'): Promise<MediaLibraryItem> {
    const media: MediaLibraryItem = {
      ...item,
      id: `med_${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    this.memoryState.mediaItems.unshift(media);
    this.saveMemory(this.memoryState);
    return media;
  }

  public async deleteMediaItem(id: string, actor = 'Admin'): Promise<boolean> {
    const idx = this.memoryState.mediaItems.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.memoryState.mediaItems.splice(idx, 1);
      this.saveMemory(this.memoryState);
    }
    return idx !== -1;
  }

  // --- STATS ---
  public async getStats(): Promise<any> {
    const team = await this.getTeam(undefined, false);
    const events = await this.getEvents({ publishedOnly: false });
    const achievements = await this.getAchievements({ publishedOnly: false });
    const ideas = await this.getIdeas();
    const startups = await this.getStartups(false);
    const workshops = await this.getWorkshops(false);
    const gallery = await this.getGallery(undefined, false);

    return {
      totalMembers: team.length,
      publishedMembers: team.filter(m => m.status === 'Published').length,
      totalEvents: events.length,
      completedEvents: events.filter(e => e.status === 'Completed').length,
      upcomingEvents: events.filter(e => e.status === 'Upcoming').length,
      totalAchievements: achievements.length,
      totalStudentIdeas: ideas.length,
      newIdeas: ideas.filter(i => i.status === 'New').length,
      totalStartups: startups.length,
      totalWorkshops: workshops.length,
      totalAlbums: gallery.length,
      totalSubmissions: (await this.getSubmissions()).length
    };
  }
}

export const db = new DatabaseEngine();
