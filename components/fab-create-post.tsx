"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

export function FabCreatePost() {
  return (
    <Link
      href="/posts/new"
      aria-label="Create a post"
      className="fixed bottom-20 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:opacity-90 sm:right-6 sm:bottom-6"
    >
      <Plus className="h-6 w-6" aria-hidden="true" />
    </Link>
  )
}
