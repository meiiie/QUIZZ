import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import TeacherLayout from '../layouts/TeacherLayout'
import BaoCaoKhoa from '../pages/BaoCaoKhoa'
import TienDoHocSinh from '../pages/TienDoHocSinh'
import ThongKe from '../pages/ThongKe'
import TinhTrangHoanThanh from '../pages/TinhTrangHoanThanh'
import QuanLyBaiKiemTra from '../pages/QuanLyBaiKiemTra'
import TaoBaiKiemTra from '../pages/TaoBaiKiemTra'
import Dashboard from '../pages/Dashboard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TeacherLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'bao-cao-khoa',
        element: <BaoCaoKhoa />
      },
      {
        path: 'tien-do-hoc-sinh',
        element: <TienDoHocSinh />
      },
      {
        path: 'thong-ke',
        element: <ThongKe />
      },
      {
        path: 'tinh-trang-hoan-thanh',
        element: <TinhTrangHoanThanh />
      },
      {
        path: 'quan-ly-bai-kiem-tra',
        element: <QuanLyBaiKiemTra />
      },
      {
        path: 'tao-bai-kiem-tra',
        element: <TaoBaiKiemTra />
      }
    ]
  }
])