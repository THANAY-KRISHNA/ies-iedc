import { Router, Request, Response } from 'express';
import { db } from './db';
import { authenticateToken, requireRole, AuthRequest, loginUser } from './auth';

export const apiRouter = Router();

// ==========================================
// AUTH & USERS
// ==========================================
apiRouter.get('/auth/demo-users', (_req: Request, res: Response) => {
  const users = db.getUsers().map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role
  }));
  res.json({ users });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const result = loginUser(email);
  if (!result) {
    return res.status(401).json({ error: 'User not found with this email address.' });
  }

  res.json(result);
});

apiRouter.get('/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

// Settings
apiRouter.get('/public/settings', (_req: Request, res: Response) => {
  res.json(db.getSiteSettings());
});

// Academic Years
apiRouter.get('/public/academic-years', (_req: Request, res: Response) => {
  res.json(db.getAcademicYears());
});

// Team
apiRouter.get('/public/team', (req: Request, res: Response) => {
  const year = req.query.year as string | undefined;
  res.json(db.getTeam(year, true));
});

// Events
apiRouter.get('/public/events', (req: Request, res: Response) => {
  const { year, category, status, search } = req.query;
  const events = db.getEvents({
    year: year as string,
    category: category as string,
    status: status as string,
    search: search as string,
    publishedOnly: true
  });
  res.json(events);
});

apiRouter.get('/public/events/:slug', (req: Request, res: Response) => {
  const event = db.getEventBySlug(req.params.slug);
  if (!event || !event.published) {
    return res.status(404).json({ error: 'Event not found or not published.' });
  }
  res.json(event);
});

// Achievements (Only published verified achievements)
apiRouter.get('/public/achievements', (req: Request, res: Response) => {
  const { year, category } = req.query;
  const achievements = db.getAchievements({
    year: year as string,
    category: category as string,
    publishedOnly: true
  });
  res.json(achievements);
});

// Startups
apiRouter.get('/public/startups', (_req: Request, res: Response) => {
  res.json(db.getStartups(true));
});

// Student Ideas (developing/completed/accepted showcase)
apiRouter.get('/public/ideas', (_req: Request, res: Response) => {
  const all = db.getIdeas();
  // Filter out rejected/new for public, only show developing/completed/accepted
  const publicShowcase = all.filter(i => ['Developing', 'Completed', 'Accepted'].includes(i.status));
  res.json(publicShowcase);
});

// Submit Idea (Public form)
apiRouter.post('/public/ideas/submit', (req: Request, res: Response) => {
  const { projectName, studentName, studentEmail, studentPhone, department, academicYear, problem, proposedSolution, technology, description, imageUrl } = req.body;
  if (!projectName || !studentName || !studentEmail || !problem || !proposedSolution) {
    return res.status(400).json({ error: 'Project name, student name, email, problem statement, and proposed solution are required.' });
  }

  const idea = db.submitIdea({
    projectName,
    studentName,
    studentEmail,
    studentPhone: studentPhone || '',
    department: department || 'General',
    academicYear: academicYear || '2025–26',
    problem,
    proposedSolution,
    technology: technology || '',
    description: description || '',
    imageUrl
  });

  res.status(201).json({ message: 'Idea successfully submitted for review by the IEDC team.', idea });
});

// Workshops
apiRouter.get('/public/workshops', (_req: Request, res: Response) => {
  res.json(db.getWorkshops(true));
});

// Resources
apiRouter.get('/public/resources', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  res.json(db.getResources(category, true));
});

// Gallery
apiRouter.get('/public/gallery', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  res.json(db.getGallery(category, true));
});

// News
apiRouter.get('/public/news', (req: Request, res: Response) => {
  const { search } = req.query;
  res.json(db.getNews({ search: search as string, publishedOnly: true }));
});

apiRouter.get('/public/news/:slug', (req: Request, res: Response) => {
  const article = db.getNewsBySlug(req.params.slug);
  if (!article || article.status !== 'Published') {
    return res.status(404).json({ error: 'Article not found.' });
  }
  res.json(article);
});

// Join Application (Public Form)
apiRouter.post('/public/join/submit', (req: Request, res: Response) => {
  const { fullName, email, phone, department, semester, rollNumber, interestAreas, previousExperience, whyJoin } = req.body;
  if (!fullName || !email || !phone || !department || !semester || !rollNumber || !whyJoin) {
    return res.status(400).json({ error: 'Please provide all mandatory application fields.' });
  }

  const submission = db.submitJoin({
    fullName,
    email,
    phone,
    department,
    semester,
    rollNumber,
    interestAreas: Array.isArray(interestAreas) ? interestAreas : [],
    previousExperience,
    whyJoin
  });

  res.status(201).json({ message: 'Application submitted successfully. The executive team will review your application.', submission });
});

// ==========================================
// ADMIN ENDPOINTS (Protected)
// ==========================================

// Dashboard Stats & Logs
apiRouter.get('/admin/stats', authenticateToken, (_req: AuthRequest, res: Response) => {
  res.json(db.getStats());
});

apiRouter.get('/admin/audit-logs', authenticateToken, (_req: AuthRequest, res: Response) => {
  res.json(db.getActivityLogs());
});

// Team Management (Team Admin or Super Admin)
apiRouter.get('/admin/team', authenticateToken, requireRole(['Team Admin']), (req: AuthRequest, res: Response) => {
  const year = req.query.year as string | undefined;
  res.json(db.getTeam(year, false));
});

apiRouter.post('/admin/team', authenticateToken, requireRole(['Team Admin']), (req: AuthRequest, res: Response) => {
  const member = db.addTeamMember(req.body, req.user?.name);
  res.status(201).json(member);
});

apiRouter.put('/admin/team/:id', authenticateToken, requireRole(['Team Admin']), (req: AuthRequest, res: Response) => {
  const updated = db.updateTeamMember(req.params.id, req.body, req.user?.name);
  if (!updated) return res.status(404).json({ error: 'Team member not found.' });
  res.json(updated);
});

apiRouter.delete('/admin/team/:id', authenticateToken, requireRole(['Team Admin']), (req: AuthRequest, res: Response) => {
  const success = db.deleteTeamMember(req.params.id, req.user?.name);
  if (!success) return res.status(404).json({ error: 'Team member not found.' });
  res.json({ message: 'Team member removed.' });
});

// Academic Years
apiRouter.post('/admin/academic-years', authenticateToken, requireRole(['Team Admin']), (req: AuthRequest, res: Response) => {
  const { year, notes, isCurrent } = req.body;
  if (!year) return res.status(400).json({ error: 'Academic year name is required.' });
  const newYear = db.addAcademicYear({
    id: `ay_${year.replace(/[^a-zA-Z0-9]/g, '_')}`,
    year,
    notes,
    isCurrent: !!isCurrent
  }, req.user?.name);
  res.status(201).json(newYear);
});

// Events Management (Content Admin or Super Admin)
apiRouter.get('/admin/events', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const { year, category, status, search } = req.query;
  res.json(db.getEvents({
    year: year as string,
    category: category as string,
    status: status as string,
    search: search as string,
    publishedOnly: false
  }));
});

apiRouter.post('/admin/events', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const event = db.addEvent(req.body, req.user?.name);
  res.status(201).json(event);
});

apiRouter.put('/admin/events/:id', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const updated = db.updateEvent(req.params.id, req.body, req.user?.name);
  if (!updated) return res.status(404).json({ error: 'Event not found.' });
  res.json(updated);
});

apiRouter.delete('/admin/events/:id', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const success = db.deleteEvent(req.params.id, req.user?.name);
  if (!success) return res.status(404).json({ error: 'Event not found.' });
  res.json({ message: 'Event deleted.' });
});

// Achievements (Achievement Admin or Super Admin)
apiRouter.get('/admin/achievements', authenticateToken, requireRole(['Achievement Admin']), (req: AuthRequest, res: Response) => {
  const { year, category } = req.query;
  res.json(db.getAchievements({ year: year as string, category: category as string, publishedOnly: false }));
});

apiRouter.post('/admin/achievements', authenticateToken, requireRole(['Achievement Admin']), (req: AuthRequest, res: Response) => {
  const achievement = db.addAchievement(req.body, req.user?.name);
  res.status(201).json(achievement);
});

apiRouter.put('/admin/achievements/:id', authenticateToken, requireRole(['Achievement Admin']), (req: AuthRequest, res: Response) => {
  const updated = db.updateAchievement(req.params.id, req.body, req.user?.name);
  if (!updated) return res.status(404).json({ error: 'Achievement not found.' });
  res.json(updated);
});

apiRouter.delete('/admin/achievements/:id', authenticateToken, requireRole(['Achievement Admin']), (req: AuthRequest, res: Response) => {
  const success = db.deleteAchievement(req.params.id, req.user?.name);
  if (!success) return res.status(404).json({ error: 'Achievement not found.' });
  res.json({ message: 'Achievement deleted.' });
});

// Ideas Management (Content Admin or Super Admin)
apiRouter.get('/admin/ideas', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const { status, search } = req.query;
  res.json(db.getIdeas({ status: status as string, search: search as string }));
});

apiRouter.put('/admin/ideas/:id', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const updated = db.updateIdea(req.params.id, req.body, req.user?.name);
  if (!updated) return res.status(404).json({ error: 'Idea not found.' });
  res.json(updated);
});

// Startups Management (Content Admin or Super Admin)
apiRouter.get('/admin/startups', authenticateToken, requireRole(['Content Admin']), (_req: AuthRequest, res: Response) => {
  res.json(db.getStartups(false));
});

apiRouter.post('/admin/startups', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const startup = db.addStartup(req.body, req.user?.name);
  res.status(201).json(startup);
});

apiRouter.put('/admin/startups/:id', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const updated = db.updateStartup(req.params.id, req.body, req.user?.name);
  if (!updated) return res.status(404).json({ error: 'Startup not found.' });
  res.json(updated);
});

apiRouter.delete('/admin/startups/:id', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const success = db.deleteStartup(req.params.id, req.user?.name);
  if (!success) return res.status(404).json({ error: 'Startup not found.' });
  res.json({ message: 'Startup removed.' });
});

// Workshops Management
apiRouter.get('/admin/workshops', authenticateToken, requireRole(['Content Admin']), (_req: AuthRequest, res: Response) => {
  res.json(db.getWorkshops(false));
});

apiRouter.post('/admin/workshops', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const ws = db.addWorkshop(req.body, req.user?.name);
  res.status(201).json(ws);
});

apiRouter.put('/admin/workshops/:id', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const updated = db.updateWorkshop(req.params.id, req.body, req.user?.name);
  if (!updated) return res.status(404).json({ error: 'Workshop not found.' });
  res.json(updated);
});

apiRouter.delete('/admin/workshops/:id', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const success = db.deleteWorkshop(req.params.id, req.user?.name);
  if (!success) return res.status(404).json({ error: 'Workshop not found.' });
  res.json({ message: 'Workshop deleted.' });
});

// Resources Management
apiRouter.get('/admin/resources', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const category = req.query.category as string | undefined;
  res.json(db.getResources(category, false));
});

apiRouter.post('/admin/resources', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const resItem = db.addResource(req.body, req.user?.name);
  res.status(201).json(resItem);
});

apiRouter.put('/admin/resources/:id', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const updated = db.updateResource(req.params.id, req.body, req.user?.name);
  if (!updated) return res.status(404).json({ error: 'Resource not found.' });
  res.json(updated);
});

apiRouter.delete('/admin/resources/:id', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const success = db.deleteResource(req.params.id, req.user?.name);
  if (!success) return res.status(404).json({ error: 'Resource not found.' });
  res.json({ message: 'Resource deleted.' });
});

// Gallery Management
apiRouter.get('/admin/gallery', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const category = req.query.category as string | undefined;
  res.json(db.getGallery(category, false));
});

apiRouter.post('/admin/gallery', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const album = db.addGalleryAlbum(req.body, req.user?.name);
  res.status(201).json(album);
});

apiRouter.put('/admin/gallery/:id', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const updated = db.updateGalleryAlbum(req.params.id, req.body, req.user?.name);
  if (!updated) return res.status(404).json({ error: 'Album not found.' });
  res.json(updated);
});

apiRouter.delete('/admin/gallery/:id', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const success = db.deleteGalleryAlbum(req.params.id, req.user?.name);
  if (!success) return res.status(404).json({ error: 'Album not found.' });
  res.json({ message: 'Gallery album deleted.' });
});

// News Management
apiRouter.get('/admin/news', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const { status, search } = req.query;
  res.json(db.getNews({ status: status as string, search: search as string, publishedOnly: false }));
});

apiRouter.post('/admin/news', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const article = db.addNews(req.body, req.user?.name);
  res.status(201).json(article);
});

apiRouter.put('/admin/news/:id', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const updated = db.updateNews(req.params.id, req.body, req.user?.name);
  if (!updated) return res.status(404).json({ error: 'Article not found.' });
  res.json(updated);
});

apiRouter.delete('/admin/news/:id', authenticateToken, requireRole(['Content Admin']), (req: AuthRequest, res: Response) => {
  const success = db.deleteNews(req.params.id, req.user?.name);
  if (!success) return res.status(404).json({ error: 'Article not found.' });
  res.json({ message: 'News article deleted.' });
});

// Media Upload
apiRouter.post('/upload', authenticateToken, (req: AuthRequest, res: Response) => {
  const { fileName, fileData } = req.body;
  if (!fileData) {
    return res.status(400).json({ error: 'File data is required.' });
  }
  // Return the data URL directly or save path
  res.json({ url: fileData, fileName: fileName || 'uploaded_image' });
});

// Submissions
apiRouter.get('/admin/submissions', authenticateToken, requireRole(['Team Admin']), (_req: AuthRequest, res: Response) => {
  res.json(db.getSubmissions());
});

apiRouter.put('/admin/submissions/:id', authenticateToken, requireRole(['Team Admin']), (req: AuthRequest, res: Response) => {
  const updated = db.updateSubmission(req.params.id, req.body, req.user?.name);
  if (!updated) return res.status(404).json({ error: 'Submission not found.' });
  res.json(updated);
});

// Settings & Homepage
apiRouter.get('/admin/settings', authenticateToken, requireRole(['Super Admin']), (_req: AuthRequest, res: Response) => {
  res.json(db.getSiteSettings());
});

apiRouter.put('/admin/settings', authenticateToken, requireRole(['Super Admin']), (req: AuthRequest, res: Response) => {
  const updated = db.updateSiteSettings(req.body, req.user?.name);
  res.json(updated);
});

// Users Management (Super Admin only)
apiRouter.get('/admin/users', authenticateToken, requireRole(['Super Admin']), (_req: AuthRequest, res: Response) => {
  res.json(db.getUsers());
});

apiRouter.put('/admin/users/:id/role', authenticateToken, requireRole(['Super Admin']), (req: AuthRequest, res: Response) => {
  const { role } = req.body;
  const updated = db.updateUserRole(req.params.id, role, req.user?.name);
  if (!updated) return res.status(404).json({ error: 'User not found.' });
  res.json(updated);
});
