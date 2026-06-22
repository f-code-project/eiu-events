# Exploring IT Universe (EIU) — Hệ thống tích điểm sự kiện

## Tổng quan

Hệ thống web phục vụ sự kiện **Exploring IT Universe (EIU)** — sự kiện diễn ra trong **1 ngày** với nhiều trạm trò chơi. Sinh viên tham gia các trạm, tích điểm, và đổi thưởng khi hoàn thành tất cả trạm.

- **Đối tượng:** Sinh viên trường (bắt buộc có MSSV)
- **Quy mô:** 1 sự kiện duy nhất, 1 ngày
- **Số trạm:** Dynamic — Admin tạo/quản lý, mặc định 7 trạm

---

## Roles & Phân quyền

### 1. Admin

- Full quyền trên toàn hệ thống
- CRUD trạm (tên, mô tả, trạng thái)
- CRUD tài khoản nhân sự trực trạm (phân quyền theo trạm)
- Xem/sửa điểm người chơi
- Dashboard thống kê toàn bộ sự kiện

### 2. Trực trạm

- Mỗi tài khoản được phân quyền quản lý **1 hoặc nhiều trạm** cụ thể (trạm 1→7)
- Nhập MSSV người chơi → cộng điểm trực tiếp tại trạm mình phụ trách
- Tài khoản có role **Trạm Đổi Thưởng** → có thêm quyền xử lý đổi thưởng:
  - Nhận thông báo realtime khi người chơi yêu cầu nhận thưởng
  - Xem tổng điểm người chơi
  - Đánh dấu "Đã nhận thưởng"

### 3. Người chơi

- Tự đăng ký tài khoản
- Xem tiến trình chơi (trạm đã hoàn thành, điểm từng trạm, tổng điểm)
- Nhấn "Nhận thưởng" khi đủ điều kiện

---

## Flow hệ thống

### 1. Đăng ký tài khoản

- Tại mỗi trạm có **mã QR tĩnh** (URL tới trang đăng ký)
- Người chơi quét QR → truy cập trang đăng ký
- Thông tin đăng ký:
  - MSSV (bắt buộc, duy nhất)
  - Mật khẩu
  - Xác nhận mật khẩu
- Sau đăng ký → đăng nhập bằng MSSV + mật khẩu

### 2. Chấm điểm tại trạm

1. Người chơi hoàn thành trò chơi tại trạm
2. Nhân sự trực trạm nhập **MSSV** người chơi trên hệ thống
3. Nhân sự chọn số điểm: **1 điểm / 2 điểm / 3 điểm**
4. Hệ thống cộng điểm trực tiếp vào tài khoản người chơi

**Quy tắc:**

| Quy tắc | Chi tiết |
|---------|----------|
| Tối đa điểm/trạm | Mỗi người chơi tối đa **3 điểm** tại 1 trạm |
| Không chơi lặp | Mỗi người chỉ được tính điểm **1 lần** tại mỗi trạm |
| Phân quyền trạm | Nhân sự chỉ cộng điểm tại trạm mình được phân quyền |

### 3. Giao diện người chơi

Sau khi đăng nhập, người chơi thấy:

- Danh sách trạm + trạng thái (đã chơi / chưa chơi)
- Điểm đạt được tại mỗi trạm
- Tổng điểm hiện tại
- Nút **"Nhận thưởng"** — hiển thị khi đã hoàn thành tất cả trạm
- Trạng thái **"Đã nhận thưởng"** — sau khi được trao quà

### 4. Điều kiện hoàn thành sự kiện

- Người chơi **có điểm tại tất cả trạm** (≥1 điểm/trạm) → hoàn thành sự kiện
- Khi hoàn thành → nút **"Nhận thưởng"** xuất hiện

### 5. Quy trình đổi thưởng

1. Người chơi nhấn nút **"Nhận thưởng"**
2. Hệ thống gửi **thông báo realtime** tới màn hình Trạm Đổi Thưởng
3. Thông tin hiển thị cho nhân sự:
   - MSSV
   - Tổng điểm
   - Thời gian yêu cầu
4. Nhân sự xem tổng điểm → **tự quyết định loại quà** phù hợp
5. Sau khi trao quà → nhân sự nhấn **"Đã trao thưởng"**
6. Hệ thống chuyển trạng thái người chơi → **"Đã nhận thưởng"**

### 6. Chống gian lận

| Quy tắc | Chi tiết |
|---------|----------|
| Không chơi lặp trạm | Mỗi người chỉ tính điểm 1 lần/trạm |
| Không nhận thưởng lặp | Trạng thái "Đã nhận thưởng" → không thể yêu cầu lần 2 |
| Cộng điểm qua nhân sự | Chỉ nhân sự trực trạm mới cộng được điểm, tránh gian lận QR |

---

## Admin Dashboard

Thống kê realtime toàn bộ sự kiện:

- Tổng số người chơi đã đăng ký
- Số người hoàn thành từng trạm
- Số người đã hoàn thành tất cả trạm
- Số người đã đổi thưởng
- Phân bố điểm theo trạm

Quản lý:

- CRUD trạm (dynamic — thêm/sửa/xoá trạm)
- CRUD tài khoản nhân sự trực trạm (phân quyền theo trạm)
- Xem/sửa điểm người chơi (phòng trường hợp nhập sai)
- Xem danh sách người chơi + chi tiết điểm từng trạm
