"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { NavigationButtons } from "@/components/navigation-buttons"
import { WebtoonModal } from "@/components/webtoon-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Upload, Settings, X, ImagePlus } from "lucide-react"
import type { Webtoon } from "@/types"

export default function WebtoonPage() {
  const [webtoons, setWebtoons] = useState<Webtoon[]>([])
  const [selectedWebtoon, setSelectedWebtoon] = useState<Webtoon | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newWebtoon, setNewWebtoon] = useState<{
    id?: string
    title: string
    thumbnail: string
    images: string[]
    endCharacterImage: string
    createdAt?: string
  }>({
    title: "",
    thumbnail: "",
    images: [],
    endCharacterImage: "",
  })
  const [uploading, setUploading] = useState<string | null>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const imagesInputRef = useRef<HTMLInputElement>(null)
  const imagesPrependInputRef = useRef<HTMLInputElement>(null)
  const endCharInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_auth")
    if (authStatus === "true") {
      setIsAdmin(true)
    }

    const fetchWebtoons = async () => {
      try {
        const response = await fetch("/api/webtoon")
        if (!response.ok) throw new Error("Failed to fetch")
        const data = await response.json()
        if (Array.isArray(data)) {
          setWebtoons(data)
        }
      } catch (error) {
        console.error("Error fetching webtoons:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWebtoons()
  }, [])

  const handleUpload = async (
    file: File,
    type: "thumbnail" | "images" | "images-prepend" | "endChar"
  ) => {
    setUploading(type)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const { url } = await response.json()

      if (type === "thumbnail") {
        setNewWebtoon((prev) => ({ ...prev, thumbnail: url }))
      } else if (type === "images") {
        setNewWebtoon((prev) => ({ ...prev, images: [...prev.images, url] }))
      } else if (type === "images-prepend") {
        setNewWebtoon((prev) => ({ ...prev, images: [url, ...prev.images] }))
      } else {
        setNewWebtoon((prev) => ({ ...prev, endCharacterImage: url }))
      }
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(null)
    }
  }

  const handleSaveWebtoon = async () => {
    if (!newWebtoon.title || !newWebtoon.thumbnail) return

    try {
      const isEditing = !!newWebtoon.id
      const method = isEditing ? "PUT" : "POST"
      const body = isEditing
        ? { ...newWebtoon }
        : {
            ...newWebtoon,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          }

      const response = await fetch("/api/webtoon", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const webtoonsRes = await fetch("/api/webtoon")
        const data = await webtoonsRes.json()
        setWebtoons(data)
        setAddDialogOpen(false)
        setNewWebtoon({
          id: undefined,
          title: "",
          thumbnail: "",
          images: [],
          endCharacterImage: "",
        })
      }
    } catch (error) {
      console.error("Error saving webtoon:", error)
    }
  }

  const handleEditClick = (webtoon: Webtoon, e: React.MouseEvent) => {
    e.stopPropagation()
    setNewWebtoon({
      id: webtoon.id,
      title: webtoon.title,
      thumbnail: webtoon.thumbnail,
      images: [...webtoon.images],
      endCharacterImage: webtoon.endCharacterImage || "",
      createdAt: webtoon.createdAt,
    })
    setAddDialogOpen(true)
  }

  const handleDeleteWebtoon = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("이 웹툰을 삭제하시겠습니까?")) return

    try {
      const response = await fetch("/api/webtoon", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setWebtoons(webtoons.filter((w) => w.id !== id))
      }
    } catch (error) {
      console.error("Error deleting webtoon:", error)
    }
  }

  const removeImage = (index: number) => {
    setNewWebtoon((prev) => ({
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
        ref={thumbnailInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file, "thumbnail")
          e.target.value = ""
        }}
      />
      <input
        ref={imagesInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file, "images")
          e.target.value = ""
        }}
      />
      <input
        ref={imagesPrependInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file, "images-prepend")
          e.target.value = ""
        }}
      />
      <input
        ref={endCharInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file, "endChar")
          e.target.value = ""
        }}
      />

      <div className="container max-w-5xl mx-auto px-4 py-16 relative z-10">
        <header className="flex flex-col items-center justify-center text-center mb-12">
          <div className="w-full max-w-md flex justify-center gap-8 items-center border-y border-muted-foreground/30 py-2 mb-6 text-[10px] md:text-sm text-muted-foreground font-[family-name:var(--font-playfair)] tracking-widest uppercase">
            <span>Webtoon</span>
            <span>Archive</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold italic tracking-tight text-foreground font-[family-name:var(--font-playfair)]">
            WEBTOON
          </h1>
        </header>

        {/* Webtoon Grid */}
        {webtoons.length === 0 && !isAdmin ? (
          <p className="text-center text-muted-foreground py-16">
            등록된 웹툰이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {webtoons.map((webtoon) => (
              <div
                key={webtoon.id}
                className="group relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer bg-muted"
                onClick={() => {
                  setSelectedWebtoon(webtoon)
                  setModalOpen(true)
                }}
              >
                {webtoon.thumbnail && (
                  <Image
                    src={webtoon.thumbnail}
                    alt={webtoon.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-semibold text-sm md:text-base truncate">
                    {webtoon.title}
                  </h3>
                </div>

                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 text-foreground"
                      onClick={(e) => handleEditClick(webtoon, e)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => handleDeleteWebtoon(webtoon.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* Add/Edit Button (Admin) */}
            {isAdmin && (
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <button 
                    className="aspect-[3/4] rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover:border-foreground/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setNewWebtoon({
                        id: undefined,
                        title: "",
                        thumbnail: "",
                        images: [],
                        endCharacterImage: "",
                      })
                    }}
                  >
                    <Plus className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      웹툰 추가
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{newWebtoon.id ? "웹툰 수정" : "새 웹툰 추가"}</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-4">
                    <Input
                      placeholder="웹툰 제목"
                      value={newWebtoon.title}
                      onChange={(e) =>
                        setNewWebtoon({ ...newWebtoon, title: e.target.value })
                      }
                    />

                    {/* Thumbnail */}
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium">썸네일</span>
                      {newWebtoon.thumbnail ? (
                        <div className="relative aspect-[3/4] w-32 rounded-lg overflow-hidden">
                          <Image
                            src={newWebtoon.thumbnail}
                            alt="Thumbnail"
                            fill
                            className="object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() =>
                              setNewWebtoon({ ...newWebtoon, thumbnail: "" })
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => thumbnailInputRef.current?.click()}
                          disabled={uploading === "thumbnail"}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading === "thumbnail"
                            ? "업로드 중..."
                            : "썸네일 업로드"}
                        </Button>
                      )}
                    </div>

                    {/* Webtoon Images */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          웹툰 이미지 ({newWebtoon.images.length}장)
                        </span>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => imagesPrependInputRef.current?.click()}
                            disabled={uploading === "images-prepend" || uploading === "images"}
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            앞에 추가
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => imagesInputRef.current?.click()}
                            disabled={uploading === "images-prepend" || uploading === "images"}
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            뒤에 추가
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {newWebtoon.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-[3/4] rounded-lg overflow-hidden"
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
                            <span className="absolute bottom-1 left-1 text-xs text-white bg-black/60 px-1 rounded">
                              {idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                      {(uploading === "images" || uploading === "images-prepend") && (
                        <p className="text-sm text-muted-foreground mt-1">
                          업로드 중...
                        </p>
                      )}
                    </div>

                    {/* End Character */}
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium">
                        엔딩 캐릭터 (선택)
                      </span>
                      {newWebtoon.endCharacterImage ? (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                          <Image
                            src={newWebtoon.endCharacterImage}
                            alt="End character"
                            fill
                            className="object-contain"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() =>
                              setNewWebtoon({
                                ...newWebtoon,
                                endCharacterImage: "",
                              })
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => endCharInputRef.current?.click()}
                          disabled={uploading === "endChar"}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading === "endChar"
                            ? "업로드 중..."
                            : "캐릭터 업로드"}
                        </Button>
                      )}
                    </div>

                    <Button
                      onClick={handleSaveWebtoon}
                      disabled={!newWebtoon.title || !newWebtoon.thumbnail}
                    >
                      {newWebtoon.id ? "수정하기" : "추가하기"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </div>

      {/* Webtoon Modal */}
      <WebtoonModal
        webtoon={selectedWebtoon}
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
