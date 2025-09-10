// ========================================================================
// FILE: src/components/ScrollToTopButton.tsx
// PURPOSE: Floating scroll-to-top button optimized for mobile
// DESIGN: Professional button with mobile-first responsive design
// ========================================================================

import { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/use-mobile';

interface ScrollToTopButtonProps {
  showAfter?: number; // Pixels to scroll before showing button
  className?: string;
}

export default function ScrollToTopButton({ 
  showAfter = 300, 
  className = '' 
}: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const toggleVisibility = () => {
      // On mobile, show earlier for better UX
      const threshold = isMobile ? showAfter * 0.7 : showAfter;
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [showAfter, isMobile]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Optional: Show subtle toast feedback (can be removed if too much)
    // toast({
    //   title: "Đã cuộn lên đầu trang",
    //   description: "Quay về đầu trang thành công",
    //   variant: "success",
    // });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed z-50
        ${isMobile 
          ? 'bottom-4 right-4 w-12 h-12' 
          : 'bottom-6 right-6 w-14 h-14'
        }
        bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800
        hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900
        text-white 
        rounded-full 
        shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40
        transition-all duration-300 
        ${isMobile 
          ? 'hover:scale-105 active:scale-95' 
          : 'hover:scale-110 active:scale-95'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        border border-white/20
        backdrop-blur-sm
        group
        ${className}
      `}
      aria-label="Cuộn lên đầu trang"
      title="Cuộn lên đầu trang"
    >
      {/* Ocean wave effect background */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Arrow Up Icon with mobile-optimized sizing */}
      <svg 
        className={`mx-auto transition-transform duration-300 group-hover:-translate-y-1 relative z-10 ${
          isMobile ? 'w-5 h-5' : 'w-6 h-6'
        }`}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        strokeWidth={2.5}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M5 10l7-7m0 0l7 7m-7-7v18" 
        />
      </svg>
      
      {/* Mobile-optimized floating particle effect */}
      <div className={`absolute bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-60 animate-pulse group-hover:opacity-100 transition-opacity duration-300 ${
        isMobile 
          ? '-top-0.5 -right-0.5 w-2 h-2' 
          : '-top-1 -right-1 w-3 h-3'
      }`}></div>
    </button>
  );
}
