/**
 * Sidebar Model - Student MFE
 *
 * Triết lý: "La Bàn Số" - Maritime Navigation System
 * Design Vision: Professional Maritime Interface for Vietnam Maritime University
 * Color Scheme: Navy Blue (#1A3BAD) + Compass Gold (#FFC107)
 */

import { useMemo } from "react"
import type { StudentView } from "../../../shared/lib/viewManager"

export interface NavItem {
  id: StudentView
  label: string
  iconKey: string
  description?: string
  badge?: string // Optional badge for special items
}

export interface SecondaryAction {
  id: string
  label: string
  iconKey: string
  description?: string
  onClick?: () => void
}

export interface UserInfo {
  name: string
  studentId: string
  faculty: string
  avatar: string
  status: "online" | "offline" | "busy"
}

export const useSidebar = () => {
  // Maritime Navigation Items với thiết kế chuyên nghiệp
  const navItems: NavItem[] = useMemo(
    () => [
      {
        id: "dashboard",
        label: "Trang Chủ",
        description: "Tổng quan hoạt động học tập",
        iconKey: "home", // Home icon
      },
      {
        id: "quizzes",
        label: "Bài Thi",
        description: "Danh sách bài kiểm tra",
        iconKey: "book", // Book icon
        badge: "new", // Indicate new quizzes available
      },
      {
        id: "history",
        label: "Lịch Sử",
        description: "Kết quả bài thi đã làm",
        iconKey: "chart", // Chart icon
      },
      {
        id: "profile",
        label: "Hồ Sơ",
        description: "Thông tin cá nhân",
        iconKey: "user", // User icon
      },
    ],
    [],
  )

  // Secondary Actions - Bottom of sidebar
  const secondaryActions: SecondaryAction[] = useMemo(
    () => [
      // Empty array - all actions moved to user dropdown for cleaner design
    ],
    [],
  )

  // Mock user data - In real app, this would come from auth context
  const userInfo: UserInfo = useMemo(
    () => ({
      name: "Nguyễn Văn Hải",
      studentId: "SV2024001",
      faculty: "Khoa Hàng Hải",
      avatar: "NH", // Initials for avatar
      status: "online",
    }),
    [],
  )

  return {
    navItems,
    secondaryActions,
    userInfo,
  }
}
