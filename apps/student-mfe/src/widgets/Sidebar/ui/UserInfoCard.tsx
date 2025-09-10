/**
 * Professional User Information Card with Dropdown - Enhanced for VMU
 *
 * New Features:
 * - User dropdown menu for profile, settings, logout
 * - Cleaner, more spacious design
 * - Professional interactions and animations
 */

import type { FC } from "react"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import type { UserInfo } from "../model/useSidebar"
import { getUserStatusColor, getUserStatusText } from "../../../entities/user/lib/utils"
import { getMaritimeIcon } from "./icons"

interface UserInfoCardProps {
  userInfo: UserInfo
  isCollapsed: boolean
}

export const UserInfoCard: FC<UserInfoCardProps> = ({ userInfo, isCollapsed }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })

  const userMenuItems = [
    {
      id: "profile",
      label: "Hồ sơ thủy thủ",
      description: "Quản lý thông tin cá nhân",
      iconKey: "user",
      action: () => console.log("Navigate to profile"),
    },
    {
      id: "settings",
      label: "Cài đặt hệ thống",
      description: "Tùy chỉnh ứng dụng",
      iconKey: "ship-wheel",
      action: () => console.log("Navigate to settings"),
    },
    {
      id: "logout",
      label: "Rời khỏi Cảng",
      description: "Đăng xuất khỏi hệ thống",
      iconKey: "log-out",
      action: () => console.log("Logout"),
      isDanger: true,
    },
  ]

  // Update dropdown position when button position changes
  useEffect(() => {
    if (isDropdownOpen && buttonRef.current && isCollapsed) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: buttonRect.top,
        left: buttonRect.right + 12 // 12px gap like ml-3
      })
    }
  }, [isDropdownOpen, isCollapsed])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  if (isCollapsed) {
    return (
      <div
        className="px-3 py-3 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 flex justify-center flex-shrink-0 overflow-visible"
        ref={dropdownRef}
      >
        <div className="relative group">
          <button
            ref={buttonRef}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 bg-gradient-to-br from-[#1A3BAD] to-[#3b82f6] rounded-xl flex items-center justify-center text-white font-bold text-base shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 border-2 border-white"
          >
            {userInfo.avatar}
          </button>
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getUserStatusColor(userInfo.status)} rounded-full border-2 border-white shadow-sm`}
          ></div>

          {isDropdownOpen && createPortal(
            <div 
              ref={dropdownRef}
              className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 min-w-[260px] overflow-hidden animate-in slide-in-from-left-2 duration-200 z-50"
              style={{ 
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-[#1A3BAD] to-[#2563eb] text-white">
                <div className="font-semibold text-sm">{userInfo.name}</div>
                <div className="text-xs text-blue-100">{userInfo.studentId}</div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {userMenuItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.action()
                      setIsDropdownOpen(false)
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200
                      hover:bg-gradient-to-r hover:shadow-sm
                      ${
                        item.isDanger
                          ? "hover:from-red-50 hover:to-red-100 text-red-600 hover:text-red-700"
                          : "hover:from-[#1A3BAD]/5 hover:to-[#FFC107]/5 text-gray-700 hover:text-[#1A3BAD]"
                      }
                      ${index < userMenuItems.length - 1 ? "border-b border-gray-100" : ""}
                    `}
                  >
                    <div
                      className={`
                      w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
                      ${item.isDanger ? "bg-red-100 text-red-600" : "bg-gray-100 text-[#1A3BAD]"}
                    `}
                    >
                      {getMaritimeIcon(item.iconKey)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.label}</div>
                      <div className="text-xs text-gray-500 truncate">{item.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>,
            document.body
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className="px-4 py-4 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200 flex-shrink-0 overflow-visible"
      ref={dropdownRef}
    >
      {/* Section Header - Enhanced */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 bg-[#1A3BAD] rounded-full"></div>
        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Thông tin sinh viên</span>
        <div className="flex-1 h-px bg-gradient-to-r from-[#1A3BAD]/30 to-transparent"></div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center gap-4 text-left group"
        >
          {/* Enhanced Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1A3BAD] to-[#3b82f6] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg border border-blue-100 group-hover:shadow-xl transition-all duration-300">
              {userInfo.avatar}
            </div>
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${getUserStatusColor(userInfo.status)} rounded-full border-2 border-white shadow-lg`}
            ></div>
          </div>

          {/* Enhanced Student Information */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 truncate mb-1 group-hover:text-[#1A3BAD] transition-colors">
              {userInfo.name}
            </h3>
            <p className="text-sm text-gray-600 truncate font-medium mb-1">{userInfo.studentId}</p>
            <p className="text-sm text-[#1A3BAD] font-semibold truncate mb-3">{userInfo.faculty}</p>

            {/* Enhanced Status Display */}
            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg border border-gray-100">
              <div className={`w-2 h-2 ${getUserStatusColor(userInfo.status)} rounded-full animate-pulse`}></div>
              <span className="text-sm text-gray-700 font-medium flex-1 truncate">
                {getUserStatusText(userInfo.status)}
              </span>
            </div>
          </div>

          <div
            className={`
            text-gray-400 transition-transform duration-300 flex-shrink-0
            ${isDropdownOpen ? "rotate-180 text-[#1A3BAD]" : "group-hover:text-[#1A3BAD]"}
          `}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-in slide-in-from-top-2 duration-200 z-50">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#1A3BAD] to-[#2563eb] text-white">
              <div className="font-semibold text-sm">{userInfo.name}</div>
              <div className="text-xs text-blue-100">Menu cá nhân</div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {userMenuItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action()
                    setIsDropdownOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200
                    hover:bg-gradient-to-r hover:shadow-sm
                    ${
                      item.isDanger
                        ? "hover:from-red-50 hover:to-red-100 text-red-600 hover:text-red-700"
                        : "hover:from-[#1A3BAD]/5 hover:to-[#FFC107]/5 text-gray-700 hover:text-[#1A3BAD]"
                    }
                    ${index < userMenuItems.length - 1 ? "border-b border-gray-100" : ""}
                  `}
                >
                  <div
                    className={`
                      w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
                      ${item.isDanger ? "bg-red-100 text-red-600" : "bg-gray-100 text-[#1A3BAD]"}
                    `}
                  >
                    {getMaritimeIcon(item.iconKey)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{item.label}</div>
                    <div className="text-xs text-gray-500 truncate">{item.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
