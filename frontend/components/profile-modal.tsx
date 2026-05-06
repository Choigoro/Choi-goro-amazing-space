"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Check, X, Upload } from "lucide-react"

interface ProfileData {
  name: string
  bio: string
  profileImage: string
  socialLinks: { label: string; url: string }[]
}

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isAdmin: boolean
}

export function ProfileModal({ open, onOpenChange, isAdmin }: ProfileModalProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (open && !profile) {
      setIsLoading(true)
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          setProfile(data)
          setEditForm(data)
          setIsLoading(false)
        })
        .catch(console.error)
    }
  }, [open, profile])

  const handleSave = async () => {
    if (!editForm) return

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        setProfile(editForm)
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editForm) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        setEditForm({ ...editForm, profileImage: url })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    }
    
    e.target.value = ""
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val)
      if (!val) setIsEditing(false)
    }}>
      <DialogContent className="sm:max-w-2xl bg-background/95 backdrop-blur-xl border-foreground/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold italic tracking-widest font-[family-name:var(--font-playfair)]">
            About the Author
          </DialogTitle>
          {isAdmin && !isEditing && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-12 top-4 h-8 w-8"
              onClick={() => {
                setEditForm(profile)
                setIsEditing(true)
              }}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isEditing && editForm ? (
          <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted">
                {editForm.profileImage && (
                  <Image
                    src={editForm.profileImage}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                  <Upload className="h-6 w-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">이름</label>
                <Input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">소개</label>
                <Textarea
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  rows={5}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setEditForm(profile)
                }}
              >
                <X className="h-4 w-4 mr-2" />
                취소
              </Button>
              <Button onClick={handleSave}>
                <Check className="h-4 w-4 mr-2" />
                저장
              </Button>
            </div>
          </div>
        ) : profile ? (
          <div className="flex flex-col md:flex-row gap-8 py-6">
            <div className="flex-shrink-0 flex justify-center">
              <div className="relative w-40 h-40 md:w-48 md:h-48 overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-700">
                {profile.profileImage ? (
                  <Image
                    src={profile.profileImage}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-4xl text-muted-foreground">P</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-6">
              <div>
                <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] italic mb-4 border-b border-foreground/20 pb-2">
                  {profile.name}
                </h2>
                <div className="prose prose-sm md:prose-base dark:prose-invert">
                  <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                    {profile.bio}
                  </p>
                </div>
              </div>
              
              {profile.socialLinks && profile.socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {profile.socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-widest border border-foreground/30 px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}