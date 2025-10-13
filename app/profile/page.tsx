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
import { getCurrentUser, getPosts, getPostsFromDB, savePostsToDB, ProfileData, Post } from "@/lib/local-db"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"

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

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [editing, setEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedBio, setEditedBio] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [editedInterests, setEditedInterests] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [user, setUser] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('User:', user)
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    if (!user) return
    console.log('Fetching profile for user:', user.id)
    const fetchProfile = async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      console.log('Profile query result:', { data, error })
      if (error) {
        console.error('Profile fetch error:', error)
        // If no profile, set default
        setProfileData({
          id: user.id,
          name: user.user_metadata?.name || user.email || "User",
          handle: "@" + (user.email?.split('@')[0] || "user"),
          bio: "",
          avatar: "/professional-headshot.png",
          profession: "",
          interests: [],
          coins: 0,
          email: user.email
        })
        return
      }
      setProfileData(data)
    }
    fetchProfile()
  }, [user])

  useEffect(() => {
    const fetchPosts = async () => {
      const p = await getPostsFromDB()
      if (p.length === 0) {
        const seeded = getPosts()
        await savePostsToDB(seeded)
        setPosts(seeded)
      } else {
        setPosts(p)
      }
    }
    fetchPosts()
  }, [])

  const me = getCurrentUser()
  const myPosts = useMemo(() => posts.filter((p) => p.authorHandle === (me?.handle || "@demo")), [posts, me])
  const myComments = useMemo(() => {
    const u = me?.name || "Demo User"
    const result: { postId: string; title: string; text: string }[] = []
    posts.forEach((p) => {
      const comments = Array.isArray(p.comments) ? p.comments : []
      comments.forEach((c) => {
        if (c.user === u) result.push({ postId: p.id, title: p.title, text: c.text })
      })
    })
    return result
  }, [posts, me])

  const handleEdit = () => {
    if (profileData) {
      setEditedName(profileData.name || "")
      setEditedBio(profileData.bio || "")
      setEditedInterests((profileData.interests || []).join(", "))
    }
    setEditing(true)
  }

  const uploadAvatar = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from('avatar').upload(fileName, file)
    if (error) throw error
    const { data: urlData } = supabase.storage.from('avatar').getPublicUrl(fileName)
    return urlData.publicUrl
  }

  const save = async () => {
    if (!profileData || !user) return
    try {
      const interests = editedInterests.split(",").map(s => s.trim()).filter(s => s)
      let avatarUrl = profileData.avatar
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile)
      }
      const updatedData = { name: editedName, bio: editedBio, avatar: avatarUrl, interests, profession: profileData.profession, coins: profileData.coins }
      const { error } = await supabase.from('profiles').upsert({ id: user.id, ...updatedData })
      if (error) throw error
      setProfileData({ ...profileData, ...updatedData })
      setEditing(false)
    } catch (e) {
      console.error(e)
      alert('Error saving profile: ' + (e as Error).message)
    }
  }

  if (!profileData) return <div>Loading...</div>

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
