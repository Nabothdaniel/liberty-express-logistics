"use client"

import { StatusManager } from "../../utils/status-manager"
import { Phone, MessageCircle, Calendar, Star, AlertTriangle, RotateCcw, X } from "lucide-react"

export default function StatusActionsComponent({ trackingId, status, onStatusUpdate }) {
  const availableActions = StatusManager.getAvailableActions(status)

  const actionConfig = {
    track: { icon: MessageCircle, label: "Track", color: "text-blue-600 hover:bg-blue-50" },
    cancel: { icon: X, label: "Cancel", color: "text-red-600 hover:bg-red-50" },
    reschedule: { icon: Calendar, label: "Reschedule", color: "text-orange-600 hover:bg-orange-50" },
    contact_courier: { icon: Phone, label: "Call Courier", color: "text-green-600 hover:bg-green-50" },
    contact_support: { icon: MessageCircle, label: "Support", color: "text-purple-600 hover:bg-purple-50" },
    rate: { icon: Star, label: "Rate", color: "text-yellow-600 hover:bg-yellow-50" },
    report_issue: { icon: AlertTriangle, label: "Report Issue", color: "text-red-600 hover:bg-red-50" },
    reorder: { icon: RotateCcw, label: "Reorder", color: "text-blue-600 hover:bg-blue-50" },
  }

  const handleAction = (actionKey) => {
    const result = window.StatusActions[actionKey](trackingId)
    if (result && onStatusUpdate) {
      onStatusUpdate(result)
    }
  }

  if (availableActions.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {availableActions.map((actionKey) => {
        const config = actionConfig[actionKey]
        if (!config) return null

        const Icon = config.icon

        return (
          <button
            key={actionKey}
            onClick={() => handleAction(actionKey)}
            className={`flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-md transition-colors ${config.color}`}
          >
            <Icon className="w-4 h-4" />
            <span>{config.label}</span>
          </button>
        )
      })}
    </div>
  )
}
