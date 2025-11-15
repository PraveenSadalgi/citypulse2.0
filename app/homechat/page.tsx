"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomeChatPage() {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const res = await fetch("/api/homechat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      setResponse(data.response || "Sorry, I couldn't process your query.")
    } catch (error) {
      setResponse("Error: Unable to get response.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="md:flex">
      <Sidebar />
      <main className="min-h-dvh flex flex-col flex-1">
        <TopBar />
        <div className="flex-1 p-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Home Chatbot</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about issues, e.g., 'How many potholes reported today?'"
                  disabled={loading}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? "Thinking..." : "Ask"}
                </Button>
              </form>
              {response && (
                <div className="mt-4 p-4 bg-muted rounded">
                  <p>{response}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <BottomNav />
      </main>
    </div>
  )
}
