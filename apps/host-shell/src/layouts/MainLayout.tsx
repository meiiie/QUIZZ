import type React from "react"
// ========================================================================
// FILE: src/layouts/MainLayout.tsx
// PURPOSE: Main layout with mobile-optimized spacing
// DESIGN: Professional layout with responsive design using mobile hook
// ========================================================================
import { Outlet, useLocation } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ScrollToTopButton from "../components/ScrollToTopButton"
import { Toaster } from "../components/ui/toaster"
import { useIsMobile } from "../hooks/use-mobile"

interface MainLayoutProps {
  children?: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation()
  const isMobile = useIsMobile()

  // Homepage doesn't need top padding because it has full-height hero section
  const isHomePage = location.pathname === "/"

  // Student routes don't need top padding or header/footer because sidebar handles layout/navigation
  const isStudentRoute = location.pathname.startsWith("/student")
  // Admin routes also don't need header/footer because they have their own layout
  const isAdminRoute = location.pathname.startsWith("/admin")
  // Teacher routes also don't need header/footer because they have their own layout
  const isTeacherRoute = location.pathname.startsWith("/teacher")
  const topPadding = !isHomePage && !isStudentRoute && !isAdminRoute && !isTeacherRoute ? (isMobile ? "pt-20" : "pt-28") : ""

  return (
    <div className="flex flex-col min-h-screen">
      {!isStudentRoute && !isAdminRoute && !isTeacherRoute && <Header />}

      {/* Main content with mobile-optimized padding */}
      <main className={`flex-grow ${topPadding} ${isStudentRoute || isAdminRoute || isTeacherRoute ? "h-screen" : ""}`}>{children || <Outlet />}</main>

      {!isStudentRoute && !isAdminRoute && !isTeacherRoute && <Footer />}

      {/* Mobile-optimized scroll to top button */}
      <ScrollToTopButton showAfter={isMobile ? 200 : 300} />

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}


