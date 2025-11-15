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
        <div className="flex-1 p-4 md:p-6">
          <Card className="max-w-6xl mx-auto h-[calc(100vh-140px)] md:h-[calc(100vh-180px)] border-2 border-green-200 shadow-2xl rounded-3xl overflow-hidden flex flex-col">
            <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white py-4 md:py-6 px-6 md:px-8 border-b-0 shrink-0">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                    <svg className="w-5 h-5 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-xl md:text-3xl font-bold tracking-tight truncate">CITYZEN CHAT</CardTitle>
                    <p className="text-green-100 text-xs md:text-sm mt-1 font-light truncate">Your Intelligent City Assistant</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 px-2 py-1 md:px-3 md:py-2 rounded-full flex-shrink-0">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-green-100 text-xs md:text-sm">Online</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex flex-col h-full p-0 bg-gradient-to-b from-white to-green-50/30 flex-1 overflow-hidden">
              {/* Messages Area - Made shorter to ensure input is visible */}
              <ScrollArea className="flex-1 p-4 md:p-6" style={{ maxHeight: 'calc(100% - 120px)' }}>
                <div className="space-y-4 md:space-y-6 w-full">
                  {messages.length === 0 && (
                    <div className="text-center py-4 md:py-8 w-full">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 px-4">Welcome to CityZen Chat</h3>
                      <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto leading-relaxed px-4 mb-4">
                        Your intelligent assistant for city-related queries, reports, and information.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 max-w-md mx-auto px-4">
                        <div className="bg-white p-2 md:p-3 rounded-lg border border-green-200 shadow-sm text-center">
                          <div className="w-5 h-5 md:w-6 md:h-6 bg-green-100 rounded flex items-center justify-center mb-1 mx-auto">
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <p className="text-xs text-gray-600">Report Issues</p>
                        </div>
                        <div className="bg-white p-2 md:p-3 rounded-lg border border-green-200 shadow-sm text-center">
                          <div className="w-5 h-5 md:w-6 md:h-6 bg-green-100 rounded flex items-center justify-center mb-1 mx-auto">
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-xs text-gray-600">Get Information</p>
                        </div>
                        <div className="bg-white p-2 md:p-3 rounded-lg border border-green-200 shadow-sm text-center">
                          <div className="w-5 h-5 md:w-6 md:h-6 bg-green-100 rounded flex items-center justify-center mb-1 mx-auto">
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                          <p className="text-xs text-gray-600">Quick Updates</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Messages List */}
                  <div className="space-y-3 md:space-y-4 w-full">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex w-full ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] xs:max-w-[80%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%] p-3 md:p-4 rounded-2xl shadow-lg ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-md shadow-green-200'
                              : 'bg-white text-gray-800 border-2 border-green-100 rounded-bl-md shadow-green-100'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words text-sm md:text-base leading-relaxed font-medium">
                            {message.content}
                          </p>
                          <p className={`text-xs mt-2 md:mt-3 font-semibold ${
                            message.type === 'user' ? 'text-green-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Loading Indicator */}
                    {loading && (
                      <div className="flex w-full justify-start">
                        <div className="max-w-[85%] xs:max-w-[80%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%] p-3 md:p-4 rounded-2xl rounded-bl-md bg-white border-2 border-green-100 shadow-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
                </div>
              </ScrollArea>

              {/* Input Area - Fixed and always visible */}
              <div className="border-t-2 border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 rounded-b-3xl p-4 md:p-4 mt-auto">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 md:gap-3 items-stretch sm:items-center w-full">
                  <div className="flex-1 min-w-0">
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask about city issues, services, or reports... (e.g., 'How many potholes were reported this week?')"
                      disabled={loading}
                      className="w-full border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white text-sm md:text-base py-3 px-4 rounded-xl shadow-sm transition-all duration-200"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 border-2 border-green-600 text-white shadow-lg py-3 px-4 md:px-6 rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap min-w-[80px] flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <span className="text-sm font-semibold">Send</span>
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </Button>
                </form>
                <div className="flex justify-center mt-2">
                  <p className="text-xs text-gray-500 text-center max-w-md">
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