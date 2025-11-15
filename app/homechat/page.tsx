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
      <main className="min-h-dvh flex flex-col flex-1 bg-gradient-to-br from-green-50 to-white">
        <TopBar />
        <div className="flex-1 p-4">
          <Card className="max-w-4xl mx-auto h-[calc(100vh-200px)] border-green-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg border-b border-green-500">
              <CardTitle className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span>CityZen Chat</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full p-0">
              <ScrollArea className="flex-1 p-4 bg-white">
                <div className="space-y-6">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Welcome to CityZen Chat</h3>
                      <p className="text-gray-500 text-sm">Ask about city issues, reports, or any queries you have.</p>
                    </div>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 border border-green-100 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-green-100' : 'text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] p-4 rounded-2xl rounded-bl-none bg-white border border-green-100 shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="text-sm text-gray-500">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-green-100 bg-green-50 rounded-b-lg">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about issues, e.g., 'How many potholes reported today?'"
                    disabled={loading}
                    className="flex-1 border-green-200 focus:border-green-400 focus:ring-green-400 bg-white"
                  />
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border border-green-600 text-white shadow-sm transition-all duration-200"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
        <BottomNav />
      </main>
    </div>
  )
}