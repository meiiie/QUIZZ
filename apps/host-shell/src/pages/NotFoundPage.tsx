// ========================================================================
// FILE: src/pages/NotFoundPage.tsx
// PURPOSE: Trang 404 chuyên nghiệp cho hệ thống trắc nghiệm ĐHHH
// DESIGN: Clean, friendly, với navigation rõ ràng về trang chủ
// ========================================================================
import { useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { Home, ArrowLeft, HelpCircle, Mail } from "lucide-react"

// Register GSAP plugins
gsap.registerPlugin(useGSAP)

export default function NotFoundPage() {
  const container = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useGSAP(() => {
    // Floating animation cho illustration
    gsap.to(".floating-element", {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.3,
    })

    // Entrance animations
    const tl = gsap.timeline()

    tl.fromTo(".error-code", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" })
      .fromTo(
        ".error-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4",
      )
      .fromTo(
        ".error-description",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.3",
      )
      .fromTo(
        ".error-actions",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.2",
      )
      .fromTo(
        ".quick-links",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 },
        "-=0.1",
      )
  }, { scope: container })

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate("/")
    }
  }

  return (
    <div ref={container} className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="floating-element absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-200 rounded-full filter blur-3xl opacity-15 animate-pulse delay-1000"></div>
        <div className="floating-element absolute top-3/4 left-3/4 w-24 h-24 bg-indigo-200 rounded-full filter blur-2xl opacity-25 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center">
          {/* Error Code */}
          <div className="error-code mb-8">
            <div className="relative inline-block">
              <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 leading-none">
                404
              </h1>
              <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-blue-100 -z-10 translate-x-2 translate-y-2">
                404
              </div>
            </div>
          </div>

          {/* Error Title */}
          <div className="error-title mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Trang Không Tìm Thấy
            </h2>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>

          {/* Error Description */}
          <div className="error-description mb-12">
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Xin lỗi! Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển. 
              Có thể đường dẫn không chính xác hoặc trang đã bị xóa.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="error-actions mb-16">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Home className="w-5 h-5 mr-2" />
                Về Trang Chủ
              </Link>
              
              <button
                onClick={handleGoBack}
                className="inline-flex items-center bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay Lại
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link to="/help" className="quick-links group">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white/50 group-hover:border-green-200 group-hover:scale-105">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors mx-auto">
                  <HelpCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Hỗ Trợ</h3>
                <p className="text-gray-600 text-sm">Nhận trợ giúp và hướng dẫn sử dụng</p>
              </div>
            </Link>

            <div className="quick-links group">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white/50 group-hover:border-purple-200 group-hover:scale-105">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors mx-auto">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Liên Hệ CNTT</h3>
                <p className="text-gray-600 text-sm">Email: cntt@vimaru.edu.vn</p>
                <p className="text-gray-600 text-sm">SĐT: (0225) 3827 123</p>
              </div>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-16 pt-8 border-t border-gray-200/50">
            <p className="text-sm text-gray-500 mb-2">
              Vẫn cần hỗ trợ? Liên hệ phòng Công nghệ thông tin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-gray-400">
              <span>📧 cntt@vimaru.edu.vn</span>
              <span className="hidden sm:inline">|</span>
              <span>📞 (0225) 3827 123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
