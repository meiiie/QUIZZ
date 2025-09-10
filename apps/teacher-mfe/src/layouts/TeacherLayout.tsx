import { Outlet, Link } from 'react-router-dom'

const TeacherLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🎓</div>
            <div>
              <h1 className="text-xl font-bold">Quiz Online System</h1>
              <p className="text-sm text-blue-100">Teacher Portal</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <span>📊</span>
                  <span>Bảng Điều Khiển</span>
                </Link>
              </li>
              
              {/* Statistics Section */}
              <li className="pt-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                  Thống kê & Báo cáo
                </div>
              </li>
              
              <li>
                <Link 
                  to="/thong-ke" 
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <span>📈</span>
                  <span>Thống kê tổng quan</span>
                </Link>
              </li>
              
              <li>
                <Link 
                  to="/tien-do-hoc-sinh" 
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <span>👥</span>
                  <span>Tiến độ học sinh</span>
                </Link>
              </li>
              
              <li>
                <Link 
                  to="/bao-cao-khoa" 
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <span>🏫</span>
                  <span>Báo cáo theo Khoa</span>
                </Link>
              </li>
              
              <li>
                <Link 
                  to="/tinh-trang-hoan-thanh" 
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <span>✅</span>
                  <span>Hoàn thành Quiz</span>
                </Link>
              </li>
              
              {/* Quiz Management Section */}
              <li className="pt-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                  Quản lý Quiz
                </div>
              </li>
              
              <li>
                <Link 
                  to="/quan-ly-bai-kiem-tra" 
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <span>📝</span>
                  <span>Danh sách Quiz</span>
                </Link>
              </li>
              
              <li>
                <Link 
                  to="/tao-bai-kiem-tra" 
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <span>➕</span>
                  <span>Tạo Quiz mới</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default TeacherLayout
