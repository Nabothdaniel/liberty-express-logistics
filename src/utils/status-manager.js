// Status definitions for flight bookings
export const TRACKING_STATUSES = {
  BOOKED: {
    key: "booked",
    label: "Booked",
    description: "Flight booking confirmed",
    color: "bg-blue-500",
    textColor: "text-blue-800",
    bgColor: "bg-blue-100",
    progress: 10,
    allowedActions: ["cancel", "edit"],
    nextStatuses: ["check_in", "cancelled"],
  },
  CHECK_IN: {
    key: "check_in",
    label: "Check-in Open",
    description: "Online check-in is available",
    color: "bg-indigo-500",
    textColor: "text-indigo-800",
    bgColor: "bg-indigo-100",
    progress: 30,
    allowedActions: ["check_in", "contact_support"],
    nextStatuses: ["boarding", "cancelled", "delayed"],
  },
  BOARDING: {
    key: "boarding",
    label: "Boarding",
    description: "Passengers are boarding the aircraft",
    color: "bg-yellow-500",
    textColor: "text-yellow-800",
    bgColor: "bg-yellow-100",
    progress: 55,
    allowedActions: ["contact_support"],
    nextStatuses: ["in_flight", "delayed"],
  },
  IN_FLIGHT: {
    key: "in_flight",
    label: "In Flight",
    description: "Aircraft is currently airborne",
    color: "bg-orange-500",
    textColor: "text-orange-800",
    bgColor: "bg-orange-100",
    progress: 75,
    allowedActions: ["track"],
    nextStatuses: ["landed", "delayed"],
  },
  LANDED: {
    key: "landed",
    label: "Landed",
    description: "Aircraft has landed at destination",
    color: "bg-teal-500",
    textColor: "text-teal-800",
    bgColor: "bg-teal-100",
    progress: 90,
    allowedActions: ["track"],
    nextStatuses: ["arrived"],
  },
  ARRIVED: {
    key: "arrived",
    label: "Arrived",
    description: "Passenger has arrived at destination",
    color: "bg-green-500",
    textColor: "text-green-800",
    bgColor: "bg-green-100",
    progress: 100,
    allowedActions: ["rate", "report_issue"],
    nextStatuses: [],
  },
  DELAYED: {
    key: "delayed",
    label: "Delayed",
    description: "Flight has been delayed",
    color: "bg-red-500",
    textColor: "text-red-800",
    bgColor: "bg-red-100",
    progress: 20,
    allowedActions: ["track", "contact_support"],
    nextStatuses: ["boarding", "cancelled"],
  },
  CANCELLED: {
    key: "cancelled",
    label: "Cancelled",
    description: "Flight booking has been cancelled",
    color: "bg-gray-500",
    textColor: "text-gray-800",
    bgColor: "bg-gray-100",
    progress: 0,
    allowedActions: ["reorder", "contact_support"],
    nextStatuses: [],
  },
}

// Status management class
export class StatusManager {
  static getStatus(statusKey) {
    if (!statusKey) return TRACKING_STATUSES.BOOKED
    return (
      TRACKING_STATUSES[statusKey.toUpperCase()] ||
      Object.values(TRACKING_STATUSES).find((s) => s.key === statusKey.toLowerCase()) ||
      TRACKING_STATUSES.BOOKED
    )
  }

  static canTransitionTo(currentStatus, newStatus) {
    const current = this.getStatus(currentStatus)
    return current.nextStatuses.includes(newStatus.toLowerCase())
  }

  static getAvailableActions(statusKey) {
    const status = this.getStatus(statusKey)
    return status.allowedActions
  }

  static getAllStatuses() {
    return Object.values(TRACKING_STATUSES)
  }

  static updateStatus(trackingId, newStatus, reason = "") {
    console.log(`Updating ${trackingId} to ${newStatus}. Reason: ${reason}`)
    return {
      trackingId,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      reason,
    }
  }
}

// Action handlers
export const StatusActions = {
  track: (trackingId) => {
    console.log(`Tracking ${trackingId}`)
  },

  cancel: (trackingId) => {
    return StatusManager.updateStatus(trackingId, "cancelled", "Cancelled by user")
  },

  check_in: (trackingId) => {
    console.log(`Check-in for ${trackingId}`)
  },

  contact_support: (trackingId) => {
    console.log(`Contacting support for ${trackingId}`)
  },

  rate: (trackingId) => {
    console.log(`Rating flight ${trackingId}`)
  },

  report_issue: (trackingId) => {
    console.log(`Reporting issue for ${trackingId}`)
  },

  reorder: (trackingId) => {
    console.log(`Rebooking ${trackingId}`)
  },
}
