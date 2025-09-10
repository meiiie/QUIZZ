/**
 * View Manager - Student MFE
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

export type StudentView = "dashboard" | "quizzes" | "history" | "profile" | "take-quiz"

interface ViewContextType {
  currentView: StudentView
  setView: (view: StudentView, params?: Record<string, any>) => void
  viewParams: Record<string, any>
}

const ViewContext = createContext<ViewContextType | null>(null)

interface ViewProviderProps {
  children: ReactNode
  initialView?: StudentView
}

export const ViewProvider: FC<ViewProviderProps> = ({ children, initialView = "dashboard" }) => {
  const [currentView, setCurrentView] = useState<StudentView>(initialView)
  const [viewParams, setViewParams] = useState<Record<string, any>>({})

  const setView = (view: StudentView, params: Record<string, any> = {}) => {
    setCurrentView(view)
    setViewParams(params)

    // Thông báo cho Host-Shell về view change (optional)
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "STUDENT_MFE_VIEW_CHANGE",
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
  if (!context) {
    throw new Error("useView must be used within ViewProvider")
  }
  return context
}
