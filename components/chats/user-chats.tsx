import { useState, useRef, useEffect } from "react"
import { Send, X, MoreVertical, Paperclip } from "lucide-react"
import wallpaper from '../../assets/images/chats/chats-wallpaper.png'

export default function UserDashboard() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    { id: 1, sender: "admin", text: "Welcome! How can we assist you today?", timestamp: "14:30", delivered: true },
    { id: 2, sender: "user", text: "I want to track my shipment.", timestamp: "14:32", delivered: true }
  ])

  const user = { name: "John Doe" }
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
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        delivered: true
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100 ">
      {/* Chat Widget */}
      <div 
        className="w-full h-full sm:w-[500px] sm:h-[80%] 
      bg-white shadow-lg rounded-lg 
      flex flex-col border border-gray-300"
        style={{
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <MoreVertical className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
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
                  msg.sender === "user" ? "bg-gray-800 text-white" : "bg-white/90 text-gray-900"
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
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <button type="button" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
