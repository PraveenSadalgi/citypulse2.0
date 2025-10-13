"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { Home, BarChart2, MessageSquare, User } from "lucide-react"
import { PostForm } from "@/components/post-form"
import { DEMO_USER, newPostTemplate, upsertPost } from "@/lib/local-db"

export default function NewPostPage() {
  const router = useRouter()
  const initial = newPostTemplate(DEMO_USER)

  return (
    <main className="min-h-dvh flex flex-col">
      <section className="mx-auto w-full max-w-2xl px-4 py-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Create Post</CardTitle>
          </CardHeader>
          <CardContent>
            <PostForm
              initial={initial}
              onSubmit={(p) => {
                upsertPost(p)
                router.replace("/home")
              }}
            />
            <Button variant="ghost" className="mt-2" onClick={() => router.back()}>
              Cancel
            </Button>
          </CardContent>
        </Card>
      </section>

      <BottomNav
        items={[
          { href: "/home", label: "Home", icon: Home },
          { href: "/analytics", label: "Analytics", icon: BarChart2 },
          { href: "/aichat", label: "AI Chat", icon: MessageSquare },
          { href: "/profile", label: "Profile", icon: User },
        ]}
      />
    </main>
  )
}
