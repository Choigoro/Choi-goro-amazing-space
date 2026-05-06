"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Webtoon } from "@/types"

interface WebtoonModalProps {
  webtoon: Webtoon | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WebtoonModal({
  webtoon,
  open,
  onOpenChange,
}: WebtoonModalProps) {
  const [showEndCharacter, setShowEndCharacter] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      setShowEndCharacter(false)
    }
  }, [open])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const isAtBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 100

    if (isAtBottom && webtoon?.endCharacterImage) {
      setShowEndCharacter(true)
    }
  }

  if (!webtoon) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[100dvh] sm:h-[95vh] max-h-[100dvh] p-0 overflow-hidden border-none sm:rounded-xl rounded-none bg-background/95 backdrop-blur-xl w-full translate-y-[-50%]">
        <DialogHeader className="sr-only">
          <DialogTitle>{webtoon.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea
          className="h-[100dvh] sm:h-[95vh] w-full"
          onScrollCapture={handleScroll}
          ref={scrollRef}
        >
          <div className="flex flex-col gap-0 min-h-full pb-20">
            {webtoon.images.map((image, index) => (
              <div key={index} className="relative w-full">
                <Image
                  src={image}
                  alt={`${webtoon.title} - ${index + 1}`}
                  width={800}
                  height={1200}
                  className="w-full h-auto"
                  priority={index < 2}
                />
              </div>
            ))}

            {/* End Character */}
            {webtoon.endCharacterImage && (
              <div
                className={`relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] mt-20 mb-8 mx-auto transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  showEndCharacter
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-[30%]"
                }`}
              >
                <Image
                  src={webtoon.endCharacterImage}
                  alt="End character"
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            )}

            {/* End Text */}
            <p
              className={`text-center text-muted-foreground text-sm mb-8 transition-all duration-500 delay-300 ${
                showEndCharacter ? "opacity-100" : "opacity-0"
              }`}
            >
              - End -
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
