"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { NavigationButtons } from "@/components/navigation-buttons"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Edit2, Check, X, Settings } from "lucide-react"
import type { Profile } from "@/types"

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({ imageUrl: "", bio: "" })
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editBio, setEditBio] = useState("")
  const [uploading, setUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_auth")
    if (authStatus === "true") {
      setIsAdmin(true)
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile")
        const data = await response.json()
        setProfile(data)
        setEditBio(data.bio || "")
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) throw new Error("Upload failed")

      const { url } = await uploadRes.json()

      const newProfile = { ...profile, imageUrl: url }
      const saveRes = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile),
      })

      if (saveRes.ok) {
        setProfile(newProfile)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleSaveBio = async () => {
    try {
      const newProfile = { ...profile, bio: editBio }
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile),
      })

      if (response.ok) {
        setProfile(newProfile)
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error saving bio:", error)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <NavigationButtons />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*, image/webp"
        className="hidden"
        onChange={handleImageUpload}
      />

      <div className="container max-w-2xl mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Author
          </h1>
        </header>

        <div className="flex flex-col items-center gap-8">
          {/* Profile Image */}
          <div className="relative">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-foreground/10 bg-muted">
              {profile.imageUrl ? (
                <Image
                  src={profile.imageUrl}
                  alt="작가 프로필"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-muted-foreground">No Image</span>
                </div>
              )}
            </div>

            {isAdmin && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-2 right-2 rounded-full shadow-lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Bio */}
          <div className="w-full max-w-md">
            {isEditing ? (
              <div className="flex flex-col gap-3">
                <Textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="작가 소개를 입력해주세요..."
                  rows={6}
                  className="resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false)
                      setEditBio(profile.bio)
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    취소
                  </Button>
                  <Button size="sm" onClick={handleSaveBio}>
                    <Check className="h-4 w-4 mr-1" />
                    저장                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative group">
                {profile.bio ? (
                  <p className="text-center text-lg leading-relaxed whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-center text-muted-foreground">
                    {isAdmin
                      ? "관리자 로그인 후 작가 소개를 입력해주세요."
                      : "???뻣揶쎛 ?袁⑹춦 ?臾믨쉐??? ??녿릭??щ빍??"}
                  </p>
                )}

                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin indicator */}
      {isAdmin && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-foreground text-background text-sm rounded-full">
          <Settings className="h-4 w-4" />
          ?온?귐딆쁽 筌뤴뫀諭?
        </div>
      )}
    </main>
  )
}

