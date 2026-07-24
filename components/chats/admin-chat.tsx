"use client"

import { useState, useEffect } from "react"
import { db } from "./firebase"
import { collection, onSnapshot, doc, updateDoc, orderBy, query } from "firebase/firestore"

export default function AdminDashboard() {
  const [conversations, setConversations] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const q = query(collection(db, "conversations"), orderBy("lastUpdated", "desc"))
    const unsub = onSnapshot(q, (snapshot) => {
      setConversations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    if (!selectedUser) return
    const unsub = onSnapshot(collection(db, "conversations", selectedUser, "messages"), (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()))
    })

    // Reset unread count for admin
    updateDoc(doc(db, "conversations", selectedUser), { unreadCountForAdmin: 0 })

    return () => unsub()
  }, [selectedUser])

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/3 border-r overflow-y-auto">
        {conversations.map(conv => (
          <div
            key={conv.id}
            className={`p-4 border-b cursor-pointer ${selectedUser === conv.id ? "bg-gray-100" : ""}`}
            onClick={() => setSelectedUser(conv.id)}
          >
            <div className="flex justify-between">
              <span>User {conv.id.slice(0, 6)}</span>
              {conv.unreadCountForAdmin > 0 && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                  {conv.unreadCountForAdmin}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{conv.lastMessage}</p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div key={i} className={`mb-2 flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className={`px-3 py-2 rounded-lg ${msg.sender === "admin" ? "bg-green-500 text-white" : "bg-gray-200"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  )
}
