/**
 * Data Types & Schema for IES IEDC Platform
 */

export type UserRole = 'Super Admin' | 'Content Admin' | 'Team Admin' | 'Achievement Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  lastLogin?: string;
}

export type ContentStatus = 'Draft' | 'Review' | 'Published' | 'Archived';

export type EventStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';

export type IdeaStatus = 'New' | 'Under Review' | 'Contacted' | 'Accepted' | 'Rejected' | 'Developing' | 'Completed';

export type StartupStatus = 'Ideation' | 'Prototype' | 'Incubated' | 'Registered' | 'Revenue' | 'Graduated';

export interface AcademicYear {
  id: string;
  year: string; // e.g., "2025–26", "2024–25", "2023–24"
  isCurrent: boolean;
  notes?: string;
}

export interface Department {
  id: string;
  code: string; // "CE", "ME", "CSE", "EEE", "ECE", "R&AI", "DS", "S&H"
  name: string;
}

export interface TeamMember {
  id: string;
  academicYear: string; // e.g. "2024–25"
  name: string;
  roleType: 'Nodal Officer' | 'Assistant Nodal Officer' | 'Department Coordinator' | 'IEDC Lead' | 'Student Lead' | 'Women Lead' | 'Executive Lead' | 'Core Member';
  position: string; // e.g., "Nodal Officer", "Assistant Nodal Officer", "HOD / Assistant Professor", "Department Coordinator", "Student Lead I", "Finance Lead"
  department?: string; // e.g., "R&AI", "CSE"
  designation?: string; // Faculty designation if applicable e.g. "HOD / Assistant Professor"
  responsibility?: string;
  email?: string;
  linkedinUrl?: string;
  photoUrl?: string;
  sortOrder: number;
  status: 'Published' | 'Archived';
}

export interface EventItem {
  id: string;
  slug: string;
  name: string;
  academicYear: string; // e.g. "2024–25"
  date?: string; // formatted e.g. "22/03/2025" or "08/04/2024 – 09/04/2024"
  displayDate?: string; // formatted date string
  startDate: string; // ISO or date string
  endDate?: string;
  venue: string;
  isOnline: boolean;
  organizer: string;
  resourcePersons?: string[];
  category: 'Workshop' | 'Webinar' | 'Hackathon' | 'Ideation' | 'Ideathon' | 'Camp' | 'Seminar' | 'Orientation' | 'Training' | 'Industry Visit' | 'Exhibition' | 'Awareness' | 'Other';
  description: string;
  participantsCount?: number;
  teamsCount?: number;
  teamsSelectedCount?: number;
  posterUrl?: string;
  galleryUrls?: string[];
  registrationUrl?: string;
  status: EventStatus;
  needsAdminReview?: boolean;
  adminReviewNote?: string;
  published: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  academicYear: string;
  category: 'Hackathon Winners' | 'Startup Achievements' | 'Idea Competitions' | 'Awards' | 'Patents' | 'Publications' | 'Funded Projects' | 'Incubated Startups' | 'Competitions' | 'External Recognitions';
  recipients: string;
  description: string;
  dateAwarded?: string;
  verificationInfo?: string;
  certificateUrl?: string;
  imageUrl?: string;
  published: boolean;
}

export interface StudentIdea {
  id: string;
  projectName: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  department: string;
  academicYear: string;
  problem: string;
  proposedSolution: string;
  technology: string;
  description: string;
  imageUrl?: string;
  status: IdeaStatus;
  adminNotes?: string;
  submittedAt: string;
}

export interface StartupItem {
  id: string;
  name: string;
  founderTeam: string;
  department?: string;
  academicYear: string;
  problemSolved: string;
  productService: string;
  description: string;
  logoUrl?: string;
  websiteUrl?: string;
  socialMediaUrl?: string;
  status: StartupStatus;
  published: boolean;
}

export interface WorkshopItem {
  id: string;
  title: string;
  academicYear: string;
  date: string;
  time?: string;
  venue: string;
  isOnline: boolean;
  speakers: string[];
  mentors?: string[];
  description: string;
  topicsCovered: string[];
  registrationUrl?: string;
  certificateProvided: boolean;
  learningMaterialsUrl?: string;
  photos?: string[];
  status: 'Upcoming' | 'Past';
  published: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'Project Ideas' | 'Startup Guides' | 'IPR Resources' | 'Business Model Canvas' | 'Design Thinking' | 'Pitch Deck Resources' | 'Funding Information' | 'Hackathon Resources' | 'Useful Tools' | 'KSUM Resources';
  description: string;
  authorOrSource?: string;
  linkUrl?: string;
  fileType?: string;
  dateAdded: string;
  published: boolean;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  academicYear: string;
  category: 'Events' | 'Workshops' | 'Seminars' | 'IEDC Fest' | 'Camps' | 'Hackathons' | 'Team' | 'Achievements' | 'Awards' | 'Certificates' | 'Competitions';
  coverImageUrl: string;
  images: GalleryImage[];
  published: boolean;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  albumId: string;
  imageUrl: string;
  caption: string;
  sortOrder: number;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: 'News' | 'Announcement' | 'Registration Deadline' | 'Competition' | 'Hackathon' | 'Team' | 'Result' | 'Opportunity' | 'Important Notice';
  content: string;
  excerpt: string;
  featuredImageUrl?: string;
  author: string;
  publicationDate: string;
  academicYear: string;
  status: ContentStatus;
}

export interface JoinSubmission {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  semester: string;
  rollNumber: string;
  interestAreas: string[];
  previousExperience?: string;
  whyJoin: string;
  submittedAt: string;
  status: 'New' | 'Under Review' | 'Accepted' | 'Rejected' | 'Archived';
  adminNotes?: string;
}

export interface ActivityLog {
  id: string;
  userName: string;
  userRole: string;
  action: 'Created' | 'Updated' | 'Published' | 'Archived' | 'Deleted';
  contentType: string;
  contentId: string;
  contentSummary: string;
  timestamp: string;
}

export interface SiteSettings {
  institutionName: string;
  iedcName: string;
  establishedYear: number;
  tagline: string;
  vision: string;
  mission: string;
  nodalOfficerName: string;
  assistantNodalOfficerName: string;
  officialEmail: string;
  officialPhone: string;
  officeLocation: string;
  address: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  ksumUrl?: string;
  heroHeading: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroSecondaryCtaText: string;
  sectionVisibility: {
    hero: boolean;
    visionMission: boolean;
    whatWeDo: boolean;
    events: boolean;
    achievements: boolean;
    ideas: boolean;
    startups: boolean;
    workshops: boolean;
    gallery: boolean;
    news: boolean;
    cta: boolean;
  };
}
