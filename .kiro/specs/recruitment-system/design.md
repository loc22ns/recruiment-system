# Tài Liệu Thiết Kế - Hệ Thống Tuyển Dụng (ReactJS)

## 1. Tổng Quan (Overview)

Hệ thống tuyển dụng trực tuyến được xây dựng bằng ReactJS (frontend) kết hợp với REST API backend. Hệ thống phục vụ ba nhóm người dùng chính: Candidate (ứng viên), Recruiter (nhà tuyển dụng) và Admin (quản trị viên).

### Mục tiêu kỹ thuật

- Single Page Application (SPA) với React 18+
- State management tập trung bằng Redux Toolkit
- Responsive design hỗ trợ từ 320px đến 2560px
- Hiệu năng: tải trang chính dưới 3 giây
- Hỗ trợ dark/light mode
- Bảo mật: JWT auth, RBAC, input sanitization

### Công nghệ chính

| Lớp | Công nghệ |
|-----|-----------|
| UI Framework | React 18 + TypeScript |
| Routing | React Router v6 |
| State Management | Redux Toolkit + RTK Query |
| UI Components | Ant Design 5 |
| Rich Text Editor | TipTap |
| Charts | Recharts |
| Form Validation | React Hook Form + Zod |
| HTTP Client | Axios (tích hợp RTK Query) |
| Real-time | Socket.IO Client |
| File Upload | React Dropzone |
| Testing | Vitest + React Testing Library + fast-check |
| Build Tool | Vite |
| CSS | Tailwind CSS + CSS Modules |


## 2. Kiến Trúc Hệ Thống (Architecture)

### 2.1 Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   React SPA                          │  │
│  │                                                      │  │
│  │  ┌─────────┐  ┌──────────┐  ┌────────────────────┐  │  │
│  │  │  Pages  │  │Components│  │  Redux Store       │  │  │
│  │  │         │  │          │  │  (RTK Query cache)  │  │  │
│  │  └────┬────┘  └────┬─────┘  └────────┬───────────┘  │  │
│  │       └────────────┴─────────────────┘              │  │
│  │                    │                                 │  │
│  │              React Router v6                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │  HTTPS / WSS                      │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                    BACKEND SERVICES                          │
│                         │                                   │
│  ┌──────────┐  ┌────────┴──────┐  ┌──────────────────────┐ │
│  │Auth API  │  │  REST API     │  │  WebSocket Server    │ │
│  │/api/auth │  │  /api/v1      │  │  (Socket.IO)         │ │
│  └──────────┘  └───────────────┘  └──────────────────────┘ │
│                         │                                   │
│  ┌──────────────────────┴──────────────────────────────┐   │
│  │                   Database Layer                     │   │
│  │  PostgreSQL (main)  │  Redis (cache/sessions)        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Kiến trúc Frontend

```
src/
├── app/                    # Redux store, root config
├── assets/                 # Static files (images, fonts)
├── components/             # Shared/reusable components
│   ├── common/             # Button, Input, Modal, etc.
│   ├── layout/             # Header, Sidebar, Footer
│   └── ui/                 # Design system components
├── features/               # Feature-based modules (Redux slices + RTK Query)
│   ├── auth/
│   ├── jobs/
│   ├── applications/
│   ├── profile/
│   ├── notifications/
│   ├── company/
│   └── dashboard/
├── hooks/                  # Custom React hooks
├── pages/                  # Route-level page components
│   ├── candidate/
│   ├── recruiter/
│   ├── admin/
│   └── public/
├── routes/                 # Route definitions + guards
├── services/               # API service layer
├── types/                  # TypeScript type definitions
├── utils/                  # Helper functions
└── constants/              # App-wide constants
```

### 2.3 Luồng dữ liệu (Data Flow)

```
User Action → Component → Redux Action/RTK Query
    → API Call (Axios) → Backend REST API
    → Response → RTK Query Cache → Component Re-render
```

Với real-time (notifications):
```
Backend Event → Socket.IO → Redux dispatch → UI update
```


## 3. Các Component và Giao Diện (Components and Interfaces)

### 3.1 Cấu trúc Route

```
/                           → Trang chủ (public)
/jobs                       → Tìm kiếm việc làm (public)
/jobs/:id                   → Chi tiết tin tuyển dụng (public)
/company/:id                → Trang công ty (public)
/auth/login                 → Đăng nhập
/auth/register              → Đăng ký
/auth/forgot-password       → Quên mật khẩu
/auth/verify-email          → Xác minh email

/candidate/                 → Layout Candidate (protected)
  dashboard                 → Tổng quan
  profile                   → Hồ sơ cá nhân
  applications              → Đơn ứng tuyển của tôi
  saved-jobs                → Việc làm đã lưu
  notifications             → Thông báo

/recruiter/                 → Layout Recruiter (protected)
  dashboard                 → Tổng quan & thống kê
  jobs                      → Quản lý tin tuyển dụng
  jobs/create               → Tạo tin mới
  jobs/:id/edit             → Chỉnh sửa tin
  jobs/:id/applications     → Ứng viên của tin
  pipeline/:jobId           → Kanban pipeline
  company                   → Quản lý trang công ty
  interviews                → Lịch phỏng vấn
  notifications             → Thông báo

/admin/                     → Layout Admin (protected)
  dashboard                 → Thống kê toàn hệ thống
  users                     → Quản lý người dùng
  jobs                      → Kiểm duyệt tin tuyển dụng
  settings                  → Cấu hình hệ thống
  audit-logs                → Nhật ký hoạt động
```

### 3.2 Các Component Chính

#### Layout Components

```typescript
// AppLayout - layout chung với header và sidebar
<AppLayout role="candidate|recruiter|admin">
  <Outlet />
</AppLayout>

// AuthLayout - layout cho trang auth (không có sidebar)
<AuthLayout>
  <Outlet />
</AuthLayout>
```

#### Feature Components

**Auth Module:**
- `LoginForm` - form đăng nhập với Google OAuth button
- `RegisterForm` - form đăng ký với role selection
- `ForgotPasswordForm` - form quên mật khẩu
- `EmailVerificationBanner` - banner nhắc xác minh email

**Job Module:**
- `JobCard` - card hiển thị tóm tắt tin tuyển dụng
- `JobList` - danh sách job cards với pagination
- `JobDetail` - trang chi tiết tin tuyển dụng
- `JobForm` - form tạo/chỉnh sửa tin (rich text editor)
- `JobFilters` - bộ lọc tìm kiếm (sidebar)
- `JobSearchBar` - thanh tìm kiếm với autocomplete
- `JobStatusBadge` - badge trạng thái (nháp/đang tuyển/đã đóng)

**Application Module:**
- `ApplicationForm` - form nộp đơn ứng tuyển
- `ApplicationCard` - card ứng viên trong pipeline
- `ApplicationList` - danh sách đơn ứng tuyển
- `PipelineBoard` - Kanban board drag-and-drop
- `PipelineColumn` - cột trong Kanban (mỗi giai đoạn)
- `ApplicationDetail` - chi tiết đơn ứng tuyển + notes
- `RatingStars` - component đánh giá 1-5 sao
- `BulkActionBar` - thanh hành động hàng loạt

**Profile Module:**
- `ProfileForm` - form hồ sơ cá nhân
- `ProfileCompletionBar` - thanh tiến độ hoàn thiện hồ sơ
- `CVUploader` - upload CV (PDF/DOCX)
- `AvatarUploader` - upload ảnh đại diện
- `ExperienceSection` - section kinh nghiệm làm việc
- `EducationSection` - section học vấn
- `SkillsSection` - section kỹ năng

**Notification Module:**
- `NotificationBell` - icon thông báo với badge số
- `NotificationDropdown` - dropdown danh sách thông báo
- `NotificationItem` - item thông báo đơn lẻ
- `MessageThread` - luồng tin nhắn giữa recruiter và candidate

**Dashboard Module:**
- `StatsCard` - card hiển thị chỉ số
- `ApplicationsChart` - biểu đồ số lượng theo thời gian
- `ConversionFunnelChart` - biểu đồ tỷ lệ chuyển đổi
- `SourceTrackingTable` - bảng nguồn ứng viên

**Company Module:**
- `CompanyForm` - form tạo/chỉnh sửa trang công ty
- `CompanyPage` - trang công ty public
- `FollowButton` - nút theo dõi công ty

### 3.3 Custom Hooks

```typescript
useAuth()           // Truy cập auth state, login/logout actions
useJobSearch()      // Search state, filters, pagination
usePipeline()       // Drag-and-drop pipeline logic
useNotifications()  // Real-time notifications via Socket.IO
useFileUpload()     // File upload với validation
useFormPersist()    // Lưu form data vào localStorage
useDebounce()       // Debounce cho search input
usePagination()     // Pagination logic
useTheme()          // Dark/light mode toggle
```


## 4. Mô Hình Dữ Liệu (Data Models)

### 4.1 TypeScript Interfaces

```typescript
// ===== USER & AUTH =====

type UserRole = 'candidate' | 'recruiter' | 'admin';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ===== CANDIDATE PROFILE =====

interface CandidateProfile {
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

interface CVFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// ===== COMPANY =====

interface Company {
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

type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';

// ===== JOB POSTING =====

type JobStatus = 'draft' | 'published' | 'closed' | 'expired';
type WorkType = 'full-time' | 'part-time' | 'remote' | 'hybrid';
type JobLevel = 'intern' | 'fresher' | 'junior' | 'mid' | 'senior' | 'lead' | 'manager';

interface JobPosting {
  id: string;
  recruiterId: string;
  companyId: string;
  company?: Company;
  title: string;
  description: string;         // rich text HTML
  requirements: string;        // rich text HTML
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

type ApplicationStatus =
  | 'new'           // Mới nộp
  | 'reviewing'     // Đang xem xét
  | 'interview'     // Phỏng vấn
  | 'offered'       // Đề nghị
  | 'hired'         // Đã tuyển
  | 'rejected';     // Từ chối

interface Application {
  id: string;
  jobId: string;
  job?: JobPosting;
  candidateId: string;
  candidate?: CandidateProfile & { user: User };
  cvFileId: string;
  coverLetter: string | null;
  status: ApplicationStatus;
  rating: number | null;        // 1-5
  recruiterNotes: InternalNote[];
  statusHistory: StatusHistoryEntry[];
  appliedAt: string;
  updatedAt: string;
}

interface InternalNote {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
}

interface StatusHistoryEntry {
  fromStatus: ApplicationStatus;
  toStatus: ApplicationStatus;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

// ===== INTERVIEW =====

type InterviewType = 'in-person' | 'video-call' | 'phone';
type InterviewStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled';

interface Interview {
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

type NotificationType =
  | 'application_status_changed'
  | 'new_application'
  | 'interview_scheduled'
  | 'interview_reminder'
  | 'new_job_from_followed_company'
  | 'message_received';

interface Notification {
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

interface JobSearchFilters {
  keyword: string;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  workType: WorkType | null;
  industry: string | null;
  level: JobLevel | null;
  postedWithin: number | null;  // days
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```


## 5. Thiết Kế API (API Design)

### 5.1 Base URL và Authentication

```
Base URL: /api/v1
Authentication: Bearer JWT token trong header Authorization
```

### 5.2 Auth Endpoints

```
POST   /auth/register              Đăng ký tài khoản
POST   /auth/login                 Đăng nhập
POST   /auth/logout                Đăng xuất
POST   /auth/refresh-token         Làm mới token
POST   /auth/forgot-password       Yêu cầu đặt lại mật khẩu
POST   /auth/reset-password        Đặt lại mật khẩu
GET    /auth/verify-email/:token   Xác minh email
GET    /auth/google                Đăng nhập Google OAuth
GET    /auth/google/callback       Callback Google OAuth
```

### 5.3 Profile Endpoints

```
GET    /profile/me                 Lấy profile hiện tại
PUT    /profile/me                 Cập nhật profile
POST   /profile/avatar             Upload ảnh đại diện
POST   /profile/cv                 Upload CV
DELETE /profile/cv/:id             Xóa CV
PATCH  /profile/seeking-status     Bật/tắt chế độ tìm việc
```

### 5.4 Job Endpoints

```
GET    /jobs                       Tìm kiếm tin tuyển dụng (public)
GET    /jobs/:id                   Chi tiết tin tuyển dụng (public)
GET    /jobs/suggestions           Gợi ý tìm kiếm (autocomplete)

POST   /recruiter/jobs             Tạo tin tuyển dụng
GET    /recruiter/jobs             Danh sách tin của recruiter
GET    /recruiter/jobs/:id         Chi tiết tin
PUT    /recruiter/jobs/:id         Cập nhật tin
POST   /recruiter/jobs/:id/publish Xuất bản tin
POST   /recruiter/jobs/:id/close   Đóng tin
POST   /recruiter/jobs/:id/copy    Sao chép tin
DELETE /recruiter/jobs/:id         Xóa tin nháp
```

### 5.5 Application Endpoints

```
POST   /applications               Nộp đơn ứng tuyển
GET    /applications/my            Danh sách đơn của candidate
DELETE /applications/:id           Rút đơn ứng tuyển

GET    /recruiter/jobs/:jobId/applications        Danh sách ứng viên
GET    /recruiter/applications/:id                Chi tiết đơn
PATCH  /recruiter/applications/:id/status         Cập nhật trạng thái
POST   /recruiter/applications/:id/notes          Thêm ghi chú nội bộ
PATCH  /recruiter/applications/:id/rating         Đánh giá ứng viên
POST   /recruiter/applications/bulk-action        Hành động hàng loạt
GET    /recruiter/jobs/:jobId/applications/export Xuất Excel
```

### 5.6 Interview Endpoints

```
POST   /recruiter/interviews              Tạo lịch phỏng vấn
GET    /recruiter/interviews              Danh sách phỏng vấn
PUT    /recruiter/interviews/:id          Cập nhật lịch
DELETE /recruiter/interviews/:id          Hủy phỏng vấn
PATCH  /recruiter/interviews/:id/result   Điền kết quả

POST   /candidate/interviews/:id/confirm  Xác nhận tham dự
```

### 5.7 Company Endpoints

```
GET    /companies/:id              Trang công ty (public)
GET    /companies/:id/jobs         Tin tuyển dụng của công ty (public)

POST   /recruiter/company          Tạo trang công ty
PUT    /recruiter/company          Cập nhật trang công ty

POST   /companies/:id/follow       Theo dõi công ty
DELETE /companies/:id/follow       Bỏ theo dõi
```

### 5.8 Notification Endpoints

```
GET    /notifications              Danh sách thông báo
PATCH  /notifications/:id/read     Đánh dấu đã đọc
PATCH  /notifications/read-all     Đánh dấu tất cả đã đọc
GET    /notifications/settings     Cài đặt thông báo
PUT    /notifications/settings     Cập nhật cài đặt

GET    /messages/:applicationId    Lịch sử tin nhắn
POST   /messages/:applicationId    Gửi tin nhắn
```

### 5.9 Dashboard Endpoints

```
GET    /recruiter/dashboard/stats          Thống kê tổng quan
GET    /recruiter/dashboard/applications-chart  Biểu đồ theo thời gian
GET    /recruiter/dashboard/conversion     Tỷ lệ chuyển đổi
GET    /recruiter/dashboard/sources        Nguồn ứng viên
GET    /recruiter/dashboard/export         Xuất báo cáo

GET    /admin/dashboard/stats              Thống kê toàn hệ thống
```

### 5.10 Admin Endpoints

```
GET    /admin/users                Danh sách người dùng
PATCH  /admin/users/:id/status     Kích hoạt/vô hiệu hóa
DELETE /admin/users/:id            Xóa tài khoản
GET    /admin/jobs/reported        Tin bị báo cáo
PATCH  /admin/jobs/:id/review      Phê duyệt/từ chối tin
GET    /admin/audit-logs           Nhật ký hoạt động
GET    /admin/settings             Cấu hình hệ thống
PUT    /admin/settings             Cập nhật cấu hình
```


## 6. Quản Lý State (State Management)

### 6.1 Redux Store Structure

```typescript
interface RootState {
  auth: AuthState;
  ui: UIState;
  notifications: NotificationsState;
}
```

Các feature state còn lại được quản lý bởi **RTK Query** (cache tự động):

```typescript
// RTK Query APIs
authApi         // Auth endpoints
jobsApi         // Job endpoints
applicationsApi // Application endpoints
profileApi      // Profile endpoints
companyApi      // Company endpoints
notificationsApi // Notification endpoints
dashboardApi    // Dashboard endpoints
```

### 6.2 Auth Slice

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loginAttempts: number;
  isLocked: boolean;
  lockUntil: string | null;
}
```

### 6.3 UI Slice

```typescript
interface UIState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  activeModal: string | null;
}
```

### 6.4 Notifications Slice

```typescript
interface NotificationsState {
  unreadCount: number;
  isConnected: boolean;  // Socket.IO connection status
}
```

### 6.5 RTK Query Cache Strategy

- `jobs` list: cache 5 phút, invalidate khi tạo/cập nhật/xóa job
- `applications` list: cache 2 phút, invalidate khi status thay đổi
- `profile`: cache 10 phút, invalidate khi update
- `notifications`: không cache (real-time qua Socket.IO)
- `dashboard stats`: cache 1 phút

### 6.6 Persistent State

Dùng `redux-persist` để lưu vào localStorage:
- `auth.accessToken` (encrypted)
- `ui.theme`
- `ui.sidebarCollapsed`

Form data tạm thời (khi mất kết nối) lưu qua custom hook `useFormPersist`:
```typescript
useFormPersist('job-form-draft', { watch, setValue })
```


## 7. Correctness Properties (Tính Đúng Đắn)

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Đăng ký tài khoản hợp lệ luôn tạo được tài khoản

*For any* tập dữ liệu đăng ký hợp lệ (họ tên không rỗng, email đúng định dạng, mật khẩu đủ mạnh, vai trò hợp lệ), việc gửi form đăng ký phải tạo thành công một tài khoản mới với đúng thông tin đã nhập.

**Validates: Requirements 1.3**

### Property 2: Xác minh email kích hoạt tài khoản (round-trip)

*For any* tài khoản mới được tạo, sau khi nhấp vào liên kết xác minh email, trạng thái tài khoản phải chuyển từ chưa xác minh sang đã xác minh.

**Validates: Requirements 1.4**

### Property 3: Đăng nhập hợp lệ luôn trả về JWT token hợp lệ

*For any* tài khoản đã xác minh và đang hoạt động, đăng nhập với đúng email và mật khẩu phải trả về JWT token có cấu trúc hợp lệ và thời hạn 24 giờ.

**Validates: Requirements 1.5**

### Property 4: Đăng xuất vô hiệu hóa token (round-trip)

*For any* phiên đăng nhập đang hoạt động, sau khi đăng xuất, token cũ không còn được chấp nhận cho bất kỳ API call nào yêu cầu xác thực.

**Validates: Requirements 1.10**

### Property 5: Validation file upload theo kích thước

*For any* file được tải lên, nếu kích thước vượt quá giới hạn cho phép (5MB cho ảnh đại diện, 10MB cho CV), hệ thống phải từ chối file và hiển thị thông báo lỗi; nếu trong giới hạn, file phải được chấp nhận.

**Validates: Requirements 2.2, 2.3**

### Property 6: Tính toán phần trăm hoàn thiện hồ sơ

*For any* hồ sơ ứng viên với số lượng trường đã điền bất kỳ, phần trăm hoàn thiện phải bằng (số trường đã điền / tổng số trường) × 100, và luôn nằm trong khoảng [0, 100].

**Validates: Requirements 2.5**

### Property 7: Chế độ tìm kiếm việc làm ảnh hưởng đến visibility (round-trip)

*For any* hồ sơ ứng viên, khi bật chế độ "Tìm kiếm việc làm", hồ sơ phải xuất hiện trong kết quả tìm kiếm của recruiter; khi tắt, hồ sơ phải biến mất khỏi kết quả tìm kiếm.

**Validates: Requirements 2.6**

### Property 8: Lưu nháp không yêu cầu đầy đủ trường bắt buộc

*For any* tin tuyển dụng với bất kỳ tập hợp trường nào (kể cả thiếu trường bắt buộc), lưu ở trạng thái nháp phải thành công.

**Validates: Requirements 3.2**

### Property 9: Xuất bản từ chối khi thiếu trường bắt buộc

*For any* tin tuyển dụng thiếu ít nhất một trường bắt buộc, thao tác xuất bản phải bị từ chối và danh sách các trường còn thiếu phải được hiển thị đầy đủ.

**Validates: Requirements 3.3**

### Property 10: Tin đã xuất bản xuất hiện trong kết quả tìm kiếm (round-trip)

*For any* tin tuyển dụng được xuất bản thành công, tin đó phải xuất hiện trong kết quả tìm kiếm trong vòng 5 phút.

**Validates: Requirements 3.4**

### Property 11: Chỉnh sửa tin không làm mất đơn ứng tuyển (invariant)

*For any* tin tuyển dụng đã có đơn ứng tuyển, sau khi recruiter chỉnh sửa nội dung tin, tất cả đơn ứng tuyển trước đó phải vẫn còn tồn tại và không bị thay đổi.

**Validates: Requirements 3.5**

### Property 12: Đóng tin ẩn khỏi kết quả tìm kiếm (round-trip)

*For any* tin tuyển dụng đang ở trạng thái "đang tuyển", sau khi recruiter đóng tin, tin đó không được xuất hiện trong kết quả tìm kiếm của candidate.

**Validates: Requirements 3.6**

### Property 13: Sao chép tin giữ nguyên nội dung

*For any* tin tuyển dụng, bản sao được tạo ra phải có nội dung giống hệt bản gốc (trừ id, trạng thái mặc định là nháp và ngày tạo).

**Validates: Requirements 3.7**

### Property 14: Bộ lọc tìm kiếm trả về đúng kết quả

*For any* tập hợp bộ lọc được áp dụng (địa điểm, mức lương, hình thức làm việc, ngành nghề, cấp bậc), tất cả kết quả trả về phải thỏa mãn tất cả điều kiện lọc đã chọn.

**Validates: Requirements 4.3**

### Property 15: Phân trang không vượt quá 20 kết quả mỗi trang

*For any* tập dữ liệu tìm kiếm với bất kỳ số lượng kết quả nào, mỗi trang trong kết quả phân trang phải chứa tối đa 20 items.

**Validates: Requirements 4.6**

### Property 16: Lưu và khôi phục bộ lọc tìm kiếm (round-trip)

*For any* tập hợp bộ lọc tìm kiếm, sau khi lưu và tải lại trang, bộ lọc phải được khôi phục chính xác với các giá trị đã lưu.

**Validates: Requirements 4.8**

### Property 17: Nhãn "Đã ứng tuyển" hiển thị đúng

*For any* candidate đã đăng nhập và đã nộp đơn vào một số job, trong kết quả tìm kiếm, chỉ những job đã ứng tuyển mới hiển thị nhãn "Đã ứng tuyển".

**Validates: Requirements 4.9**

### Property 18: Form ứng tuyển điền sẵn từ profile

*For any* candidate có profile đã điền thông tin, khi mở form ứng tuyển, các trường tương ứng phải được điền sẵn với dữ liệu từ profile.

**Validates: Requirements 5.1**

### Property 19: Giới hạn độ dài cover letter

*For any* cover letter có độ dài vượt quá 2000 ký tự, hệ thống phải từ chối và hiển thị lỗi; với cover letter trong giới hạn, phải được chấp nhận.

**Validates: Requirements 5.3**

### Property 20: Không tạo đơn ứng tuyển trùng lặp (idempotence)

*For any* candidate và job posting, dù candidate nộp đơn bao nhiêu lần, hệ thống chỉ lưu tối đa một đơn ứng tuyển cho cặp (candidate, job) đó.

**Validates: Requirements 5.5**

### Property 21: Thông báo khi trạng thái đơn thay đổi

*For any* đơn ứng tuyển, mỗi lần recruiter cập nhật trạng thái, candidate phải nhận được thông báo tương ứng.

**Validates: Requirements 5.8**

### Property 22: Pipeline cập nhật trạng thái và ghi lịch sử

*For any* đơn ứng tuyển được di chuyển sang giai đoạn khác trong pipeline, trạng thái phải được cập nhật ngay lập tức và một entry mới phải được thêm vào lịch sử thay đổi trạng thái.

**Validates: Requirements 6.3**

### Property 23: Ghi chú nội bộ được lưu và truy xuất (round-trip)

*For any* đơn ứng tuyển và nội dung ghi chú bất kỳ, sau khi recruiter thêm ghi chú, ghi chú đó phải xuất hiện khi truy xuất chi tiết đơn ứng tuyển.

**Validates: Requirements 6.4**

### Property 24: Đánh giá chỉ chấp nhận giá trị 1-5

*For any* giá trị đánh giá, nếu nằm trong khoảng [1, 5], phải được lưu thành công; nếu ngoài khoảng này, phải bị từ chối.

**Validates: Requirements 6.5**

### Property 25: Hành động hàng loạt áp dụng cho tất cả đã chọn

*For any* tập hợp đơn ứng tuyển được chọn và một hành động hàng loạt, hành động đó phải được áp dụng cho tất cả và chỉ những đơn đã được chọn.

**Validates: Requirements 6.6**

### Property 26: Thống kê dashboard phản ánh đúng dữ liệu thực

*For any* tập dữ liệu đã biết (số job, số application, số theo từng giai đoạn), các chỉ số hiển thị trên dashboard phải khớp chính xác với dữ liệu thực tế.

**Validates: Requirements 6.7, 10.1, 10.2, 10.3**

### Property 27: Vô hiệu hóa recruiter ẩn tất cả job của họ

*For any* recruiter bị admin vô hiệu hóa, tất cả tin tuyển dụng của recruiter đó phải biến mất khỏi kết quả tìm kiếm của candidate.

**Validates: Requirements 11.4**

### Property 28: Mọi hành động admin đều tạo audit log entry

*For any* hành động quản trị (kích hoạt/vô hiệu hóa tài khoản, phê duyệt/từ chối job, thay đổi cấu hình), một entry mới phải được tạo trong audit log với đầy đủ thông tin (thời gian, hành động, đối tượng bị tác động).

**Validates: Requirements 11.5**

### Property 29: Responsive layout đúng ở mọi viewport

*For any* viewport width trong khoảng [320px, 2560px], giao diện phải hiển thị đúng và không bị vỡ layout.

**Validates: Requirements 12.3**

### Property 30: Dữ liệu form được lưu khi mất kết nối (round-trip)

*For any* dữ liệu đang nhập trong form khi kết nối mạng bị gián đoạn, dữ liệu phải được lưu vào localStorage và khôi phục đầy đủ khi kết nối lại.

**Validates: Requirements 12.5**

### Property 31: RBAC ngăn truy cập trái phép

*For any* request từ một role cụ thể đến một endpoint không thuộc quyền của role đó, hệ thống phải trả về lỗi 403 Forbidden.

**Validates: Requirements 13.3**

### Property 32: Input được sanitize trước khi xử lý

*For any* input chứa payload XSS hoặc SQL injection, sau khi qua lớp sanitization, output phải không còn chứa các ký tự/chuỗi nguy hiểm.

**Validates: Requirements 13.4**

### Property 33: Rate limiting từ chối request vượt giới hạn

*For any* địa chỉ IP gửi hơn 100 requests trong vòng 1 phút, các request vượt quá giới hạn phải nhận được response 429 Too Many Requests.

**Validates: Requirements 13.5**


## 8. Xử Lý Lỗi (Error Handling)

### 8.1 HTTP Error Handling

RTK Query middleware xử lý tập trung:

```typescript
// Các mã lỗi và xử lý tương ứng
400 Bad Request     → Hiển thị validation errors từ response body
401 Unauthorized    → Thử refresh token; nếu thất bại → redirect /auth/login
403 Forbidden       → Hiển thị thông báo "Không có quyền truy cập"
404 Not Found       → Hiển thị trang 404
409 Conflict        → Hiển thị thông báo lỗi cụ thể (vd: email đã tồn tại)
422 Unprocessable   → Hiển thị lỗi validation từng trường
429 Too Many Req    → Hiển thị thông báo "Vui lòng thử lại sau X giây"
500 Server Error    → Hiển thị thông báo lỗi chung + nút thử lại
```

### 8.2 Form Validation Errors

Dùng React Hook Form + Zod schema validation:
- Validate client-side trước khi gửi request
- Hiển thị lỗi inline dưới từng trường
- Kết hợp với server-side validation errors từ API response

### 8.3 Network Error Handling

```typescript
// Khi mất kết nối
- Hiển thị banner "Mất kết nối mạng"
- Lưu form data vào localStorage (useFormPersist)
- Retry tự động khi kết nối lại (RTK Query refetchOnReconnect)
```

### 8.4 File Upload Errors

```
- File quá lớn: hiển thị lỗi ngay khi chọn file (client-side)
- Sai định dạng: hiển thị lỗi ngay khi chọn file
- Upload thất bại: hiển thị lỗi + nút thử lại
```

### 8.5 Real-time Connection Errors

```typescript
// Socket.IO reconnection strategy
{
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000
}
// Khi mất kết nối: hiển thị indicator "Đang kết nối lại..."
```

### 8.6 Error Boundaries

Mỗi major section có React Error Boundary riêng để tránh crash toàn bộ app:
- `<RouteErrorBoundary>` - bao quanh mỗi page
- `<WidgetErrorBoundary>` - bao quanh các dashboard widgets


## 9. Chiến Lược Kiểm Thử (Testing Strategy)

### 9.1 Tổng quan

Hệ thống sử dụng hai lớp kiểm thử bổ sung cho nhau:
- **Unit/Example tests**: kiểm tra các trường hợp cụ thể, edge cases và error conditions
- **Property-based tests**: kiểm tra các thuộc tính phổ quát trên nhiều input ngẫu nhiên

### 9.2 Công cụ kiểm thử

| Loại | Công cụ |
|------|---------|
| Test runner | Vitest |
| Component testing | React Testing Library |
| Property-based testing | fast-check |
| E2E testing | Playwright |
| Mock | MSW (Mock Service Worker) |
| Coverage | Istanbul (tích hợp Vitest) |

### 9.3 Property-Based Tests

Dùng thư viện **fast-check** với tối thiểu **100 iterations** mỗi property test.

Mỗi test được tag theo format:
```
// Feature: recruitment-system, Property {N}: {property_text}
```

Các property cần implement (từ Correctness Properties section):

**Auth properties (P1-P4):**
```typescript
// P1: Đăng ký hợp lệ luôn tạo tài khoản
fc.assert(fc.asyncProperty(
  fc.record({ fullName: fc.string({minLength:1}), email: fc.emailAddress(), ... }),
  async (validData) => { /* register → verify account created */ }
), { numRuns: 100 });
```

**File validation properties (P5):**
```typescript
// P5: File upload validation theo kích thước
fc.assert(fc.property(
  fc.integer({ min: 0, max: 20_000_000 }),
  (fileSize) => {
    const result = validateFileSize(fileSize, 5_000_000);
    return fileSize <= 5_000_000 ? result.valid : !result.valid;
  }
), { numRuns: 100 });
```

**Search/Filter properties (P14, P15, P16, P17):**
```typescript
// P14: Bộ lọc trả về đúng kết quả
fc.assert(fc.asyncProperty(
  fc.array(arbitraryJobPosting()),
  arbitraryJobFilters(),
  async (jobs, filters) => {
    const results = await searchJobs(jobs, filters);
    return results.every(job => matchesFilters(job, filters));
  }
), { numRuns: 100 });
```

**Business logic properties (P20, P22, P24, P25, P26):**
```typescript
// P20: Không tạo đơn trùng lặp (idempotence)
fc.assert(fc.asyncProperty(
  arbitraryCandidate(),
  arbitraryJobPosting(),
  fc.integer({ min: 1, max: 5 }),
  async (candidate, job, attempts) => {
    for (let i = 0; i < attempts; i++) {
      await tryApply(candidate.id, job.id);
    }
    const apps = await getApplications(candidate.id, job.id);
    return apps.length === 1;
  }
), { numRuns: 100 });
```

**Security properties (P31, P32, P33):**
```typescript
// P31: RBAC ngăn truy cập trái phép
fc.assert(fc.asyncProperty(
  arbitraryRole(),
  arbitraryEndpoint(),
  async (role, endpoint) => {
    if (!isAllowed(role, endpoint)) {
      const response = await callEndpoint(role, endpoint);
      return response.status === 403;
    }
    return true;
  }
), { numRuns: 100 });
```

### 9.4 Unit/Example Tests

Tập trung vào:
- Render đúng các component với props khác nhau
- User interactions (click, input, submit)
- Edge cases: empty states, loading states, error states
- Integration giữa các components

```typescript
// Ví dụ: test pipeline drag-and-drop
it('should update application status when dragged to new column', async () => {
  // setup mock data
  // simulate drag-and-drop
  // verify status updated + history recorded
});
```

### 9.5 Integration Tests

Dùng MSW để mock API:
- Auth flow: register → verify → login → logout
- Job flow: create draft → publish → search → apply
- Pipeline flow: receive application → move through stages → hire/reject
- Notification flow: trigger event → receive notification

### 9.6 E2E Tests (Playwright)

Critical user journeys:
1. Candidate: đăng ký → tìm việc → nộp đơn → theo dõi trạng thái
2. Recruiter: đăng tin → nhận đơn → pipeline → lên lịch phỏng vấn → tuyển dụng
3. Admin: quản lý người dùng → kiểm duyệt tin → xem báo cáo

### 9.7 Coverage Target

- Unit + Property tests: ≥ 80% line coverage
- Critical paths (auth, application submission, pipeline): ≥ 95%


## 10. Các Quyết Định Kỹ Thuật (Technical Decisions)

### 10.1 Tại sao dùng RTK Query thay vì React Query?

RTK Query được tích hợp sẵn với Redux Toolkit, giúp đồng bộ server state với global state (auth, notifications) dễ dàng hơn. Với hệ thống có nhiều role và phức tạp về phân quyền, việc có một store thống nhất giúp debug và maintain tốt hơn.

### 10.2 Tại sao dùng Ant Design?

Ant Design cung cấp sẵn các component phức tạp cần thiết: Table với sorting/filtering, DatePicker, Upload, Kanban-ready components. Điều này giảm đáng kể thời gian phát triển so với tự build từ đầu.

### 10.3 Drag-and-drop Pipeline

Dùng `@dnd-kit/core` thay vì `react-beautiful-dnd` vì:
- Hỗ trợ tốt hơn với React 18 Strict Mode
- Accessibility tốt hơn (keyboard navigation)
- Bundle size nhỏ hơn

### 10.4 Rich Text Editor

Dùng **TipTap** (dựa trên ProseMirror) vì:
- Headless architecture, dễ style với Tailwind
- Extension system linh hoạt
- TypeScript support tốt

### 10.5 Real-time Notifications

Socket.IO được chọn vì:
- Fallback tự động (WebSocket → long polling)
- Reconnection handling tích hợp sẵn
- Phổ biến, nhiều tài liệu

### 10.6 File Upload Strategy

- Client-side validation trước (kích thước, định dạng) để UX tốt hơn
- Upload trực tiếp lên S3/cloud storage qua presigned URL (tránh qua backend)
- Backend chỉ lưu metadata (URL, tên file, kích thước)

### 10.7 Cấu trúc thư mục theo Feature

Chọn feature-based structure thay vì type-based (components/, hooks/, services/) vì:
- Dễ tìm code liên quan đến một tính năng
- Dễ xóa/thêm tính năng mà không ảnh hưởng phần khác
- Scale tốt hơn khi team lớn

### 10.8 Form Persistence

Custom hook `useFormPersist` dùng localStorage với key theo route:
```typescript
// Key format: form-persist-{routePath}
// Tự động xóa sau khi submit thành công
// TTL: 24 giờ
```

