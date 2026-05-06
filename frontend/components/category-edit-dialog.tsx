"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import type { CategoryImage } from "@/types"

interface CategoryEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: CategoryImage[]
  onUpdateCategory: (
    id: string,
    grayscaleImage: string,
    colorImage: string
  ) => void
}

export function CategoryEditDialog({
  open,
  onOpenChange,
  categories,
  onUpdateCategory,
}: CategoryEditDialogProps) {
  const [uploading, setUploading] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentUpload, setCurrentUpload] = useState<{
    categoryId: string
    imageType: "grayscale" | "color"
  } | null>(null)

  const handleUploadClick = (
    categoryId: string,
    imageType: "grayscale" | "color"
  ) => {
    setCurrentUpload({ categoryId, imageType })
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentUpload) return

    setUploading(`${currentUpload.categoryId}-${currentUpload.imageType}`)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const { url } = await response.json()
      const category = categories.find((c) => c.id === currentUpload.categoryId)
      if (category) {
        onUpdateCategory(
          currentUpload.categoryId,
          currentUpload.imageType === "grayscale" ? url : category.grayscaleImage,
          currentUpload.imageType === "color" ? url : category.colorImage
        )
      }
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(null)
      setCurrentUpload(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>燁삳똾?믤⑥쥓?????筌왖 ?紐꾩춿</DialogTitle>
        </DialogHeader>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="grid gap-6 py-4">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col gap-3">
              <h3 className="font-semibold">{category.title}</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Grayscale Image */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    흑백 이미지
                  </span>
                  <div className="relative aspect-square rounded-lg border overflow-hidden bg-muted">
                    {category.grayscaleImage ? (
                      <Image
                        src={category.grayscaleImage}
                        alt={`${category.title} grayscale`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUploadClick(category.id, "grayscale")}
                    disabled={uploading === `${category.id}-grayscale`}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading === `${category.id}-grayscale`
                      ? "업로드 중..."
                      : "업로드"}
                  </Button>
                </div>

                {/* Color Image */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    컬러 이미지
                  </span>
                  <div className="relative aspect-square rounded-lg border overflow-hidden bg-muted">
                    {category.colorImage ? (
                      <Image
                        src={category.colorImage}
                        alt={`${category.title} color`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUploadClick(category.id, "color")}
                    disabled={uploading === `${category.id}-color`}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading === `${category.id}-color`
                      ? "업로드 중..."
                      : "업로드"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}


