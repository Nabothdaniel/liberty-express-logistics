"use client"
import { Phone, MapPin, MessageCircle, Star, Clock, Package } from "lucide-react"

export default function CourierInfo({ courier, onChatOpen }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-medium text-gray-900 mb-4">Courier Information</h3>

      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {courier.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">{courier.name}</h4>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{courier.rating}</span>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-2 mb-1">
              <Package className="w-3 h-3" />
              <span>{courier.deliveries} deliveries completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3" />
              <span>{courier.experience} years experience</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onChatOpen}
              className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </button>
            <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors">
              <MapPin className="w-4 h-4 mr-2" />
              Track
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
