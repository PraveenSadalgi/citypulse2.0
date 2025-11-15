import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Fetch data from issues table
    const { data: issues, error } = await supabase
      .from("issues")
      .select("category, created_at")

    if (error) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
    }

    // Process the data
    const today = new Date().toISOString().split('T')[0]
    const todayIssues = issues.filter(issue => issue.created_at.startsWith(today))

    const categoryCounts = issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const todayCategoryCounts = todayIssues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Use Gemini API to generate response
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `User query: ${query}\n\nData summary:\nTotal issues: ${issues.length}\nToday's issues: ${todayIssues.length}\nCategory breakdown: ${JSON.stringify(categoryCounts)}\nToday's category breakdown: ${JSON.stringify(todayCategoryCounts)}\n\nPlease provide a helpful response based on this data.`
          }]
        }]
      })
    })

    const geminiData = await geminiResponse.json()
    const response = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response."

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
