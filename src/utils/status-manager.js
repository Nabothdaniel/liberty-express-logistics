// Status definitions and configurations
export const TRACKING_STATUSES = {
  PENDING: {
    key: "pending",
    label: "Pending",
    description: "Package is waiting to be processed",
    color: "bg-gray-500",
    textColor: "text-gray-800",
    bgColor: "bg-gray-100",
    progress: 0,
    allowedActions: ["cancel", "edit"],
    nextStatuses: ["processing"],
  },
  PROCESSING: {
    key: "processing",
    label: "Processing",
    description: "Package is being prepared for shipment",
    color: "bg-blue-500",
    textColor: "text-blue-800",
    bgColor: "bg-blue-100",
    progress: 15,
    allowedActions: ["track"],
    nextStatuses: ["in_transit"],
  },
  IN_TRANSIT: {
    key: "in_transit",
    label: "In transit",
    description: "Package is on the way to destination",
    color: "bg-orange-500",
    textColor: "text-orange-800",
    bgColor: "bg-orange-100",
    progress: 50,
    allowedActions: ["track", "contact_courier"],
    nextStatuses: ["out_for_delivery", "delayed"],
  },
  OUT_FOR_DELIVERY: {
    key: "out_for_delivery",
    label: "Out for delivery",
    description: "Package is out for final delivery",
    color: "bg-yellow-500",
    textColor: "text-yellow-800",
    bgColor: "bg-yellow-100",
    progress: 85,
    allowedActions: ["track", "contact_courier", "reschedule"],
    nextStatuses: ["delivered", "failed_delivery"],
  },
  DELIVERED: {
    key: "delivered",
    label: "Delivered",
    description: "Package has been successfully delivered",
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
    description: "Package delivery has been delayed",
    color: "bg-red-500",
    textColor: "text-red-800",
    bgColor: "bg-red-100",
    progress: 30,
    allowedActions: ["track", "contact_support"],
    nextStatuses: ["in_transit", "cancelled"],
  },
  FAILED_DELIVERY: {
    key: "failed_delivery",
    label: "Failed delivery",
    description: "Delivery attempt was unsuccessful",
    color: "bg-red-500",
    textColor: "text-red-800",
    bgColor: "bg-red-100",
    progress: 90,
    allowedActions: ["reschedule", "contact_courier", "return_to_sender"],
    nextStatuses: ["out_for_delivery", "returned"],
  },
  CANCELLED: {
    key: "cancelled",
    label: "Cancelled",
    description: "Package shipment has been cancelled",
    color: "bg-gray-500",
    textColor: "text-gray-800",
    bgColor: "bg-gray-100",
    progress: 0,
    allowedActions: ["reorder"],
    nextStatuses: [],
  },
  RETURNED: {
    key: "returned",
    label: "Returned",
    description: "Package has been returned to sender",
    color: "bg-purple-500",
    textColor: "text-purple-800",
    bgColor: "bg-purple-100",
    progress: 100,
    allowedActions: ["reorder", "contact_support"],
    nextStatuses: [],
  },
}

// Status management functions
export class StatusManager {
  static getStatus(statusKey) {
    return TRACKING_STATUSES[statusKey.toUpperCase()] || TRACKING_STATUSES.PENDING
  }

  static canTransitionTo(currentStatus, newStatus) {
    const current = this.getStatus(currentStatus)
    return current.nextStatuses.includes(newStatus.toLowerCase())
  }

  static getAvailableActions(statusKey) {
    const status = this.getStatus(statusKey)
    return status.allowedActions
  }

  static updateStatus(trackingId, newStatus, reason = "") {
    // This would typically make an API call to update the status
    console.log(`Updating ${trackingId} to ${newStatus}. Reason: ${reason}`)

    // Return updated tracking data
    return {
      trackingId,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      reason,
    }
  }

  static getStatusHistory(trackingId) {
    // This would typically fetch from an API
    // For now, return mock data
    return [
      {
        status: "pending",
        timestamp: "2025-02-19T10:00:00Z",
        location: "Jakarta, Indonesia",
        description: "Package received and pending processing",
      },
      {
        status: "processing",
        timestamp: "2025-02-19T12:00:00Z",
        location: "Jakarta, Indonesia",
        description: "Package is being prepared for shipment",
      },
      {
        status: "in_transit",
        timestamp: "2025-02-19T18:49:00Z",
        location: "Jakarta, Indonesia",
        description: "Package has left the origin facility",
      },
    ]
  }

  static getEstimatedDelivery(statusKey, distance = 0) {
    const status = this.getStatus(statusKey)

    // Calculate estimated delivery based on status and distance
    const baseHours = {
      pending: 24,
      processing: 12,
      in_transit: Math.max(2, distance / 50), // Rough calculation
      out_for_delivery: 4,
      delivered: 0,
      delayed: 48,
      failed_delivery: 24,
    }

    const hours = baseHours[status.key] || 24
    const deliveryDate = new Date()
    deliveryDate.setHours(deliveryDate.getHours() + hours)

    return deliveryDate
  }
}

// Action handlers
export const StatusActions = {
  track: (trackingId) => {
    console.log(`Tracking ${trackingId}`)
    // Navigate to detailed tracking view
  },

  cancel: (trackingId) => {
    if (confirm("Are you sure you want to cancel this shipment?")) {
      return StatusManager.updateStatus(trackingId, "cancelled", "Cancelled by user")
    }
  },

  reschedule: (trackingId) => {
    console.log(`Rescheduling delivery for ${trackingId}`)
    // Open reschedule modal
  },

  contact_courier: (trackingId) => {
    console.log(`Contacting courier for ${trackingId}`)
    // Open chat or call courier
  },

  contact_support: (trackingId) => {
    console.log(`Contacting support for ${trackingId}`)
    // Open support chat
  },

  rate: (trackingId) => {
    console.log(`Rating delivery for ${trackingId}`)
    // Open rating modal
  },

  report_issue: (trackingId) => {
    console.log(`Reporting issue for ${trackingId}`)
    // Open issue reporting form
  },

  reorder: (trackingId) => {
    console.log(`Reordering ${trackingId}`)
    // Navigate to reorder flow
  },
}
