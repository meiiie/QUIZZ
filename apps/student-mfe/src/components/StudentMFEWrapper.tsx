/**
 * Student MFE Wrapper Component
 * 
 * Đảm bảo CSS isolation hoàn toàn khi tích hợp với host application
 * Sử dụng CSS Modules và namespace để tránh conflicts
 */

import { type FC, type ReactNode, useEffect, useRef } from 'react';
import styles from '../styles/student-mfe.module.css';

interface StudentMFEWrapperProps {
  children: ReactNode;
  className?: string;
}

export const StudentMFEWrapper: FC<StudentMFEWrapperProps> = ({ 
  children, 
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Thêm namespace cho tất cả elements bên trong wrapper
    if (containerRef.current) {
      const container = containerRef.current;
      
      // Thêm data attribute để identify Student MFE
      container.setAttribute('data-student-mfe', 'true');
      
      // Thêm class để styling isolation
      container.classList.add('student-mfe-container');
      
      // Prevent style leakage
      const style = document.createElement('style');
      style.textContent = `
        .student-mfe-container * {
          box-sizing: border-box;
        }
        
        .student-mfe-container {
          isolation: isolate;
          contain: layout style;
        }
      `;
      
      if (!document.head.querySelector('[data-student-mfe-styles]')) {
        style.setAttribute('data-student-mfe-styles', 'true');
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`${styles.studentMfeContainer} ${className}`}
      data-student-mfe="true"
    >
      {children}
    </div>
  );
};

export default StudentMFEWrapper;
