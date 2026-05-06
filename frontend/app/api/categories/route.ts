import { type NextRequest, NextResponse } from "next/server"
import { getCategories, updateCategory, saveCategories } from "@/lib/data"

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
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
    await updateCategory(id, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const categories = await request.json()
    await saveCategories(categories)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving categories:", error)
    return NextResponse.json(
      { error: "Failed to save categories" },
      { status: 500 }
    )
  }
}
