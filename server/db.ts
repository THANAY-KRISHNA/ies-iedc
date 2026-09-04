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
import { isSupabaseConfigured, supabaseAdmin, uploadToSupabaseStorage } from './supabase';

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

class DatabaseEngine {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadInitial();
  }

  private loadInitial(): DatabaseState {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

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
          activityLogs: parsed.activityLogs || [
            {
              id: 'log_seed',
              userName: 'System',
              userRole: 'Super Admin',
              action: 'Created',
              contentType: 'System',
              contentId: 'init',
              contentSummary: 'IES IEDC database initialized with verified records',
              timestamp: new Date().toISOString()
            }
          ],
          siteSettings: parsed.siteSettings || INITIAL_SITE_SETTINGS,
          posters: parsed.posters || [],
          mediaItems: parsed.mediaItems || []
        };
      }
    } catch (err) {
      console.warn('Could not read persistent DB file, falling back to in-memory verified seeds', err);
    }

    const defaultState: DatabaseState = {
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
      activityLogs: [
        {
          id: 'log_seed',
          userName: 'System',
          userRole: 'Super Admin',
          action: 'Created',
          contentType: 'System',
          contentId: 'init',
          contentSummary: 'IES IEDC database initialized with verified records',
          timestamp: new Date().toISOString()
        }
      ],
      siteSettings: INITIAL_SITE_SETTINGS,
      posters: [],
      mediaItems: []
    };

    this.save(defaultState);
    return defaultState;
  }

  private save(state: DatabaseState) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write to DB file:', err);
    }
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public logActivity(log: Omit<ActivityLog, 'id' | 'timestamp'>) {
    const newLog: ActivityLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    this.state.activityLogs.unshift(newLog);
    if (this.state.activityLogs.length > 200) {
      this.state.activityLogs = this.state.activityLogs.slice(0, 200);
    }
    this.save(this.state);
    return newLog;
  }

  // --- ACADEMIC YEARS ---
  public getAcademicYears(): AcademicYear[] {
    return this.state.academicYears;
  }

  public addAcademicYear(year: AcademicYear, actor = 'Admin') {
    this.state.academicYears.push(year);
    this.logActivity({
      userName: actor,
      userRole: 'Admin',
      action: 'Created',
      contentType: 'Academic Year',
      contentId: year.id,
      contentSummary: `Added academic year ${year.year}`
    });
    this.save(this.state);
    return year;
  }

  // --- TEAM MEMBERS ---
  public getTeam(academicYear?: string, publishedOnly = false): TeamMember[] {
    let list = this.state.teamMembers;
    if (academicYear) {
      list = list.filter(m => m.academicYear === academicYear);
    }
    if (publishedOnly) {
      list = list.filter(m => m.status === 'Published');
    }
    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public addTeamMember(data: Omit<TeamMember, 'id'>, actor = 'Admin'): TeamMember {
    const newMember: TeamMember = {
      ...data,
      id: `tm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    this.state.teamMembers.push(newMember);
    this.logActivity({
      userName: actor,
      userRole: 'Team Admin',
      action: 'Created',
      contentType: 'Team Member',
      contentId: newMember.id,
      contentSummary: `Added team member ${newMember.name} (${newMember.position}, ${newMember.academicYear})`
    });
    this.save(this.state);
    return newMember;
  }

  public updateTeamMember(id: string, updates: Partial<TeamMember>, actor = 'Admin'): TeamMember | null {
    const idx = this.state.teamMembers.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.state.teamMembers[idx] = { ...this.state.teamMembers[idx], ...updates };
    this.logActivity({
      userName: actor,
      userRole: 'Team Admin',
      action: updates.status === 'Archived' ? 'Archived' : updates.status === 'Published' ? 'Published' : 'Updated',
      contentType: 'Team Member',
      contentId: id,
      contentSummary: `Updated team member ${this.state.teamMembers[idx].name}`
    });
    this.save(this.state);
    return this.state.teamMembers[idx];
  }

  public deleteTeamMember(id: string, actor = 'Admin'): boolean {
    const member = this.state.teamMembers.find(m => m.id === id);
    if (!member) return false;
    this.state.teamMembers = this.state.teamMembers.filter(m => m.id !== id);
    this.logActivity({
      userName: actor,
      userRole: 'Team Admin',
      action: 'Deleted',
      contentType: 'Team Member',
      contentId: id,
      contentSummary: `Deleted team member ${member.name}`
    });
    this.save(this.state);
    return true;
  }

  // --- EVENTS ---
  public getEvents(options?: {
    year?: string;
    category?: string;
    status?: string;
    search?: string;
    publishedOnly?: boolean;
  }): EventItem[] {
    let list = this.state.events;
    if (options?.publishedOnly) {
      list = list.filter(e => e.published);
    }
    if (options?.year) {
      list = list.filter(e => e.academicYear === options.year);
    }
    if (options?.category && options.category !== 'All') {
      list = list.filter(e => e.category.toLowerCase() === options.category?.toLowerCase());
    }
    if (options?.status && options.status !== 'All') {
      list = list.filter(e => e.status.toLowerCase() === options.status?.toLowerCase());
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        e =>
          e.name.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          (e.resourcePersons && e.resourcePersons.some(rp => rp.toLowerCase().includes(q)))
      );
    }
    return list;
  }

  public getEventBySlug(slug: string): EventItem | null {
    return this.state.events.find(e => e.slug === slug) || null;
  }

  public addEvent(data: Omit<EventItem, 'id'>, actor = 'Admin'): EventItem {
    const newEvent: EventItem = {
      ...data,
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    this.state.events.unshift(newEvent);
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: 'Created',
      contentType: 'Event',
      contentId: newEvent.id,
      contentSummary: `Created event "${newEvent.name}" (${newEvent.academicYear})`
    });
    this.save(this.state);
    return newEvent;
  }

  public updateEvent(id: string, updates: Partial<EventItem>, actor = 'Admin'): EventItem | null {
    const idx = this.state.events.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.state.events[idx] = { ...this.state.events[idx], ...updates };
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: updates.published ? 'Published' : 'Updated',
      contentType: 'Event',
      contentId: id,
      contentSummary: `Updated event "${this.state.events[idx].name}"`
    });
    this.save(this.state);
    return this.state.events[idx];
  }

  public deleteEvent(id: string, actor = 'Admin'): boolean {
    const event = this.state.events.find(e => e.id === id);
    if (!event) return false;
    this.state.events = this.state.events.filter(e => e.id !== id);
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: 'Deleted',
      contentType: 'Event',
      contentId: id,
      contentSummary: `Deleted event "${event.name}"`
    });
    this.save(this.state);
    return true;
  }

  // --- ACHIEVEMENTS ---
  public getAchievements(options?: { year?: string; category?: string; publishedOnly?: boolean }): Achievement[] {
    let list = this.state.achievements;
    if (options?.publishedOnly) {
      list = list.filter(a => a.published);
    }
    if (options?.year) {
      list = list.filter(a => a.academicYear === options.year);
    }
    if (options?.category && options.category !== 'All') {
      list = list.filter(a => a.category === options.category);
    }
    return list;
  }

  public addAchievement(data: Omit<Achievement, 'id'>, actor = 'Admin'): Achievement {
    const item: Achievement = {
      ...data,
      id: `ach_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    this.state.achievements.unshift(item);
    this.logActivity({
      userName: actor,
      userRole: 'Achievement Admin',
      action: item.published ? 'Published' : 'Created',
      contentType: 'Achievement',
      contentId: item.id,
      contentSummary: `Added achievement "${item.title}"`
    });
    this.save(this.state);
    return item;
  }

  public updateAchievement(id: string, updates: Partial<Achievement>, actor = 'Admin'): Achievement | null {
    const idx = this.state.achievements.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.state.achievements[idx] = { ...this.state.achievements[idx], ...updates };
    this.logActivity({
      userName: actor,
      userRole: 'Achievement Admin',
      action: updates.published ? 'Published' : 'Updated',
      contentType: 'Achievement',
      contentId: id,
      contentSummary: `Updated achievement "${this.state.achievements[idx].title}"`
    });
    this.save(this.state);
    return this.state.achievements[idx];
  }

  public deleteAchievement(id: string, actor = 'Admin'): boolean {
    const ach = this.state.achievements.find(a => a.id === id);
    if (!ach) return false;
    this.state.achievements = this.state.achievements.filter(a => a.id !== id);
    this.logActivity({
      userName: actor,
      userRole: 'Achievement Admin',
      action: 'Deleted',
      contentType: 'Achievement',
      contentId: id,
      contentSummary: `Deleted achievement "${ach.title}"`
    });
    this.save(this.state);
    return true;
  }

  // --- STUDENT IDEAS ---
  public getIdeas(options?: { status?: string; search?: string }): StudentIdea[] {
    let list = this.state.studentIdeas;
    if (options?.status && options.status !== 'All') {
      list = list.filter(i => i.status === options.status);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        i =>
          i.projectName.toLowerCase().includes(q) ||
          i.studentName.toLowerCase().includes(q) ||
          i.department.toLowerCase().includes(q) ||
          i.problem.toLowerCase().includes(q) ||
          i.technology.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public submitIdea(data: Omit<StudentIdea, 'id' | 'status' | 'submittedAt'>): StudentIdea {
    const newIdea: StudentIdea = {
      ...data,
      id: `idea_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'New',
      submittedAt: new Date().toISOString()
    };
    this.state.studentIdeas.unshift(newIdea);
    this.logActivity({
      userName: data.studentName,
      userRole: 'Student',
      action: 'Created',
      contentType: 'Student Idea',
      contentId: newIdea.id,
      contentSummary: `Submitted idea "${newIdea.projectName}" (${newIdea.department})`
    });
    this.save(this.state);
    return newIdea;
  }

  public updateIdea(id: string, updates: Partial<StudentIdea>, actor = 'Admin'): StudentIdea | null {
    const idx = this.state.studentIdeas.findIndex(i => i.id === id);
    if (idx === -1) return null;
    this.state.studentIdeas[idx] = { ...this.state.studentIdeas[idx], ...updates };
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: 'Updated',
      contentType: 'Student Idea',
      contentId: id,
      contentSummary: `Updated idea "${this.state.studentIdeas[idx].projectName}" to status "${updates.status || 'Updated'}"`
    });
    this.save(this.state);
    return this.state.studentIdeas[idx];
  }

  // --- STARTUPS ---
  public getStartups(publishedOnly = false): StartupItem[] {
    if (publishedOnly) {
      return this.state.startups.filter(s => s.published);
    }
    return this.state.startups;
  }

  public addStartup(data: Omit<StartupItem, 'id'>, actor = 'Admin'): StartupItem {
    const item: StartupItem = {
      ...data,
      id: `stp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    this.state.startups.unshift(item);
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: item.published ? 'Published' : 'Created',
      contentType: 'Startup',
      contentId: item.id,
      contentSummary: `Added startup "${item.name}"`
    });
    this.save(this.state);
    return item;
  }

  public updateStartup(id: string, updates: Partial<StartupItem>, actor = 'Admin'): StartupItem | null {
    const idx = this.state.startups.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.state.startups[idx] = { ...this.state.startups[idx], ...updates };
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: updates.published ? 'Published' : 'Updated',
      contentType: 'Startup',
      contentId: id,
      contentSummary: `Updated startup "${this.state.startups[idx].name}"`
    });
    this.save(this.state);
    return this.state.startups[idx];
  }

  public deleteStartup(id: string, actor = 'Admin'): boolean {
    const stp = this.state.startups.find(s => s.id === id);
    if (!stp) return false;
    this.state.startups = this.state.startups.filter(s => s.id !== id);
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: 'Deleted',
      contentType: 'Startup',
      contentId: id,
      contentSummary: `Deleted startup "${stp.name}"`
    });
    this.save(this.state);
    return true;
  }

  // --- WORKSHOPS ---
  public getWorkshops(publishedOnly = false): WorkshopItem[] {
    if (publishedOnly) {
      return this.state.workshops.filter(w => w.published);
    }
    return this.state.workshops;
  }

  public addWorkshop(data: Omit<WorkshopItem, 'id'>, actor = 'Admin'): WorkshopItem {
    const item: WorkshopItem = {
      ...data,
      id: `ws_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    this.state.workshops.unshift(item);
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: item.published ? 'Published' : 'Created',
      contentType: 'Workshop',
      contentId: item.id,
      contentSummary: `Added workshop "${item.title}"`
    });
    this.save(this.state);
    return item;
  }

  public updateWorkshop(id: string, updates: Partial<WorkshopItem>, actor = 'Admin'): WorkshopItem | null {
    const idx = this.state.workshops.findIndex(w => w.id === id);
    if (idx === -1) return null;
    this.state.workshops[idx] = { ...this.state.workshops[idx], ...updates };
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: updates.published ? 'Published' : 'Updated',
      contentType: 'Workshop',
      contentId: id,
      contentSummary: `Updated workshop "${this.state.workshops[idx].title}"`
    });
    this.save(this.state);
    return this.state.workshops[idx];
  }

  public deleteWorkshop(id: string, actor = 'Admin'): boolean {
    const ws = this.state.workshops.find(w => w.id === id);
    if (!ws) return false;
    this.state.workshops = this.state.workshops.filter(w => w.id !== id);
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: 'Deleted',
      contentType: 'Workshop',
      contentId: id,
      contentSummary: `Deleted workshop "${ws.title}"`
    });
    this.save(this.state);
    return true;
  }

  // --- RESOURCES ---
  public getResources(category?: string, publishedOnly = false): ResourceItem[] {
    let list = this.state.resources;
    if (publishedOnly) {
      list = list.filter(r => r.published);
    }
    if (category && category !== 'All') {
      list = list.filter(r => r.category === category);
    }
    return list;
  }

  public addResource(data: Omit<ResourceItem, 'id'>, actor = 'Admin'): ResourceItem {
    const item: ResourceItem = {
      ...data,
      id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    this.state.resources.unshift(item);
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: item.published ? 'Published' : 'Created',
      contentType: 'Resource',
      contentId: item.id,
      contentSummary: `Added resource "${item.title}" (${item.category})`
    });
    this.save(this.state);
    return item;
  }

  public updateResource(id: string, updates: Partial<ResourceItem>, actor = 'Admin'): ResourceItem | null {
    const idx = this.state.resources.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.state.resources[idx] = { ...this.state.resources[idx], ...updates };
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: updates.published ? 'Published' : 'Updated',
      contentType: 'Resource',
      contentId: id,
      contentSummary: `Updated resource "${this.state.resources[idx].title}"`
    });
    this.save(this.state);
    return this.state.resources[idx];
  }

  public deleteResource(id: string, actor = 'Admin'): boolean {
    const res = this.state.resources.find(r => r.id === id);
    if (!res) return false;
    this.state.resources = this.state.resources.filter(r => r.id !== id);
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: 'Deleted',
      contentType: 'Resource',
      contentId: id,
      contentSummary: `Deleted resource "${res.title}"`
    });
    this.save(this.state);
    return true;
  }

  // --- GALLERY ---
  public getGallery(category?: string, publishedOnly = false): GalleryAlbum[] {
    let list = this.state.galleryAlbums;
    if (publishedOnly) {
      list = list.filter(g => g.published);
    }
    if (category && category !== 'All') {
      list = list.filter(g => g.category === category);
    }
    return list;
  }

  public addGalleryAlbum(data: Omit<GalleryAlbum, 'id' | 'createdAt'>, actor = 'Admin'): GalleryAlbum {
    const album: GalleryAlbum = {
      ...data,
      id: `alb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    this.state.galleryAlbums.unshift(album);
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: album.published ? 'Published' : 'Created',
      contentType: 'Gallery Album',
      contentId: album.id,
      contentSummary: `Created gallery album "${album.title}"`
    });
    this.save(this.state);
    return album;
  }

  public updateGalleryAlbum(id: string, updates: Partial<GalleryAlbum>, actor = 'Admin'): GalleryAlbum | null {
    const idx = this.state.galleryAlbums.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.state.galleryAlbums[idx] = { ...this.state.galleryAlbums[idx], ...updates };
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: updates.published ? 'Published' : 'Updated',
      contentType: 'Gallery Album',
      contentId: id,
      contentSummary: `Updated album "${this.state.galleryAlbums[idx].title}"`
    });
    this.save(this.state);
    return this.state.galleryAlbums[idx];
  }

  public deleteGalleryAlbum(id: string, actor = 'Admin'): boolean {
    const alb = this.state.galleryAlbums.find(a => a.id === id);
    if (!alb) return false;
    this.state.galleryAlbums = this.state.galleryAlbums.filter(a => a.id !== id);
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: 'Deleted',
      contentType: 'Gallery Album',
      contentId: id,
      contentSummary: `Deleted album "${alb.title}"`
    });
    this.save(this.state);
    return true;
  }

  // --- NEWS ---
  public getNews(options?: { status?: string; search?: string; publishedOnly?: boolean }): NewsItem[] {
    let list = this.state.news;
    if (options?.publishedOnly) {
      list = list.filter(n => n.status === 'Published');
    }
    if (options?.status && options.status !== 'All') {
      list = list.filter(n => n.status === options.status);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        n =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.excerpt.toLowerCase().includes(q) ||
          n.author.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getNewsBySlug(slug: string): NewsItem | null {
    return this.state.news.find(n => n.slug === slug) || null;
  }

  public addNews(data: Omit<NewsItem, 'id'>, actor = 'Admin'): NewsItem {
    const item: NewsItem = {
      ...data,
      id: `news_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    this.state.news.unshift(item);
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: item.status === 'Published' ? 'Published' : 'Created',
      contentType: 'News Article',
      contentId: item.id,
      contentSummary: `Created news article "${item.title}" [${item.status}]`
    });
    this.save(this.state);
    return item;
  }

  public updateNews(id: string, updates: Partial<NewsItem>, actor = 'Admin'): NewsItem | null {
    const idx = this.state.news.findIndex(n => n.id === id);
    if (idx === -1) return null;
    this.state.news[idx] = { ...this.state.news[idx], ...updates };
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: updates.status === 'Published' ? 'Published' : updates.status === 'Archived' ? 'Archived' : 'Updated',
      contentType: 'News Article',
      contentId: id,
      contentSummary: `Updated news article "${this.state.news[idx].title}" status to ${updates.status || this.state.news[idx].status}`
    });
    this.save(this.state);
    return this.state.news[idx];
  }

  public deleteNews(id: string, actor = 'Admin'): boolean {
    const news = this.state.news.find(n => n.id === id);
    if (!news) return false;
    this.state.news = this.state.news.filter(n => n.id !== id);
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: 'Deleted',
      contentType: 'News Article',
      contentId: id,
      contentSummary: `Deleted news article "${news.title}"`
    });
    this.save(this.state);
    return true;
  }

  // --- SUBMISSIONS (JOIN IEDC) ---
  public getSubmissions(): JoinSubmission[] {
    return this.state.submissions;
  }

  public submitJoin(data: Omit<JoinSubmission, 'id' | 'status' | 'submittedAt'>): JoinSubmission {
    const sub: JoinSubmission = {
      ...data,
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'New',
      submittedAt: new Date().toISOString()
    };
    this.state.submissions.unshift(sub);
    this.logActivity({
      userName: sub.fullName,
      userRole: 'Applicant',
      action: 'Created',
      contentType: 'Membership Application',
      contentId: sub.id,
      contentSummary: `Application submitted by ${sub.fullName} (${sub.department}, Sem ${sub.semester})`
    });
    this.save(this.state);
    return sub;
  }

  public updateSubmission(id: string, updates: Partial<JoinSubmission>, actor = 'Admin'): JoinSubmission | null {
    const idx = this.state.submissions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.state.submissions[idx] = { ...this.state.submissions[idx], ...updates };
    this.logActivity({
      userName: actor,
      userRole: 'Team Admin',
      action: 'Updated',
      contentType: 'Membership Application',
      contentId: id,
      contentSummary: `Updated application for ${this.state.submissions[idx].fullName} to ${updates.status || 'Reviewed'}`
    });
    this.save(this.state);
    return this.state.submissions[idx];
  }

  // --- SITE SETTINGS ---
  public getSiteSettings(): SiteSettings {
    return this.state.siteSettings;
  }

  public updateSiteSettings(updates: Partial<SiteSettings>, actor = 'Admin'): SiteSettings {
    this.state.siteSettings = { ...this.state.siteSettings, ...updates };
    this.logActivity({
      userName: actor,
      userRole: 'Super Admin',
      action: 'Updated',
      contentType: 'Site Settings',
      contentId: 'site_config',
      contentSummary: 'Updated global site settings and configuration'
    });
    this.save(this.state);
    return this.state.siteSettings;
  }

  // --- STATS & AUDIT LOGS ---
  public getStats() {
    return {
      teamMembersCount: this.state.teamMembers.length,
      eventsCount: this.state.events.length,
      achievementsCount: this.state.achievements.length,
      ideasCount: this.state.studentIdeas.length,
      startupsCount: this.state.startups.length,
      workshopsCount: this.state.workshops.length,
      resourcesCount: this.state.resources.length,
      galleryAlbumsCount: this.state.galleryAlbums.length,
      newsCount: this.state.news.length,
      submissionsCount: this.state.submissions.length,
      needsReviewCount: this.state.events.filter(e => e.needsAdminReview).length
    };
  }

  public getActivityLogs(): ActivityLog[] {
    return this.state.activityLogs;
  }

  // --- USERS ---
  public getUsers(): User[] {
    return this.state.users;
  }

  public updateUserRole(userId: string, role: User['role'], actor = 'Super Admin'): User | null {
    const idx = this.state.users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    this.state.users[idx].role = role;
    this.logActivity({
      userName: actor,
      userRole: 'Super Admin',
      action: 'Updated',
      contentType: 'User Role',
      contentId: userId,
      contentSummary: `Changed role for ${this.state.users[idx].name} to ${role}`
    });
    this.save(this.state);
    return this.state.users[idx];
  }

  // --- POSTERS ---
  public getPosters(): PosterMediaItem[] {
    return this.state.posters || [];
  }

  public addPoster(data: Omit<PosterMediaItem, 'id'>, actor = 'Admin'): PosterMediaItem {
    const item: PosterMediaItem = {
      ...data,
      id: `poster_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    if (!this.state.posters) this.state.posters = [];
    this.state.posters.unshift(item);
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: 'Created',
      contentType: 'Poster',
      contentId: item.id,
      contentSummary: `Uploaded poster "${item.title}"`
    });
    this.save(this.state);
    return item;
  }

  public deletePoster(id: string, actor = 'Admin'): boolean {
    if (!this.state.posters) return false;
    const poster = this.state.posters.find(p => p.id === id);
    if (!poster) return false;
    this.state.posters = this.state.posters.filter(p => p.id !== id);
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: 'Deleted',
      contentType: 'Poster',
      contentId: id,
      contentSummary: `Deleted poster "${poster.title}"`
    });
    this.save(this.state);
    return true;
  }

  // --- MEDIA ITEMS ---
  public getMediaItems(): MediaLibraryItem[] {
    return this.state.mediaItems || [];
  }

  public addMediaItem(data: Omit<MediaLibraryItem, 'id'>, actor = 'Admin'): MediaLibraryItem {
    const item: MediaLibraryItem = {
      ...data,
      id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };
    if (!this.state.mediaItems) this.state.mediaItems = [];
    this.state.mediaItems.unshift(item);
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: 'Created',
      contentType: 'Media Asset',
      contentId: item.id,
      contentSummary: `Uploaded media asset "${item.name}"`
    });
    this.save(this.state);
    return item;
  }

  public deleteMediaItem(id: string, actor = 'Admin'): boolean {
    if (!this.state.mediaItems) return false;
    const media = this.state.mediaItems.find(m => m.id === id);
    if (!media) return false;
    this.state.mediaItems = this.state.mediaItems.filter(m => m.id !== id);
    this.logActivity({
      userName: actor,
      userRole: 'Content Admin',
      action: 'Deleted',
      contentType: 'Media Asset',
      contentId: id,
      contentSummary: `Deleted media asset "${media.name}"`
    });
    this.save(this.state);
    return true;
  }
}

export const db = new DatabaseEngine();
