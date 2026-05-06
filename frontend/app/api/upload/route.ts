import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import sharp from "sharp"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    // If you always want to convert to webp, you can disregard this frontend param, 
    // or just assume we'll convert all images.
    const convertToWebp = true; // Forced conversion to webp for images

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    let filename = file.name
    const isImage = file.type.startsWith("image/")

    if (isImage) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
      filename = `${nameWithoutExt}.webp`
    }

    const bytes = await file.arrayBuffer()
    let buffer = Buffer.from(bytes)

    if (isImage) {
      try {
        buffer = await sharp(buffer)
          .webp({ quality: 80 })
          .toBuffer()
      } catch (error) {
        console.error("Image conversion failed, saving original buffer:", error)
        // Revert filename if conversion fails
        filename = file.name
      }
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const savedFilename = `${uniqueSuffix}-${filename}`

    const uploadDir = join(process.cwd(), 'public', 'uploads')
    
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {
      // Directory may already exist
    }

    const filepath = join(uploadDir, savedFilename)
    await writeFile(filepath, buffer)

    return NextResponse.json({ url: `/uploads/${savedFilename}` })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
