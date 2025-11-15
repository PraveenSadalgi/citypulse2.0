"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomNav } from "@/components/bottom-nav"
import { TopBar } from "@/components/top-bar"
import { Camera } from "lucide-react"
import { useState, useMemo, useEffect, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { ProfileData, Post, getProfileFromDB, getPosts, saveProfile } from "@/lib/local-db"
import { Input } from "@/components/ui/input"
import AnimatedLoadingSkeleton from "@/components/ui/loading-skeleton"
import { useAuth } from "@/components/auth-provider"
import { signOut as localSignOut } from "@/lib/local-db"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

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
  const { user } = useAuth()
  const router = useRouter()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [editing, setEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedBio, setEditedBio] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [editedInterests, setEditedInterests] = useState("")
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        if (!user) {
          // Guest user data
          setProfileData({
            id: 'guest',
            name: 'Guest User',
            handle: '@guest',
            email: '',
            avatar: "/placeholder-user.jpg",
            bio: "Welcome to CityPulse!",
            profession: "Community Member",
            interests: ["Community", "Technology"],
            coins: 0
          })
          setPosts([])
        } else {
          const [profile, allPosts] = await Promise.all([
            getProfileFromDB(user!.id),
            getPosts()
          ])

          if (profile) {
            setProfileData(profile)
          } else {
            // Fallback to demo data if no profile found
            setProfileData({
              id: user!.id,
              name: user!.user_metadata?.name || "User",
              handle: `@${user!.email?.split('@')[0] || 'user'}`,
              email: user!.email || "",
              avatar: user!.user_metadata?.avatar_url || "/placeholder-user.jpg",
              bio: "Welcome to CityPulse!",
              profession: "Community Member",
              interests: ["Community", "Technology"],
              coins: 0
            })
          }

          setPosts(allPosts)
        }
      } catch (error) {
        console.error('Error loading profile data:', error)
        // Fallback to guest data on error
        setProfileData({
          id: 'guest',
          name: 'Guest User',
          handle: '@guest',
          email: '',
          avatar: "/placeholder-user.jpg",
          bio: "Welcome to CityPulse!",
          profession: "Community Member",
          interests: ["Community", "Technology"],
          coins: 0
        })
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user, router])

  const myPosts = useMemo(() => posts.filter((p) => p.authorHandle === profileData?.handle), [posts, profileData])
  const myComments = useMemo(() => {
    // Extract comments from user's posts
    return myPosts.flatMap(post =>
      (post.comments || []).map(comment => ({
        postId: post.id,
        title: post.title,
        text: comment.text
      }))
    )
  }, [myPosts])

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
        // Upload to Supabase storage bucket 'profile_photos'
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${profileData.id}_${Date.now()}.${fileExt}`
        const { data, error: uploadError } = await supabase.storage
          .from('profile_photos')
          .upload(fileName, avatarFile)

        if (uploadError) {
          throw new Error('Failed to upload avatar: ' + uploadError.message)
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profile_photos')
          .getPublicUrl(fileName)

        avatarUrl = publicUrl
      }
      const updatedData = {
        ...profileData,
        name: editedName,
        bio: editedBio,
        avatar: avatarUrl,
        interests,
      }

      // Save to database or local storage
      await saveProfile(updatedData)

      setProfileData(updatedData)
      setEditing(false)
      setAvatarFile(null)

      // Show success message
      alert('Profile updated successfully!')
    } catch (e) {
      console.error(e)
      alert('Error saving profile: ' + (e as Error).message)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      localSignOut()
      router.push('/auth/signin')
    } catch (error) {
      console.error('Error signing out:', error)
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
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleEdit}>
                  Edit profile
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
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

        <BottomNav />
      </main>
    </div>
  )
}
