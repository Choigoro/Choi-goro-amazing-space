"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, LogOut } from "lucide-react"

interface AdminAuthDialogProps {
  isAuthenticated: boolean
  onAuthenticate: (success: boolean) => void
  onOpenAdmin: () => void
  showLogout?: boolean
}

const ADMIN_PASSWORD = "1234"

export function AdminAuthDialog({
  isAuthenticated,
  onAuthenticate,
  onOpenAdmin,
  showLogout = true,
}: AdminAuthDialogProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true")
      onAuthenticate(true)
      setOpen(false)
      setPassword("")
      setError("")
      onOpenAdmin()
    } else {
      setError("비밀번호媛 ??몄뒿?덈떎.")
    }
  }

  const handleClick = () => {
    if (isAuthenticated) {
      onOpenAdmin()
    } else {
      setOpen(true)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth")
    onAuthenticate(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        {isAuthenticated && showLogout && (
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 backdrop-blur-sm hover:bg-accent"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">로그아웃</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="bg-background/80 backdrop-blur-sm hover:bg-accent"
          onClick={handleClick}
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">愿由ъ옄 ?ㅼ젙</span>
        </Button>
      </div>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>愿由ъ옄 ?몄쬆</DialogTitle>
          <DialogDescription>
            愿由ъ옄 鍮꾨?踰덊샇瑜??낅젰?섏꽭??
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="password"
            placeholder="鍮꾨?踰덊샇"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError("")
            }}
            autoFocus
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit">확인</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
