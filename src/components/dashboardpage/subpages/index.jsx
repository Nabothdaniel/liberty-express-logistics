"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Filter, Bell, MapPin, Package, Phone, Copy, Home, Play, Pause, RotateCcw } from "lucide-react"
import CourierInfo from "./courier-info"
import CourierChat from "./courier-chat"
import { StatusManager } from "../utils/status-manager"
import StatusBadge from "./status-badge"
import StatusActions from "./status-actions"
import { simulator } from "../utils/real-time-simulator"

export default function TrackingDashboard() {
  const [selectedTracking, setSelectedTracking] = useState("#C024")
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(75)
  const [currentStatus, setCurrentStatus] = useState("in_transit")
  const [courierLocation, setCourierLocation] = useState({ lat: -6.5632, lng: 107.2317 })
  const [estimatedDelivery, setEstimatedDelivery] = useState("2 hours 22 minutes")
  const [timelineEvents, setTimelineEvents] = useState([
    {
      time: "18:49 PM",
      date: "February 19, 2025",
      status: "Package being checked",
      location: "Jakarta, Indonesia",
      completed: true,
    },
    {
      time: "19:15 PM",
      date: "February 19, 2025",
      status: "Package in transit",
      location: "Bekasi, Indonesia",
      completed: true,
    },
    {
      time: "20:30 PM",
      date: "February 19, 2025",
      status: "Package in transit",
      location: "Purwakarta, Indonesia",
      completed: true,
    },
    {
      time: "22:12 PM",
      date: "February 19, 2025",
      status: "Package arrive at final destination",
      location: "Bandung, Indonesia",
      completed: false,
    },
  ])

  const mapContainer = useRef(null)
  const map = useRef(null)
  const courierMarker = useRef(null)

  const courierData = {
    name: "Joko Wiroso",
    rating: 4.8,
    deliveries: 1247,
    experience: 5,
    phone: "+62 812-3456-7890",
  }

  useEffect(() => {
    const handleSimulationUpdate = (data) => {
      setCurrentStatus(data.status)
      setCurrentProgress(data.progress)
      setCourierLocation(data.location)
      setEstimatedDelivery(data.estimatedDelivery)

      if (data.newEvent) {
        setTimelineEvents((prev) => {
          const newEvents = [...prev]
          newEvents.forEach((event) => (event.completed = true))
          newEvents.push({ ...data.newEvent, completed: false })
          return newEvents
        })
      }

      if (courierMarker.current && map.current) {
        courierMarker.current.setLatLng([data.location.lat, data.location.lng])
        map.current.setView([data.location.lat, data.location.lng], 11)
      }
    }

    simulator.onUpdate(handleSimulationUpdate)

    return () => {
      simulator.removeCallback(handleSimulationUpdate)
    }
  }, [])

  useEffect(() => {
    if (map.current) return

    const loadLeaflet = async () => {
      const link = document.createElement("link")
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.rel = "stylesheet"
      document.head.appendChild(link)

      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"

      script.onload = () => {
        if (window.L && mapContainer.current) {
          map.current = window.L.map(mapContainer.current).setView([courierLocation.lat, courierLocation.lng], 10)

          window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(map.current)

          const originIcon = window.L.divIcon({
            html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            className: "custom-marker",
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })

          const destinationIcon = window.L.divIcon({
            html: '<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            className: "custom-marker",
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })

          const courierIcon = window.L.divIcon({
            html: '<div style="background-color: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); animation: pulse 2s infinite;"><div style="background-color: white; width: 8px; height: 8px; border-radius: 50%; margin: 5px auto;"></div></div>',
            className: "courier-marker",
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })

          window.L.marker([-6.2088, 106.8456], { icon: originIcon })
            .addTo(map.current)
            .bindPopup("<b>Jakarta</b><br>Origin")

          window.L.marker([-6.9175, 107.6191], { icon: destinationIcon })
            .addTo(map.current)
            .bindPopup("<b>Bandung</b><br>Destination")

          courierMarker.current = window.L.marker([courierLocation.lat, courierLocation.lng], { icon: courierIcon })
            .addTo(map.current)
            .bindPopup("<b>Courier Location</b><br>Joko Wiroso")

          const routeCoordinates = [
            [-6.2088, 106.8456],
            [-6.35, 106.92],
            [-6.5088, 107.0186],
            [-6.65, 107.2],
            [-6.8, 107.4],
            [-6.9175, 107.6191],
          ]

          window.L.polyline(routeCoordinates, {
            color: "#3b82f6",
            weight: 4,
            opacity: 0.8,
          }).addTo(map.current)

          const group = new window.L.featureGroup([
            window.L.marker([-6.2088, 106.8456]),
            window.L.marker([-6.9175, 107.6191]),
          ])
          map.current.fitBounds(group.getBounds().pad(0.1))

          const style = document.createElement("style")
          style.textContent = `
            @keyframes pulse {
              0% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.1); opacity: 0.8; }
              100% { transform: scale(1); opacity: 1; }
            }
          `
          document.head.appendChild(style)
        }
      }

      document.head.appendChild(script)
    }

    loadLeaflet()
  }, [courierLocation])

  const startSimulation = () => {
    simulator.start()
    setSimulationRunning(true)
  }

  const stopSimulation = () => {
    simulator.stop()
    setSimulationRunning(false)
  }

  const resetSimulation = () => {
    simulator.reset()
    setSimulationRunning(false)
    setCurrentProgress(75)
    setCurrentStatus("in_transit")
    setCourierLocation({ lat: -6.5632, lng: 107.2317 })
    setEstimatedDelivery("2 hours 22 minutes")
    setTimelineEvents([
      {
        time: "18:49 PM",
        date: "February 19, 2025",
        status: "Package being checked",
        location: "Jakarta, Indonesia",
        completed: true,
      },
      {
        time: "19:15 PM",
        date: "February 19, 2025",
        status: "Package in transit",
        location: "Bekasi, Indonesia",
        completed: true,
      },
      {
        time: "20:30 PM",
        date: "February 19, 2025",
        status: "Package in transit",
        location: "Purwakarta, Indonesia",
        completed: true,
      },
      {
        time: "22:12 PM",
        date: "February 19, 2025",
        status: "Package arrive at final destination",
        location: "Bandung, Indonesia",
        completed: false,
      },
    ])
  }

  const trackingItems = [
    {
      id: "#C023",
      status: "delivered",
      date: "25 February 2025",
      time: "18:00 PM",
      items: 2,
      location: "Bandung, Indonesia",
    },
    {
      id: "#C024",
      status: currentStatus,
      date: "25 February 2025",
      time: "18:00 PM",
      items: 2,
      location: "En route to Bandung",
    },
    {
      id: "#C025",
      status: "pending",
      date: "",
      time: "",
      items: 1,
      location: "Jakarta, Indonesia",
    },
    {
      id: "#C026",
      status: "processing",
      date: "",
      time: "",
      items: 3,
      location: "Jakarta, Indonesia",
    },
    {
      id: "#C027",
      status: "delivered",
      date: "24 February 2025",
      time: "16:30 PM",
      items: 1,
      location: "Surabaya, Indonesia",
    },
  ]

  const handleStatusUpdate = (updatedTracking) => {
    console.log("Status updated:", updatedTracking)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Flows</span>
            </div>

            <nav className="flex items-center space-x-6">
              <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
              <button className="flex items-center px-3 py-2 text-gray-900 bg-gray-100 rounded-md">
                <MapPin className="w-4 h-4 mr-2" />
                Tracking
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="flex items-center space-x-2 mr-4">
              <button
                onClick={simulationRunning ? stopSimulation : startSimulation}
                className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                  simulationRunning
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {simulationRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                {simulationRunning ? "Stop" : "Start"} Simulation
              </button>
              <button
                onClick={resetSimulation}
                className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </button>
            </div>

            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">U</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        <div className="hidden lg:block lg:w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Tracking</h1>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tracking ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              />
              <button className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                <Filter className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {trackingItems.map((item) => {
                const statusConfig = StatusManager.getStatus(item.status)

                return (
                  <div
                    key={item.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                      selectedTracking === item.id ? "ring-2 ring-gray-800 border-gray-800" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedTracking(item.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${statusConfig.color}`}></div>
                        <span className="font-medium text-gray-900">{item.id}</span>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    <div className="text-xs text-gray-600 mb-2">{statusConfig.description}</div>
                    <div className="text-xs text-gray-500">{item.location}</div>

                    {item.date && (
                      <>
                        <div className="text-sm text-gray-600 mb-1 mt-2">Package arrived on: {item.date}</div>
                        <div className="text-sm text-gray-600 mb-2">Time: {item.time}</div>
                        <div className="text-sm text-gray-600">Total item: {item.items} items</div>
                      </>
                    )}

                    <div className="mt-3">
                      <StatusActions trackingId={item.id} status={item.status} onStatusUpdate={handleStatusUpdate} />
                    </div>
                  </div>
                )
              })}
            </div>

            {selectedTracking === "#C024" && (
              <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Package Timeline</h3>
                <div className="space-y-4">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full mt-1 ${event.completed ? "bg-blue-500" : "bg-gray-300"}`}
                      ></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{event.status}</div>
                        <div className="text-xs text-gray-500">
                          {event.date} • {event.time}
                        </div>
                        <div className="text-xs text-gray-500">{event.location}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">JW</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Joko Wiroso</div>
                        <div className="text-xs text-gray-500">Courier</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                        <MapPin className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="lg:hidden bg-white border-b border-gray-200 p-4">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 mb-4">Tracking</h1>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tracking ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
                <button className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-3 overflow-x-auto pb-2">
              {trackingItems.map((item) => {
                const statusConfig = StatusManager.getStatus(item.status)

                return (
                  <div
                    key={item.id}
                    className={`flex-shrink-0 w-64 p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                      selectedTracking === item.id ? "ring-2 ring-gray-800 border-gray-800" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedTracking(item.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${statusConfig.color}`}></div>
                        <span className="font-medium text-gray-900">{item.id}</span>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    <div className="text-xs text-gray-600 mb-1">{statusConfig.description}</div>

                    {item.date && (
                      <>
                        <div className="text-sm text-gray-600 mb-1">Package arrived on: {item.date}</div>
                        <div className="text-sm text-gray-600">Time: {item.time}</div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex-1">
            <div ref={mapContainer} className="w-full h-64 lg:h-96" />
          </div>

          <div className="bg-white border-t border-gray-200 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">Live shipment tracking</span>
                </div>
                <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Tracking ID:</div>
                  <div className="font-medium text-blue-600">#C024</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Shipping Status:</div>
                  <StatusBadge status={currentStatus} showProgress={true} />
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Distance:</div>
                  <div className="font-medium">153 km</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Est. delivery time:</div>
                  <div className="font-medium">{estimatedDelivery}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">From:</div>
                  <div className="font-medium">Jakarta, Indonesia</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">To:</div>
                  <div className="font-medium">Bandung, Indonesia</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total weight:</div>
                  <div className="font-medium">29.86 kg</div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Package shipped</span>
                  <span className="text-sm text-gray-600">Est. package arrival</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">February 19, 2025 • 18:49 PM</span>
                  <span className="text-sm font-medium">February 19, 2025 • 22:12 PM</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${currentProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="lg:hidden mt-6">
                {selectedTracking === "#C024" && (
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Package Timeline</h3>
                    <div className="space-y-4">
                      {timelineEvents.map((event, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full mt-1 ${event.completed ? "bg-blue-500" : "bg-gray-300"}`}
                          ></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{event.status}</div>
                            <div className="text-xs text-gray-500">
                              {event.date} • {event.time}
                            </div>
                            <div className="text-xs text-gray-500">{event.location}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <CourierInfo courier={courierData} onChatOpen={() => setChatOpen(true)} />
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Available Actions:</h3>
                <StatusActions trackingId="#C024" status={currentStatus} onStatusUpdate={handleStatusUpdate} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CourierChat courier={courierData} isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}
