import type {
  UserRole,
  CompanySize,
  JobStatus,
  WorkType,
  JobLevel,
  ApplicationStatus,
  InterviewType,
  InterviewStatus,
  NotificationType,
} from './enums';

export type {
  UserRole,
  CompanySize,
  JobStatus,
  WorkType,
  JobLevel,
  ApplicationStatus,
  InterviewType,
  InterviewStatus,
  NotificationType,
};

// ===== USER & AUTH =====

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAttempts: number;
  isLocked: boolean;
  lockUntil: string | null;
}

// ===== CANDIDATE PROFILE =====

export interface CVFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialUrl: string | null;
}

export interface CandidateProfile {
  userId: string;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  phone: string | null;
  address: string | null;
  careerObjective: string | null;
  isSeekingJob: boolean;
  completionPercentage: number;
  cvFiles: CVFile[];
  education: Education[];
  experience: WorkExperience[];
  skills: Skill[];
  certifications: Certification[];
}

// ===== COMPANY =====

export interface Company {
  id: string;
  recruiterId: string;
  name: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  description: string;
  industry: string;
  size: CompanySize;
  website: string | null;
  address: string;
  followerCount: number;
  isFollowedByCurrentUser?: boolean;
}

// ===== JOB POSTING =====

export interface JobPosting {
  id: string;
  recruiterId: string;
  companyId: string;
  company?: Company;
  title: string;
  description: string;       // rich text HTML
  requirements: string;      // rich text HTML
  benefits: string;
  salaryMin: number | null;
  salaryMax: number | null;
  isSalaryNegotiable: boolean;
  location: string;
  workType: WorkType;
  industry: string;
  level: JobLevel;
  deadline: string;
  status: JobStatus;
  applicationCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// ===== APPLICATION =====

export interface InternalNote {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
}

export interface StatusHistoryEntry {
  fromStatus: ApplicationStatus;
  toStatus: ApplicationStatus;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

export interface Application {
  id: string;
  jobId: string;
  job?: JobPosting;
  candidateId: string;
  candidate?: CandidateProfile & { user: User };
  cvFileId: string;
  coverLetter: string | null;
  status: ApplicationStatus;
  rating: number | null;  // 1-5
  recruiterNotes: InternalNote[];
  statusHistory: StatusHistoryEntry[];
  appliedAt: string;
  updatedAt: string;
}

// ===== INTERVIEW =====

export interface Interview {
  id: string;
  applicationId: string;
  scheduledAt: string;
  type: InterviewType;
  location: string | null;
  meetingLink: string | null;
  interviewers: string[];
  notes: string | null;
  status: InterviewStatus;
  candidateConfirmed: boolean;
  result: string | null;
}

// ===== NOTIFICATION =====

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
  createdAt: string;
}

// ===== SEARCH & FILTERS =====

export interface JobSearchFilters {
  keyword: string;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  workType: WorkType | null;
  industry: string | null;
  level: JobLevel | null;
  postedWithin: number | null;  // days
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
