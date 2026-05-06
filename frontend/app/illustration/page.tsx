"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { NavigationButtons } from "@/components/navigation-buttons"
import { IllustrationModal } from "@/components/illustration-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Upload, Settings, X, ImagePlus } from "lucide-react"
import type { Illustration } from "@/types"

// Client-side image conversion to webp
async function convertToWebp(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img")
    img.crossOrigin = "anonymous"
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Failed to convert to webp"))
          }
        },
        "image/webp",
        0.9
      )
    }

    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export default function IllustrationPage() {
  const [illustrations, setIllustrations] = useState<Illustration[]>([])
  const [selectedIllustration, setSelectedIllustration] =
    useState<Illustration | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newIllustration, setNewIllustration] = useState({
    title: "",
    description: "",
    images: [] as string[],
  })
  const [uploading, setUploading] = useState(false)
  const imagesInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_auth")
    if (authStatus === "true") {
      setIsAdmin(true)
    }

    const fetchIllustrations = async () => {
      try {
        const response = await fetch("/api/illustration")
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()
        if (Array.isArray(data)) {
          setIllustrations(data)
        }
      } catch (error) {
        console.error("Error fetching illustrations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIllustrations()
  }, [])

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      // Convert to webp
      const webpBlob = await convertToWebp(file)
      const webpFile = new File(
        [webpBlob],
        file.name.replace(/\.[^/.]+$/, ".webp"),
        { type: "image/webp" }
      )

      const formData = new FormData()
      formData.append("file", webpFile)
      formData.append("convertToWebp", "true")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const { url } = await response.json()
      setNewIllustration((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }))
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleAddIllustration = async () => {
    if (!newIllustration.title || newIllustration.images.length === 0) return

    try {
      const response = await fetch("/api/illustration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newIllustration,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        const illustrationsRes = await fetch("/api/illustration")
        const data = await illustrationsRes.json()
        setIllustrations(data)
        setAddDialogOpen(false)
        setNewIllustration({ title: "", description: "", images: [] })
      }
    } catch (error) {
      console.error("Error adding illustration:", error)
    }
  }

  const handleDeleteIllustration = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("이 일러스트를 삭제하시겠습니까?")) return

    try {
      const response = await fetch("/api/illustration", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setIllustrations(illustrations.filter((i) => i.id !== id))
      }
    } catch (error) {
      console.error("Error deleting illustration:", error)
    }
  }

  const removeImage = (index: number) => {
    setNewIllustration((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
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
    <main className="min-h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Newspaper Columns / Margin Lines Background */}
      <div className="fixed inset-0 pointer-events-none flex justify-center z-0 opacity-10">
        <div className="w-full max-w-7xl h-full border-x border-foreground flex justify-between px-4 sm:px-0">
          <div className="hidden sm:block w-px h-full bg-foreground/50"></div>
          <div className="hidden md:block w-px h-full bg-foreground/50"></div>
          <div className="hidden lg:block w-px h-full bg-foreground/50"></div>
        </div>
      </div>

      {/* Cinematic Vignette Overlay to focus center */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.15)_100%)] z-[1]" />

      <div className="relative z-20">
        <NavigationButtons />
      </div>

      <input
        ref={imagesInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
          e.target.value = ""
        }}
      />

      <div className="container max-w-5xl mx-auto px-4 py-16 relative z-10">
        <header className="flex flex-col items-center justify-center text-center mb-12">
          <div className="w-full max-w-md flex justify-center gap-8 items-center border-y border-muted-foreground/30 py-2 mb-6 text-[10px] md:text-sm text-muted-foreground font-[family-name:var(--font-playfair)] tracking-widest uppercase">
            <span>Illustration</span>
            <span>Gallery</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold italic tracking-tight text-foreground font-[family-name:var(--font-playfair)]">
            ILLUSTRATION
          </h1>
        </header>

        {/* Illustration Grid */}
        {illustrations.length === 0 && !isAdmin ? (
          <p className="text-center text-muted-foreground py-16">
            등록된 일러스트가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {illustrations.map((illustration) => (
              <div
                key={illustration.id}
                className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-muted"
                onClick={() => {
                  setSelectedIllustration(illustration)
                  setModalOpen(true)
                }}
              >
                {illustration.images[0] && (
                  <Image
                    src={illustration.images[0]}
                    alt={illustration.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-white font-semibold text-sm truncate">
                    {illustration.title}
                  </h3>
                </div>

                {/* Image count badge */}
                {illustration.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                    +{illustration.images.length - 1}
                  </div>
                )}

                {isAdmin && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 left-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDeleteIllustration(illustration.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            {/* Add Button (Admin) */}
            {isAdmin && (
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <button className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover:border-foreground/50 transition-colors cursor-pointer">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      일러스트 추가
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>새 일러스트 추가</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-4">
                    <Input
                      placeholder="일러스트 제목"
                      value={newIllustration.title}
                      onChange={(e) =>
                        setNewIllustration({
                          ...newIllustration,
                          title: e.target.value,
                        })
                      }
                    />
                    <Textarea
                      placeholder="설명 (선택)"
                      value={newIllustration.description}
                      onChange={(e) =>
                        setNewIllustration({
                          ...newIllustration,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />

                    {/* Images */}
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium">
                        이미지 ({newIllustration.images.length}장)
                      </span>
                      <p className="text-xs text-muted-foreground">
                        업로드 시 자동으로 webp 형식으로 변환됩니다.
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {newIllustration.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square rounded-lg overflow-hidden"
                          >
                            <Image
                              src={img}
                              alt={`Image ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-5 w-5"
                              onClick={() => removeImage(idx)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <button
                          className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-foreground/50 transition-colors"
                          onClick={() => imagesInputRef.current?.click()}
                          disabled={uploading}
                        >
                          {uploading ? (
                            <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <ImagePlus className="h-6 w-6 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={handleAddIllustration}
                      disabled={
                        !newIllustration.title ||
                        newIllustration.images.length === 0
                      }
                    >
                      추가하기
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </div>

      {/* Illustration Modal */}
      <IllustrationModal
        illustration={selectedIllustration}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {/* Admin indicator */}
      {isAdmin && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-foreground text-background text-sm rounded-full">
          <Settings className="h-4 w-4" />
          관리자 모드
        </div>
      )}
    </main>
  )
}
