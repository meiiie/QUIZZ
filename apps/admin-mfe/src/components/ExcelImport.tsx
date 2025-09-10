import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { FileUploadIcon, DownloadIcon, XIcon, CheckIcon } from './icons';
import { colors, semanticColors } from '../styles/colors';
import { spacing, borderRadius, shadows } from '../styles/spacing';

interface ExcelImportProps {
  onImport: (data: any[]) => Promise<void>;
  onDownloadTemplate: () => void;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

interface ImportResult {
  success: boolean;
  message: string;
  data?: any[];
  errors?: string[];
}

const ExcelImport: React.FC<ExcelImportProps> = ({
  onImport,
  onDownloadTemplate,
  isOpen,
  onClose,
  title = "Import dữ liệu từ Excel"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const excelFile = files.find(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    );

    if (excelFile) {
      processFile(excelFile);
    } else {
      setResult({
        success: false,
        message: 'Vui lòng chọn file Excel (.xlsx hoặc .xls)',
        errors: ['Định dạng file không được hỗ trợ']
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setResult(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];

      if (!sheet) {
        throw new Error('Không tìm thấy sheet hợp lệ trong file.');
      }

      const headerRows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: '' }) as any[];
      const headerRow = (headerRows && headerRows[0]) ? headerRows[0] : [];
      const headers = (headerRow as any[]).map((h) => String(h).toLowerCase().trim());

      const requiredHeaders = selectedRole === 'student' 
        ? ['name', 'email', 'studentid']
        : ['name', 'email'];

      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        setResult({
          success: false,
          message: 'File không đúng định dạng cột bắt buộc.',
          errors: [
            `Thiếu cột: ${missingHeaders.join(', ')}`,
            selectedRole === 'student' 
              ? 'Đối với vai trò Học sinh, cần có các cột: name, email, studentid.'
              : 'Đối với vai trò Admin/Giáo viên, cần có các cột: name, email.'
          ]
        });
        return;
      }

      const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' });

      if (rawRows.length === 0) {
        setResult({
          success: false,
          message: 'File không có dữ liệu.',
          errors: ['Vui lòng kiểm tra lại nội dung file Excel.']
        });
        return;
      }

      const rowErrors: string[] = [];
      const normalizedData = rawRows.map((row, idx) => {
        const rowIndex = idx + 2; // +2 because header is row 1
        const normalized = Object.fromEntries(
          Object.entries(row).map(([k, v]) => [String(k).toLowerCase().trim(), v])
        ) as Record<string, any>;

        const name = String(normalized['name'] ?? '').trim();
        const email = String(normalized['email'] ?? '').trim();
        const studentId = String(normalized['studentid'] ?? '').trim();

        if (!name) {
          rowErrors.push(`Dòng ${rowIndex}: thiếu "name".`);
        }
        if (!email) {
          rowErrors.push(`Dòng ${rowIndex}: thiếu "email".`);
        }
        if (selectedRole === 'student' && !studentId) {
          rowErrors.push(`Dòng ${rowIndex}: thiếu "studentid" cho vai trò Học sinh.`);
        }

        return {
          name,
          email,
          role: selectedRole,
          status: 'active',
          ...(selectedRole === 'student' ? { studentid: studentId } : {})
        } as any;
      });

      if (rowErrors.length > 0) {
        setResult({
          success: false,
          message: 'Phát hiện lỗi trong dữ liệu Excel.',
          errors: rowErrors
        });
        return;
      }

      await onImport(normalizedData);
      
      setResult({
        success: true,
        message: `Import thành công ${normalizedData.length} người dùng`,
        data: normalizedData
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: 'Import thất bại',
        errors: [error.message || 'Có lỗi xảy ra khi xử lý file']
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
          <button style={styles.closeButton} onClick={handleClose}>
            <XIcon size={20} color={semanticColors.text.secondary} />
          </button>
        </div>

        <div style={styles.content}>
          {!result ? (
            <div
              style={{
                ...styles.dropZone,
                ...(isDragging ? styles.dropZoneActive : {}),
                ...(isProcessing ? styles.dropZoneProcessing : {})
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isProcessing ? (
                <div style={styles.processing}>
                  <div style={styles.spinner}></div>
                  <p>Đang xử lý file...</p>
                </div>
              ) : (
                <div style={styles.dropZoneContent}>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                    <label style={{ color: semanticColors.text.secondary, fontSize: '0.875rem' }}>Chọn vai trò cho dữ liệu import</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as any)}
                      style={{
                        padding: spacing[3],
                        borderRadius: borderRadius.md,
                        border: `1px solid ${semanticColors.border.primary}`,
                        background: semanticColors.surface.primary,
                        color: semanticColors.text.primary
                      }}
                    >
                      <option value="student">Học sinh</option>
                      <option value="teacher">Giáo viên</option>
                      <option value="admin">Admin</option>
                    </select>
                    <p style={{ margin: 0, color: semanticColors.text.tertiary, fontSize: '0.8125rem' }}>
                      {selectedRole === 'student'
                        ? 'Yêu cầu cột: name, email, studentid'
                        : 'Yêu cầu cột: name, email'}
                    </p>
                  </div>
                  <FileUploadIcon size={48} color={colors.primary[500]} />
                  <h3 style={styles.dropZoneTitle}>
                    Kéo thả file Excel vào đây
                  </h3>
                  <p style={styles.dropZoneText}>
                    hoặc <button 
                      style={styles.fileButton}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      chọn file
                    </button>
                  </p>
                  <p style={styles.dropZoneSubtext}>
                    Hỗ trợ định dạng .xlsx, .xls
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.result}>
              <div style={{
                ...styles.resultIcon,
                backgroundColor: result.success ? colors.success[50] : colors.error[50]
              }}>
                {result.success ? (
                  <CheckIcon size={24} color={colors.success[500]} />
                ) : (
                  <XIcon size={24} color={colors.error[500]} />
                )}
              </div>
              <h3 style={styles.resultTitle}>
                {result.success ? 'Import thành công!' : 'Import thất bại!'}
              </h3>
              <p style={styles.resultMessage}>{result.message}</p>
              
              {result.errors && result.errors.length > 0 && (
                <div style={styles.errorList}>
                  <h4>Chi tiết lỗi:</h4>
                  <ul>
                    {result.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div style={styles.actions}>
            <button
              style={styles.templateButton}
              onClick={onDownloadTemplate}
            >
              <DownloadIcon size={16} color={colors.primary[500]} />
              Tải template
            </button>
            
            {result && (
              <button
                style={styles.closeResultButton}
                onClick={handleClose}
              >
                Đóng
              </button>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  
  modal: {
    backgroundColor: semanticColors.surface.primary,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.xl,
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'hidden',
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[6],
    borderBottom: `1px solid ${semanticColors.border.primary}`,
  },
  
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: semanticColors.text.primary,
    margin: 0,
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: spacing[2],
    borderRadius: borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  content: {
    padding: spacing[6],
  },
  
  dropZone: {
    border: `2px dashed ${semanticColors.border.secondary}`,
    borderRadius: borderRadius.lg,
    padding: spacing[8],
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: semanticColors.background.secondary,
  },
  
  dropZoneActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  
  dropZoneProcessing: {
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  
  dropZoneContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: spacing[4],
  },
  
  dropZoneTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: semanticColors.text.primary,
    margin: 0,
  },
  
  dropZoneText: {
    color: semanticColors.text.secondary,
    margin: 0,
  },
  
  dropZoneSubtext: {
    fontSize: '0.875rem',
    color: semanticColors.text.tertiary,
    margin: 0,
  },
  
  fileButton: {
    background: 'none',
    border: 'none',
    color: colors.primary[500],
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: 'inherit',
  },
  
  processing: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: spacing[4],
  },
  
  spinner: {
    width: '2rem',
    height: '2rem',
    border: `3px solid ${semanticColors.border.primary}`,
    borderTop: `3px solid ${colors.primary[500]}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  result: {
    textAlign: 'center' as const,
    padding: spacing[4],
  },
  
  resultIcon: {
    width: '4rem',
    height: '4rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    marginBottom: spacing[4],
  },
  
  resultTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: semanticColors.text.primary,
    margin: 0,
    marginBottom: spacing[2],
  },
  
  resultMessage: {
    color: semanticColors.text.secondary,
    margin: 0,
    marginBottom: spacing[4],
  },
  
  errorList: {
    textAlign: 'left' as const,
    backgroundColor: colors.error[50],
    padding: spacing[4],
    borderRadius: borderRadius.md,
    marginTop: spacing[4],
  },
  
  actions: {
    display: 'flex',
    gap: spacing[3],
    justifyContent: 'center',
    marginTop: spacing[6],
  },
  
  templateButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    background: semanticColors.surface.primary,
    border: `1px solid ${colors.primary[300]}`,
    color: colors.primary[600],
    padding: `${spacing[3]} ${spacing[4]}`,
    borderRadius: borderRadius.lg,
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  
  closeResultButton: {
    background: colors.primary[500],
    color: semanticColors.text.inverse,
    border: 'none',
    padding: `${spacing[3]} ${spacing[6]}`,
    borderRadius: borderRadius.lg,
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
} as const;

export default ExcelImport;
