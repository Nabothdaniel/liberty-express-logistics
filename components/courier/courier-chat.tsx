"use client"

import { useState, useRef, useEffect } from "react"
import { Send, X, Phone, MoreVertical, Paperclip } from "lucide-react"

export default function CourierChat({ courier, isOpen, onClose }) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "courier",
      text: "Hello! I'm on my way to deliver your package. ETA is about 2 hours.",
      timestamp: "14:30",
      delivered: true,
    },
    {
      id: 2,
      sender: "user",
      text: "Great! Will you call when you arrive?",
      timestamp: "14:32",
      delivered: true,
    },
    {
      id: 3,
      sender: "courier",
      text: "Yes, I'll call you 10 minutes before arrival. The package is secure and in good condition.",
      timestamp: "14:33",
      delivered: true,
    },
  ])

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user",
        text: message,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        delivered: false,
      }
      setMessages([...messages, newMessage])
      setMessage("")

      // Simulate courier response after 2 seconds
      setTimeout(() => {
        const responses = [
          "Got it! Thanks for letting me know.",
          "I'll keep you updated on my progress.",
          "No problem! I'll be there soon.",
          "Thanks for your patience!",
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        setMessages((prev) => [
          ...prev.map((msg) => (msg.id === newMessage.id ? { ...msg, delivered: true } : msg)),
          {
            id: prev.length + 1,
            sender: "courier",
            text: randomResponse,
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            delivered: true,
          },
        ])
      }, 2000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center sm:items-center sm:p-4">
      <div className="fixed inset-0 bg-black/20 bg-opacity-50" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-lg sm:rounded-lg shadow-xl flex flex-col h-96 sm:h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">
                {courier.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{courier.name}</h3>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  msg.sender === "user" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <div
                  className={`flex items-center justify-between mt-1 ${
                    msg.sender === "user" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  <span className="text-xs">{msg.timestamp}</span>
                  {msg.sender === "user" && <span className="text-xs ml-2">{msg.delivered ? "✓✓" : "✓"}</span>}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
