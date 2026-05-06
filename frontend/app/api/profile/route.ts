import { type NextRequest, NextResponse } from "next/server"
import { getProfile, saveProfile } from "@/lib/data"

export async function GET() {
  try {
    const profile = await getProfile()
    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    await saveProfile(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving profile:", error)
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
  }
}
