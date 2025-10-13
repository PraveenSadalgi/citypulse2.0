"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomNav } from "@/components/bottom-nav"
import { TopBar } from "@/components/top-bar"
import { Home, BarChart2, MessageSquare, User, Camera } from "lucide-react"
import { useState, useMemo, useEffect, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { ProfileData, Post } from "@/lib/local-db"
import { Input } from "@/components/ui/input"
import AnimatedLoadingSkeleton from "@/components/ui/loading-skeleton"

function ProfileHeader({ profileData, postsCount, editing, onAvatarClick }: { profileData: ProfileData, postsCount: number, editing: boolean, onAvatarClick: () => void }) {
  return (
    <section className="relative">
      <div className="h-24 w-full rounded-b-2xl bg-primary/10" />
      <div className="mx-auto max-w-2xl px-4">
        <div className="-mt-10 flex items-end gap-4">
          <div className="relative">
            <Avatar className={`size-20 ring-2 ring-background ${editing ?"cursor-pointer" : ""}`} onClick={editing ? onAvatarClick : undefined}>
              <AvatarImage src={profileData.avatar || "/professional-headshot.png"} alt="Profile" />
              <AvatarFallback>{profileData.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            {editing && (
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 border-2 border-background">
                <Camera size={16} className="text-gray-600" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{profileData.name}</h1>
            <p className="text-sm text-muted-foreground">{profileData.handle}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center">{profileData.profession || "🎨 Designer & Painter"}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(profileData.interests || ["Football", "Arts & Crafts", "Handicrafts"]).map((chip) => (
            <span
              key={chip}
              className="rounded-full border px-3 py-1 text-xs text-muted-foreground"
              aria-label={`Interest ${chip}`}
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-3 text-sm text-muted-foreground">
          <strong className="text-foreground">{postsCount}</strong> posts
        </div>
      </div>
    </section>
  )
}

function SamplePost({ title, status, adminNote }: { title: string; status?: string; adminNote?: string }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">{title}</div>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
            {(status || "pending").replace("_", " ")}
          </span>
        </div>
        {status === "rejected" && adminNote ? (
          <p className="mt-2 text-xs text-destructive">Reason: {adminNote}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}

function CommentCard({ postId, title, text }: { postId: string; title: string; text: string }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="text-xs text-muted-foreground">On: {title}</div>
        <div className="text-sm">{text}</div>
      </CardContent>
    </Card>
  )
}

// Mock data for profile
const mockProfileData: ProfileData = {
  id: "mock-user-1",
  name: "Alex Johnson",
  handle: "@alexj",
  bio: "Passionate about community development and civic engagement. Love helping make our city a better place for everyone!",
  avatar: "/professional-headshot.png",
  profession: "🎨 Community Organizer & Designer",
  interests: ["Urban Planning", "Environmental Issues", "Public Transportation", "Community Events"],
  coins: 1250,
  email: "alex.johnson@example.com"
}

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Broken Street Light on Main Street",
    body: "There's a street light that's been out for over a week now. It's making the area unsafe for pedestrians at night.",
    authorName: "Alex Johnson",
    authorHandle: "@alexj",
    location: "Main Street & 5th Ave",
    city: "Downtown",
    year: 2024,
    category: "Infrastructure",
    priority: "High",
    images: [{ src: "/street-light-issue.jpg", alt: "Broken street light" }],
    video: null,
    likes: 12,
    dislikes: 0,
    comments: [
      { user: "Alex Johnson", text: "Thanks for reporting this! I'll follow up with the city.", timestamp: Date.now() - 3600000 }
    ],
    shares: 3,
    status: "in_progress",
    adminNote: "Work order created, estimated completion: 3-5 business days",
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: "2",
    title: "Pothole on Oak Avenue",
    body: "Large pothole that's been getting worse. Cars are swerving to avoid it which is dangerous.",
    authorName: "Alex Johnson",
    authorHandle: "@alexj",
    location: "Oak Avenue, between 2nd and 3rd Street",
    city: "Midtown",
    year: 2024,
    category: "Roads",
    priority: "Medium",
    images: [{ src: "/pothole.png", alt: "Large pothole" }],
    video: null,
    likes: 8,
    dislikes: 0,
    comments: [],
    shares: 1,
    status: "pending",
    adminNote: "",
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: "3",
    title: "Water Leak in Public Park",
    body: "There's a water leak near the playground that's been running for days. Wasting water and creating a muddy area.",
    authorName: "Alex Johnson",
    authorHandle: "@alexj",
    location: "Central Park, near playground",
    city: "Central District",
    year: 2024,
    category: "Utilities",
    priority: "High",
    images: [{ src: "/water-issue.jpg", alt: "Water leak in park" }],
    video: null,
    likes: 15,
    dislikes: 0,
    comments: [
      { user: "Alex Johnson", text: "Update: The leak has been fixed! Great response time from the city.", timestamp: Date.now() - 1800000 }
    ],
    shares: 5,
    status: "resolved",
    adminNote: "Issue resolved - water line repaired",
    createdAt: Date.now() - 86400000 * 7
  }
]

const mockComments = [
  { postId: "1", title: "Broken Street Light on Main Street", text: "Thanks for reporting this! I'll follow up with the city." },
  { postId: "3", title: "Water Leak in Public Park", text: "Update: The leak has been fixed! Great response time from the city." }
]

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [editing, setEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedBio, setEditedBio] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [editedInterests, setEditedInterests] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulate loading with mock data
  useEffect(() => {
    const loadMockData = async () => {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setProfileData(mockProfileData)
      setPosts(mockPosts)
      setIsLoading(false)
    }
    
    loadMockData()
  }, [])

  const myPosts = useMemo(() => posts.filter((p) => p.authorHandle === "@alexj"), [posts])
  const myComments = useMemo(() => mockComments, [])

  const handleEdit = () => {
    if (profileData) {
      setEditedName(profileData.name || "")
      setEditedBio(profileData.bio || "")
      setEditedInterests((profileData.interests || []).join(", "))
    }
    setEditing(true)
  }

  const save = async () => {
    if (!profileData) return
    try {
      const interests = editedInterests.split(",").map(s => s.trim()).filter(s => s)
      let avatarUrl = profileData.avatar
      if (avatarFile) {
        // For mock data, we'll just use a placeholder URL
        avatarUrl = "/professional-headshot.png"
      }
      const updatedData = { 
        name: editedName, 
        bio: editedBio, 
        avatar: avatarUrl, 
        interests, 
        profession: profileData.profession, 
        coins: profileData.coins 
      }
      
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setProfileData({ ...profileData, ...updatedData })
      setEditing(false)
      
      // Show success message
      alert('Profile updated successfully!')
    } catch (e) {
      console.error(e)
      alert('Error saving profile: ' + (e as Error).message)
    }
  }

  if (isLoading || !profileData) {
    return (
      <div className="md:flex">
        <Sidebar />
        <main className="min-h-dvh flex flex-col flex-1">
          <TopBar />
          <div className="min-h-screen bg-white">
            <div className="h-32 bg-gradient-to-b from-[#B8F1B0] to-white"></div>
            <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-20 relative z-10">
              <AnimatedLoadingSkeleton />
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="md:flex">
      <Sidebar />
      <main className="min-h-dvh flex flex-col flex-1">
        <TopBar />
        <ProfileHeader profileData={profileData} postsCount={myPosts.length} editing={editing} onAvatarClick={() => fileInputRef.current?.click()} />
        <section className="mx-auto w-full max-w-2xl px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Coins: <span className="font-medium text-foreground">{profileData.coins || 0}</span>
            </div>
            {!editing ? (
              <Button variant="secondary" onClick={handleEdit}>
                Edit profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" onClick={save}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="grid gap-2 mb-4">
              <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} placeholder="Name" />
              <Input value={editedBio} onChange={(e) => setEditedBio(e.target.value)} placeholder="Bio" />
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} style={{display: 'none'}} />
              <Input value={editedInterests} onChange={(e) => setEditedInterests(e.target.value)} placeholder="Interests (comma separated)" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-4">{profileData.bio}</p>
          )}

          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="posts">Posts ({myPosts.length})</TabsTrigger>
              <TabsTrigger value="grievances">Grievances</TabsTrigger>
              <TabsTrigger value="replies">Replies</TabsTrigger>
              <TabsTrigger value="comments">Comments ({myComments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              {myPosts.length ? (
                myPosts.map((p) => <SamplePost key={p.id} title={p.title} status={p.status} adminNote={p.adminNote} />)
              ) : (
                <p className="text-sm text-muted-foreground">No posts yet.</p>
              )}
            </TabsContent>
            <TabsContent value="grievances" className="space-y-4">
              <p className="text-sm text-muted-foreground">Coming soon.</p>
            </TabsContent>
            <TabsContent value="replies">
              <p className="text-sm text-muted-foreground">No replies yet.</p>
            </TabsContent>
            <TabsContent value="comments" className="space-y-3">
              {myComments.length ? (
                myComments.map((c, i) => <CommentCard key={i} postId={c.postId} title={c.title} text={c.text} />)
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              )}
            </TabsContent>
          </Tabs>
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
    </div>
  )
}
