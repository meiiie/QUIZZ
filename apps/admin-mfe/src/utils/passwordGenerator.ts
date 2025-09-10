// src/utils/passwordGenerator.ts

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean; // Exclude 0, O, l, 1, I
}

export const defaultPasswordOptions: PasswordOptions = {
  length: 8,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: false,
  excludeSimilar: true,
};

const UPPERCASE = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijkmnpqrstuvwxyz';
const NUMBERS = '23456789';
const SYMBOLS = '!@#$%^&*';


export function generatePassword(options: PasswordOptions = defaultPasswordOptions): string {
  const {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeSimilar,
  } = options;

  let charset = '';
  
  if (includeUppercase) {
    charset += excludeSimilar ? UPPERCASE : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  
  if (includeLowercase) {
    charset += excludeSimilar ? LOWERCASE : 'abcdefghijklmnopqrstuvwxyz';
  }
  
  if (includeNumbers) {
    charset += excludeSimilar ? NUMBERS : '0123456789';
  }
  
  if (includeSymbols) {
    charset += SYMBOLS;
  }

  if (charset.length === 0) {
    throw new Error('Ít nhất một loại ký tự phải được chọn');
  }

  let password = '';
  
  // Đảm bảo ít nhất một ký tự từ mỗi loại được chọn
  if (includeUppercase) {
    const upperChars = excludeSimilar ? UPPERCASE : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    password += upperChars[Math.floor(Math.random() * upperChars.length)];
  }
  
  if (includeLowercase) {
    const lowerChars = excludeSimilar ? LOWERCASE : 'abcdefghijklmnopqrstuvwxyz';
    password += lowerChars[Math.floor(Math.random() * lowerChars.length)];
  }
  
  if (includeNumbers) {
    const numberChars = excludeSimilar ? NUMBERS : '0123456789';
    password += numberChars[Math.floor(Math.random() * numberChars.length)];
  }
  
  if (includeSymbols) {
    password += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  }

  // Tạo phần còn lại của mật khẩu
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Xáo trộn mật khẩu
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

export function generateMultiplePasswords(count: number, options: PasswordOptions = defaultPasswordOptions): string[] {
  const passwords: string[] = [];
  
  for (let i = 0; i < count; i++) {
    passwords.push(generatePassword(options));
  }
  
  return passwords;
}

export function validatePasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Mật khẩu nên có ít nhất 8 ký tự');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Mật khẩu nên có chữ thường');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Mật khẩu nên có chữ hoa');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Mật khẩu nên có số');
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Mật khẩu nên có ký tự đặc biệt');
  }

  if (password.length >= 12) {
    score += 1;
  }

  return { score, feedback };
}

export function getPasswordStrengthText(score: number): string {
  if (score <= 2) return 'Yếu';
  if (score <= 4) return 'Trung bình';
  if (score <= 5) return 'Mạnh';
  return 'Rất mạnh';
}

export function getPasswordStrengthColor(score: number): string {
  if (score <= 2) return 'var(--vmu-error)';
  if (score <= 4) return 'var(--vmu-warning)';
  if (score <= 5) return 'var(--vmu-success)';
  return 'var(--vmu-primary)';
}
