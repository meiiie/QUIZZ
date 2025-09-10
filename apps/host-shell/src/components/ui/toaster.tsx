// ========================================================================
// FILE: src/components/ui/toaster.tsx
// PURPOSE: Toast provider for displaying notifications
// DESIGN: Mobile-optimized toast positioning and animations
// ========================================================================

import { useToast } from "../../hooks/use-toast"
import { useIsMobile } from "../../hooks/use-mobile"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "./toast"

export function Toaster() {
  const { toasts } = useToast()
  const isMobile = useIsMobile()

  return (
    <div className={`fixed z-[100] flex flex-col-reverse p-4 ${
      isMobile 
        ? 'top-0 left-0 right-0 max-w-full' 
        : 'top-0 right-0 max-w-[420px]'
    }`}>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
    </div>
  )
}
