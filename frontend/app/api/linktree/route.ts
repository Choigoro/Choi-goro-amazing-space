import { type NextRequest, NextResponse } from "next/server"
import { getLinktree, addLink, deleteLink, updateLink } from "@/lib/data"
import type { LinkItem } from "@/types"

export async function GET() {
  try {
    const links = await getLinktree()
    return NextResponse.json(links)
  } catch (error) {
    console.error("Error fetching links:", error)
    return NextResponse.json(
      { error: "Failed to fetch links" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: LinkItem = await request.json()
    await addLink({
      ...data,
      id: data.id || crypto.randomUUID(),
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding link:", error)
    return NextResponse.json({ error: "Failed to add link" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }
    await updateLink(id, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating link:", error)
    return NextResponse.json(
      { error: "Failed to update link" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }
    await deleteLink(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting link:", error)
    return NextResponse.json(
      { error: "Failed to delete link" },
      { status: 500 }
    )
  }
}
