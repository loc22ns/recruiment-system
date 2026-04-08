import type { ApplicationStatus } from '../types/enums';

// ===== FILE SIZE LIMITS =====
export const MAX_AVATAR_SIZE = 5 * 1024 * 1024;   // 5MB in bytes
export const MAX_CV_SIZE = 10 * 1024 * 1024;       // 10MB in bytes

// ===== FORM LIMITS =====
export const MAX_COVER_LETTER_LENGTH = 2000;

// ===== PAGINATION =====
export const PAGE_SIZE = 20;

// ===== CACHE TTL (in seconds) =====
export const CACHE_TTL = {
  jobs: 5 * 60,          // 5 minutes
  applications: 2 * 60,  // 2 minutes
  profile: 10 * 60,      // 10 minutes
  dashboard: 1 * 60,     // 1 minute
  notifications: 0,      // no cache (real-time)
} as const;

// ===== PIPELINE STAGES =====
export const PIPELINE_STAGES: { key: ApplicationStatus; label: string }[] = [
  { key: 'new', label: 'Mới nộp' },
  { key: 'reviewing', label: 'Đang xem xét' },
  { key: 'interview', label: 'Phỏng vấn' },
  { key: 'offered', label: 'Đề nghị' },
  { key: 'hired', label: 'Đã tuyển' },
  { key: 'rejected', label: 'Từ chối' },
];

// ===== REJECTION REASONS =====
export const REJECTION_REASONS: string[] = [
  'Không đáp ứng yêu cầu kinh nghiệm',
  'Không đáp ứng yêu cầu kỹ năng',
  'Không phù hợp với văn hóa công ty',
  'Vị trí đã được lấp đầy',
  'Ứng viên rút đơn',
  'Mức lương kỳ vọng không phù hợp',
  'Lý do khác',
];
