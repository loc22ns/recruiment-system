# Kế Hoạch Triển Khai: Hệ Thống Tuyển Dụng (ReactJS)

## Tổng Quan

Xây dựng hệ thống tuyển dụng trực tuyến bằng React 18 + TypeScript, sử dụng Redux Toolkit, RTK Query, Ant Design 5, React Router v6 và các công nghệ liên quan theo thiết kế đã định nghĩa.

## Tasks

- [~] 1. Khởi tạo dự án và cấu hình môi trường
  - Tạo dự án Vite + React 18 + TypeScript
  - Cài đặt và cấu hình: Tailwind CSS, Ant Design 5, Redux Toolkit, React Router v6, Axios, React Hook Form, Zod, Socket.IO Client, fast-check, Vitest, React Testing Library, MSW
  - Tạo cấu trúc thư mục theo feature: `src/app`, `src/assets`, `src/components`, `src/features`, `src/hooks`, `src/pages`, `src/routes`, `src/services`, `src/types`, `src/utils`, `src/constants`
  - Cấu hình Vite aliases (`@/` → `src/`)
  - Cấu hình ESLint + Prettier
  - Cấu hình Vitest với jsdom environment
  - _Yêu cầu: 12.1, 12.2_

- [x] 2. Định nghĩa TypeScript types và constants toàn hệ thống
  - Tạo `src/types/index.ts` với tất cả interfaces: `User`, `AuthState`, `CandidateProfile`, `CVFile`, `Education`, `WorkExperience`, `Skill`, `Company`, `JobPosting`, `Application`, `Interview`, `Notification`, `JobSearchFilters`, `PaginatedResponse`
  - Tạo `src/types/enums.ts` với các union types: `UserRole`, `JobStatus`, `WorkType`, `JobLevel`, `ApplicationStatus`, `InterviewType`, `NotificationType`, `CompanySize`
  - Tạo `src/constants/api.ts` với base URL và endpoint paths
  - Tạo `src/constants/app.ts` với các hằng số: giới hạn file size, pagination size, cache TTL
  - _Yêu cầu: 1.1, 2.1, 3.1, 5.3_

- [x] 3. Cấu hình Redux Store và RTK Query
  - Tạo `src/app/store.ts` với Redux store, tích hợp redux-persist cho `auth.accessToken`, `ui.theme`, `ui.sidebarCollapsed`
  - Tạo `src/features/auth/authSlice.ts` với `AuthState` (user, accessToken, isAuthenticated, loginAttempts, isLocked, lockUntil)
  - Tạo `src/features/ui/uiSlice.ts` với `UIState` (theme, sidebarCollapsed, activeModal)
  - Tạo `src/features/notifications/notificationsSlice.ts` với `NotificationsState` (unreadCount, isConnected)
  - Tạo `src/app/rootReducer.ts` kết hợp tất cả slices
  - Tạo `src/services/baseApi.ts` cấu hình RTK Query base với Axios, xử lý JWT refresh token tự động (401 → refresh → retry)
  - _Yêu cầu: 1.5, 1.9, 1.10_

- [x] 4. Xây dựng hệ thống Routing và Layout
  - Tạo `src/routes/index.tsx` với React Router v6, định nghĩa tất cả routes theo thiết kế (public, candidate, recruiter, admin)
  - Tạo `src/routes/ProtectedRoute.tsx` kiểm tra auth và role, redirect về `/auth/login` nếu chưa đăng nhập, redirect 403 nếu sai role
  - Tạo `src/components/layout/AppLayout.tsx` với Header, Sidebar, Outlet theo role
  - Tạo `src/components/layout/AuthLayout.tsx` cho các trang auth (không có sidebar)
  - Tạo `src/components/layout/Header.tsx` với logo, navigation, NotificationBell, user menu
  - Tạo `src/components/layout/Sidebar.tsx` với menu items theo role, collapsible
  - _Yêu cầu: 1.5, 11.1, 13.3_

- [ ] 5. Triển khai Module Xác Thực (Auth)
  - [x] 5.1 Tạo RTK Query API cho auth
    - Tạo `src/features/auth/authApi.ts` với endpoints: register, login, logout, refreshToken, forgotPassword, resetPassword, verifyEmail, googleOAuth
    - Implement interceptor tự động refresh token trước 5 phút hết hạn
    - _Yêu cầu: 1.1, 1.3, 1.5, 1.7, 1.8, 1.9_

  - [x] 5.2 Tạo trang và form đăng ký
    - Tạo `src/pages/public/RegisterPage.tsx` với `RegisterForm` component
    - Form fields: họ tên, email, mật khẩu, xác nhận mật khẩu, lựa chọn vai trò (Candidate/Recruiter)
    - Zod schema validation: email format, password strength, password match
    - Hiển thị lỗi "Email đã được sử dụng" (409) inline
    - Sau đăng ký thành công: hiển thị thông báo kiểm tra email
    - _Yêu cầu: 1.1, 1.2, 1.3_

  - [~] 5.3 Viết property test cho đăng ký tài khoản
    - **Property 1: Đăng ký tài khoản hợp lệ luôn tạo được tài khoản**
    - **Validates: Yêu cầu 1.3**

  - [x] 5.4 Tạo trang đăng nhập
    - Tạo `src/pages/public/LoginPage.tsx` với `LoginForm` component
    - Form fields: email, mật khẩu, remember me
    - Hiển thị lỗi đăng nhập sai, đếm số lần thất bại
    - Khóa tài khoản sau 5 lần sai, hiển thị countdown 15 phút
    - Nút "Đăng nhập với Google" (OAuth 2.0)
    - Sau đăng nhập thành công: redirect đến dashboard theo role
    - _Yêu cầu: 1.5, 1.6, 1.7_

  - [~] 5.5 Viết property test cho đăng nhập
    - **Property 3: Đăng nhập hợp lệ luôn trả về JWT token hợp lệ**
    - **Validates: Yêu cầu 1.5**

  - [~] 5.6 Tạo trang quên mật khẩu và xác minh email
    - Tạo `src/pages/public/ForgotPasswordPage.tsx` với form nhập email
    - Tạo `src/pages/public/ResetPasswordPage.tsx` với form đặt mật khẩu mới
    - Tạo `src/pages/public/VerifyEmailPage.tsx` xử lý token từ URL
    - `EmailVerificationBanner` component nhắc xác minh email
    - _Yêu cầu: 1.4, 1.8_

  - [~] 5.7 Viết property test cho xác minh email và đăng xuất
    - **Property 2: Xác minh email kích hoạt tài khoản (round-trip)**
    - **Property 4: Đăng xuất vô hiệu hóa token (round-trip)**
    - **Validates: Yêu cầu 1.4, 1.10**

  - [~] 5.8 Tạo custom hook `useAuth`
    - Tạo `src/hooks/useAuth.ts` expose: user, isAuthenticated, login, logout, role
    - _Yêu cầu: 1.5, 1.10_

- [ ] 6. Checkpoint - Xác thực hoạt động đúng
  - Đảm bảo tất cả tests pass, kiểm tra luồng đăng ký → xác minh email → đăng nhập → đăng xuất. Hỏi người dùng nếu có thắc mắc.

- [ ] 7. Triển khai Module Hồ Sơ Cá Nhân (Profile)
  - [~] 7.1 Tạo RTK Query API cho profile
    - Tạo `src/features/profile/profileApi.ts` với endpoints: getMyProfile, updateProfile, uploadAvatar, uploadCV, deleteCV, updateSeekingStatus
    - Cache 10 phút, invalidate khi update
    - _Yêu cầu: 2.1, 2.3, 2.6_

  - [~] 7.2 Tạo các component upload file
    - Tạo `src/components/common/CVUploader.tsx` dùng React Dropzone, chấp nhận PDF/DOCX, tối đa 10MB
    - Tạo `src/components/common/AvatarUploader.tsx` chấp nhận ảnh, tối đa 5MB
    - Client-side validation kích thước và định dạng trước khi upload
    - Hiển thị lỗi ngay khi chọn file sai
    - _Yêu cầu: 2.2, 2.3_

  - [~] 7.3 Viết property test cho file upload validation
    - **Property 5: Validation file upload theo kích thước**
    - **Validates: Yêu cầu 2.2, 2.3**

  - [~] 7.4 Tạo trang hồ sơ ứng viên
    - Tạo `src/pages/candidate/ProfilePage.tsx`
    - Tạo `src/features/profile/ProfileForm.tsx` với tất cả sections: thông tin cơ bản, học vấn, kinh nghiệm, kỹ năng, chứng chỉ
    - Tạo `src/features/profile/ProfileCompletionBar.tsx` hiển thị % hoàn thiện
    - Tạo `src/features/profile/ExperienceSection.tsx`, `EducationSection.tsx`, `SkillsSection.tsx`
    - Validate trường bắt buộc, hiển thị lỗi cụ thể từng trường
    - Hiển thị toast "Cập nhật thành công" sau 3 giây
    - _Yêu cầu: 2.1, 2.4, 2.5, 2.7_

  - [~] 7.5 Viết property test cho tính toán phần trăm hoàn thiện hồ sơ
    - **Property 6: Tính toán phần trăm hoàn thiện hồ sơ**
    - **Validates: Yêu cầu 2.5**

  - [~] 7.6 Viết property test cho chế độ tìm kiếm việc làm
    - **Property 7: Chế độ tìm kiếm việc làm ảnh hưởng đến visibility (round-trip)**
    - **Validates: Yêu cầu 2.6**

  - [ ] 7.7 Tạo custom hook `useFileUpload`
    - Tạo `src/hooks/useFileUpload.ts` với validation, upload state, error handling
    - _Yêu cầu: 2.2, 2.3_

- [ ] 8. Triển khai Module Tin Tuyển Dụng (Jobs)
  - [ ] 8.1 Tạo RTK Query API cho jobs
    - Tạo `src/features/jobs/jobsApi.ts` với public endpoints: getJobs, getJobById, getJobSuggestions
    - Tạo `src/features/jobs/recruiterJobsApi.ts` với recruiter endpoints: createJob, getMyJobs, updateJob, publishJob, closeJob, copyJob, deleteJob
    - Cache jobs list 5 phút, invalidate khi tạo/cập nhật/xóa
    - _Yêu cầu: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ] 8.2 Tạo form tạo/chỉnh sửa tin tuyển dụng
    - Tạo `src/features/jobs/JobForm.tsx` với React Hook Form + Zod
    - Fields: tiêu đề, mô tả (TipTap rich text), yêu cầu (TipTap), quyền lợi, mức lương, địa điểm, hình thức, ngành nghề, cấp bậc, hạn nộp
    - Tích hợp `useFormPersist` để lưu nháp vào localStorage
    - Nút "Lưu nháp" (không validate bắt buộc) và "Xuất bản" (validate đầy đủ)
    - Hiển thị danh sách trường còn thiếu khi xuất bản thất bại
    - _Yêu cầu: 3.1, 3.2, 3.3, 3.10_

  - [ ] 8.3 Viết property test cho lưu nháp và xuất bản
    - **Property 8: Lưu nháp không yêu cầu đầy đủ trường bắt buộc**
    - **Property 9: Xuất bản từ chối khi thiếu trường bắt buộc**
    - **Validates: Yêu cầu 3.2, 3.3**

  - [ ] 8.4 Tạo trang quản lý tin tuyển dụng (Recruiter)
    - Tạo `src/pages/recruiter/JobsPage.tsx` danh sách tin với bộ lọc theo trạng thái
    - Tạo `src/pages/recruiter/CreateJobPage.tsx` và `EditJobPage.tsx`
    - Tạo `src/features/jobs/JobStatusBadge.tsx` (nháp/đang tuyển/đã đóng/hết hạn)
    - Nút sao chép tin, xóa nháp, đóng tin
    - _Yêu cầu: 3.5, 3.6, 3.7, 3.8_

  - [ ] 8.5 Viết property test cho sao chép tin và chỉnh sửa tin
    - **Property 11: Chỉnh sửa tin không làm mất đơn ứng tuyển (invariant)**
    - **Property 13: Sao chép tin giữ nguyên nội dung**
    - **Validates: Yêu cầu 3.5, 3.7**

  - [ ] 8.6 Tạo custom hook `useFormPersist`
    - Tạo `src/hooks/useFormPersist.ts` lưu form data vào localStorage với key theo route, TTL 24 giờ, tự xóa sau submit
    - _Yêu cầu: 12.5_

  - [ ] 8.7 Viết property test cho form persistence
    - **Property 30: Dữ liệu form được lưu khi mất kết nối (round-trip)**
    - **Validates: Yêu cầu 12.5**

- [ ] 9. Triển khai Module Tìm Kiếm Việc Làm (Search)
  - [ ] 9.1 Tạo trang tìm kiếm và danh sách việc làm (Public)
    - Tạo `src/pages/public/JobsPage.tsx` với layout 2 cột: bộ lọc trái, danh sách phải
    - Tạo `src/features/jobs/JobSearchBar.tsx` với autocomplete (debounce 300ms)
    - Tạo `src/features/jobs/JobFilters.tsx` với bộ lọc: địa điểm, mức lương, hình thức, ngành nghề, cấp bậc, ngày đăng
    - Tạo `src/features/jobs/JobCard.tsx` hiển thị: tiêu đề, công ty, địa điểm, mức lương, ngày đăng, badge "Đã ứng tuyển"
    - Tạo `src/features/jobs/JobList.tsx` với pagination (20 items/trang)
    - Cập nhật kết quả trong 500ms khi áp dụng bộ lọc (không reload trang)
    - Hiển thị "Không tìm thấy kết quả" khi rỗng
    - _Yêu cầu: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.9_

  - [ ] 9.2 Viết property test cho bộ lọc tìm kiếm
    - **Property 14: Bộ lọc tìm kiếm trả về đúng kết quả**
    - **Property 15: Phân trang không vượt quá 20 kết quả mỗi trang**
    - **Property 17: Nhãn "Đã ứng tuyển" hiển thị đúng**
    - **Validates: Yêu cầu 4.3, 4.6, 4.9**

  - [ ] 9.3 Tạo trang chi tiết tin tuyển dụng
    - Tạo `src/pages/public/JobDetailPage.tsx` hiển thị đầy đủ thông tin tin tuyển dụng
    - Nút "Ứng tuyển ngay" (disabled nếu đã ứng tuyển hoặc tin đã đóng)
    - Link đến trang công ty
    - _Yêu cầu: 4.5, 5.6_

  - [ ] 9.4 Tạo custom hooks cho tìm kiếm
    - Tạo `src/hooks/useJobSearch.ts` quản lý search state, filters, pagination
    - Tạo `src/hooks/useDebounce.ts` cho search input
    - Tạo `src/hooks/usePagination.ts` cho pagination logic
    - Implement lưu bộ lọc vào URL params để có thể share và khôi phục
    - _Yêu cầu: 4.2, 4.4, 4.8_

  - [ ] 9.5 Viết property test cho lưu và khôi phục bộ lọc
    - **Property 16: Lưu và khôi phục bộ lọc tìm kiếm (round-trip)**
    - **Validates: Yêu cầu 4.8**

- [ ] 10. Checkpoint - Jobs và Search hoạt động đúng
  - Đảm bảo tất cả tests pass, kiểm tra luồng tạo tin → xuất bản → tìm kiếm → xem chi tiết. Hỏi người dùng nếu có thắc mắc.

- [ ] 11. Triển khai Module Nộp Đơn Ứng Tuyển (Application - Candidate)
  - [ ] 11.1 Tạo RTK Query API cho applications (candidate)
    - Tạo `src/features/applications/applicationsApi.ts` với endpoints: submitApplication, getMyApplications, withdrawApplication
    - _Yêu cầu: 5.1, 5.2, 5.4, 5.7, 5.9_

  - [ ] 11.2 Tạo form nộp đơn ứng tuyển
    - Tạo `src/features/applications/ApplicationForm.tsx`
    - Điền sẵn thông tin từ profile (họ tên, email, phone)
    - Cho phép chọn CV đã upload hoặc upload CV mới (PDF/DOCX, 10MB)
    - Trường cover letter tùy chọn, giới hạn 2000 ký tự, hiển thị đếm ký tự
    - Sau submit thành công: hiển thị xác nhận, gửi email xác nhận
    - _Yêu cầu: 5.1, 5.2, 5.3, 5.4_

  - [ ] 11.3 Viết property test cho form ứng tuyển
    - **Property 18: Form ứng tuyển điền sẵn từ profile**
    - **Property 19: Giới hạn độ dài cover letter**
    - **Validates: Yêu cầu 5.1, 5.3**

  - [ ] 11.4 Xử lý các trường hợp đặc biệt khi nộp đơn
    - Hiển thị thông báo "Bạn đã ứng tuyển vị trí này" nếu đã nộp (không tạo trùng)
    - Disable nút ứng tuyển nếu tin đã đóng/hết hạn
    - _Yêu cầu: 5.5, 5.6_

  - [ ] 11.5 Viết property test cho idempotence nộp đơn
    - **Property 20: Không tạo đơn ứng tuyển trùng lặp (idempotence)**
    - **Validates: Yêu cầu 5.5**

  - [ ] 11.6 Tạo trang danh sách đơn ứng tuyển của candidate
    - Tạo `src/pages/candidate/ApplicationsPage.tsx`
    - Tạo `src/features/applications/ApplicationList.tsx` hiển thị tất cả đơn với trạng thái hiện tại
    - Nút rút đơn (chỉ khi trạng thái "Đang xem xét")
    - _Yêu cầu: 5.7, 5.9_

  - [ ] 11.7 Viết unit tests cho ApplicationForm
    - Test validation cover letter, chọn CV, submit thành công/thất bại
    - _Yêu cầu: 5.1, 5.2, 5.3_

- [ ] 12. Triển khai Module Quản Lý Ứng Viên và Pipeline (Recruiter)
  - [ ] 12.1 Tạo RTK Query API cho applications (recruiter)
    - Tạo `src/features/applications/recruiterApplicationsApi.ts` với endpoints: getApplicationsByJob, getApplicationDetail, updateApplicationStatus, addNote, rateApplication, bulkAction, exportApplications
    - Cache 2 phút, invalidate khi status thay đổi
    - _Yêu cầu: 6.1, 6.3, 6.4, 6.5, 6.6, 6.8_

  - [ ] 12.2 Tạo Kanban Pipeline Board
    - Tạo `src/features/applications/PipelineBoard.tsx` với `@dnd-kit/core`
    - Tạo `src/features/applications/PipelineColumn.tsx` cho mỗi giai đoạn: Mới nộp, Đang xem xét, Phỏng vấn, Đề nghị, Đã tuyển, Từ chối
    - Tạo `src/features/applications/ApplicationCard.tsx` draggable card
    - Khi kéo thả: cập nhật trạng thái ngay lập tức + ghi lịch sử thay đổi
    - Tạo custom hook `src/hooks/usePipeline.ts`
    - _Yêu cầu: 6.2, 6.3_

  - [ ] 12.3 Viết property test cho pipeline
    - **Property 22: Pipeline cập nhật trạng thái và ghi lịch sử**
    - **Validates: Yêu cầu 6.3**

  - [ ] 12.4 Tạo trang chi tiết đơn ứng tuyển
    - Tạo `src/pages/recruiter/ApplicationDetailPage.tsx`
    - Tạo `src/features/applications/ApplicationDetail.tsx` hiển thị: thông tin ứng viên, CV, cover letter, lịch sử trạng thái
    - Tạo `src/features/applications/RatingStars.tsx` đánh giá 1-5 sao (chỉ chấp nhận 1-5)
    - Tạo section ghi chú nội bộ (recruiter only)
    - _Yêu cầu: 6.4, 6.5_

  - [ ] 12.5 Viết property test cho ghi chú và đánh giá
    - **Property 23: Ghi chú nội bộ được lưu và truy xuất (round-trip)**
    - **Property 24: Đánh giá chỉ chấp nhận giá trị 1-5**
    - **Validates: Yêu cầu 6.4, 6.5**

  - [ ] 12.6 Tạo tính năng hành động hàng loạt
    - Tạo `src/features/applications/BulkActionBar.tsx` hiển thị khi chọn nhiều đơn
    - Hành động: chuyển giai đoạn, gửi email, từ chối (với lý do)
    - Khi từ chối: modal chọn lý do + tùy chọn gửi email thông báo
    - _Yêu cầu: 6.6, 6.9_

  - [ ] 12.7 Viết property test cho hành động hàng loạt
    - **Property 25: Hành động hàng loạt áp dụng cho tất cả đã chọn**
    - **Validates: Yêu cầu 6.6**

  - [ ] 12.8 Tạo tính năng xuất Excel
    - Implement export danh sách ứng viên ra file .xlsx
    - _Yêu cầu: 6.8_

- [ ] 13. Checkpoint - Pipeline và quản lý ứng viên hoạt động đúng
  - Đảm bảo tất cả tests pass, kiểm tra luồng nhận đơn → kéo thả pipeline → ghi chú → đánh giá. Hỏi người dùng nếu có thắc mắc.

- [ ] 14. Triển khai Module Lên Lịch Phỏng Vấn (Interview)
  - [ ] 14.1 Tạo RTK Query API cho interviews
    - Tạo `src/features/interviews/interviewsApi.ts` với endpoints: createInterview, getInterviews, updateInterview, cancelInterview, submitResult, confirmAttendance
    - _Yêu cầu: 7.1, 7.4, 7.5, 7.6_

  - [ ] 14.2 Tạo form lên lịch phỏng vấn
    - Tạo `src/features/interviews/InterviewForm.tsx`
    - Fields: ngày giờ (DateTimePicker), hình thức (trực tiếp/video/điện thoại), địa điểm hoặc link họp, người phỏng vấn, ghi chú
    - _Yêu cầu: 7.1_

  - [ ] 14.3 Tạo trang quản lý lịch phỏng vấn
    - Tạo `src/pages/recruiter/InterviewsPage.tsx` danh sách phỏng vấn
    - Nút hủy/đổi lịch, điền kết quả sau phỏng vấn
    - Trang xác nhận tham dự cho candidate: `src/pages/candidate/InterviewConfirmPage.tsx`
    - _Yêu cầu: 7.4, 7.5, 7.6_

  - [ ] 14.4 Viết unit tests cho interview scheduling
    - Test tạo lịch, hủy lịch, xác nhận tham dự
    - _Yêu cầu: 7.1, 7.4, 7.5_

- [ ] 15. Triển khai Module Thông Báo Real-time (Notifications)
  - [ ] 15.1 Cấu hình Socket.IO Client
    - Tạo `src/services/socketService.ts` với Socket.IO client, reconnection strategy (5 attempts, delay 1s-5s)
    - Tạo `src/hooks/useNotifications.ts` kết nối Socket.IO, dispatch Redux actions khi nhận event
    - _Yêu cầu: 8.1, 8.2_

  - [ ] 15.2 Tạo RTK Query API cho notifications
    - Tạo `src/features/notifications/notificationsApi.ts` với endpoints: getNotifications, markAsRead, markAllAsRead, getSettings, updateSettings
    - Không cache (real-time qua Socket.IO)
    - _Yêu cầu: 8.3, 8.4, 8.5_

  - [ ] 15.3 Tạo các component thông báo
    - Tạo `src/features/notifications/NotificationBell.tsx` với badge số chưa đọc (real-time)
    - Tạo `src/features/notifications/NotificationDropdown.tsx` danh sách thông báo
    - Tạo `src/features/notifications/NotificationItem.tsx` item đơn lẻ, click → đánh dấu đã đọc + redirect
    - _Yêu cầu: 8.1, 8.2, 8.5_

  - [ ] 15.4 Tạo tính năng nhắn tin trực tiếp
    - Tạo `src/features/notifications/MessageThread.tsx` luồng tin nhắn trong phạm vi một Application
    - Tạo endpoints: getMessages, sendMessage trong notificationsApi
    - _Yêu cầu: 8.6_

  - [ ] 15.5 Viết property test cho thông báo trạng thái đơn
    - **Property 21: Thông báo khi trạng thái đơn thay đổi**
    - **Validates: Yêu cầu 5.8_

  - [ ] 15.6 Viết unit tests cho NotificationBell và NotificationDropdown
    - Test hiển thị badge, cập nhật real-time, đánh dấu đã đọc
    - _Yêu cầu: 8.1, 8.2, 8.5_

- [ ] 16. Triển khai Module Trang Công Ty (Company)
  - [ ] 16.1 Tạo RTK Query API cho company
    - Tạo `src/features/company/companyApi.ts` với endpoints: getCompany, getCompanyJobs, createCompany, updateCompany, followCompany, unfollowCompany
    - _Yêu cầu: 9.1, 9.2, 9.3, 9.4_

  - [ ] 16.2 Tạo trang công ty public
    - Tạo `src/pages/public/CompanyPage.tsx`
    - Tạo `src/features/company/CompanyPage.tsx` hiển thị: logo, ảnh bìa, thông tin công ty, danh sách job đang tuyển
    - Tạo `src/features/company/FollowButton.tsx` nút theo dõi/bỏ theo dõi
    - _Yêu cầu: 9.2, 9.3, 9.4_

  - [ ] 16.3 Tạo trang quản lý trang công ty (Recruiter)
    - Tạo `src/pages/recruiter/CompanyPage.tsx`
    - Tạo `src/features/company/CompanyForm.tsx` với upload logo, ảnh bìa, thông tin công ty
    - _Yêu cầu: 9.1_

  - [ ] 16.4 Viết unit tests cho CompanyPage và FollowButton
    - Test hiển thị thông tin, follow/unfollow
    - _Yêu cầu: 9.3, 9.4_

- [ ] 17. Triển khai Module Dashboard và Báo Cáo
  - [ ] 17.1 Tạo RTK Query API cho dashboard
    - Tạo `src/features/dashboard/dashboardApi.ts` với endpoints: getStats, getApplicationsChart, getConversionFunnel, getSources, exportReport
    - Cache 1 phút
    - _Yêu cầu: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ] 17.2 Tạo Dashboard Recruiter
    - Tạo `src/pages/recruiter/DashboardPage.tsx`
    - Tạo `src/features/dashboard/StatsCard.tsx` hiển thị: tổng job, tổng application, đang trong pipeline, đã tuyển
    - Tạo `src/features/dashboard/ApplicationsChart.tsx` dùng Recharts, lọc theo ngày/tuần/tháng
    - Tạo `src/features/dashboard/ConversionFunnelChart.tsx` tỷ lệ chuyển đổi giữa các giai đoạn
    - Tạo `src/features/dashboard/SourceTrackingTable.tsx` nguồn ứng viên
    - Nút xuất báo cáo PDF/Excel
    - _Yêu cầu: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ] 17.3 Viết property test cho thống kê dashboard
    - **Property 26: Thống kê dashboard phản ánh đúng dữ liệu thực**
    - **Validates: Yêu cầu 6.7, 10.1, 10.2, 10.3**

  - [ ] 17.4 Tạo Dashboard Candidate
    - Tạo `src/pages/candidate/DashboardPage.tsx` tổng quan: số đơn đã nộp, trạng thái, việc làm đã lưu
    - _Yêu cầu: 5.7_

- [ ] 18. Checkpoint - Dashboard và thông báo hoạt động đúng
  - Đảm bảo tất cả tests pass, kiểm tra luồng nhận thông báo real-time và hiển thị thống kê. Hỏi người dùng nếu có thắc mắc.

- [ ] 19. Triển khai Module Quản Trị Hệ Thống (Admin)
  - [ ] 19.1 Tạo RTK Query API cho admin
    - Tạo `src/features/admin/adminApi.ts` với endpoints: getUsers, updateUserStatus, deleteUser, getReportedJobs, reviewJob, getAuditLogs, getSettings, updateSettings, getAdminStats
    - _Yêu cầu: 11.1, 11.2, 11.3, 11.5, 11.6_

  - [ ] 19.2 Tạo trang quản lý người dùng
    - Tạo `src/pages/admin/UsersPage.tsx` với Ant Design Table
    - Tìm kiếm và lọc theo vai trò, trạng thái
    - Nút kích hoạt/vô hiệu hóa/xóa tài khoản
    - _Yêu cầu: 11.1, 11.2_

  - [ ] 19.3 Tạo trang kiểm duyệt tin tuyển dụng
    - Tạo `src/pages/admin/JobsReviewPage.tsx` danh sách tin bị báo cáo
    - Nút phê duyệt/từ chối với lý do
    - _Yêu cầu: 11.3_

  - [ ] 19.4 Tạo trang audit logs và cài đặt hệ thống
    - Tạo `src/pages/admin/AuditLogsPage.tsx` nhật ký hoạt động admin
    - Tạo `src/pages/admin/SettingsPage.tsx` cấu hình ngành nghề, cấp bậc, địa điểm
    - _Yêu cầu: 11.5, 11.6_

  - [ ] 19.5 Tạo Admin Dashboard
    - Tạo `src/pages/admin/DashboardPage.tsx` thống kê toàn hệ thống: tổng recruiter, candidate, giao dịch
    - _Yêu cầu: 10.6_

  - [ ] 19.6 Viết property test cho admin actions
    - **Property 27: Vô hiệu hóa recruiter ẩn tất cả job của họ**
    - **Property 28: Mọi hành động admin đều tạo audit log entry**
    - **Validates: Yêu cầu 11.4, 11.5**

- [ ] 20. Triển khai Bảo Mật và Error Handling
  - [ ] 20.1 Implement RBAC và input sanitization
    - Tạo `src/utils/sanitize.ts` sanitize input chống XSS
    - Cấu hình ProtectedRoute kiểm tra role, trả về 403 nếu sai quyền
    - _Yêu cầu: 13.3, 13.4_

  - [ ] 20.2 Viết property test cho bảo mật
    - **Property 31: RBAC ngăn truy cập trái phép**
    - **Property 32: Input được sanitize trước khi xử lý**
    - **Validates: Yêu cầu 13.3, 13.4**

  - [ ] 20.3 Implement Error Boundaries và xử lý lỗi tập trung
    - Tạo `src/components/common/RouteErrorBoundary.tsx` bao quanh mỗi page
    - Tạo `src/components/common/WidgetErrorBoundary.tsx` bao quanh dashboard widgets
    - Cấu hình RTK Query middleware xử lý tập trung: 400, 401 (refresh), 403, 404, 409, 422, 429, 500
    - Tạo `src/components/common/NetworkStatusBanner.tsx` hiển thị khi mất kết nối
    - _Yêu cầu: 12.5_

  - [ ] 20.4 Implement rate limiting feedback
    - Hiển thị thông báo "Vui lòng thử lại sau X giây" khi nhận 429
    - _Yêu cầu: 13.5_

- [ ] 21. Triển khai UI/UX và Hiệu Năng
  - [ ] 21.1 Implement Dark/Light mode
    - Tạo `src/hooks/useTheme.ts` toggle theme, lưu vào Redux + localStorage
    - Cấu hình Ant Design ConfigProvider và Tailwind dark mode
    - _Yêu cầu: 12.6_

  - [ ] 21.2 Implement Responsive Design
    - Kiểm tra và đảm bảo layout responsive từ 320px đến 2560px
    - Sidebar collapse trên mobile, hamburger menu
    - _Yêu cầu: 12.3_

  - [ ] 21.3 Viết property test cho responsive layout
    - **Property 29: Responsive layout đúng ở mọi viewport**
    - **Validates: Yêu cầu 12.3**

  - [ ] 21.4 Implement Lazy Loading và Performance
    - Cấu hình React.lazy + Suspense cho tất cả page components
    - Lazy loading cho hình ảnh trong JobCard và CompanyPage
    - _Yêu cầu: 12.1, 12.4_

  - [ ] 21.5 Tạo các shared UI components còn lại
    - Tạo `src/components/common/LoadingSpinner.tsx`, `EmptyState.tsx`, `ErrorState.tsx`, `ConfirmModal.tsx`
    - Tạo `src/components/ui/` các design system components tái sử dụng
    - _Yêu cầu: 12.1_

- [ ] 22. Tích hợp và Wiring toàn hệ thống
  - [ ] 22.1 Kết nối tất cả modules vào App
    - Tạo `src/App.tsx` tích hợp Redux Provider, Router, Ant Design ConfigProvider, redux-persist PersistGate
    - Khởi tạo Socket.IO connection sau khi đăng nhập thành công
    - Tích hợp `NetworkStatusBanner` ở root level
    - _Yêu cầu: 8.2, 12.5_

  - [ ] 22.2 Tạo trang chủ public
    - Tạo `src/pages/public/HomePage.tsx` với hero section, featured jobs, company highlights
    - _Yêu cầu: 12.1_

  - [ ] 22.3 Tạo trang 404 và các trang lỗi
    - Tạo `src/pages/NotFoundPage.tsx`
    - Tạo `src/pages/ForbiddenPage.tsx`
    - _Yêu cầu: 13.3_

  - [ ] 22.4 Viết integration tests cho các luồng chính
    - Test auth flow: register → verify → login → logout
    - Test job flow: create draft → publish → search → apply
    - Test pipeline flow: receive application → move stages → hire/reject
    - Dùng MSW để mock API
    - _Yêu cầu: 1.3, 1.5, 3.3, 5.1, 6.3_

- [ ] 23. Checkpoint cuối - Đảm bảo toàn hệ thống hoạt động đúng
  - Đảm bảo tất cả tests pass (≥80% coverage, ≥95% cho auth và application), kiểm tra tất cả luồng chính. Hỏi người dùng nếu có thắc mắc.

## Ghi Chú

- Các task đánh dấu `*` là tùy chọn, có thể bỏ qua để phát triển MVP nhanh hơn
- Mỗi task tham chiếu đến yêu cầu cụ thể để đảm bảo traceability
- Các checkpoint giúp kiểm tra tiến độ theo từng giai đoạn
- Property tests dùng fast-check với tối thiểu 100 iterations mỗi test
- Unit tests dùng Vitest + React Testing Library
- Integration tests dùng MSW để mock API
