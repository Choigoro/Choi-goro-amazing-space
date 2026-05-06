"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export function NavigationButtons() {
  const router = useRouter()
  const pathname = usePathname()

  // Don't show on main page
  if (pathname === "/") {
    return null
  }

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="bg-background/80 backdrop-blur-sm hover:bg-accent"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">뒤로 가기</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push("/")}
        className="bg-background/80 backdrop-blur-sm hover:bg-accent"
      >
        <Home className="h-5 w-5" />
        <span className="sr-only">홈으로</span>
      </Button>
    </div>
  )
}
