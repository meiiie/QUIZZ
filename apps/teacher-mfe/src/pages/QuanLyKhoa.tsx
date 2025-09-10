import React, { useState, useMemo, useEffect } from 'react';

interface Department {
  id: number;
  name: string;
  code: string;
  color: string;
  students: number;
}

interface Student {
  id: number;
  name: string;
  studentId: string;
  departmentId: number;
  completed: boolean;
  score: number | null;
  lastQuiz: string | null;
  completedDate: string | null;
}

export default function QuanLyKhoa() {
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data ngay trong component để test giao diện
  useEffect(() => {
    const loadMockData = () => {
      setLoading(true);
      
      // Simulate loading delay
      setTimeout(() => {
        // Mock departments data với đầy đủ 11 khoa/viện
        const mockDepartments: Department[] = [
          { id: 1, name: 'Khoa Hàng hải', code: 'HH', color: 'bg-blue-300', students: 245 },
          { id: 2, name: 'Khoa Máy tàu biển', code: 'MTB', color: 'bg-green-300', students: 198 },
          { id: 3, name: 'Khoa Công trình', code: 'CT', color: 'bg-yellow-300', students: 167 },
          { id: 4, name: 'Khoa Điện - Điện tử', code: 'DDT', color: 'bg-purple-300', students: 134 },
          { id: 5, name: 'Khoa Kinh tế', code: 'KT', color: 'bg-red-300', students: 156 },
          { id: 6, name: 'Khoa Quản trị - Tài chính', code: 'QTTC', color: 'bg-pink-300', students: 89 },
          { id: 7, name: 'Khoa Công nghệ thông tin', code: 'CNTT', color: 'bg-indigo-300', students: 123 },
          { id: 8, name: 'Khoa Đóng tàu', code: 'DT', color: 'bg-teal-300', students: 78 },
          { id: 9, name: 'Khoa Ngoại ngữ', code: 'NN', color: 'bg-orange-300', students: 95 },
          { id: 10, name: 'Viện Môi trường', code: 'VMT', color: 'bg-emerald-300', students: 112 },
          { id: 11, name: 'Viện Đào tạo quốc tế', code: 'VDTQT', color: 'bg-violet-300', students: 87 }
        ];

        // Mock students data với nhiều học sinh hơn cho mỗi khoa
        const mockStudents: Student[] = [
          // Khoa Hàng hải (HH) - 8 học sinh
          { id: 1, name: 'Nguyễn Văn An', studentId: 'HH001', departmentId: 1, completed: true, score: 85, lastQuiz: 'Điều khiển tàu', completedDate: '2024-12-20' },
          { id: 2, name: 'Trần Thị Bình', studentId: 'HH002', departmentId: 1, completed: false, score: null, lastQuiz: null, completedDate: null },
          { id: 3, name: 'Lê Minh Châu', studentId: 'HH003', departmentId: 1, completed: true, score: 92, lastQuiz: 'Hàng hải quốc tế', completedDate: '2024-12-19' },
          { id: 4, name: 'Phạm Thu Dung', studentId: 'HH004', departmentId: 1, completed: true, score: 78, lastQuiz: 'An toàn hàng hải', completedDate: '2024-12-18' },
          { id: 5, name: 'Hoàng Văn Em', studentId: 'HH005', departmentId: 1, completed: false, score: null, lastQuiz: null, completedDate: null },
          { id: 6, name: 'Đặng Thị Giang', studentId: 'HH006', departmentId: 1, completed: true, score: 87, lastQuiz: 'Luật hàng hải', completedDate: '2024-12-17' },
          { id: 7, name: 'Vũ Minh Hoàng', studentId: 'HH007', departmentId: 1, completed: true, score: 94, lastQuiz: 'Điều khiển tàu', completedDate: '2024-12-16' },
          { id: 8, name: 'Ngô Thị Lan', studentId: 'HH008', departmentId: 1, completed: false, score: null, lastQuiz: null, completedDate: null },

          // Khoa Máy tàu biển (MTB) - 6 học sinh
          { id: 9, name: 'Vũ Thị Loan', studentId: 'MTB001', departmentId: 2, completed: true, score: 88, lastQuiz: 'Động cơ diesel', completedDate: '2024-12-20' },
          { id: 10, name: 'Đỗ Văn Nam', studentId: 'MTB002', departmentId: 2, completed: false, score: null, lastQuiz: null, completedDate: null },
          { id: 11, name: 'Bùi Thị Oanh', studentId: 'MTB003', departmentId: 2, completed: true, score: 75, lastQuiz: 'Hệ thống máy tàu', completedDate: '2024-12-17' },
          { id: 12, name: 'Trương Văn Phúc', studentId: 'MTB004', departmentId: 2, completed: true, score: 82, lastQuiz: 'Bảo trì máy tàu', completedDate: '2024-12-19' },
          { id: 13, name: 'Lý Thị Quỳnh', studentId: 'MTB005', departmentId: 2, completed: false, score: null, lastQuiz: null, completedDate: null },
          { id: 14, name: 'Phan Minh Sơn', studentId: 'MTB006', departmentId: 2, completed: true, score: 79, lastQuiz: 'Động cơ diesel', completedDate: '2024-12-15' },

          // Khoa Công trình (CT) - 5 học sinh
          { id: 15, name: 'Ngô Văn Phong', studentId: 'CT001', departmentId: 3, completed: true, score: 90, lastQuiz: 'Thủy lực', completedDate: '2024-12-19' },
          { id: 16, name: 'Lý Thị Quỳnh', studentId: 'CT002', departmentId: 3, completed: false, score: null, lastQuiz: null, completedDate: null },
          { id: 17, name: 'Đinh Văn Tâm', studentId: 'CT003', departmentId: 3, completed: true, score: 86, lastQuiz: 'Cơ học đất', completedDate: '2024-12-18' },
          { id: 18, name: 'Võ Thị Uyên', studentId: 'CT004', departmentId: 3, completed: true, score: 91, lastQuiz: 'Kết cấu bê tông', completedDate: '2024-12-20' },
          { id: 19, name: 'Huỳnh Minh Việt', studentId: 'CT005', departmentId: 3, completed: false, score: null, lastQuiz: null, completedDate: null },

          // Khoa Điện - Điện tử (DDT) - 7 học sinh
          { id: 20, name: 'Cao Thị Yến', studentId: 'DDT001', departmentId: 4, completed: true, score: 89, lastQuiz: 'Mạch điện', completedDate: '2024-12-21' },
          { id: 21, name: 'Lê Văn Bình', studentId: 'DDT002', departmentId: 4, completed: false, score: null, lastQuiz: null, completedDate: null },
          { id: 22, name: 'Trần Thị Cúc', studentId: 'DDT003', departmentId: 4, completed: true, score: 84, lastQuiz: 'Điện tử số', completedDate: '2024-12-19' },
          { id: 23, name: 'Phạm Văn Đức', studentId: 'DDT004', departmentId: 4, completed: true, score: 77, lastQuiz: 'Vi xử lý', completedDate: '2024-12-18' },
          { id: 24, name: 'Nguyễn Thị Hạnh', studentId: 'DDT005', departmentId: 4, completed: false, score: null, lastQuiz: null, completedDate: null },
          { id: 25, name: 'Vũ Minh Khang', studentId: 'DDT006', departmentId: 4, completed: true, score: 93, lastQuiz: 'Tự động hóa', completedDate: '2024-12-20' },
          { id: 26, name: 'Đỗ Thị Linh', studentId: 'DDT007', departmentId: 4, completed: true, score: 81, lastQuiz: 'Mạch điện', completedDate: '2024-12-17' },

          // Khoa Kinh tế (KT) - 6 học sinh
          { id: 27, name: 'Hoàng Văn Minh', studentId: 'KT001', departmentId: 5, completed: true, score: 88, lastQuiz: 'Kinh tế vĩ mô', completedDate: '2024-12-20' },
          { id: 28, name: 'Lê Thị Ngọc', studentId: 'KT002', departmentId: 5, completed: false, score: null, lastQuiz: null, completedDate: null },
          { id: 29, name: 'Trần Văn Phúc', studentId: 'KT003', departmentId: 5, completed: true, score: 92, lastQuiz: 'Tài chính doanh nghiệp', completedDate: '2024-12-19' },
          { id: 30, name: 'Nguyễn Thị Quỳnh', studentId: 'KT004', departmentId: 5, completed: true, score: 85, lastQuiz: 'Thống kê kinh tế', completedDate: '2024-12-18' },
          { id: 31, name: 'Phạm Minh Tuấn', studentId: 'KT005', departmentId: 5, completed: false, score: null, lastQuiz: null, completedDate: null },
          { id: 32, name: 'Võ Thị Uyên', studentId: 'KT006', departmentId: 5, completed: true, score: 79, lastQuiz: 'Marketing', completedDate: '2024-12-16' },

          // Khoa CNTT (CNTT) - 8 học sinh
          { id: 33, name: 'Đinh Văn Việt', studentId: 'CNTT001', departmentId: 7, completed: true, score: 95, lastQuiz: 'Lập trình Java', completedDate: '2024-12-21' },
          { id: 34, name: 'Bùi Thị Anh', studentId: 'CNTT002', departmentId: 7, completed: false, score: null, lastQuiz: null, completedDate: null },
          { id: 35, name: 'Lý Minh Bảo', studentId: 'CNTT003', departmentId: 7, completed: true, score: 87, lastQuiz: 'Cơ sở dữ liệu', completedDate: '2024-12-20' },
          { id: 36, name: 'Trương Thị Cầm', studentId: 'CNTT004', departmentId: 7, completed: true, score: 91, lastQuiz: 'Mạng máy tính', completedDate: '2024-12-19' },
          { id: 37, name: 'Huỳnh Văn Đạt', studentId: 'CNTT005', departmentId: 7, completed: false, score: null, lastQuiz: null, completedDate: null },
          { id: 38, name: 'Cao Thị Hoa', studentId: 'CNTT006', departmentId: 7, completed: true, score: 83, lastQuiz: 'Phát triển Web', completedDate: '2024-12-18' },
          { id: 39, name: 'Phan Minh Khánh', studentId: 'CNTT007', departmentId: 7, completed: true, score: 89, lastQuiz: 'AI & Machine Learning', completedDate: '2024-12-17' },
          { id: 40, name: 'Ngô Thị Lan', studentId: 'CNTT008', departmentId: 7, completed: false, score: null, lastQuiz: null, completedDate: null },

          // Viện Môi trường (VMT) - 5 học sinh
          { id: 41, name: 'Nguyễn Thị Hoa', studentId: 'VMT001', departmentId: 10, completed: true, score: 91, lastQuiz: 'Môi trường biển', completedDate: '2024-12-21' },
          { id: 42, name: 'Trần Văn Hùng', studentId: 'VMT002', departmentId: 10, completed: false, score: null, lastQuiz: null, completedDate: null },
          { id: 43, name: 'Lê Thị Mai', studentId: 'VMT003', departmentId: 10, completed: true, score: 88, lastQuiz: 'Quản lý chất thải', completedDate: '2024-12-20' },
          { id: 44, name: 'Phạm Văn Nam', studentId: 'VMT004', departmentId: 10, completed: true, score: 85, lastQuiz: 'Đánh giá tác động môi trường', completedDate: '2024-12-19' },
          { id: 45, name: 'Võ Thị Oanh', studentId: 'VMT005', departmentId: 10, completed: false, score: null, lastQuiz: null, completedDate: null },

          // Viện Đào tạo quốc tế (VDTQT) - 4 học sinh
          { id: 46, name: 'Phan Minh Quân', studentId: 'VDTQT001', departmentId: 11, completed: true, score: 93, lastQuiz: 'International Maritime Law', completedDate: '2024-12-21' },
          { id: 47, name: 'Võ Thị Nga', studentId: 'VDTQT002', departmentId: 11, completed: false, score: null, lastQuiz: null, completedDate: null },
          { id: 48, name: 'Nguyễn Văn Sơn', studentId: 'VDTQT003', departmentId: 11, completed: true, score: 87, lastQuiz: 'Global Business', completedDate: '2024-12-20' },
          { id: 49, name: 'Trần Thị Thảo', studentId: 'VDTQT004', departmentId: 11, completed: true, score: 90, lastQuiz: 'International Relations', completedDate: '2024-12-18' }
        ];

        setDepartments(mockDepartments);
        setAllStudents(mockStudents);
        setLoading(false);
      }, 800); // Simulate 800ms loading time
    };

    loadMockData();
  }, []);

  // Filter students theo khoa được chọn và search term
  const filteredStudents = useMemo(() => {
    if (!selectedDepartment) return [];
    
    let students = allStudents.filter(student => student.departmentId === selectedDepartment);
    
    if (searchTerm.trim()) {
      students = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return students;
  }, [selectedDepartment, searchTerm]);

  const selectedDept = departments.find(dept => dept.id === selectedDepartment);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Khoa</h1>
        <p className="text-gray-600">Xem và quản lý học sinh theo từng khoa trong trường</p>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tổng số khoa/viện</p>
              <p className="text-2xl font-bold">{departments.length}</p>
            </div>
            <div className="bg-white bg-opacity-25 rounded-lg p-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Tổng học sinh</p>
              <p className="text-2xl font-bold">{allStudents.length}</p>
            </div>
            <div className="bg-white bg-opacity-25 rounded-lg p-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Đã làm bài</p>
              <p className="text-2xl font-bold">{allStudents.filter(s => s.completed).length}</p>
            </div>
            <div className="bg-white bg-opacity-25 rounded-lg p-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Điểm trung bình</p>
              <p className="text-2xl font-bold">
                {allStudents.filter(s => s.score !== null).length > 0 
                  ? Math.round(allStudents.filter(s => s.score !== null).reduce((sum, s) => sum + (s.score || 0), 0) / allStudents.filter(s => s.score !== null).length)
                  : '--'
                }
              </p>
            </div>
            <div className="bg-white bg-opacity-25 rounded-lg p-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 11 khoa/viện - responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {departments.map((dept) => (
          <div
            key={dept.id}
            onClick={() => setSelectedDepartment(dept.id)}
            className={`
              relative cursor-pointer rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg
              ${selectedDepartment === dept.id ? 'ring-4 ring-blue-500 shadow-lg' : 'hover:shadow-md'}
              ${dept.color} text-gray-800
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">{dept.name}</h3>
                <p className="text-sm opacity-90 mb-2">{dept.code}</p>
                <div className="flex items-center text-sm">
                  <span>{dept.students} học sinh</span>
                </div>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 bg-white bg-opacity-60 rounded-lg flex items-center justify-center mb-2">
                  <div className="w-6 h-6 bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
            
            {selectedDepartment === dept.id && (
              <div className="absolute top-2 right-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Danh sách học sinh khi chọn khoa */}
      {selectedDepartment && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Học sinh {selectedDept?.name}
              </h2>
              <div className="text-sm text-gray-500">
                {filteredStudents.length} học sinh
              </div>
            </div>
            
            {/* Thanh tìm kiếm */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo tên hoặc mã số học sinh..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Bảng danh sách học sinh */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Học sinh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Điểm số
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bài kiểm tra gần nhất
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày hoàn thành
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {student.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`
                        inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${student.completed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                        }
                      `}>
                        {student.completed ? '✓ Đã làm bài' : '✗ Chưa làm bài'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.score ? (
                          <span className={`
                            font-semibold
                            ${student.score >= 80 ? 'text-green-600' : 
                              student.score >= 60 ? 'text-yellow-600' : 'text-red-600'}
                          `}>
                            {student.score}/100
                          </span>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.lastQuiz || <span className="text-gray-400">Chưa có</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.completedDate || <span className="text-gray-400">--</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">
                  {searchTerm ? 'Không tìm thấy học sinh phù hợp' : 'Chọn một khoa để xem danh sách học sinh'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
