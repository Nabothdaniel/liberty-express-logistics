"use client"

import { useState, useEffect } from "react"
import { db } from "../firebase/firebase"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import {Link} from "react-router-dom"

export default function AdminConversationsList() {
  const [conversations, setConversations] = useState([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const q = query(collection(db, "conversations"), orderBy("lastUpdated", "desc"))
    const unsub = onSnapshot(q, (snapshot) => {
      setConversations(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })
    return () => unsub()
  }, [])

  // Calculate counts for tabs
  const allCount = conversations.length
  const unreadCount = conversations.filter((conv) => conv.unreadCountForAdmin > 0).length
  const activeCount = conversations.filter((conv) => conv.status === "active").length
  const resolvedCount = conversations.filter((conv) => conv.status === "resolved").length

  // Filter conversations based on active tab
  const filteredConversations = conversations.filter((conv) => {
    switch (activeTab) {
      case "unread":
        return conv.unreadCountForAdmin > 0
      case "active":
        return conv.status === "active" || !conv.status
      case "resolved":
        return conv.status === "resolved"
      default:
        return true
    }
  })

  const formatTime = (timestamp) => {
    if (!timestamp) return ""
    const now = new Date()
    const messageTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const diffInHours = Math.floor((now - messageTime) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    return messageTime.toLocaleDateString()
  }

  const markAllAsRead = () => {
    // Implementation to mark all conversations as read
    console.log("Mark all as read")
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900">User Conversations</h1>
        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Mark all as read
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "all"
              ? "border-blue-600 text-blue-600 bg-blue-50"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          View all <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{allCount}</span>
        </button>
        <button
          onClick={() => setActiveTab("unread")}
          className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "unread"
              ? "border-blue-600 text-blue-600 bg-blue-50"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          Unread <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{unreadCount}</span>
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "active"
              ? "border-blue-600 text-blue-600 bg-blue-50"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          Active <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{activeCount}</span>
        </button>
        <button
          onClick={() => setActiveTab("resolved")}
          className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "resolved"
              ? "border-blue-600 text-blue-600 bg-blue-50"
              : "border-transparent text-gray-600 hover:text-gray-800"
          }`}
        >
          Resolved{" "}
          <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{resolvedCount}</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-lg font-medium mb-2">No conversations found</p>
            <p className="text-sm">No conversations match the selected filter.</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/admin/chat/${conv.id}`}
              className="block border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4 p-6 relative">
                {/* User Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {conv.userName ? conv.userName.charAt(0).toUpperCase() : conv.id.charAt(0).toUpperCase()}
                  </div>
                  {conv.unreadCountForAdmin > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Conversation Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {conv.userName || `User ${conv.id.slice(0, 6)}`}
                      </span>
                      <span className="text-sm text-gray-500">sent a message</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {conv.unreadCountForAdmin > 0 && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {conv.unreadCountForAdmin}
                        </span>
                      )}
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 mb-1">{formatTime(conv.lastUpdated)}</p>
                    <p className="text-sm text-gray-500">{formatTime(conv.lastUpdated)}</p>
                  </div>

                  {conv.lastMessage && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 line-clamp-2">{conv.lastMessage}</p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
