export class RealTimeSimulator {
  constructor() {
    this.isRunning = false
    this.intervalId = null
    this.callbacks = []
    this.currentProgress = 0
    this.currentLocation = { lat: -6.2088, lng: 106.8456 } // Start at Jakarta
    this.routePoints = [
      { lat: -6.2088, lng: 106.8456, name: "Jakarta", time: "18:49 PM" },
      { lat: -6.35, lng: 106.92, name: "Bekasi", time: "19:15 PM" },
      { lat: -6.5088, lng: 107.0186, name: "Karawang", time: "19:45 PM" },
      { lat: -6.65, lng: 107.2, name: "Purwakarta", time: "20:30 PM" },
      { lat: -6.8, lng: 107.4, name: "Subang", time: "21:15 PM" },
      { lat: -6.9175, lng: 107.6191, name: "Bandung", time: "22:12 PM" },
    ]
    this.currentPointIndex = 0
    this.statusProgression = [
      { status: "processing", progress: 0, message: "Package being processed" },
      { status: "in_transit", progress: 20, message: "Package picked up from Jakarta" },
      { status: "in_transit", progress: 40, message: "Package in transit - Bekasi" },
      { status: "in_transit", progress: 60, message: "Package in transit - Karawang" },
      { status: "in_transit", progress: 80, message: "Package in transit - Purwakarta" },
      { status: "out_for_delivery", progress: 95, message: "Out for delivery in Bandung" },
      { status: "delivered", progress: 100, message: "Package delivered successfully" },
    ]
    this.currentStatusIndex = 0
  }

  // Add callback for updates
  onUpdate(callback) {
    this.callbacks.push(callback)
  }

  // Remove callback
  removeCallback(callback) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback)
  }

  // Notify all callbacks
  notifyCallbacks(data) {
    this.callbacks.forEach((callback) => callback(data))
  }

  // Start simulation
  start() {
    if (this.isRunning) return

    this.isRunning = true
    this.intervalId = setInterval(() => {
      this.updateProgress()
    }, 3000) // Update every 3 seconds for demo (adjust as needed)

    console.log("Real-time simulation started")
  }

  // Stop simulation
  stop() {
    if (!this.isRunning) return

    this.isRunning = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }

    console.log("Real-time simulation stopped")
  }

  // Update progress and location
  updateProgress() {
    if (this.currentStatusIndex >= this.statusProgression.length - 1) {
      this.stop()
      return
    }

    // Move to next status
    this.currentStatusIndex++
    const currentStatus = this.statusProgression[this.currentStatusIndex]

    // Update location along route
    if (this.currentPointIndex < this.routePoints.length - 1) {
      this.currentPointIndex++
      this.currentLocation = {
        lat: this.routePoints[this.currentPointIndex].lat,
        lng: this.routePoints[this.currentPointIndex].lng,
      }
    }

    // Create timeline event
    const newEvent = {
      time: this.routePoints[this.currentPointIndex]?.time || new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      status: currentStatus.message,
      location: this.routePoints[this.currentPointIndex]?.name || "Unknown",
      completed: true,
    }

    // Notify all listeners
    this.notifyCallbacks({
      status: currentStatus.status,
      progress: currentStatus.progress,
      location: this.currentLocation,
      newEvent: newEvent,
      currentPoint: this.routePoints[this.currentPointIndex],
      estimatedDelivery: this.calculateEstimatedDelivery(),
    })
  }

  // Calculate estimated delivery time
  calculateEstimatedDelivery() {
    const remainingPoints = this.routePoints.length - this.currentPointIndex - 1
    const estimatedMinutes = remainingPoints * 30 // 30 minutes per checkpoint

    if (estimatedMinutes <= 0) return "Delivered"

    const hours = Math.floor(estimatedMinutes / 60)
    const minutes = estimatedMinutes % 60

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes !== 1 ? "s" : ""}`
    }
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`
  }

  // Get current simulation state
  getCurrentState() {
    return {
      isRunning: this.isRunning,
      progress: this.statusProgression[this.currentStatusIndex]?.progress || 0,
      status: this.statusProgression[this.currentStatusIndex]?.status || "pending",
      location: this.currentLocation,
      currentPoint: this.routePoints[this.currentPointIndex],
      estimatedDelivery: this.calculateEstimatedDelivery(),
    }
  }

  // Reset simulation
  reset() {
    this.stop()
    this.currentProgress = 0
    this.currentStatusIndex = 0
    this.currentPointIndex = 0
    this.currentLocation = { lat: -6.2088, lng: 106.8456 }
  }
}

// Create singleton instance
export const simulator = new RealTimeSimulator()
