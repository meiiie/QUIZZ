import React from 'react';

export default function Dashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Chào mừng trở lại, Giáo viên!
        </h1>
        <p className="text-gray-600">
          Đây là tổng quan giảng dạy của bạn hôm nay
        </p>
      </div>

      {/* Stats Cards - Fixed Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tổng số Quiz</h3>
              <p className="text-2xl font-bold text-blue-600">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full flex-shrink-0">
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tổng số Học sinh</h3>
              <p className="text-2xl font-bold text-green-600">156</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full flex-shrink-0">
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Đã hoàn thành</h3>
              <p className="text-2xl font-bold text-yellow-600">89</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Đang chờ</h3>
              <p className="text-2xl font-bold text-red-600">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Hoạt động Gần đây</h2>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0">
              <span className="inline-block px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                2 giờ trước
              </span>
            </div>
            <p className="text-gray-700 flex-1">Quiz Toán 01 đã được 23 học sinh hoàn thành</p>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0">
              <span className="inline-block px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                5 giờ trước
              </span>
            </div>
            <p className="text-gray-700 flex-1">Đã tạo quiz mới: "Vật lý Chương 3"</p>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0">
              <span className="inline-block px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">
                1 ngày trước
              </span>
            </div>
            <p className="text-gray-700 flex-1">Quiz Tiếng Anh 02 đã được giao cho Lớp 10A</p>
          </div>
        </div>
      </div>
    </div>
  );
}
