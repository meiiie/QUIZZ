import React, { useState } from 'react';

// Interfaces
interface BaiKiemTra {
  id: string;
  tieuDe: string;
  moTa: string;
  soCauHoi: number;
  thoiGianLam: number;
  monHoc: string;
  mucDo: 'Dễ' | 'Trung bình' | 'Khó';
  ngayTao: Date;
  trangThai: 'Nháp' | 'Đã xuất bản' | 'Đã đóng';
  loaiBaiKiemTra: 'Bài kiểm tra' | 'Bài tập' | 'Thực hành';
  diemToiDa: number;
}

interface HocSinh {
  id: string;
  hoTen: string;
  email: string;
  lop: string;
  avatar?: string;
  trangThai: 'Hoạt động' | 'Không hoạt động';
}

interface Lop {
  id: string;
  tenLop: string;
  moTa: string;
  soHocSinh: number;
}

interface CaiDatBaiKiemTra {
  choPhepLamLai: boolean;
  soLanLamToiDa: number;
  hienThiKetQua: 'Ngay lập tức' | 'Sau khi nộp' | 'Sau thời hạn';
  tronCauHoi: boolean;
  giabHanThoiGian: boolean;
  choPhepTamDung: boolean;
  batBuocCamera: boolean;
  chongGianLan: boolean;
}

const TaoBaiKiemTra: React.FC = () => {
  // States
  const [buocHienTai, setBuocHienTai] = useState(0);
  const [baiKiemTraDaChon, setBaiKiemTraDaChon] = useState<BaiKiemTra | null>(null);
  const [thoiGianBatDau, setThoiGianBatDau] = useState<Date | null>(null);
  const [thoiGianKetThuc, setThoiGianKetThuc] = useState<Date | null>(null);
  const [hocSinhDaChon, setHocSinhDaChon] = useState<HocSinh[]>([]);
  const [lopDaChon, setLopDaChon] = useState<Lop[]>([]);
  const [caiDat, setCaiDat] = useState<CaiDatBaiKiemTra>({
    choPhepLamLai: true,
    soLanLamToiDa: 3,
    hienThiKetQua: 'Sau khi nộp',
    tronCauHoi: false,
    giabHanThoiGian: true,
    choPhepTamDung: true,
    batBuocCamera: false,
    chongGianLan: false,
  });

  // Dialog states
  const [moDialogChonHocSinh, setMoDialogChonHocSinh] = useState(false);
  const [moDialogChonLop, setMoDialogChonLop] = useState(false);

  // Mock data
  const danhSachBaiKiemTra: BaiKiemTra[] = [
    {
      id: '1',
      tieuDe: 'Bài kiểm tra Toán học - Chương 1',
      moTa: 'Kiểm tra kiến thức về số học cơ bản và các phép tính đại số',
      soCauHoi: 20,
      thoiGianLam: 45,
      monHoc: 'Toán học',
      mucDo: 'Trung bình',
      ngayTao: new Date(),
      trangThai: 'Đã xuất bản',
      loaiBaiKiemTra: 'Bài kiểm tra',
      diemToiDa: 100
    },
    {
      id: '2',
      tieuDe: 'Bài kiểm tra Văn học - Phân tích tác phẩm',
      moTa: 'Kiểm tra kỹ năng phân tích văn học và hiểu biết về tác phẩm',
      soCauHoi: 15,
      thoiGianLam: 60,
      monHoc: 'Văn học',
      mucDo: 'Khó',
      ngayTao: new Date(),
      trangThai: 'Đã xuất bản',
      loaiBaiKiemTra: 'Bài kiểm tra',
      diemToiDa: 100
    },
    {
      id: '3',
      tieuDe: 'Bài kiểm tra Hóa học - Thí nghiệm cơ bản',
      moTa: 'Kiểm tra kiến thức về các thí nghiệm hóa học và phản ứng',
      soCauHoi: 25,
      thoiGianLam: 90,
      monHoc: 'Hóa học',
      mucDo: 'Dễ',
      ngayTao: new Date(),
      trangThai: 'Đã xuất bản',
      loaiBaiKiemTra: 'Thực hành',
      diemToiDa: 100
    },
    {
      id: '4',
      tieuDe: 'Bài kiểm tra Vật lý - Cơ học',
      moTa: 'Kiểm tra hiểu biết về các định luật cơ học và ứng dụng',
      soCauHoi: 18,
      thoiGianLam: 50,
      monHoc: 'Vật lý',
      mucDo: 'Trung bình',
      ngayTao: new Date(),
      trangThai: 'Đã xuất bản',
      loaiBaiKiemTra: 'Bài kiểm tra',
      diemToiDa: 100
    },
    {
      id: '5',
      tieuDe: 'Bài kiểm tra Tiếng Anh - Ngữ pháp',
      moTa: 'Kiểm tra kiến thức ngữ pháp và từ vựng tiếng Anh',
      soCauHoi: 30,
      thoiGianLam: 40,
      monHoc: 'Tiếng Anh',
      mucDo: 'Dễ',
      ngayTao: new Date(),
      trangThai: 'Đã xuất bản',
      loaiBaiKiemTra: 'Bài kiểm tra',
      diemToiDa: 100
    },
    {
      id: '6',
      tieuDe: 'Bài kiểm tra Lịch sử - Việt Nam hiện đại',
      moTa: 'Kiểm tra kiến thức về lịch sử Việt Nam thế kỷ 20-21',
      soCauHoi: 22,
      thoiGianLam: 55,
      monHoc: 'Lịch sử',
      mucDo: 'Khó',
      ngayTao: new Date(),
      trangThai: 'Đã xuất bản',
      loaiBaiKiemTra: 'Bài kiểm tra',
      diemToiDa: 100
    }
  ];

  const danhSachHocSinh: HocSinh[] = [
    { id: '1', hoTen: 'Nguyễn Văn An', email: 'an@example.com', lop: '10A1', trangThai: 'Hoạt động' },
    { id: '2', hoTen: 'Trần Thị Bình', email: 'binh@example.com', lop: '10A1', trangThai: 'Hoạt động' },
    { id: '3', hoTen: 'Lê Văn Cường', email: 'cuong@example.com', lop: '10A2', trangThai: 'Hoạt động' },
    { id: '4', hoTen: 'Phạm Thị Dung', email: 'dung@example.com', lop: '10A2', trangThai: 'Hoạt động' },
    { id: '5', hoTen: 'Hoàng Văn Em', email: 'em@example.com', lop: '10B1', trangThai: 'Không hoạt động' },
    { id: '6', hoTen: 'Võ Thị Hoa', email: 'hoa@example.com', lop: '10B1', trangThai: 'Hoạt động' },
    { id: '7', hoTen: 'Đặng Văn Hùng', email: 'hung@example.com', lop: '11A1', trangThai: 'Hoạt động' },
    { id: '8', hoTen: 'Bùi Thị Lan', email: 'lan@example.com', lop: '11A1', trangThai: 'Hoạt động' },
    { id: '9', hoTen: 'Ngô Văn Minh', email: 'minh@example.com', lop: '11A2', trangThai: 'Hoạt động' },
    { id: '10', hoTen: 'Phan Thị Nga', email: 'nga@example.com', lop: '11A2', trangThai: 'Hoạt động' },
  ];

  const danhSachLop: Lop[] = [
    { id: '1', tenLop: '10A1', moTa: 'Lớp 10A1 - Chuyên Toán', soHocSinh: 35 },
    { id: '2', tenLop: '10A2', moTa: 'Lớp 10A2 - Chuyên Lý', soHocSinh: 32 },
    { id: '3', tenLop: '10B1', moTa: 'Lớp 10B1 - Tổng hợp', soHocSinh: 40 },
    { id: '4', tenLop: '11A1', moTa: 'Lớp 11A1 - Chuyên Toán', soHocSinh: 33 },
    { id: '5', tenLop: '11A2', moTa: 'Lớp 11A2 - Chuyên Hóa', soHocSinh: 38 },
    { id: '6', tenLop: '12A1', moTa: 'Lớp 12A1 - Chuẩn bị thi đại học', soHocSinh: 30 },
  ];

  const cacBuoc = [
    'Chọn bài kiểm tra',
    'Đặt lịch',
    'Cài đặt',
    'Chọn học sinh'
  ];

  const xuLyChonBaiKiemTra = (baiKiemTra: BaiKiemTra) => {
    setBaiKiemTraDaChon(baiKiemTra);
  };

  const xuLyTiepTuc = () => {
    if (buocHienTai < cacBuoc.length - 1) {
      setBuocHienTai(buocHienTai + 1);
    }
  };

  const xuLyQuayLai = () => {
    if (buocHienTai > 0) {
      setBuocHienTai(buocHienTai - 1);
    }
  };

  const xuLyChonHocSinh = (hocSinh: HocSinh) => {
    setHocSinhDaChon(prev => {
      const isSelected = prev.some(hs => hs.id === hocSinh.id);
      if (isSelected) {
        return prev.filter(hs => hs.id !== hocSinh.id);
      } else {
        return [...prev, hocSinh];
      }
    });
  };

  const xuLyChonLop = (lop: Lop) => {
    setLopDaChon(prev => {
      const isSelected = prev.some(l => l.id === lop.id);
      if (isSelected) {
        return prev.filter(l => l.id !== lop.id);
      } else {
        return [...prev, lop];
      }
    });
  };

  const xuLyTaoBaiKiemTra = async () => {
    try {
      const duLieuBaiKiemTra = {
        baiKiemTraId: baiKiemTraDaChon?.id,
        thoiGianBatDau,
        thoiGianKetThuc,
        caiDat,
        hocSinhIds: hocSinhDaChon.map(hs => hs.id),
        lopIds: lopDaChon.map(l => l.id),
      };

      console.log('Tạo bài kiểm tra với dữ liệu:', duLieuBaiKiemTra);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Tạo bài kiểm tra thành công!');
      
      // Reset form
      setBuocHienTai(0);
      setBaiKiemTraDaChon(null);
      setThoiGianBatDau(null);
      setThoiGianKetThuc(null);
      setHocSinhDaChon([]);
      setLopDaChon([]);
    } catch (error) {
      console.error('Lỗi khi tạo bài kiểm tra:', error);
      alert('Có lỗi xảy ra khi tạo bài kiểm tra!');
    }
  };

  const kiemTraHopLe = () => {
    switch (buocHienTai) {
      case 0:
        return baiKiemTraDaChon !== null;
      case 1:
        return thoiGianBatDau !== null && thoiGianKetThuc !== null;
      case 2:
        return true;
      case 3:
        return hocSinhDaChon.length > 0 || lopDaChon.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo Bài Kiểm Tra Mới</h1>
        <p className="text-gray-600">Tạo và giao bài kiểm tra cho học sinh của bạn</p>
      </div>

      {/* Stepper */}
      <div className="mb-8 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          {cacBuoc.map((label, index) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                index <= buocHienTai 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <span className={`ml-3 text-sm font-medium ${
                index <= buocHienTai ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {label}
              </span>
              {index < cacBuoc.length - 1 && (
                <div className={`mx-6 h-0.5 w-20 ${
                  index < buocHienTai ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mb-8 p-6 bg-white border rounded-lg shadow-sm">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">
              Bước {buocHienTai + 1}: {cacBuoc[buocHienTai]}
            </h2>
            <p className="text-gray-600">
              {buocHienTai === 0 && "Chọn bài kiểm tra từ kho đề thi có sẵn để giao cho học sinh"}
              {buocHienTai === 1 && "Thiết lập thời gian bắt đầu và kết thúc cho bài kiểm tra"}
              {buocHienTai === 2 && "Thiết lập các quy tắc và cài đặt cho bài kiểm tra"}
              {buocHienTai === 3 && "Chọn học sinh hoặc lớp học sẽ tham gia làm bài kiểm tra"}
            </p>
          </div>

          {/* Bước 1: Chọn bài kiểm tra */}
          {buocHienTai === 0 && (
            <div>
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <div className="text-blue-500 mr-3">ℹ️</div>
                  <div>
                    <p className="text-blue-800 font-medium">+ Thêm bài kiểm tra từ kho đề thi</p>
                    <p className="text-blue-600 text-sm">Chọn từ các bài kiểm tra có sẵn hoặc tạo mới</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {danhSachBaiKiemTra.map((baiKiemTra) => (
                  <div
                    key={baiKiemTra.id}
                    className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      baiKiemTraDaChon?.id === baiKiemTra.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                    onClick={() => xuLyChonBaiKiemTra(baiKiemTra)}
                  >
                    <div className="mb-3">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        baiKiemTra.loaiBaiKiemTra === 'Bài kiểm tra' 
                          ? 'bg-blue-100 text-blue-800'
                          : baiKiemTra.loaiBaiKiemTra === 'Thực hành'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {baiKiemTra.loaiBaiKiemTra}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2">
                      {baiKiemTra.tieuDe}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {baiKiemTra.moTa}
                    </p>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                          <strong>Môn học:</strong> {baiKiemTra.monHoc}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          baiKiemTra.mucDo === 'Dễ' 
                            ? 'bg-green-100 text-green-800' 
                            : baiKiemTra.mucDo === 'Trung bình' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {baiKiemTra.mucDo}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-gray-600">
                        <span className="flex items-center">
                          ⏱️ {baiKiemTra.thoiGianLam} phút
                        </span>
                        <span className="flex items-center">
                          📝 {baiKiemTra.soCauHoi} câu hỏi
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <span className="text-gray-500 text-xs">
                          Điểm tối đa: <strong>{baiKiemTra.diemToiDa}</strong>
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          baiKiemTra.trangThai === 'Đã xuất bản' 
                            ? 'bg-green-100 text-green-800' 
                            : baiKiemTra.trangThai === 'Nháp'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {baiKiemTra.trangThai}
                        </span>
                      </div>
                    </div>

                    {baiKiemTraDaChon?.id === baiKiemTra.id && (
                      <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
                        ✅ Đã chọn
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* No records message */}
              {danhSachBaiKiemTra.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không có bài kiểm tra nào</h3>
                  <p className="text-gray-500 mb-4">Hãy tạo bài kiểm tra mới để bắt đầu</p>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Tạo bài kiểm tra mới
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bước 2: Đặt lịch */}
          {buocHienTai === 1 && (
            <div className="space-y-6">
              {baiKiemTraDaChon && (
                <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Bài kiểm tra được chọn: {baiKiemTraDaChon.tieuDe}
                  </h3>
                  <p className="text-blue-700 text-sm mb-2">{baiKiemTraDaChon.moTa}</p>
                  <div className="flex items-center space-x-4 text-sm text-blue-600">
                    <span>⏱️ {baiKiemTraDaChon.thoiGianLam} phút</span>
                    <span>📝 {baiKiemTraDaChon.soCauHoi} câu hỏi</span>
                    <span>📚 {baiKiemTraDaChon.monHoc}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => setThoiGianBatDau(new Date(e.target.value))}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => setThoiGianKetThuc(new Date(e.target.value))}
                    min={thoiGianBatDau?.toISOString().slice(0, 16) || new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>

              {thoiGianBatDau && thoiGianKetThuc && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-green-500 mr-3">✅</div>
                    <div>
                      <p className="text-green-800 font-medium">Lịch thi đã được thiết lập</p>
                      <p className="text-green-600 text-sm">
                        Từ <strong>{thoiGianBatDau.toLocaleString('vi-VN')}</strong> đến{' '}
                        <strong>{thoiGianKetThuc.toLocaleString('vi-VN')}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bước 3: Cài đặt */}
          {buocHienTai === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 border rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                <h3 className="font-semibold text-lg mb-4 text-blue-900 flex items-center">
                  ⚙️ Cài đặt chung
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-center p-3 rounded-lg hover:bg-white/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={caiDat.choPhepLamLai}
                      onChange={(e) => setCaiDat({...caiDat, choPhepLamLai: e.target.checked})}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700 font-medium">Cho phép làm lại</span>
                  </label>

                  {caiDat.choPhepLamLai && (
                    <div className="ml-7">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số lần làm tối đa
                      </label>
                      <select
                        value={caiDat.soLanLamToiDa}
                        onChange={(e) => setCaiDat({...caiDat, soLanLamToiDa: parseInt(e.target.value)})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {[1,2,3,4,5].map(num => (
                          <option key={num} value={num}>{num} lần</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hiển thị kết quả
                    </label>
                    <select
                      value={caiDat.hienThiKetQua}
                      onChange={(e) => setCaiDat({...caiDat, hienThiKetQua: e.target.value as any})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Ngay lập tức">Ngay lập tức</option>
                      <option value="Sau khi nộp">Sau khi nộp</option>
                      <option value="Sau thời hạn">Sau thời hạn</option>
                    </select>
                  </div>

                  <label className="flex items-center p-3 rounded-lg hover:bg-white/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={caiDat.tronCauHoi}
                      onChange={(e) => setCaiDat({...caiDat, tronCauHoi: e.target.checked})}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700 font-medium">Trộn thứ tự câu hỏi</span>
                  </label>
                </div>
              </div>

              <div className="p-6 border rounded-xl bg-gradient-to-br from-red-50 to-orange-50">
                <h3 className="font-semibold text-lg mb-4 text-red-900 flex items-center">
                  🔒 Cài đặt bảo mật
                </h3>
                
                <div className="space-y-4">
                  <label className="flex items-center p-3 rounded-lg hover:bg-white/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={caiDat.giabHanThoiGian}
                      onChange={(e) => setCaiDat({...caiDat, giabHanThoiGian: e.target.checked})}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-3 text-gray-700 font-medium">Giới hạn thời gian làm bài</span>
                  </label>

                  <label className="flex items-center p-3 rounded-lg hover:bg-white/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={caiDat.choPhepTamDung}
                      onChange={(e) => setCaiDat({...caiDat, choPhepTamDung: e.target.checked})}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-3 text-gray-700 font-medium">Cho phép tạm dừng</span>
                  </label>

                  <label className="flex items-center p-3 rounded-lg hover:bg-white/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={caiDat.batBuocCamera}
                      onChange={(e) => setCaiDat({...caiDat, batBuocCamera: e.target.checked})}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-3 text-gray-700 font-medium">Bắt buộc bật camera</span>
                  </label>

                  <label className="flex items-center p-3 rounded-lg hover:bg-white/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={caiDat.chongGianLan}
                      onChange={(e) => setCaiDat({...caiDat, chongGianLan: e.target.checked})}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-3 text-gray-700 font-medium">Bật chế độ chống gian lận</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Bước 4: Chọn học sinh */}
          {buocHienTai === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 border rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-green-900 flex items-center">
                    🏫 Chọn theo lớp học
                  </h3>
                  <button
                    onClick={() => setMoDialogChonLop(true)}
                    className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    + Thêm lớp
                  </button>
                </div>

                {lopDaChon.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">🏫</div>
                    <p className="text-gray-500 mb-3">Chưa chọn lớp nào</p>
                    <button 
                      onClick={() => setMoDialogChonLop(true)}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Chọn lớp học →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lopDaChon.map((lop) => (
                      <div key={lop.id} className="flex items-center justify-between p-4 bg-white border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            🏫
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{lop.tenLop}</div>
                            <div className="text-sm text-gray-600">{lop.soHocSinh} học sinh - {lop.moTa}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => xuLyChonLop(lop)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-purple-900 flex items-center">
                    👥 Chọn học sinh cá nhân
                  </h3>
                  <button
                    onClick={() => setMoDialogChonHocSinh(true)}
                    className="px-4 py-2 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    + Thêm học sinh
                  </button>
                </div>

                {hocSinhDaChon.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">👥</div>
                    <p className="text-gray-500 mb-3">Chưa chọn học sinh nào</p>
                    <button 
                      onClick={() => setMoDialogChonHocSinh(true)}
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Chọn học sinh →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {hocSinhDaChon.map((hocSinh) => (
                      <div key={hocSinh.id} className="flex items-center justify-between p-4 bg-white border border-purple-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3 text-purple-600 font-semibold">
                            {hocSinh.hoTen.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{hocSinh.hoTen}</div>
                            <div className="text-sm text-gray-600">{hocSinh.email} - {hocSinh.lop}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => xuLyChonHocSinh(hocSinh)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={xuLyQuayLai}
          disabled={buocHienTai === 0}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Quay lại
        </button>

        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            Bước {buocHienTai + 1} / {cacBuoc.length}
          </span>
          {buocHienTai === cacBuoc.length - 1 ? (
            <button
              onClick={xuLyTaoBaiKiemTra}
              disabled={!kiemTraHopLe()}
              className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              🚀 Tạo bài kiểm tra
            </button>
          ) : (
            <button
              onClick={xuLyTiepTuc}
              disabled={!kiemTraHopLe()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Tiếp tục →
            </button>
          )}
        </div>
      </div>

      {/* Dialog chọn lớp */}
      {moDialogChonLop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Chọn lớp học</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {danhSachLop.map((lop) => (
                <label key={lop.id} className="flex items-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer border transition-colors">
                  <input
                    type="checkbox"
                    checked={lopDaChon.some(l => l.id === lop.id)}
                    onChange={() => xuLyChonLop(lop)}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-4"
                  />
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    🏫
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{lop.tenLop}</div>
                    <div className="text-sm text-gray-600">{lop.soHocSinh} học sinh - {lop.moTa}</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setMoDialogChonLop(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog chọn học sinh */}
      {moDialogChonHocSinh && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Chọn học sinh</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {danhSachHocSinh.map((hocSinh) => (
                <label
                  key={hocSinh.id}
                  className={`flex items-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer border transition-colors ${
                    hocSinh.trangThai === 'Không hoạt động' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={hocSinhDaChon.some(hs => hs.id === hocSinh.id)}
                    onChange={() => xuLyChonHocSinh(hocSinh)}
                    disabled={hocSinh.trangThai === 'Không hoạt động'}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-4"
                  />
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 text-purple-600 font-semibold">
                    {hocSinh.hoTen.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{hocSinh.hoTen}</div>
                    <div className="text-sm text-gray-600">{hocSinh.email} - {hocSinh.lop}</div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    hocSinh.trangThai === 'Hoạt động' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {hocSinh.trangThai}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setMoDialogChonHocSinh(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaoBaiKiemTra;