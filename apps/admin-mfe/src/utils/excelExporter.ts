// src/utils/excelExporter.ts

export interface UserAccount {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface ExcelExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  includePasswords?: boolean;
  includeTimestamps?: boolean;
}

export function exportUsersToExcel(
  users: UserAccount[],
  options: ExcelExportOptions = {}
): void {
  const {
    filename = 'danh_sach_tai_khoan',
    includeHeaders = true,
    includePasswords = true,
    includeTimestamps = true,
  } = options;

  // Tạo nội dung CSV
  let csvContent = '';
  
  // BOM để hỗ trợ UTF-8
  csvContent += '\uFEFF';
  
  // Headers
  if (includeHeaders) {
    const headers = [
      'STT',
      'Họ và tên',
      'Email',
      ...(includePasswords ? ['Mật khẩu'] : []),
      'Vai trò',
      'Trạng thái',
      'Ngày tạo',
      ...(includeTimestamps ? ['Lần đăng nhập cuối'] : []),
    ];
    csvContent += headers.join(',') + '\n';
  }

  // Data rows
  users.forEach((user, index) => {
    const row = [
      (index + 1).toString(),
      `"${user.name}"`,
      `"${user.email}"`,
      ...(includePasswords ? [`"${user.password}"`] : []),
      `"${getRoleText(user.role)}"`,
      `"${getStatusText(user.status)}"`,
      `"${formatDate(user.createdAt)}"`,
      ...(includeTimestamps ? [`"${user.lastLogin ? formatDate(user.lastLogin) : 'Chưa đăng nhập'}"`] : []),
    ];
    csvContent += row.join(',') + '\n';
  });

  // Tạo và tải file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${formatDateForFilename(new Date())}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportPasswordTemplate(): void {
  const templateContent = '\uFEFF' + // BOM for UTF-8
    'Họ và tên,Email,Vai trò,Trạng thái\n' +
    'Nguyễn Văn A,nguyenvana@vimaru.edu.vn,student,active\n' +
    'Trần Thị B,tranthib@vimaru.edu.vn,teacher,active\n' +
    'Lê Văn C,levanc@vimaru.edu.vn,admin,active\n';

  const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'mau_import_tai_khoan.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportPasswordList(users: UserAccount[]): void {
  const passwordContent = '\uFEFF' + // BOM for UTF-8
    'STT,Họ và tên,Email,Mật khẩu,Vai trò\n' +
    users.map((user, index) => 
      `${index + 1},"${user.name}","${user.email}","${user.password}","${getRoleText(user.role)}"`
    ).join('\n');

  const blob = new Blob([passwordContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `danh_sach_mat_khau_${formatDateForFilename(new Date())}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function exportCredentialsCsv(users: Array<{ name: string; email: string; password: string; role: 'admin' | 'teacher' | 'student'; studentid?: string }>, filename: string = 'tai_khoan_moi_tao'): void {
  const hasStudentId = users.some(u => !!u.studentid);
  const headers = ['STT', 'Họ và tên', 'Email', 'Mật khẩu', 'Vai trò', ...(hasStudentId ? ['StudentID'] : [])];
  const content = users.map((u, idx) => [
    (idx + 1).toString(),
    `"${u.name}"`,
    `"${u.email}"`,
    `"${u.password}"`,
    `"${getRoleText(u.role)}"`,
    ...(hasStudentId ? [`"${u.studentid ?? ''}"`] : [])
  ].join(',')).join('\n');

  const csv = '\uFEFF' + headers.join(',') + '\n' + content + (content ? '\n' : '');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${formatDateForFilename(new Date())}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function getRoleText(role: string): string {
  switch (role) {
    case 'admin': return 'Quản trị viên';
    case 'teacher': return 'Giảng viên';
    case 'student': return 'Sinh viên';
    default: return role;
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'active': return 'Hoạt động';
    case 'inactive': return 'Không hoạt động';
    default: return status;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateForFilename(date: Date): string {
  return date.toISOString().split('T')[0].replace(/-/g, '');
}

export function validateExcelData(data: any[]): {
  isValid: boolean;
  errors: string[];
  validData: any[];
} {
  const errors: string[] = [];
  const validData: any[] = [];

  data.forEach((row, index) => {
    const rowErrors: string[] = [];
    const rowNumber = index + 1;

    // Kiểm tra tên
    if (!row.name || typeof row.name !== 'string' || row.name.trim().length === 0) {
      rowErrors.push(`Dòng ${rowNumber}: Tên không được để trống`);
    }

    // Kiểm tra email
    if (!row.email || typeof row.email !== 'string' || row.email.trim().length === 0) {
      rowErrors.push(`Dòng ${rowNumber}: Email không được để trống`);
    } else if (!isValidEmail(row.email)) {
      rowErrors.push(`Dòng ${rowNumber}: Email không hợp lệ`);
    }

    // Kiểm tra vai trò
    if (!row.role || !['admin', 'teacher', 'student'].includes(row.role)) {
      rowErrors.push(`Dòng ${rowNumber}: Vai trò phải là admin, teacher hoặc student`);
    }

    // Kiểm tra trạng thái
    if (!row.status || !['active', 'inactive'].includes(row.status)) {
      rowErrors.push(`Dòng ${rowNumber}: Trạng thái phải là active hoặc inactive`);
    }

    if (rowErrors.length === 0) {
      validData.push({
        name: row.name.trim(),
        email: row.email.trim().toLowerCase(),
        role: row.role,
        status: row.status,
      });
    } else {
      errors.push(...rowErrors);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    validData,
  };
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
