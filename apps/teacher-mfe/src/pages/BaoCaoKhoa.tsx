import React, { useState } from 'react';

// Type definitions
interface Department {
  id: number;
  name: string;
  code: string;
}

interface Student {
  id: number;
  name: string;
  studentId: string;
  completed: number;
  total: number;
  percentage: number;
}

type DepartmentCode = 'IT' | 'ECO' | 'FL' | 'ENG';

// Mock data - trong thực tế sẽ lấy từ API
const mockDepartments: Department[] = [
  { id: 1, name: 'Khoa Công nghệ Thông tin', code: 'IT' },
  { id: 2, name: 'Khoa Kinh tế', code: 'ECO' },
  { id: 3, name: 'Khoa Ngoại ngữ', code: 'FL' },
  { id: 4, name: 'Khoa Kỹ thuật', code: 'ENG' }
];

const mockStudentData: Record<DepartmentCode, Student[]> = {
  'IT': [
    { id: 1, name: 'Nguyễn Văn A', studentId: 'IT001', completed: 8, total: 10, percentage: 80 },
    { id: 2, name: 'Trần Thị B', studentId: 'IT002', completed: 9, total: 10, percentage: 90 },
    { id: 3, name: 'Lê Văn C', studentId: 'IT003', completed: 6, total: 10, percentage: 60 },
    { id: 4, name: 'Phạm Thị D', studentId: 'IT004', completed: 10, total: 10, percentage: 100 },
    { id: 5, name: 'Hoàng Văn E', studentId: 'IT005', completed: 4, total: 10, percentage: 40 }
  ],
  'ECO': [
    { id: 6, name: 'Đỗ Thị F', studentId: 'ECO001', completed: 7, total: 8, percentage: 87.5 },
    { id: 7, name: 'Vũ Văn G', studentId: 'ECO002', completed: 5, total: 8, percentage: 62.5 },
    { id: 8, name: 'Bùi Thị H', studentId: 'ECO003', completed: 8, total: 8, percentage: 100 }
  ],
  'FL': [
    { id: 9, name: 'Ngô Văn I', studentId: 'FL001', completed: 3, total: 6, percentage: 50 },
    { id: 10, name: 'Đinh Thị K', studentId: 'FL002', completed: 6, total: 6, percentage: 100 }
  ],
  'ENG': [
    { id: 11, name: 'Mai Văn L', studentId: 'ENG001', completed: 12, total: 15, percentage: 80 },
    { id: 12, name: 'Cao Thị M', studentId: 'ENG002', completed: 14, total: 15, percentage: 93.3 }
  ]
};

const BaoCaoKhoa: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentCode>('IT');
  
  const currentStudents = mockStudentData[selectedDepartment] || [];
  
  const getStatusColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };
  
  const getStatusText = (percentage: number): string => {
    if (percentage >= 80) return 'Tốt';
    if (percentage >= 60) return 'Trung bình';
    return 'Cần cải thiện';
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Báo cáo theo Khoa
        </h1>
        <p className="text-gray-600">
          Thống kê chi tiết tiến độ hoàn thành Quiz của học sinh theo từng Khoa
        </p>
      </div>

      {/* Department Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Chọn Khoa</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockDepartments.map((dept: Department) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDepartment(dept.code as DepartmentCode)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedDepartment === dept.code
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-semibold">{dept.code}</div>
              <div className="text-sm mt-1">{dept.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Department Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tổng học sinh</h3>
              <p className="text-2xl font-bold text-blue-600">{currentStudents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full flex-shrink-0">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Hoàn thành ≥80%</h3>
              <p className="text-2xl font-bold text-green-600">
                {currentStudents.filter((s: Student) => s.percentage >= 80).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full flex-shrink-0">
              <div className="w-6 h-6 bg-yellow-500 rounded"></div>
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Đang thực hiện</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {currentStudents.filter((s: Student) => s.percentage >= 60 && s.percentage < 80).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
              <div className="w-6 h-6 bg-red-500 rounded"></div>
            </div>
            <div className="ml-4 min-w-0">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Cần cải thiện</h3>
              <p className="text-2xl font-bold text-red-600">
                {currentStudents.filter((s: Student) => s.percentage < 60).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Details Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Chi tiết học sinh - {mockDepartments.find((d: Department) => d.code === selectedDepartment)?.name}
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Học sinh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MSSV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiến độ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phần trăm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStudents.map((student: Student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{student.studentId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.completed}/{student.total} Quiz
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${student.percentage}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {student.percentage.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.percentage)}`}>
                      {getStatusText(student.percentage)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Chi tiết
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      Gửi nhắc nhở
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BaoCaoKhoa;
