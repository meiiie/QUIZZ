"use client"

// ========================================================================
// FILE: src/pages/HomePage.tsx
// PURPOSE: Trang chủ tối ưu cho sinh viên ĐHHH - tập trung vào trắc nghiệm
// DESIGN: Gọn gàng, chuyên nghiệp, hướng dẫn rõ ràng cho sinh viên
// ========================================================================
import { useRef } from "react"
import { Link } from "react-router-dom"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function HomePage() {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Chỉ chạy animations sau khi DOM đã render xong
    const tl = gsap.timeline()

    // Hero section animation
    tl.fromTo(".hero-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
      .fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4",
      )
      .fromTo(
        ".hero-actions",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.3",
      )

    // Quick access animation với ScrollTrigger
    gsap.fromTo(
      ".quick-access-card",
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".quick-access-section",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    )

    // Stats animation với ScrollTrigger
    gsap.fromTo(
      ".stat-item",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      },
    )
  }, { scope: container }) // Giới hạn GSAP trong container này

  return (
    <div ref={container} className="min-h-screen bg-gray-50">
      {/* Hero Section - Simplified */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white pt-32 pb-20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 border border-white rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <div className="hero-title">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Hệ Thống Trắc Nghiệm
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 mt-2">
                ĐHHH Việt Nam
              </span>
            </h1>
          </div>

          <div className="hero-subtitle">
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Nền tảng học tập và kiểm tra trực tuyến dành riêng cho sinh viên Đại học Hàng hải Việt Nam
            </p>
          </div>

          <div className="hero-actions">
            <Link
              to="/login"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Đăng Nhập Hệ Thống
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="quick-access-section py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Hướng Dẫn</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Thông tin hữu ích để bạn sử dụng hệ thống hiệu quả
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link to="/help" className="quick-access-card group">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-blue-200 group-hover:scale-105">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors mx-auto">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Hỗ Trợ & Hướng Dẫn</h3>
                <p className="text-gray-600 text-center">Tìm hiểu cách sử dụng hệ thống và nhận hỗ trợ kỹ thuật</p>
              </div>
            </Link>

            <div className="quick-access-card group">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-green-200 group-hover:scale-105">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors mx-auto">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Liên Hệ CNTT</h3>
                <div className="text-center space-y-2">
                  <p className="text-gray-600">📧 cntt@vimaru.edu.vn</p>
                  <p className="text-gray-600">📞 (0225) 3827 123</p>
                  <p className="text-gray-600 text-sm">Thứ 2-6: 8:00-17:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Thống Kê Hệ Thống</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="stat-item text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">Môn Học</div>
            </div>
            <div className="stat-item text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Câu Hỏi</div>
            </div>
            <div className="stat-item text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600">Sinh Viên</div>
            </div>
            <div className="stat-item text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Hỗ Trợ</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
