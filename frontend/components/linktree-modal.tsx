"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Globe,
  Instagram,
  Mail,
  Twitter,
  Youtube,
  LinkIcon,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react"
import type { LinkItem } from "@/types"

interface LinktreeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  links: LinkItem[]
  isAdmin: boolean
  onAddLink: (link: Omit<LinkItem, "id">) => void
  onDeleteLink: (id: string) => void
}

const linkTypeIcons = {
  blog: Globe,
  instagram: Instagram,
  email: Mail,
  twitter: Twitter,
  youtube: Youtube,
  other: LinkIcon,
}

const linkTypeLabels = {
  blog: "블로그",
  instagram: "인스타그램",
  email: "이메일",
  twitter: "트위터",
  youtube: "유튜브",
  other: "기타",
}

export function LinktreeModal({
  open,
  onOpenChange,
  links,
  isAdmin,
  onAddLink,
  onDeleteLink,
}: LinktreeModalProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newLink, setNewLink] = useState<Omit<LinkItem, "id">>({
    type: "blog",
    label: "",
    url: "",
  })

  const handleAddLink = () => {
    if (newLink.label && newLink.url) {
      onAddLink(newLink)
      setNewLink({ type: "blog", label: "", url: "" })
      setIsAdding(false)
    }
  }

  const handleLinkClick = (link: LinkItem) => {
    if (link.type === "email") {
      window.location.href = `mailto:${link.url}`
    } else {
      window.open(link.url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Link
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
          {links.length === 0 && !isAdmin && (
            <p className="text-center text-muted-foreground py-8">
              등록된 링크가 없습니다.
            </p>
          )}

          {links.map((link) => {
            const Icon = linkTypeIcons[link.type]
            return (
              <div
                key={link.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-accent transition-colors cursor-pointer group"
                onClick={() => handleLinkClick(link)}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1 font-medium">{link.label}</span>
                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteLink(link.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            )
          })}

          {isAdmin && !isAdding && (
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              링크 추가
            </Button>
          )}

          {isAdmin && isAdding && (
            <div className="flex flex-col gap-3 p-4 rounded-lg border bg-card">
              <Select
                value={newLink.type}
                onValueChange={(value) =>
                  setNewLink({
                    ...newLink,
                    type: value as LinkItem["type"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(linkTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="표시 이름"
                value={newLink.label}
                onChange={(e) =>
                  setNewLink({ ...newLink, label: e.target.value })
                }
              />
              <Input
                placeholder={
                  newLink.type === "email"
                    ? "이메일 주소"
                    : "URL (https://...)"
                }
                value={newLink.url}
                onChange={(e) =>
                  setNewLink({ ...newLink, url: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsAdding(false)
                    setNewLink({ type: "blog", label: "", url: "" })
                  }}
                >
                  취소
                </Button>
                <Button className="flex-1" onClick={handleAddLink}>
                  추가
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

