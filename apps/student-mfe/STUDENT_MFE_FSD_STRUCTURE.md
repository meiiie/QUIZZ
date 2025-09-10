# Student MFE - Feature-Sliced Design Architecture

## 📋 Tổng quan

Student MFE đã được tái cấu trúc theo **Feature-Sliced Design (FSD)** - một kiến trúc frontend hiện đại và scalable. Kiến trúc này tối ưu cho việc phát triển từng bước và dễ dàng mở rộng.

## 🏗️ Cấu trúc thư mục hiện tại

```
src/
├── 🚀 app/                          # Lớp Application - Khởi tạo ứng dụng
│   ├── providers/
│   │   └── AppProviders.tsx         # React Providers (Theme, Error Boundary, etc.)
│   └── store/                       # Global state management (future)
│
├── 📄 pages/                        # Lớp Pages - Các trang hoàn chỉnh
│   ├── StudentDashboardPage.tsx     # Trang Dashboard chính
│   └── QuizListPage.tsx             # Trang danh sách Quiz
│
├── 🧩 widgets/                      # Lớp Widgets - Các khối UI lớn
│   ├── index.ts                     # Barrel exports
│   └── Sidebar/                     # Widget điều hướng
│       ├── index.ts                 # Exports
│       ├── model/
│       │   └── useSidebar.ts        # Logic sidebar
│       └── ui/
│           └── Sidebar.tsx          # UI component
│
├── ⚡ features/                     # Lớp Features - Tính năng cụ thể
│   └── (empty - sẽ phát triển)      # Quiz taking, User auth, etc.
│
├── 🎯 entities/                     # Lớp Entities - Business entities
│   ├── index.ts                     # Barrel exports
│   ├── quiz/                        # Quiz business entity
│   │   ├── index.ts
│   │   ├── model/
│   │   │   └── types.ts             # Quiz types & interfaces
│   │   └── ui/
│   │       └── QuizCard.tsx         # Quiz display component
│   └── user/                        # User business entity
│       ├── index.ts
│       ├── model/
│       │   └── types.ts             # User types & interfaces
│       └── ui/
│           └── UserAvatar.tsx       # User display component
│
└── 🔧 shared/                       # Lớp Shared - Code tái sử dụng
    ├── index.ts                     # Barrel exports
    ├── api/                         # API clients (future)
    ├── lib/
    │   └── viewManager.tsx          # View state management
    └── ui/                          # Basic UI components
        ├── Button.tsx               # Reusable button
        ├── Card.tsx                 # Reusable card
        └── index.ts                 # UI barrel exports
```

## 🎯 Nhiệm vụ từng layer

### 1. **`shared/`** - Nền tảng cơ bản ⚡
**Khi nào chỉnh sửa:** Khi cần component UI cơ bản mới
- **`shared/ui/`**: Button, Input, Card, Modal... (UI thuần túy, không biết business logic)
- **`shared/lib/`**: Utils, hooks chung, constants
- **`shared/api/`**: HTTP client, API configurations

### 2. **`entities/`** - Business entities 🎯
**Khi nào chỉnh sửa:** Khi cần thêm/sửa data types hoặc display components
- **`entities/quiz/`**: Quiz data types, QuizCard component
- **`entities/user/`**: User data types, UserAvatar component
- **Quy tắc**: Entities không biết về features, chỉ chứa pure business logic

### 3. **`features/`** - Tính năng cụ thể ⚡
**Khi nào chỉnh sửa:** Khi phát triển tính năng mới
- **`features/take-quiz/`**: Tính năng làm bài quiz
- **`features/auth/`**: Đăng nhập/đăng xuất
- **Quy tắc**: Mỗi feature có thể dùng entities và shared, nhưng không dùng features khác

### 4. **`widgets/`** - Khối UI lớn 🧩
**Khi nào chỉnh sửa:** Khi cần sửa layout hoặc navigation
- **`widgets/Sidebar/`**: Navigation menu
- **`widgets/Header/`**: Top header (future)
- **`widgets/QuizPlayer/`**: Quiz playing widget (future)

### 5. **`pages/`** - Trang hoàn chỉnh 📄
**Khi nào chỉnh sửa:** Khi cần thêm page mới hoặc sửa layout trang
- Kết hợp widgets, features để tạo trang hoàn chỉnh
- Mỗi page tương ứng với một view trong viewManager

### 6. **`app/`** - Khởi tạo ứng dụng 🚀
**Khi nào chỉnh sửa:** Khi cần thêm providers hoặc global config
- **`app/providers/`**: Context providers, theme providers
- **`app/store/`**: Global state management

## 🔄 Quy trình phát triển từ thấp lên cao

### Giai đoạn 1: Nền tảng (`shared/`)
1. Tạo các UI components cơ bản trong `shared/ui/`
2. Tạo utilities và helpers trong `shared/lib/`
3. Setup API client trong `shared/api/`

### Giai đoạn 2: Business entities (`entities/`)
1. Định nghĩa types trong `entities/*/model/`
2. Tạo display components trong `entities/*/ui/`

### Giai đoạn 3: Tính năng (`features/`)
1. Xây dựng từng tính năng độc lập
2. Sử dụng entities và shared components

### Giai đoạn 4: Widgets (`widgets/`)
1. Kết hợp features và entities thành widgets
2. Focus vào reusability

### Giai đoạn 5: Pages (`pages/`)
1. Kết hợp widgets thành pages hoàn chỉnh
2. Handle page-level logic

## 🎨 Hướng dẫn sửa giao diện

### Sửa Navigation/Sidebar
➡️ **File cần sửa:** `src/widgets/Sidebar/ui/Sidebar.tsx`
- Thay đổi styling, thêm animation
- Sửa layout, responsive design

### Sửa Button/Card cơ bản
➡️ **File cần sửa:** `src/shared/ui/Button.tsx`, `src/shared/ui/Card.tsx`
- Thay đổi variants, colors, sizes
- Thêm animation, hover effects

### Thêm component UI mới
➡️ **Tạo file mới:** `src/shared/ui/ComponentName.tsx`
- Thêm export vào `src/shared/ui/index.ts`

### Sửa layout trang
➡️ **File cần sửa:** `src/pages/StudentDashboardPage.tsx`, `src/pages/QuizListPage.tsx`
- Thay đổi cách bố trí widgets
- Sửa spacing, colors, responsiveness

### Thêm trang mới
1. **Tạo:** `src/pages/NewPage.tsx`
2. **Thêm vào:** `src/shared/lib/viewManager.tsx` (type StudentView)
3. **Thêm vào:** `src/widgets/Sidebar/model/useSidebar.ts` (navItems)
4. **Thêm vào:** `src/App.tsx` (renderView switch)

## 🚦 Quy tắc quan trọng

### ✅ Được phép
- `shared` → không import gì khác
- `entities` → chỉ import `shared`
- `features` → import `shared`, `entities`
- `widgets` → import `shared`, `entities`, `features`
- `pages` → import tất cả
- `app` → import tất cả

### ❌ Không được phép
- Import ngược (từ layer cao xuống layer thấp)
- `entities` import `features`
- `shared` import bất kỳ layer nào khác

## 🎯 Roadmap phát triển

### Phase 1: UI Foundation (Hiện tại)
- [x] Cấu trúc FSD cơ bản
- [x] Sidebar navigation
- [x] Basic pages
- [ ] Complete UI components (Button, Input, Modal...)
- [ ] Responsive design

### Phase 2: Quiz Features
- [ ] Quiz taking feature
- [ ] Quiz results display
- [ ] Progress tracking

### Phase 3: Advanced Features
- [ ] User authentication
- [ ] Real-time notifications
- [ ] Advanced analytics

---

**Lưu ý:** Luôn phát triển từ `shared` → `entities` → `features` → `widgets` → `pages`. Không bao giờ làm ngược lại!
