"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

export default function HomeChatPage() {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setQuery("")
    setLoading(true)

    try {
      const res = await fetch("/api/homechat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage.content }),
      })
      const data = await res.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response || "Sorry, I couldn't process your query.",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Error: Unable to get response.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="md:flex">
      <Sidebar />
      <main className="min-h-dvh flex flex-col flex-1 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <TopBar />
        <div className="flex-1 p-6">
          <Card className="max-w-6xl mx-auto h-[calc(100vh-180px)] border-2 border-green-200 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white py-6 px-8 border-b-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold tracking-tight">CITYZEN CHAT</CardTitle>
                    <p className="text-green-100 text-sm mt-1 font-light">Your Intelligent City Assistant</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-full">
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-green-100 text-sm">Online</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-full p-0 bg-gradient-to-b from-white to-green-50/30">
              <ScrollArea className="flex-1 p-8">
                <div className="space-y-6">
                  {messages.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">Welcome to CityZen Chat</h3>
                      <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                        Your intelligent assistant for city-related queries, reports, and information.
                      </p>
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                        <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">Report Issues</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">Get Information</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">Quick Updates</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex w-full ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] sm:max-w-[65%] md:max-w-[55%] p-4 sm:p-6 rounded-3xl shadow-lg ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-none shadow-green-200'
                            : 'bg-white text-gray-800 border-2 border-green-100 rounded-bl-none shadow-green-100'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed font-medium">{message.content}</p>
                        <p className={`text-xs mt-3 font-semibold ${
                          message.type === 'user' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex w-full justify-start">
                      <div className="max-w-[75%] sm:max-w-[65%] md:max-w-[55%] p-4 sm:p-6 rounded-3xl rounded-bl-none bg-white border-2 border-green-100 shadow-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-700">CityZen is thinking</span>
                            <p className="text-xs text-gray-500">Getting the latest information...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 sm:p-6 border-t-2 border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 rounded-b-3xl">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about city issues, services, or reports... (e.g., 'How many potholes were reported this week?')"
                    disabled={loading}
                    className="flex-1 border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white text-base sm:text-lg py-4 sm:py-6 px-4 rounded-2xl shadow-sm transition-all duration-200"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 border-2 border-green-600 text-white shadow-lg py-4 sm:py-6 px-6 sm:px-8 rounded-2xl transition-all duration-200 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap"
                  >
                    {loading ? (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm sm:text-lg font-semibold">Send</span>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </Button>
                </form>
                <div className="flex justify-center mt-4">
                  <p className="text-xs sm:text-sm text-gray-500 text-center">
                    Ask about reports, services, or any city-related information
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <BottomNav />
      </main>
    </div>
  )
}