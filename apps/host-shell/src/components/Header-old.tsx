"use client"

import type React from "react"

// ========================================================================
// FILE: src/components/Header.tsx
// PURPOSE: Header tối ưu cho sinh viên - navigation đơn giản và rõ ràng
// DESIGN: Clean, professional, focused on core functions
// ========================================================================

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

const NAVIGATION_ITEMS = [
  { label: "Trang Chủ", href: "/" },
  { label: "Hỗ Trợ", href: "/help" },
] as const

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const isActivePage = (href: string) => {
    return location.pathname === href
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()

    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }

    if (location.pathname !== "/") {
      navigate("/")
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "border-b border-blue-200/30 bg-white/95 shadow-xl shadow-blue-500/10 backdrop-blur-md"
          : "bg-white/0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="relative flex items-center justify-between">
          <Link to="/" className="flex items-center group" aria-label="ĐHHH Việt Nam" onClick={handleLogoClick}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mr-3 shadow-lg group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold transition-colors ${isScrolled ? "text-gray-900" : "text-white"}`}>
                ĐHHH Quiz
              </span>
              <span
                className={`text-xs font-medium transition-colors ${isScrolled ? "text-blue-600" : "text-blue-200"}`}
              >
                Hệ thống trắc nghiệm
              </span>
            </div>
          </Link>

          <nav className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <div className="flex items-center gap-6">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                    isActivePage(item.href)
                      ? isScrolled
                        ? "text-blue-700"
                        : "text-white"
                      : isScrolled
                        ? "text-gray-700 hover:text-blue-600"
                        : "text-blue-100 hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActivePage(item.href) && (
                    <div
                      className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                        isScrolled ? "bg-blue-600" : "bg-white"
                      }`}
                    />
                  )}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className={`px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                isScrolled
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40"
                  : "bg-white/20 text-white border border-white/30 backdrop-blur-sm hover:bg-white/30"
              }`}
            >
              Đăng Nhập
            </Link>

            <button
              onClick={toggleMobileMenu}
              className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
                isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/20"
              }`}
              aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden mt-6 p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-blue-100/50 shadow-xl">
            <nav className="space-y-3">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center justify-between px-4 py-3 text-base font-semibold rounded-xl transition-all duration-300 ${
                    isActivePage(item.href)
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  <span>{item.label}</span>
                  <svg
                    className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full px-4 py-3 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Đăng Nhập
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
