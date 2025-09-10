/**
 * View Manager - Admin MFE
 *
 * Triết lý MFE: Không dùng React Router vì Host-Shell lo routing chính
 * MFE chỉ cần quản lý các view nội bộ đơn giản
 *
 * Best Practice:
 * - Dùng state đơn giản để switch view
 * - Giao tiếp với Host-Shell qua PostMessage
 * - Mỗi view là một component độc lập
 */

import { createContext, useContext, useState, type FC, type ReactNode } from "react"

export type AdminView = "dashboard" | "user-management" | "quiz-management" | "system-reports"

interface ViewContextType {
  currentView: AdminView
  setView: (view: AdminView, params?: Record<string, any>) => void
  viewParams: Record<string, any>
}

const ViewContext = createContext<ViewContextType | undefined>(undefined)

interface ViewProviderProps {
  children: ReactNode
  initialView?: AdminView
}

export const ViewProvider: FC<ViewProviderProps> = ({ children, initialView = "dashboard" }) => {
  const [currentView, setCurrentView] = useState<AdminView>(initialView)
  const [viewParams, setViewParams] = useState<Record<string, any>>({})

  const setView = (view: AdminView, params: Record<string, any> = {}) => {
    setCurrentView(view)
    setViewParams(params)

    // Thông báo cho Host-Shell về view change (optional)
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "ADMIN_MFE_VIEW_CHANGE",
          payload: { view, params },
        },
        "*",
      )
    }
  }

  return <ViewContext.Provider value={{ currentView, setView, viewParams }}>{children}</ViewContext.Provider>
}

export const useView = () => {
  const context = useContext(ViewContext)
  if (context === undefined) {
    throw new Error("useView must be used within a ViewProvider")
  }
  return context
}
