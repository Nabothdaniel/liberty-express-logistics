"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Filter, MapPin,  Phone, } from "lucide-react"

import CourierChat from "../components/courier/courier-chat"
import MainContent from "../components/Tracking/MainContent"
import Header from "../components/Tracking/Header"

export default function TrackingDashboard() {
  const [selectedTracking, setSelectedTracking] = useState("#C024")
  const [searchQuery, setSearchQuery] = useState("")


  const [chatOpen, setChatOpen] = useState(false)
  const mapContainer = useRef(null)
  const map = useRef(null)

  const courierData = {
    name: "Joko Wiroso",
    rating: 4.8,
    deliveries: 1247,
    experience: 5,
    phone: "+62 812-3456-7890",
  }

  useEffect(() => {
    if (map.current) return // Initialize map only once

    const loadLeaflet = async () => {
      // Load Leaflet CSS
      const link = document.createElement("link")
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.rel = "stylesheet"
      document.head.appendChild(link)

      // Load Leaflet JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"

      script.onload = () => {
        if (window.L && mapContainer.current) {
          map.current = window.L.map(mapContainer.current).setView([-6.5632, 107.2317], 10)

          // Add OpenStreetMap tile layer (completely free)
          window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(map.current)

          // Custom marker icons
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

          // Add markers for Jakarta and Bandung
          window.L.marker([-6.2088, 106.8456], { icon: originIcon })
            .addTo(map.current)
            .bindPopup("<b>Jakarta</b><br>Origin")

          window.L.marker([-6.9175, 107.6191], { icon: destinationIcon })
            .addTo(map.current)
            .bindPopup("<b>Bandung</b><br>Destination")

          // Add route line
          const routeCoordinates = [
            [-6.2088, 106.8456], // Jakarta
            [-6.5088, 107.0186], // Intermediate point
            [-6.9175, 107.6191], // Bandung
          ]

          window.L.polyline(routeCoordinates, {
            color: "#3b82f6",
            weight: 4,
            opacity: 0.8,
          }).addTo(map.current)

          // Fit map to show the route
          const group = new window.L.featureGroup([
            window.L.marker([-6.2088, 106.8456]),
            window.L.marker([-6.9175, 107.6191]),
          ])
          map.current.fitBounds(group.getBounds().pad(0.1))
        }
      }

      document.head.appendChild(script)
    }

    loadLeaflet()
  }, [])

  const trackingItems = [
    { id: "#C023", status: "Delivered", color: "bg-green-500", date: "25 February 2025", time: "18:00 PM", items: 2 },
    { id: "#C024", status: "In transit", color: "bg-orange-500", date: "25 February 2025", time: "18:00 PM", items: 2 },
    { id: "#C025", status: "Pending", color: "bg-red-500", date: "", time: "", items: 0 },
    { id: "#C026", status: "In transit", color: "bg-orange-500", date: "", time: "", items: 0 },
    { id: "#C027", status: "Delivered", color: "bg-green-500", date: "", time: "", items: 0 },
  ]

  const timelineEvents = [
    {
      time: "18:49 PM",
      date: "February 19, 2025",
      status: "Package being checked",
      location: "Jakarta, Indonesia",
      completed: true,
    },
    {
      time: "18:45 PM",
      date: "February 19, 2025",
      status: "Package in transit",
      location: "Bekasi, Indonesia",
      completed: true,
    },
    {
      time: "21:29 PM",
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
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="flex flex-col lg:flex-row">
        <div className="hidden lg:block lg:w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Tracking</h1>
            </div>

            {/* Search */}
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

            {/* Tracking Items */}
            <div className="space-y-3">
              {trackingItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${selectedTracking === item.id ? "ring-2 ring-gray-300 border-gray-300" : "border-gray-200"
                    }`}
                  onClick={() => setSelectedTracking(item.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="font-medium text-gray-900">{item.id}</span>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${item.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : item.status === "In transit"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  {item.date && (
                    <>
                      <div className="text-sm text-gray-600 mb-1">Package arrived on: {item.date}</div>
                      <div className="text-sm text-gray-600 mb-2">Time: {item.time}</div>
                      <div className="text-sm text-gray-600">Total item: {item.items} items</div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Selected Item Details */}
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

                {/* Courier Info */}
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

        {/* Main Content Area */}
        <MainContent setSearchQuery={setSearchQuery} selectedTracking={selectedTracking} setSelectedTracking={setSelectedTracking} trackingItems={trackingItems} searchQuery={searchQuery} timelineEvents={timelineEvents} mapContainer={mapContainer} courierData={courierData} setChatOpen={setChatOpen} />
      </div>

      {/* Chat Component */}
      <CourierChat courier={courierData} isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}
