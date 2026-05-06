"use client"

import { useState, useEffect } from "react"
import { CategoryCard } from "@/components/category-card"
import { AdminAuthDialog } from "@/components/admin-auth-dialog"
import { LinktreeModal } from "@/components/linktree-modal"
import { CategoryEditDialog } from "@/components/category-edit-dialog"
import { ProfileModal } from "@/components/profile-modal"
import type { CategoryImage, LinkItem } from "@/types"

export default function HomePage() {
  const [categories, setCategories] = useState<CategoryImage[]>([])
  const [links, setLinks] = useState<LinkItem[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [linktreeOpen, setLinktreeOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [categoryEditOpen, setCategoryEditOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check admin auth from session storage
    const authStatus = sessionStorage.getItem("admin_auth")
    if (authStatus === "true") {
      setIsAdmin(true)
    }

    // Fetch data
    const fetchData = async () => {
      try {
        const [categoriesRes, linksRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/linktree"),
        ])
        const [categoriesData, linksData] = await Promise.all([
          categoriesRes.json(),
          linksRes.json(),
        ])
        setCategories(categoriesData)
        setLinks(linksData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddLink = async (link: Omit<LinkItem, "id">) => {
    try {
      const response = await fetch("/api/linktree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(link),
      })
      if (response.ok) {
        const linksRes = await fetch("/api/linktree")
        const linksData = await linksRes.json()
        setLinks(linksData)
      }
    } catch (error) {
      console.error("Error adding link:", error)
    }
  }

  const handleDeleteLink = async (id: string) => {
    try {
      const response = await fetch("/api/linktree", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        setLinks(links.filter((l) => l.id !== id))
      }
    } catch (error) {
      console.error("Error deleting link:", error)
    }
  }

  const handleUpdateCategory = async (
    id: string,
    grayscaleImage: string,
    colorImage: string
  ) => {
    try {
      const response = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, grayscaleImage, colorImage }),
      })
      if (response.ok) {
        setCategories(
          categories.map((c) =>
            c.id === id ? { ...c, grayscaleImage, colorImage } : c
          )
        )
      }
    } catch (error) {
      console.error("Error updating category:", error)
    }
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
      <div className="absolute inset-0 pointer-events-none flex justify-center z-0 opacity-10">
        <div className="w-full max-w-7xl h-full border-x border-foreground flex justify-between px-4 sm:px-0">
          <div className="hidden sm:block w-px h-full bg-foreground/50"></div>
          <div className="hidden md:block w-px h-full bg-foreground/50"></div>
          <div className="hidden lg:block w-px h-full bg-foreground/50"></div>
        </div>
      </div>

      {/* Cinematic Vignette Overlay to focus center */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.15)_100%)] z-[1]" />

      {/* Faint Background Typography */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none overflow-hidden z-0">
        <div className="flex flex-col items-center justify-center font-[family-name:var(--font-playfair)] tracking-tighter leading-[0.8] whitespace-nowrap">
          <span className="text-[18vw] italic text-foreground">Choi goro</span>
          <span className="text-[16vw] font-bold text-foreground">THE ARCHIVE</span>
        </div>
      </div>

      {/* Header - NYT Inspired */}
      <header className="relative z-10 flex flex-col items-center justify-center pt-10 pb-6 md:pt-16 md:pb-10 shrink-0 text-center px-4 w-full">
        <div className="max-w-4xl w-full flex flex-col items-center">
          <div className="w-full flex justify-between items-center border-y border-muted-foreground/30 py-2 mb-8 text-[10px] md:text-sm text-muted-foreground font-[family-name:var(--font-playfair)] tracking-widest uppercase">
            <span>Vol. 1</span>
            <span>The Masterpiece Collection</span>
            <span>Seoul, KR</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold italic tracking-tight text-foreground font-[family-name:var(--font-playfair)] mb-6">
            The most "Choi goro" amazing space
          </h1>
          
          <p className="max-w-2xl text-xs md:text-sm lg:text-base text-muted-foreground/70 leading-relaxed font-[family-name:var(--font-playfair)] italic border-l-2 border-muted-foreground/30 pl-4 text-left mx-auto">
            "Every act of creation is first an act of destruction." <br className="hidden md:block"/>
            Welcome to an exclusive gallery exploring the depths of imagination and storytelling. Where lines, shadows, and digital realms converge to evoke the deepest emotions.
          </p>
        </div>
      </header>

      {/* Category List */}
      <div className="container max-w-7xl mx-auto px-4 pb-8 flex-1 flex flex-col relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onModalClick={
                category.isModal 
                  ? () => {
                      if (category.id === "profile") setProfileOpen(true);
                      if (category.id === "linktree") setLinktreeOpen(true);
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* Admin Auth Button */}
      <AdminAuthDialog
        isAuthenticated={isAdmin}
        onAuthenticate={setIsAdmin}
        onOpenAdmin={() => setCategoryEditOpen(true)}
      />

      {/* Linktree Modal */}
      <LinktreeModal
        open={linktreeOpen}
        onOpenChange={setLinktreeOpen}
        links={links}
        isAdmin={isAdmin}
        onAddLink={handleAddLink}
        onDeleteLink={handleDeleteLink}
      />

      {/* Profile Modal */}
      <ProfileModal
        open={profileOpen}
        onOpenChange={setProfileOpen}
        isAdmin={isAdmin}
      />

      {/* Category Edit Dialog (Admin Only) */}
      {isAdmin && (
        <CategoryEditDialog
          open={categoryEditOpen}
          onOpenChange={setCategoryEditOpen}
          categories={categories}
          onUpdateCategory={handleUpdateCategory}
        />
      )}
    </main>
  )
}
