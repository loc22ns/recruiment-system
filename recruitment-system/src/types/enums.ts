// ===== USER & AUTH =====
export type UserRole = 'candidate' | 'recruiter' | 'admin';

// ===== COMPANY =====
export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';

// ===== JOB POSTING =====
export type JobStatus = 'draft' | 'published' | 'closed' | 'expired';
export type WorkType = 'full-time' | 'part-time' | 'remote' | 'hybrid';
export type JobLevel = 'intern' | 'fresher' | 'junior' | 'mid' | 'senior' | 'lead' | 'manager';

// ===== APPLICATION =====
export type ApplicationStatus =
  | 'new'        // Mới nộp
  | 'reviewing'  // Đang xem xét
  | 'interview'  // Phỏng vấn
  | 'offered'    // Đề nghị
  | 'hired'      // Đã tuyển
  | 'rejected';  // Từ chối

// ===== INTERVIEW =====
export type InterviewType = 'in-person' | 'video-call' | 'phone';
export type InterviewStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled';

// ===== NOTIFICATION =====
export type NotificationType =
  | 'application_status_changed'
  | 'new_application'
  | 'interview_scheduled'
  | 'interview_reminder'
  | 'new_job_from_followed_company'
  | 'message_received';
