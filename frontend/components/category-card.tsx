"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { CategoryImage } from "@/types"

interface CategoryCardProps {
  category: CategoryImage
  onModalClick?: () => void
}

export function CategoryCard({ category, onModalClick }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const hasImages = category.grayscaleImage && category.colorImage

  const content = (
    <div
      className="relative w-full h-full min-h-[350px] md:min-h-[450px] overflow-hidden cursor-pointer group border-y sm:border border-foreground/40 hover:border-foreground transition-colors duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {hasImages ? (
        <>
          {/* Grayscale Image (default) */}
          <Image
            src={category.grayscaleImage}
            alt={category.title}
            fill
            className={`object-cover transition-all duration-700 ease-out ${
              isHovered ? "opacity-0 scale-105" : "opacity-100 scale-100 grayscale-[0.8]"
            }`}
          />
          {/* Color Image (on hover) */}
          <Image
            src={category.colorImage}
            alt={category.title}
            fill
            className={`object-cover transition-all duration-700 ease-out ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100 grayscale"
            }`}
          />
          {/* Title Overlay for images */}
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-500 ${
              isHovered ? "opacity-100 backdrop-blur-sm" : "opacity-0"
            }`}
          >
            <h2 className="text-white text-3xl md:text-4xl font-bold italic tracking-widest font-[family-name:var(--font-playfair)] px-4 text-center border-y border-white/30 py-4 w-[80%]">
              {category.title}
            </h2>
          </div>
        </>
      ) : (
        /* Placeholder when no images - shows title always */
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            isHovered ? "bg-foreground" : "bg-transparent"
          }`}
        >
          <h2 
            className={`text-3xl md:text-4xl font-bold italic tracking-widest font-[family-name:var(--font-playfair)] border-y border-current py-4 w-[80%] text-center transition-colors duration-500 ${
              isHovered ? "text-background border-background/30" : "text-foreground border-foreground/30"
            }`}
          >
            {category.title}
          </h2>
        </div>
      )}
    </div>
  )

  if (category.isModal) {
    return (
      <button
        type="button"
        onClick={onModalClick}
        className="w-full h-full text-left focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {content}
      </button>
    )
  }

  return (
    <Link href={category.href} className="block h-full">
      {content}
    </Link>
  )
}
