/**
 * Professional Secondary Actions & Footer
 *
 * Enhanced with:
 * - Better visual separation
 * - Professional styling
 * - Improved spacing and layout
 */

import type { FC } from "react"
import type { SecondaryAction } from "../model/useSidebar"
import { getMaritimeIcon } from "./icons"

interface SecondaryActionsProps {
  secondaryActions: SecondaryAction[]
  isCollapsed: boolean
}

export const SecondaryActions: FC<SecondaryActionsProps> = ({ secondaryActions, isCollapsed }) => {
  return (
    <div
      className={`flex-shrink-0 bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 transition-all duration-300 ${
        isCollapsed ? "px-2 py-3" : "px-4 py-4"
      }`}
    >
      {/* Secondary Actions */}
      <div className={`space-y-1 ${isCollapsed ? "space-y-2" : ""}`}>
        {secondaryActions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            title={isCollapsed ? action.label : undefined}
            className={`
              group relative w-full flex items-center text-left transition-all duration-300 
              hover:scale-[1.01] active:scale-[0.99] rounded-lg
              ${isCollapsed ? "justify-center px-2 py-2 h-10" : "gap-3 px-3 py-2 h-11"}
              text-gray-600 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 
              hover:text-[#1e40af] hover:shadow-sm border border-transparent 
              hover:border-[#FFC107]/30 hover:ring-1 hover:ring-[#FFC107]/20
            `.trim()}
          >
            {/* Golden Corner Triangle for Active/Hover Effect */}
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px] border-t-[#FFC107] opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-tr-lg"></div>

            {/* Icon */}
            <div
              className={`
              flex items-center justify-center rounded-lg transition-all duration-300 flex-shrink-0
              ${isCollapsed ? "w-7 h-7" : "w-8 h-8"}
              bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-[#FFC107] group-hover:to-amber-400 
              group-hover:text-white group-hover:shadow-md group-hover:scale-105
            `}
            >
              {getMaritimeIcon(action.iconKey)}
            </div>

            {/* Label */}
            {!isCollapsed && (
              <span className="font-medium text-sm truncate group-hover:text-[#1e40af] transition-colors duration-300">
                {action.label}
              </span>
            )}

            {/* Golden Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFC107]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full transform rounded-lg pointer-events-none"></div>

            {/* Tooltip for collapsed mode */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                {action.label}
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-1.5 h-1.5 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
