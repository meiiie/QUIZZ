"use client"

import type React from "react"

// ========================================================================
// FILE: src/components/Footer.tsx
// PURPOSE: Footer đơn giản và chuyên nghiệp cho hệ thống trắc nghiệm
// DESIGN: Clean, focused on essential links and information
// ========================================================================

import { Link, useNavigate, useLocation } from "react-router-dom"

const CURRENT_YEAR = new Date().getFullYear()

interface FooterItem {
  label: string
  href: string
  external?: boolean
}

interface FooterSection {
  title: string
  items: FooterItem[]
}

const footerSections: Record<string, FooterSection> = {
  support: {
    title: "Hỗ Trợ",
    items: [
      { label: "Trợ Giúp", href: "/help" },
    ],
  },
  university: {
    title: "Trường Đại Học",
    items: [
      { label: "Trang Chủ ĐHHH", href: "https://vimaru.edu.vn", external: true },
      { label: "Thông Tin Tuyển Sinh", href: "https://vimaru.edu.vn/tuyen-sinh", external: true },
      { label: "Tin Tức Trường", href: "https://vimaru.edu.vn/tin-tuc", external: true },
    ],
  },
  contact: {
    title: "Liên Hệ",
    items: [
      { label: "📧 cntt@vimaru.edu.vn", href: "mailto:cntt@vimaru.edu.vn" },
      { label: "📞 (0225) 3827 123", href: "tel:+842253827123" },
      { label: "📍 484 Lạch Tray, Hải Phòng", href: "https://maps.google.com/?q=484+Lạch+Tray,+Hải+Phòng", external: true },
    ],
  },
}

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()

    if (location.pathname !== "/") {
      navigate("/")
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="flex items-center font-bold text-gray-800 select-none group mb-4"
              aria-label="ĐHHH Việt Nam - Trang chủ"
              onClick={handleLogoClick}
            >
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
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">ĐHHH Quiz</span>
                <span className="text-sm text-blue-600 font-medium">Hệ thống trắc nghiệm</span>
              </div>
            </Link>

            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Hệ thống trắc nghiệm trực tuyến chính thức của Đại học Hàng hải Việt Nam. Dành riêng cho sinh viên 
              với tài khoản được cấp từ nhà trường.
            </p>

            <div className="flex items-center space-x-3">
              <Link
                to="https://facebook.com/vimaru.edu.vn"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                aria-label="Facebook ĐHHH"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link
                to="mailto:cntt@vimaru.edu.vn"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                aria-label="Email hỗ trợ"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Footer Navigation Sections */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key}>
              <h3 className="mb-4 font-semibold text-gray-900 text-sm uppercase tracking-wider">{section.title}</h3>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center group"
                      {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{item.label}</span>
                      {item.external && (
                        <svg className="w-3 h-3 ml-1 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 mb-4 md:mb-0">
              &copy; {CURRENT_YEAR} Đại Học Hàng Hải Việt Nam. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-gray-500">
                Hệ thống nội bộ dành cho sinh viên
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
