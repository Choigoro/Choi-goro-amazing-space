import { type NextRequest, NextResponse } from "next/server"
import {
  getWebtoons,
  addWebtoon,
  deleteWebtoon,
  updateWebtoon,
} from "@/lib/data"
import type { Webtoon } from "@/types"

export async function GET() {
  try {
    const webtoons = await getWebtoons()
    return NextResponse.json(webtoons)
  } catch (error) {
    console.error("Error fetching webtoons:", error)
    return NextResponse.json(
      { error: "Failed to fetch webtoons" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: Webtoon = await request.json()
    await addWebtoon({
      ...data,
      id: data.id || crypto.randomUUID(),
      createdAt: data.createdAt || new Date().toISOString(),
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding webtoon:", error)
    return NextResponse.json(
      { error: "Failed to add webtoon" },
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
    await updateWebtoon(id, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating webtoon:", error)
    return NextResponse.json(
      { error: "Failed to update webtoon" },
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
    await deleteWebtoon(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting webtoon:", error)
    return NextResponse.json(
      { error: "Failed to delete webtoon" },
      { status: 500 }
    )
  }
}
