/**
 * Clean Navigation List - Matching Teacher MFE Style
 *
 * Features:
 * - Clean, simple navigation items
 * - Professional hover states and active indicators
 * - Smooth animations and transitions
 * - Consistent with Teacher MFE design
 */

import type { FC } from "react"
import type { StudentView } from "../../../shared/lib/viewManager"
import type { NavItem } from "../model/useSidebar"
import styles from "../../../styles/student-mfe.module.css"

interface NavListProps {
  navItems: NavItem[]
  currentView: StudentView
  onViewChange: (view: StudentView) => void
  isCollapsed: boolean
}

export const NavList: FC<NavListProps> = ({ navItems, currentView, onViewChange, isCollapsed }) => {
  const getIcon = (iconKey: string) => {
    const iconMap: Record<string, string> = {
      home: "🏠",
      book: "📚",
      chart: "📊",
      user: "👤",
      anchor: "⚓",
      list: "📋",
      history: "📜"
    }
    return iconMap[iconKey] || "📄"
  }

  return (
    <nav className={styles.studentMfeNav}>
      {navItems.map((item) => {
        const isActive = currentView === item.id

        return (
          <div
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`${styles.studentMfeNavItem} ${isActive ? styles.active : ''}`}
            title={!isCollapsed ? item.description : item.label}
          >
            <span className={styles.studentMfeNavItemIcon}>{getIcon(item.iconKey)}</span>
            {!isCollapsed && (
              <span className={styles.studentMfeNavItemText}>{item.label}</span>
            )}
            {!isCollapsed && item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}
