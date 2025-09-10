// ========================================================================
// FILE: src/layouts/StudentLayout.tsx
// PURPOSE: Minimal wrapper cho Student MFE - để MFE tự quản lý layout
// DESIGN: Clean wrapper pattern - không can thiệp vào MFE internal layout
// FEATURES: MFE autonomy, event listening for future extensions
// ========================================================================

import { type ReactNode, useEffect } from "react"

interface StudentLayoutProps {
  children: ReactNode
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  // Enhanced: Listen for MFE sidebar events and adapt layout accordingly
  useEffect(() => {
    const handleSidebarToggle = (event: Event) => {
      const customEvent = event as CustomEvent<{ isCollapsed: boolean; width: number }>
      console.log("🏛️ Host-shell received sidebar toggle:", customEvent.detail)

      // Apply dynamic margin based on sidebar width for better integration
      const { isCollapsed, width } = customEvent.detail
      document.body.classList.toggle("sidebar-collapsed", isCollapsed)
      
      // Set CSS custom property for potential layout adjustments
      document.documentElement.style.setProperty(
        '--vmu-sidebar-width', 
        `${width || (isCollapsed ? 80 : 320)}px`
      )
    }

    // Listen for enhanced events from Student MFE
    window.addEventListener("vmu:sidebar:toggle", handleSidebarToggle)
    window.addEventListener("sidebar:toggle", handleSidebarToggle) // Backward compatibility

    return () => {
      window.removeEventListener("vmu:sidebar:toggle", handleSidebarToggle)
      window.removeEventListener("sidebar:toggle", handleSidebarToggle)
    }
  }, [])

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Student MFE renders its own complete layout here */}
      {children}
    </div>
  )
}

