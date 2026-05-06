"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Illustration } from "@/types"

interface IllustrationModalProps {
  illustration: Illustration | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IllustrationModal({
  illustration,
  open,
  onOpenChange,
}: IllustrationModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!illustration) return null

  const hasMultipleImages = illustration.images.length > 1

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? illustration.images.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === illustration.images.length - 1 ? 0 : prev + 1
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) setCurrentIndex(0)
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-bold">
            {illustration.title}
          </DialogTitle>
          {illustration.description && (
            <p className="text-muted-foreground text-sm mt-2">
              {illustration.description}
            </p>
          )}
        </DialogHeader>

        <div className="relative px-6 pb-6">
          {/* Image */}
          <div className="relative aspect-square md:aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            {illustration.images[currentIndex] && (
              <Image
                src={illustration.images[currentIndex]}
                alt={`${illustration.title} - ${currentIndex + 1}`}
                fill
                className="object-contain"
              />
            )}
          </div>

          {/* Navigation */}
          {hasMultipleImages && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-8 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-accent"
                onClick={goToPrev}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-8 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-accent"
                onClick={goToNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-4">
                {illustration.images.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentIndex
                        ? "bg-foreground"
                        : "bg-muted-foreground/30"
                    }`}
                    onClick={() => setCurrentIndex(idx)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
