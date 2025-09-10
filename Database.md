# DATABASE SCHEMA - QUIZ ONLINE SYSTEM
## PostgreSQL Database Design

Dựa trên phân tích chi tiết các chức năng của dự án Quiz Online System, đây là schema database PostgreSQL hoàn chỉnh để hỗ trợ tất cả các tính năng của hệ thống.

---

## 📋 MỤC LỤC

1. [Bảng Quản lý Người dùng](#1-bảng-quản-lý-người-dùng)
2. [Bảng Hệ thống Quiz](#2-bảng-hệ-thống-quiz)
3. [Bảng Phân tích và Báo cáo](#3-bảng-phân-tích-và-báo-cáo)
4. [Bảng Hệ thống](#4-bảng-hệ-thống)
5. [Indexes và Constraints](#5-indexes-và-constraints)
6. [Triggers và Functions](#6-triggers-và-functions)
7. [Sample Data](#7-sample-data)

---

## 1. BẢNG QUẢN LÝ NGƯỜI DÙNG

### 1.1 Bảng `users` - Thông tin người dùng chính
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 1.2 Bảng `departments` - Khoa/Bộ môn
```sql
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 1.3 Bảng `classes` - Lớp học
```sql
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    academic_year VARCHAR(10) NOT NULL, -- 2024-2025
    semester INTEGER CHECK (semester IN (1, 2, 3)), -- 1: Học kỳ 1, 2: Học kỳ 2, 3: Học kỳ hè
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 1.4 Bảng `students` - Thông tin sinh viên
```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE NOT NULL, -- Mã sinh viên: IT001, ECO002
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    enrollment_year INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'suspended')),
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 1.5 Bảng `teachers` - Thông tin giảng viên
```sql
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    teacher_id VARCHAR(20) UNIQUE NOT NULL, -- Mã giảng viên: GV001
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    title VARCHAR(50), -- Thạc sĩ, Tiến sĩ, PGS, GS
    specialization TEXT, -- Chuyên ngành
    phone VARCHAR(20),
    office_location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 1.6 Bảng `admins` - Thông tin quản trị viên
```sql
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    admin_id VARCHAR(20) UNIQUE NOT NULL, -- Mã admin: AD001
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    permissions JSONB DEFAULT '{}', -- Quyền hạn chi tiết
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 1.7 Bảng `user_preferences` - Tùy chọn người dùng
```sql
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
    language VARCHAR(10) DEFAULT 'vi' CHECK (language IN ('vi', 'en')),
    notifications JSONB DEFAULT '{}', -- Cài đặt thông báo
    quiz_settings JSONB DEFAULT '{}', -- Cài đặt quiz cá nhân
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. BẢNG HỆ THỐNG QUIZ

### 2.1 Bảng `quiz_categories` - Danh mục quiz
```sql
CREATE TABLE quiz_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    icon VARCHAR(50), -- Icon name
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 Bảng `quizzes` - Bài quiz chính
```sql
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    category_id UUID REFERENCES quiz_categories(id) ON DELETE SET NULL,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    total_questions INTEGER NOT NULL DEFAULT 0,
    total_points DECIMAL(10,2) NOT NULL DEFAULT 0,
    difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    is_public BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    password VARCHAR(255), -- Password bảo vệ quiz
    time_limit_type VARCHAR(20) DEFAULT 'per_quiz' CHECK (time_limit_type IN ('per_quiz', 'per_question')),
    randomize_questions BOOLEAN DEFAULT false,
    randomize_answers BOOLEAN DEFAULT false,
    show_correct_answers VARCHAR(20) DEFAULT 'after_due_date' CHECK (show_correct_answers IN ('never', 'always', 'after_due_date', 'after_first_attempt', 'after_last_attempt', 'after_each_attempt')),
    show_correctness_marks VARCHAR(20) DEFAULT 'after_due_date' CHECK (show_correctness_marks IN ('never', 'always', 'after_due_date', 'after_each_attempt')),
    show_points_possible BOOLEAN DEFAULT true,
    show_earned_score BOOLEAN DEFAULT true,
    allow_retake BOOLEAN DEFAULT true,
    max_attempts INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.3 Bảng `questions` - Câu hỏi
```sql
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'fill_blank', 'essay')),
    points DECIMAL(5,2) NOT NULL DEFAULT 1.0,
    order_index INTEGER NOT NULL,
    explanation TEXT, -- Giải thích đáp án
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.4 Bảng `question_options` - Lựa chọn câu trả lời
```sql
CREATE TABLE question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.5 Bảng `assignments` - Bài tập/Phân công quiz
```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    no_dates BOOLEAN DEFAULT false, -- Không giới hạn thời gian
    max_attempts INTEGER DEFAULT 3,
    show_correct_answers VARCHAR(20) DEFAULT 'after_due_date',
    show_correctness_marks VARCHAR(20) DEFAULT 'after_due_date',
    show_points_possible BOOLEAN DEFAULT true,
    show_earned_score BOOLEAN DEFAULT true,
    allow_retake BOOLEAN DEFAULT true,
    randomize_questions BOOLEAN DEFAULT false,
    randomize_answers BOOLEAN DEFAULT false,
    show_time_remaining BOOLEAN DEFAULT true,
    protected_with_password BOOLEAN DEFAULT false,
    password VARCHAR(255),
    assign_to_all BOOLEAN DEFAULT false,
    assign_to_future_students BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.6 Bảng `assignment_students` - Sinh viên được phân công
```sql
CREATE TABLE assignment_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, student_id)
);
```

### 2.7 Bảng `quiz_attempts` - Lần làm bài
```sql
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INTEGER DEFAULT 0,
    score DECIMAL(10,2) DEFAULT 0,
    max_score DECIMAL(10,2) DEFAULT 0,
    percentage DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned', 'timeout')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.8 Bảng `quiz_answers` - Câu trả lời của sinh viên
```sql
CREATE TABLE quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES question_options(id) ON DELETE SET NULL,
    answer_text TEXT, -- Cho câu hỏi tự luận
    is_correct BOOLEAN,
    points_earned DECIMAL(5,2) DEFAULT 0,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. BẢNG PHÂN TÍCH VÀ BÁO CÁO

### 3.1 Bảng `student_progress` - Tiến độ học tập
```sql
CREATE TABLE student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
    total_attempts INTEGER DEFAULT 0,
    best_score DECIMAL(10,2) DEFAULT 0,
    average_score DECIMAL(10,2) DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0, -- seconds
    completion_status VARCHAR(20) DEFAULT 'not_started' CHECK (completion_status IN ('not_started', 'in_progress', 'completed', 'overdue')),
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, quiz_id, assignment_id)
);
```

### 3.2 Bảng `quiz_statistics` - Thống kê quiz
```sql
CREATE TABLE quiz_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    total_attempts INTEGER DEFAULT 0,
    completed_attempts INTEGER DEFAULT 0,
    average_score DECIMAL(10,2) DEFAULT 0,
    highest_score DECIMAL(10,2) DEFAULT 0,
    lowest_score DECIMAL(10,2) DEFAULT 0,
    average_time_spent INTEGER DEFAULT 0, -- seconds
    difficulty_rating DECIMAL(3,2) DEFAULT 0, -- 0.00 to 1.00
    question_analysis JSONB DEFAULT '{}', -- Phân tích từng câu hỏi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 Bảng `system_analytics` - Phân tích hệ thống
```sql
CREATE TABLE system_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    total_users INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    total_quizzes INTEGER DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    average_session_duration INTEGER DEFAULT 0, -- seconds
    peak_concurrent_users INTEGER DEFAULT 0,
    department_stats JSONB DEFAULT '{}', -- Thống kê theo khoa
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3.4 Bảng `user_activities` - Hoạt động người dùng
```sql
CREATE TABLE user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- login, quiz_start, quiz_complete, etc.
    description TEXT,
    metadata JSONB DEFAULT '{}', -- Dữ liệu bổ sung
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. BẢNG HỆ THỐNG

### 4.1 Bảng `system_settings` - Cài đặt hệ thống
```sql
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT false, -- Có hiển thị cho user không
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 Bảng `notifications` - Thông báo
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- info, warning, success, error
    is_read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE
);
```

### 4.3 Bảng `audit_logs` - Nhật ký kiểm toán
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- create, update, delete, login, etc.
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 4.4 Bảng `file_uploads` - Quản lý file upload
```sql
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- avatar, quiz_import, etc.
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. INDEXES VÀ CONSTRAINTS

### 5.1 Indexes cho Performance
```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Students table indexes
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_department ON students(department_id);
CREATE INDEX idx_students_class ON students(class_id);

-- Teachers table indexes
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_teachers_department ON teachers(department_id);

-- Quizzes table indexes
CREATE INDEX idx_quizzes_teacher ON quizzes(teacher_id);
CREATE INDEX idx_quizzes_department ON quizzes(department_id);
CREATE INDEX idx_quizzes_category ON quizzes(category_id);
CREATE INDEX idx_quizzes_active ON quizzes(is_active);

-- Questions table indexes
CREATE INDEX idx_questions_quiz ON questions(quiz_id);
CREATE INDEX idx_questions_order ON questions(quiz_id, order_index);

-- Quiz attempts indexes
CREATE INDEX idx_attempts_student ON quiz_attempts(student_id);
CREATE INDEX idx_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_attempts_assignment ON quiz_attempts(assignment_id);
CREATE INDEX idx_attempts_status ON quiz_attempts(status);

-- Quiz answers indexes
CREATE INDEX idx_answers_attempt ON quiz_answers(attempt_id);
CREATE INDEX idx_answers_question ON quiz_answers(question_id);

-- User activities indexes
CREATE INDEX idx_activities_user ON user_activities(user_id);
CREATE INDEX idx_activities_type ON user_activities(activity_type);
CREATE INDEX idx_activities_created ON user_activities(created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

### 5.2 Constraints và Triggers
```sql
-- Function để update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers cho updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quiz_attempts_updated_at BEFORE UPDATE ON quiz_attempts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function để tính toán điểm số
CREATE OR REPLACE FUNCTION calculate_quiz_score(attempt_id UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    total_score DECIMAL(10,2) := 0;
BEGIN
    SELECT COALESCE(SUM(points_earned), 0) INTO total_score
    FROM quiz_answers
    WHERE attempt_id = calculate_quiz_score.attempt_id;
    
    RETURN total_score;
END;
$$ LANGUAGE plpgsql;

-- Function để cập nhật thống kê quiz
CREATE OR REPLACE FUNCTION update_quiz_statistics(quiz_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO quiz_statistics (quiz_id, total_attempts, completed_attempts, average_score, highest_score, lowest_score)
    SELECT 
        quiz_id,
        COUNT(*) as total_attempts,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_attempts,
        COALESCE(AVG(CASE WHEN status = 'completed' THEN score END), 0) as average_score,
        COALESCE(MAX(CASE WHEN status = 'completed' THEN score END), 0) as highest_score,
        COALESCE(MIN(CASE WHEN status = 'completed' THEN score END), 0) as lowest_score
    FROM quiz_attempts
    WHERE quiz_attempts.quiz_id = update_quiz_statistics.quiz_id
    ON CONFLICT (quiz_id) DO UPDATE SET
        total_attempts = EXCLUDED.total_attempts,
        completed_attempts = EXCLUDED.completed_attempts,
        average_score = EXCLUDED.average_score,
        highest_score = EXCLUDED.highest_score,
        lowest_score = EXCLUDED.lowest_score,
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. SAMPLE DATA

### 6.1 Dữ liệu mẫu cho Departments
```sql
INSERT INTO departments (name, code, description) VALUES
('Công nghệ Thông tin', 'CNTT', 'Khoa Công nghệ Thông tin'),
('Kinh tế', 'KT', 'Khoa Kinh tế'),
('Hàng hải', 'HH', 'Khoa Hàng hải'),
('Cơ khí', 'CK', 'Khoa Cơ khí'),
('Điện - Điện tử', 'DDT', 'Khoa Điện - Điện tử');
```

### 6.2 Dữ liệu mẫu cho Classes
```sql
INSERT INTO classes (name, code, department_id, academic_year, semester) VALUES
('Lớp CNTT K66', 'CNTT66', (SELECT id FROM departments WHERE code = 'CNTT'), '2024-2025', 1),
('Lớp KT K66', 'KT66', (SELECT id FROM departments WHERE code = 'KT'), '2024-2025', 1),
('Lớp HH K66', 'HH66', (SELECT id FROM departments WHERE code = 'HH'), '2024-2025', 1);
```

### 6.3 Dữ liệu mẫu cho Quiz Categories
```sql
INSERT INTO quiz_categories (name, description, color, icon) VALUES
('Lập trình', 'Các bài quiz về lập trình', '#3B82F6', 'code'),
('Toán học', 'Các bài quiz về toán học', '#10B981', 'calculator'),
('Tiếng Anh', 'Các bài quiz về tiếng Anh', '#F59E0B', 'book-open'),
('Chuyên ngành', 'Các bài quiz chuyên ngành', '#8B5CF6', 'academic-cap'),
('Kiểm tra giữa kỳ', 'Các bài kiểm tra giữa kỳ', '#EF4444', 'clipboard-check');
```

### 6.4 Dữ liệu mẫu cho System Settings
```sql
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'Quiz Online System - ĐHHH', 'string', 'Tên hệ thống', true),
('max_quiz_duration', '180', 'number', 'Thời gian tối đa cho một quiz (phút)', false),
('allow_quiz_retake', 'true', 'boolean', 'Cho phép làm lại quiz', true),
('default_quiz_attempts', '3', 'number', 'Số lần làm bài mặc định', false),
('email_notifications', 'true', 'boolean', 'Bật thông báo email', true),
('maintenance_mode', 'false', 'boolean', 'Chế độ bảo trì', false);
```

---

## 7. VIEWS CHO BÁO CÁO

### 7.1 View tổng quan sinh viên
```sql
CREATE VIEW student_overview AS
SELECT 
    s.id,
    s.student_id,
    u.name,
    u.email,
    d.name as department_name,
    c.name as class_name,
    s.enrollment_year,
    s.status,
    COUNT(qa.id) as total_quiz_attempts,
    COALESCE(AVG(qa.score), 0) as average_score,
    COALESCE(MAX(qa.score), 0) as best_score
FROM students s
JOIN users u ON s.user_id = u.id
JOIN departments d ON s.department_id = d.id
LEFT JOIN classes c ON s.class_id = c.id
LEFT JOIN quiz_attempts qa ON s.id = qa.student_id
GROUP BY s.id, s.student_id, u.name, u.email, d.name, c.name, s.enrollment_year, s.status;
```

### 7.2 View thống kê quiz
```sql
CREATE VIEW quiz_statistics_view AS
SELECT 
    q.id,
    q.title,
    q.duration_minutes,
    q.total_questions,
    q.difficulty,
    qc.name as category_name,
    u.name as teacher_name,
    d.name as department_name,
    COUNT(qa.id) as total_attempts,
    COUNT(CASE WHEN qa.status = 'completed' THEN 1 END) as completed_attempts,
    COALESCE(AVG(CASE WHEN qa.status = 'completed' THEN qa.score END), 0) as average_score,
    COALESCE(MAX(CASE WHEN qa.status = 'completed' THEN qa.score END), 0) as highest_score,
    COALESCE(MIN(CASE WHEN qa.status = 'completed' THEN qa.score END), 0) as lowest_score
FROM quizzes q
LEFT JOIN quiz_categories qc ON q.category_id = qc.id
LEFT JOIN teachers t ON q.teacher_id = t.id
LEFT JOIN users u ON t.user_id = u.id
LEFT JOIN departments d ON q.department_id = d.id
LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
GROUP BY q.id, q.title, q.duration_minutes, q.total_questions, q.difficulty, qc.name, u.name, d.name;
```

### 7.3 View tiến độ học tập
```sql
CREATE VIEW student_progress_view AS
SELECT 
    s.id as student_id,
    s.student_id,
    u.name as student_name,
    d.name as department_name,
    q.id as quiz_id,
    q.title as quiz_title,
    qc.name as category_name,
    sp.total_attempts,
    sp.best_score,
    sp.average_score,
    sp.completion_status,
    sp.last_attempt_at
FROM students s
JOIN users u ON s.user_id = u.id
JOIN departments d ON s.department_id = d.id
JOIN student_progress sp ON s.id = sp.student_id
JOIN quizzes q ON sp.quiz_id = q.id
LEFT JOIN quiz_categories qc ON q.category_id = qc.id;
```

---

## 8. API ENDPOINTS MAPPING

### 8.1 Authentication Endpoints
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/refresh` - Làm mới token
- `GET /api/auth/me` - Thông tin user hiện tại

### 8.2 User Management Endpoints
- `GET /api/users` - Danh sách users
- `POST /api/users` - Tạo user mới
- `PUT /api/users/:id` - Cập nhật user
- `DELETE /api/users/:id` - Xóa user
- `POST /api/users/bulk-import` - Import users từ Excel

### 8.3 Quiz Management Endpoints
- `GET /api/quizzes` - Danh sách quizzes
- `POST /api/quizzes` - Tạo quiz mới
- `PUT /api/quizzes/:id` - Cập nhật quiz
- `DELETE /api/quizzes/:id` - Xóa quiz
- `GET /api/quizzes/:id/questions` - Lấy câu hỏi của quiz
- `POST /api/quizzes/:id/questions` - Thêm câu hỏi

### 8.4 Quiz Taking Endpoints
- `POST /api/quiz-attempts` - Bắt đầu làm quiz
- `PUT /api/quiz-attempts/:id` - Cập nhật attempt
- `POST /api/quiz-attempts/:id/submit` - Nộp bài
- `GET /api/quiz-attempts/:id/result` - Xem kết quả

### 8.5 Analytics Endpoints
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/student-progress` - Tiến độ sinh viên
- `GET /api/analytics/quiz-performance` - Hiệu suất quiz
- `GET /api/analytics/department-stats` - Thống kê theo khoa

---

## 9. MIGRATION SCRIPTS

### 9.1 Tạo tất cả bảng
```sql
-- Chạy script này để tạo toàn bộ database schema
-- Thứ tự tạo bảng quan trọng vì có foreign key constraints

-- 1. Tạo bảng cơ bản (không có foreign key)
-- 2. Tạo bảng có foreign key đến bảng cơ bản
-- 3. Tạo indexes
-- 4. Tạo triggers
-- 5. Insert sample data
```

### 9.2 Backup và Restore
```sql
-- Backup database
pg_dump -h localhost -U username -d quiz_online > quiz_online_backup.sql

-- Restore database
psql -h localhost -U username -d quiz_online < quiz_online_backup.sql
```

---

## 10. PERFORMANCE OPTIMIZATION

### 10.1 Partitioning cho bảng lớn
```sql
-- Partition quiz_attempts theo tháng
CREATE TABLE quiz_attempts_2024_01 PARTITION OF quiz_attempts
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Partition user_activities theo tháng
CREATE TABLE user_activities_2024_01 PARTITION OF user_activities
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### 10.2 Materialized Views cho báo cáo
```sql
-- Materialized view cho dashboard
CREATE MATERIALIZED VIEW dashboard_stats AS
SELECT 
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT s.id) as total_students,
    COUNT(DISTINCT t.id) as total_teachers,
    COUNT(DISTINCT q.id) as total_quizzes,
    COUNT(DISTINCT qa.id) as total_attempts,
    COALESCE(AVG(qa.score), 0) as average_score
FROM users u
LEFT JOIN students s ON u.id = s.user_id
LEFT JOIN teachers t ON u.id = t.user_id
LEFT JOIN quizzes q ON q.is_active = true
LEFT JOIN quiz_attempts qa ON qa.status = 'completed';

-- Refresh materialized view
REFRESH MATERIALIZED VIEW dashboard_stats;
```

---

## 🎯 KẾT LUẬN

Database schema này được thiết kế để hỗ trợ đầy đủ tất cả các chức năng của hệ thống Quiz Online:

### ✅ **Tính năng được hỗ trợ:**
- **Quản lý người dùng** đầy đủ (Student, Teacher, Admin)
- **Hệ thống quiz** hoàn chỉnh với câu hỏi và đáp án
- **Phân công bài tập** và theo dõi tiến độ
- **Phân tích và báo cáo** chi tiết
- **Audit logs** và security
- **File upload** và notifications
- **Performance optimization** với indexes và partitioning

### 🚀 **Ưu điểm:**
- **Scalable** - Có thể mở rộng cho hàng nghìn users
- **Flexible** - Hỗ trợ nhiều loại câu hỏi và cấu hình
- **Secure** - Audit logs và role-based access
- **Performant** - Indexes và materialized views
- **Maintainable** - Cấu trúc rõ ràng và documentation đầy đủ

Database này sẵn sàng để tích hợp với backend API và frontend applications của bạn!

---

*Schema này được tạo dựa trên phân tích chi tiết các chức năng của dự án Quiz Online System - Đại học Hàng hải Việt Nam*
