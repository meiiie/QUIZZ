/**
 * Professional Student Sidebar - Redesigned to match Teacher MFE style
 *
 * Design Philosophy: "Clean Academic Interface"
 * - Clean, professional layout matching Teacher MFE design
 * - Enhanced spacing and typography for better readability
 * - Consistent color system with academic blue theme
 * - Professional-grade interactions and animations
 *
 * Key Features:
 * - Header with VMU branding
 * - Sectioned navigation with clear hierarchy
 * - User info card with avatar
 * - Collapsible design with smooth transitions
 * - Professional styling matching Teacher MFE
 */

import type { FC } from "react"
import { useState, useEffect } from "react"
import { useView } from "../../../shared/lib/viewManager"
import { useSidebar } from "../model/useSidebar"
import { NavList } from "./NavList"
import { SecondaryActions } from "./SecondaryActions"

export interface SidebarProps {
  className?: string
}

/**
 * Get initial collapsed state from localStorage with SSR safety
 */
const getInitialCollapsedState = (): boolean => {
  if (typeof window === "undefined") return false
  const savedState = localStorage.getItem("vmu-sidebar-collapsed")
  return savedState ? JSON.parse(savedState) : false
}

export const Sidebar: FC<SidebarProps> = ({ className = "" }) => {
  const { currentView, setView } = useView()
  const { navItems, secondaryActions } = useSidebar()

  // Enhanced state management with smooth transitions
  const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsedState)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Professional toggle handler with transition management
  const handleToggle = () => {
    setIsTransitioning(true)
    const newCollapsedState = !isCollapsed

    // Smooth transition timing
    setTimeout(() => {
      setIsCollapsed(newCollapsedState)
      localStorage.setItem("vmu-sidebar-collapsed", JSON.stringify(newCollapsedState))

      // Notify host application
      window.dispatchEvent(
        new CustomEvent("vmu:sidebar:toggle", {
          detail: { isCollapsed: newCollapsedState },
        }),
      )

      setTimeout(() => setIsTransitioning(false), 150)
    }, 50)
  }

  // Initial state notification
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("vmu:sidebar:toggle", {
        detail: { isCollapsed },
      }),
    )
  }, [])

  return (
    <div className="relative h-full overflow-visible">
      {/* Toggle Button - Positioned absolutely relative to the container */}
      <button
        onClick={handleToggle}
        className={`
          absolute top-6 z-[100] 
          w-8 h-12 bg-blue-600 hover:bg-blue-700
          text-white rounded-r-lg shadow-lg hover:shadow-xl
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          border border-l-0 border-blue-300 hover:border-blue-400
          ${isCollapsed ? "left-[76px]" : "left-[256px]"}
        `}
        title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
        aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
      >
        <div className={`transition-transform duration-300 ${isCollapsed ? "rotate-0" : "rotate-180"}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </div>
      </button>

      {/* Professional Student Sidebar - Clean Academic Design */}
      <aside
        className={`
          relative h-full bg-white flex flex-col shadow-sm border-r border-gray-200
          transition-all duration-300 ease-in-out overflow-hidden
          ${isCollapsed ? "w-20" : "w-64"}
          ${isTransitioning ? "pointer-events-none" : ""}
          ${className}
        `}
      >
        {/* Enhanced Sidebar Content */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Navigation Section */}
          <div className="flex-1 overflow-y-auto">
            <NavList navItems={navItems} currentView={currentView} onViewChange={setView} isCollapsed={isCollapsed} />
          </div>

          {/* Secondary Actions */}
          <SecondaryActions secondaryActions={secondaryActions} isCollapsed={isCollapsed} />

          {/* Footer */}
          <footer
            className={`
            flex-shrink-0 bg-gray-50 border-t border-gray-200 transition-all duration-300
            ${isCollapsed ? "px-4 py-4" : "px-6 py-4"}
          `}
          >
            {!isCollapsed ? (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2L3 7v11h14V7l-7-5z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">VMU Portal</span>
                </div>
                <p className="text-xs text-gray-500">Student Portal v2.0</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11h14V7l-7-5z" />
                  </svg>
                </div>
              </div>
            )}
          </footer>
        </div>
      </aside>
    </div>
  )
}

export default Sidebar
