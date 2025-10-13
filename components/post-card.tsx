"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MapPin, MoreHorizontal, Heart, Share2, MessageCircle, ThumbsDown } from "lucide-react"
import { PriorityBadge } from "@/components/priority-badge"
import type { Post } from "@/lib/local-db"

export function PostCard({
  post,
  onEdit,
  onDelete,
  onLike,
  onComments,
  onShare,
}: {
  post: Post
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onLike?: (id: string) => void
  onComments?: (id: string) => void
  onShare?: (id: string) => void
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src="/diverse-avatars.png" alt={`${post.authorName} avatar`} />
            <AvatarFallback>{post.authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium leading-none">{post.authorName}</p>
              <span className="text-muted-foreground text-sm">
                {post.authorHandle} · {Math.max(1, Math.round((Date.now() - post.createdAt) / 60000))}m
              </span>
            </div>
            <p className="mt-2">{post.title}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {post.priority ? <PriorityBadge level={post.priority} /> : null}
              {post.status ? (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                  {post.status === "in_progress"
                    ? "In progress"
                    : post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </span>
              ) : null}
              {post.location ? (
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-4" aria-hidden="true" />
                  {post.location}
                </span>
              ) : null}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="More">
                <MoreHorizontal className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(post.id)}>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(post.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{post.body}</p>

        {post.images && post.images.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <div className="flex gap-2 w-max">
              {post.images.slice(0, 3).map((img, i) => (
                <div key={i} className="relative h-48 w-72 overflow-hidden rounded-lg border flex-shrink-0">
                  <Image
                    src={img.src || "/placeholder.svg?height=300&width=400&query=post-image"}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 85vw, 400px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {post.video?.src ? (
          <div className="mt-3">
            <video src={post.video.src} controls className="w-full rounded-lg border" />
          </div>
        ) : null}

        <Separator className="my-4" />

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => onLike?.(post.id)}
            aria-label="Upvote post"
          >
            <Heart className="size-4" aria-hidden="true" />
            {post.likes}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => onComments?.(post.id)}
            aria-label="Open comments"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            {post.comments?.length ?? 0}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => onShare?.(post.id)}
            aria-label="Share post"
          >
            <Share2 className="size-4" aria-hidden="true" />
            {post.shares}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => onDelete?.(post.id)}
            aria-label="Delete post"
          >
            Delete
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => (onEdit ? onEdit(post.id) : null)}
            aria-label="Edit post"
          >
            Edit
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => (onLike ? onLike(post.id) : null)}
            aria-label="Upvote duplicate"
          >
            {/* keeps layout balanced on large screens */}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => (onDelete ? onDelete(post.id) : null)}
            aria-label="Delete (duplicate)"
          >
            {/* spacer */}
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => onEdit?.(post.id)}
            aria-label="Edit"
          >
            {/* optional edit in second row */}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => (onLike ? onLike(post.id) : null)}
            aria-label="Upvote duplicate"
          >
            <Heart className="size-4" aria-hidden="true" /> {post.likes}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => (onComments ? onComments(post.id) : null)}
            aria-label="Comments duplicate"
          >
            <MessageCircle className="size-4" aria-hidden="true" /> {post.comments?.length ?? 0}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => (onShare ? onShare(post.id) : null)}
            aria-label="Share duplicate"
          >
            <Share2 className="size-4" aria-hidden="true" /> {post.shares}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            onClick={() => (onDelete ? onDelete(post.id) : null)}
            aria-label="Delete duplicate"
          >
            {/* extra spacing */}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            aria-label="Downvote post"
          >
            <ThumbsDown className="size-4" aria-hidden="true" /> {post.dislikes ?? 0}
          </button>
        </div>

        {post.status === "rejected" && post.adminNote ? (
          <p className="mt-2 rounded-md border bg-secondary/30 p-2 text-xs text-destructive">
            Rejected: {post.adminNote}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
