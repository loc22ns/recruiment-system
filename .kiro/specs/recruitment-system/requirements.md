# Tài Liệu Yêu Cầu - Hệ Thống Tuyển Dụng (ReactJS)

## Giới Thiệu

Hệ thống tuyển dụng trực tuyến được xây dựng bằng ReactJS, cho phép nhà tuyển dụng đăng tin tuyển dụng, quản lý ứng viên và quy trình tuyển dụng; đồng thời cho phép ứng viên tìm kiếm việc làm, nộp CV và theo dõi trạng thái ứng tuyển. Hệ thống hướng đến việc số hóa toàn bộ quy trình tuyển dụng từ đăng tin đến onboarding.

---

## Bảng Chú Giải

- **System**: Hệ thống tuyển dụng ReactJS tổng thể
- **Candidate**: Ứng viên — người dùng tìm kiếm và ứng tuyển vào các vị trí công việc
- **Recruiter**: Nhà tuyển dụng — người đại diện công ty đăng tin và quản lý ứng viên
- **Admin**: Quản trị viên hệ thống — người có toàn quyền quản lý nền tảng
- **Job_Posting**: Tin tuyển dụng — bài đăng mô tả vị trí công việc cần tuyển
- **CV**: Hồ sơ xin việc (Curriculum Vitae) — tài liệu thể hiện thông tin cá nhân và kinh nghiệm của ứng viên
- **Application**: Đơn ứng tuyển — hồ sơ ứng viên gửi cho một Job_Posting cụ thể
- **Auth_Service**: Dịch vụ xác thực — module xử lý đăng ký, đăng nhập và phân quyền
- **Job_Service**: Dịch vụ quản lý tin tuyển dụng
- **Application_Service**: Dịch vụ quản lý đơn ứng tuyển
- **Notification_Service**: Dịch vụ thông báo — gửi email và thông báo trong ứng dụng
- **Search_Engine**: Module tìm kiếm và lọc tin tuyển dụng
- **Dashboard**: Giao diện tổng quan dành cho Recruiter và Admin
- **Profile**: Trang hồ sơ cá nhân của Candidate hoặc Recruiter
- **Interview**: Buổi phỏng vấn được lên lịch trong quy trình tuyển dụng
- **Pipeline**: Quy trình tuyển dụng gồm nhiều giai đoạn (stages)

---

## Yêu Cầu

### Yêu Cầu 1: Xác Thực và Phân Quyền Người Dùng

**User Story:** Là một người dùng, tôi muốn đăng ký và đăng nhập vào hệ thống với vai trò phù hợp (Candidate hoặc Recruiter), để tôi có thể truy cập các chức năng tương ứng với vai trò của mình.

#### Tiêu Chí Chấp Nhận

1. THE Auth_Service SHALL cung cấp form đăng ký với các trường: họ tên, email, mật khẩu, xác nhận mật khẩu và lựa chọn vai trò (Candidate / Recruiter).
2. WHEN người dùng gửi form đăng ký với email đã tồn tại, THE Auth_Service SHALL hiển thị thông báo lỗi "Email đã được sử dụng" trong vòng 1 giây.
3. WHEN người dùng gửi form đăng ký hợp lệ, THE Auth_Service SHALL tạo tài khoản và gửi email xác minh đến địa chỉ email đã đăng ký trong vòng 30 giây.
4. WHEN người dùng nhấp vào liên kết xác minh email, THE Auth_Service SHALL kích hoạt tài khoản và chuyển hướng người dùng đến trang đăng nhập.
5. WHEN người dùng đăng nhập với email và mật khẩu hợp lệ, THE Auth_Service SHALL tạo JWT token với thời hạn 24 giờ và chuyển hướng đến Dashboard tương ứng với vai trò.
6. IF người dùng đăng nhập sai mật khẩu quá 5 lần liên tiếp, THEN THE Auth_Service SHALL khóa tài khoản trong 15 phút và hiển thị thông báo tương ứng.
7. THE Auth_Service SHALL hỗ trợ đăng nhập bằng tài khoản Google OAuth 2.0.
8. WHEN người dùng nhấp "Quên mật khẩu" và nhập email hợp lệ, THE Auth_Service SHALL gửi email đặt lại mật khẩu với liên kết có hiệu lực trong 1 giờ.
9. WHILE người dùng đã đăng nhập, THE Auth_Service SHALL tự động làm mới token trước khi hết hạn 5 phút.
10. WHEN người dùng đăng xuất, THE Auth_Service SHALL hủy token hiện tại và xóa dữ liệu phiên khỏi bộ nhớ trình duyệt.

---

### Yêu Cầu 2: Quản Lý Hồ Sơ Cá Nhân

**User Story:** Là một Candidate, tôi muốn tạo và cập nhật hồ sơ cá nhân chi tiết, để nhà tuyển dụng có thể đánh giá năng lực của tôi.

#### Tiêu Chí Chấp Nhận

1. THE Profile SHALL cho phép Candidate nhập các thông tin: ảnh đại diện, họ tên, ngày sinh, số điện thoại, địa chỉ, mục tiêu nghề nghiệp, học vấn, kinh nghiệm làm việc, kỹ năng và chứng chỉ.
2. WHEN Candidate tải lên ảnh đại diện có kích thước vượt quá 5MB, THE Profile SHALL hiển thị thông báo lỗi và từ chối tệp.
3. THE Profile SHALL hỗ trợ tải lên CV dạng PDF hoặc DOCX với kích thước tối đa 10MB.
4. WHEN Candidate lưu thông tin Profile, THE Profile SHALL xác thực tất cả trường bắt buộc và hiển thị thông báo lỗi cụ thể cho từng trường thiếu.
5. THE Profile SHALL hiển thị phần trăm hoàn thiện hồ sơ dựa trên số trường đã điền so với tổng số trường.
6. WHERE Candidate bật chế độ "Tìm kiếm việc làm", THE Profile SHALL hiển thị hồ sơ của Candidate trong kết quả tìm kiếm của Recruiter.
7. WHEN Candidate cập nhật thông tin Profile thành công, THE Profile SHALL hiển thị thông báo xác nhận "Cập nhật thành công" trong 3 giây.

---

### Yêu Cầu 3: Tạo và Quản Lý Tin Tuyển Dụng

**User Story:** Là một Recruiter, tôi muốn tạo và quản lý các tin tuyển dụng, để thu hút ứng viên phù hợp cho các vị trí cần tuyển.

#### Tiêu Chí Chấp Nhận

1. THE Job_Service SHALL cung cấp form tạo Job_Posting với các trường: tiêu đề vị trí, mô tả công việc, yêu cầu ứng viên, quyền lợi, mức lương (khoảng hoặc thỏa thuận), địa điểm làm việc, hình thức làm việc (toàn thời gian / bán thời gian / remote / hybrid), ngành nghề, cấp bậc và hạn nộp hồ sơ.
2. WHEN Recruiter lưu Job_Posting ở trạng thái nháp, THE Job_Service SHALL lưu dữ liệu mà không yêu cầu điền đầy đủ các trường bắt buộc.
3. WHEN Recruiter xuất bản Job_Posting, THE Job_Service SHALL kiểm tra tất cả trường bắt buộc và từ chối xuất bản nếu thiếu thông tin, hiển thị danh sách các trường còn thiếu.
4. WHEN Job_Posting được xuất bản thành công, THE Job_Service SHALL hiển thị tin tuyển dụng trong kết quả tìm kiếm trong vòng 5 phút.
5. THE Job_Service SHALL cho phép Recruiter chỉnh sửa Job_Posting đã xuất bản mà không làm mất các Application đã nhận.
6. WHEN Recruiter đóng Job_Posting, THE Job_Service SHALL cập nhật trạng thái thành "Đã đóng" và ẩn tin khỏi kết quả tìm kiếm của Candidate.
7. THE Job_Service SHALL cho phép Recruiter sao chép một Job_Posting hiện có để tạo tin mới với nội dung tương tự.
8. THE Job_Service SHALL hiển thị danh sách tất cả Job_Posting của Recruiter với bộ lọc theo trạng thái (nháp / đang tuyển / đã đóng) và sắp xếp theo ngày tạo.
9. WHEN hạn nộp hồ sơ của Job_Posting đến, THE Job_Service SHALL tự động chuyển trạng thái sang "Hết hạn" và gửi thông báo cho Recruiter.
10. THE Job_Service SHALL hỗ trợ định dạng văn bản phong phú (rich text) cho trường mô tả công việc và yêu cầu ứng viên.

---

### Yêu Cầu 4: Tìm Kiếm và Lọc Tin Tuyển Dụng

**User Story:** Là một Candidate, tôi muốn tìm kiếm và lọc tin tuyển dụng theo nhiều tiêu chí, để tìm được công việc phù hợp với nhu cầu của mình.

#### Tiêu Chí Chấp Nhận

1. THE Search_Engine SHALL cung cấp thanh tìm kiếm cho phép Candidate nhập từ khóa theo tiêu đề vị trí, tên công ty hoặc kỹ năng.
2. WHEN Candidate nhập từ khóa tìm kiếm, THE Search_Engine SHALL hiển thị kết quả gợi ý trong vòng 300ms.
3. THE Search_Engine SHALL cung cấp bộ lọc theo: địa điểm, mức lương, hình thức làm việc, ngành nghề, cấp bậc và ngày đăng.
4. WHEN Candidate áp dụng bộ lọc, THE Search_Engine SHALL cập nhật danh sách kết quả trong vòng 500ms mà không tải lại trang.
5. THE Search_Engine SHALL hiển thị kết quả tìm kiếm dạng danh sách với thông tin tóm tắt: tiêu đề, tên công ty, địa điểm, mức lương và ngày đăng.
6. THE Search_Engine SHALL hỗ trợ phân trang với tối đa 20 kết quả mỗi trang.
7. WHEN Candidate không có kết quả tìm kiếm, THE Search_Engine SHALL hiển thị thông báo "Không tìm thấy kết quả phù hợp" và gợi ý điều chỉnh bộ lọc.
8. THE Search_Engine SHALL cho phép Candidate lưu bộ lọc tìm kiếm để sử dụng lại.
9. WHILE Candidate đã đăng nhập, THE Search_Engine SHALL hiển thị nhãn "Đã ứng tuyển" trên các Job_Posting mà Candidate đã nộp hồ sơ.

---

### Yêu Cầu 5: Nộp Đơn Ứng Tuyển

**User Story:** Là một Candidate, tôi muốn nộp đơn ứng tuyển vào các vị trí công việc, để có cơ hội được xem xét bởi nhà tuyển dụng.

#### Tiêu Chí Chấp Nhận

1. WHEN Candidate nhấp "Ứng tuyển ngay" trên một Job_Posting, THE Application_Service SHALL hiển thị form ứng tuyển với thông tin từ Profile được điền sẵn.
2. THE Application_Service SHALL cho phép Candidate chọn CV đã tải lên trong Profile hoặc tải lên CV mới (PDF/DOCX, tối đa 10MB) khi nộp đơn.
3. THE Application_Service SHALL cung cấp trường nhập thư xin việc (cover letter) tùy chọn với giới hạn 2000 ký tự.
4. WHEN Candidate gửi Application thành công, THE Application_Service SHALL hiển thị thông báo xác nhận và gửi email xác nhận đến Candidate trong vòng 1 phút.
5. IF Candidate cố gắng nộp đơn vào một Job_Posting đã ứng tuyển trước đó, THEN THE Application_Service SHALL hiển thị thông báo "Bạn đã ứng tuyển vị trí này" và không tạo Application trùng lặp.
6. IF Candidate cố gắng nộp đơn vào một Job_Posting đã đóng hoặc hết hạn, THEN THE Application_Service SHALL hiển thị thông báo lỗi và vô hiệu hóa nút ứng tuyển.
7. THE Application_Service SHALL cho phép Candidate xem danh sách tất cả Application đã nộp với trạng thái hiện tại.
8. WHEN Recruiter cập nhật trạng thái Application, THE Application_Service SHALL gửi thông báo đến Candidate trong vòng 5 phút.
9. THE Application_Service SHALL cho phép Candidate rút đơn ứng tuyển khi trạng thái còn ở giai đoạn "Đang xem xét".

---

### Yêu Cầu 6: Quản Lý Ứng Viên và Pipeline Tuyển Dụng

**User Story:** Là một Recruiter, tôi muốn quản lý danh sách ứng viên và theo dõi tiến trình tuyển dụng theo từng giai đoạn, để tổ chức quy trình tuyển dụng hiệu quả.

#### Tiêu Chí Chấp Nhận

1. THE Dashboard SHALL hiển thị danh sách tất cả Application nhận được cho mỗi Job_Posting, có thể lọc theo trạng thái và sắp xếp theo ngày nộp.
2. THE Application_Service SHALL cung cấp Pipeline với các giai đoạn mặc định: Mới nộp → Đang xem xét → Phỏng vấn → Đề nghị → Đã tuyển / Từ chối.
3. WHEN Recruiter kéo thả Application sang giai đoạn khác trong Pipeline, THE Application_Service SHALL cập nhật trạng thái ngay lập tức và ghi lại lịch sử thay đổi.
4. THE Application_Service SHALL cho phép Recruiter thêm ghi chú nội bộ vào từng Application mà Candidate không thể xem.
5. THE Application_Service SHALL cho phép Recruiter đánh giá Candidate theo thang điểm 1-5 sao.
6. WHEN Recruiter chọn nhiều Application, THE Application_Service SHALL cho phép thực hiện hành động hàng loạt: chuyển giai đoạn, gửi email hoặc từ chối.
7. THE Dashboard SHALL hiển thị thống kê tổng quan: tổng số Application, số theo từng giai đoạn, tỷ lệ chuyển đổi giữa các giai đoạn.
8. THE Application_Service SHALL cho phép Recruiter xuất danh sách ứng viên ra file Excel (.xlsx) với đầy đủ thông tin.
9. WHEN Recruiter từ chối Application, THE Application_Service SHALL yêu cầu chọn lý do từ chối và tùy chọn gửi email thông báo cho Candidate.

---

### Yêu Cầu 7: Lên Lịch Phỏng Vấn

**User Story:** Là một Recruiter, tôi muốn lên lịch phỏng vấn với ứng viên, để tổ chức buổi gặp gỡ đánh giá một cách có hệ thống.

#### Tiêu Chí Chấp Nhận

1. THE Application_Service SHALL cho phép Recruiter tạo Interview với thông tin: ngày giờ, hình thức (trực tiếp / video call / điện thoại), địa điểm hoặc link họp, người phỏng vấn và ghi chú.
2. WHEN Interview được tạo, THE Notification_Service SHALL gửi email xác nhận đến Candidate với đầy đủ thông tin buổi phỏng vấn trong vòng 5 phút.
3. THE Application_Service SHALL gửi email nhắc nhở Interview cho cả Candidate và Recruiter trước 24 giờ và trước 1 giờ.
4. WHEN Candidate xác nhận tham dự Interview, THE Application_Service SHALL cập nhật trạng thái xác nhận và thông báo cho Recruiter.
5. THE Application_Service SHALL cho phép Recruiter hủy hoặc đổi lịch Interview và tự động thông báo cho Candidate.
6. WHEN Interview hoàn thành, THE Application_Service SHALL nhắc Recruiter điền kết quả đánh giá phỏng vấn.

---

### Yêu Cầu 8: Thông Báo và Giao Tiếp

**User Story:** Là một người dùng, tôi muốn nhận thông báo kịp thời về các hoạt động liên quan đến tôi, để không bỏ lỡ thông tin quan trọng.

#### Tiêu Chí Chấp Nhận

1. THE Notification_Service SHALL hiển thị biểu tượng thông báo trên thanh điều hướng với số lượng thông báo chưa đọc.
2. WHEN có thông báo mới, THE Notification_Service SHALL cập nhật số lượng thông báo chưa đọc trong thời gian thực mà không cần tải lại trang.
3. THE Notification_Service SHALL lưu lịch sử thông báo trong 90 ngày.
4. THE Notification_Service SHALL cho phép người dùng cấu hình loại thông báo muốn nhận qua email và thông báo trong ứng dụng.
5. WHEN người dùng nhấp vào thông báo, THE Notification_Service SHALL đánh dấu thông báo là đã đọc và chuyển hướng đến nội dung liên quan.
6. THE Notification_Service SHALL hỗ trợ tính năng nhắn tin trực tiếp giữa Recruiter và Candidate trong phạm vi một Application.

---

### Yêu Cầu 9: Trang Công Ty và Thương Hiệu Tuyển Dụng

**User Story:** Là một Recruiter, tôi muốn xây dựng trang giới thiệu công ty, để thu hút ứng viên tiềm năng và tạo ấn tượng chuyên nghiệp.

#### Tiêu Chí Chấp Nhận

1. THE System SHALL cho phép Recruiter tạo trang công ty với thông tin: logo, ảnh bìa, tên công ty, mô tả, lĩnh vực hoạt động, quy mô, website và địa chỉ.
2. THE System SHALL hiển thị trang công ty công khai với danh sách các Job_Posting đang tuyển dụng.
3. WHEN Candidate truy cập trang công ty, THE System SHALL hiển thị thông tin công ty và tất cả Job_Posting đang hoạt động của công ty đó.
4. THE System SHALL cho phép Candidate theo dõi (follow) trang công ty để nhận thông báo khi có tin tuyển dụng mới.
5. WHEN công ty đăng Job_Posting mới, THE Notification_Service SHALL gửi thông báo đến tất cả Candidate đang theo dõi công ty đó.

---

### Yêu Cầu 10: Dashboard và Báo Cáo Thống Kê

**User Story:** Là một Recruiter hoặc Admin, tôi muốn xem báo cáo thống kê về hoạt động tuyển dụng, để đưa ra quyết định dựa trên dữ liệu.

#### Tiêu Chí Chấp Nhận

1. THE Dashboard SHALL hiển thị các chỉ số tổng quan: tổng số Job_Posting, tổng số Application, số ứng viên đang trong Pipeline và số vị trí đã tuyển thành công.
2. THE Dashboard SHALL hiển thị biểu đồ số lượng Application theo thời gian (ngày/tuần/tháng) có thể lọc theo khoảng thời gian tùy chọn.
3. THE Dashboard SHALL hiển thị biểu đồ tỷ lệ chuyển đổi (conversion rate) giữa các giai đoạn trong Pipeline.
4. THE Dashboard SHALL hiển thị danh sách nguồn ứng viên (source tracking) và tỷ lệ đóng góp của từng nguồn.
5. THE Dashboard SHALL cho phép xuất báo cáo thống kê ra file PDF hoặc Excel với khoảng thời gian tùy chọn.
6. WHEN Admin truy cập Dashboard, THE Dashboard SHALL hiển thị thêm thống kê toàn hệ thống: tổng số Recruiter, tổng số Candidate và tổng số giao dịch.

---

### Yêu Cầu 11: Quản Trị Hệ Thống

**User Story:** Là một Admin, tôi muốn quản lý toàn bộ người dùng và nội dung trên nền tảng, để đảm bảo hệ thống hoạt động đúng quy định.

#### Tiêu Chí Chấp Nhận

1. THE System SHALL cung cấp trang quản trị riêng cho Admin với danh sách tất cả người dùng, có thể tìm kiếm và lọc theo vai trò, trạng thái.
2. THE System SHALL cho phép Admin kích hoạt, vô hiệu hóa hoặc xóa tài khoản người dùng.
3. THE System SHALL cho phép Admin xem xét và phê duyệt hoặc từ chối các Job_Posting được báo cáo vi phạm.
4. WHEN Admin vô hiệu hóa tài khoản Recruiter, THE System SHALL ẩn tất cả Job_Posting của Recruiter đó khỏi kết quả tìm kiếm.
5. THE System SHALL ghi lại nhật ký hoạt động (audit log) của Admin bao gồm: thời gian, hành động và đối tượng bị tác động.
6. THE System SHALL cho phép Admin cấu hình các danh mục ngành nghề, cấp bậc và địa điểm được sử dụng trong hệ thống.

---

### Yêu Cầu 12: Hiệu Năng và Trải Nghiệm Người Dùng

**User Story:** Là một người dùng, tôi muốn hệ thống phản hồi nhanh và hoạt động ổn định, để có trải nghiệm sử dụng mượt mà.

#### Tiêu Chí Chấp Nhận

1. THE System SHALL tải trang chủ và trang tìm kiếm trong vòng 3 giây trên kết nối internet tốc độ 10Mbps.
2. THE System SHALL hỗ trợ hiển thị đúng trên các trình duyệt: Chrome (phiên bản 90+), Firefox (phiên bản 88+), Safari (phiên bản 14+) và Edge (phiên bản 90+).
3. THE System SHALL hiển thị giao diện responsive tương thích với màn hình có độ rộng từ 320px đến 2560px.
4. THE System SHALL sử dụng lazy loading cho danh sách Job_Posting và hình ảnh để giảm thời gian tải trang.
5. IF kết nối mạng bị gián đoạn trong khi người dùng đang điền form, THEN THE System SHALL lưu tạm dữ liệu vào localStorage và khôi phục khi kết nối lại.
6. THE System SHALL hỗ trợ chế độ tối (dark mode) và chế độ sáng (light mode) theo tùy chọn của người dùng.

---

### Yêu Cầu 13: Bảo Mật Dữ Liệu

**User Story:** Là một người dùng, tôi muốn dữ liệu cá nhân của mình được bảo vệ an toàn, để tránh rủi ro rò rỉ thông tin.

#### Tiêu Chí Chấp Nhận

1. THE Auth_Service SHALL mã hóa mật khẩu người dùng bằng thuật toán bcrypt với salt rounds tối thiểu là 12 trước khi lưu vào cơ sở dữ liệu.
2. THE System SHALL truyền tải tất cả dữ liệu qua giao thức HTTPS với TLS 1.2 trở lên.
3. THE System SHALL áp dụng cơ chế phân quyền dựa trên vai trò (RBAC) để đảm bảo Candidate không thể truy cập dữ liệu của Recruiter và ngược lại.
4. THE System SHALL xác thực và làm sạch (sanitize) tất cả dữ liệu đầu vào từ người dùng để ngăn chặn tấn công XSS và SQL Injection.
5. THE System SHALL giới hạn tần suất gọi API (rate limiting) ở mức tối đa 100 request mỗi phút cho mỗi địa chỉ IP.
6. THE System SHALL cho phép Candidate yêu cầu xóa toàn bộ dữ liệu cá nhân theo quy định GDPR, hoàn thành trong vòng 30 ngày.
