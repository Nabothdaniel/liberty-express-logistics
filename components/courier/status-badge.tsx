import { TRACKING_STATUSES } from "../../utils/status-manager"

export default function StatusBadge({ status, showProgress = false, className = "" }) {
  const statusConfig = TRACKING_STATUSES[status.toUpperCase()] || TRACKING_STATUSES.PENDING

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}>
        {statusConfig.label}
      </span>

      {showProgress && (
        <div className="flex items-center space-x-1">
          <div className="w-16 bg-gray-200 rounded-full h-1">
            <div
              className={`h-1 rounded-full ${statusConfig.color}`}
              style={{ width: `${statusConfig.progress}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500">{statusConfig.progress}%</span>
        </div>
      )}
    </div>
  )
}
