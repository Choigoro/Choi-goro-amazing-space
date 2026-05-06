import { type NextRequest, NextResponse } from "next/server"
import {
  getIllustrations,
  addIllustration,
  deleteIllustration,
  updateIllustration,
} from "@/lib/data"
import type { Illustration } from "@/types"

export async function GET() {
  try {
    const illustrations = await getIllustrations()
    return NextResponse.json(illustrations)
  } catch (error) {
    console.error("Error fetching illustrations:", error)
    return NextResponse.json(
      { error: "Failed to fetch illustrations" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: Illustration = await request.json()
    await addIllustration({
      ...data,
      id: data.id || crypto.randomUUID(),
      createdAt: data.createdAt || new Date().toISOString(),
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding illustration:", error)
    return NextResponse.json(
      { error: "Failed to add illustration" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 })
    }
    await updateIllustration(id, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating illustration:", error)
    return NextResponse.json(
      { error: "Failed to update illustration" },
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
    await deleteIllustration(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting illustration:", error)
    return NextResponse.json(
      { error: "Failed to delete illustration" },
      { status: 500 }
    )
  }
}
