import { promises as fs } from "fs"
import path from "path"
import type {
  Profile,
  Webtoon,
  Illustration,
  LinkItem,
  CategoryImage,
} from "@/types"

const DATA_DIR = path.join(process.cwd(), "data")

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function readJsonFile<T>(filename: string, defaultValue: T): Promise<T> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)
  try {
    const data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data) as T
  } catch {
    return defaultValue
  }
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

// Profile
export async function getProfile(): Promise<Profile> {
  return readJsonFile<Profile>("profile.json", {
    imageUrl: "",
    bio: "",
  })
}

export async function saveProfile(profile: Profile): Promise<void> {
  await writeJsonFile("profile.json", profile)
}

// Webtoons
export async function getWebtoons(): Promise<Webtoon[]> {
  return readJsonFile<Webtoon[]>("webtoons.json", [])
}

export async function saveWebtoons(webtoons: Webtoon[]): Promise<void> {
  await writeJsonFile("webtoons.json", webtoons)
}

export async function addWebtoon(webtoon: Webtoon): Promise<void> {
  const webtoons = await getWebtoons()
  webtoons.push(webtoon)
  await saveWebtoons(webtoons)
}

export async function deleteWebtoon(id: string): Promise<void> {
  const webtoons = await getWebtoons()
  const filtered = webtoons.filter((w) => w.id !== id)
  await saveWebtoons(filtered)
}

export async function updateWebtoon(
  id: string,
  data: Partial<Webtoon>
): Promise<void> {
  const webtoons = await getWebtoons()
  const index = webtoons.findIndex((w) => w.id === id)
  if (index !== -1) {
    webtoons[index] = { ...webtoons[index], ...data }
    await saveWebtoons(webtoons)
  }
}

// Illustrations
export async function getIllustrations(): Promise<Illustration[]> {
  return readJsonFile<Illustration[]>("illustrations.json", [])
}

export async function saveIllustrations(
  illustrations: Illustration[]
): Promise<void> {
  await writeJsonFile("illustrations.json", illustrations)
}

export async function addIllustration(
  illustration: Illustration
): Promise<void> {
  const illustrations = await getIllustrations()
  illustrations.push(illustration)
  await saveIllustrations(illustrations)
}

export async function deleteIllustration(id: string): Promise<void> {
  const illustrations = await getIllustrations()
  const filtered = illustrations.filter((i) => i.id !== id)
  await saveIllustrations(filtered)
}

export async function updateIllustration(
  id: string,
  data: Partial<Illustration>
): Promise<void> {
  const illustrations = await getIllustrations()
  const index = illustrations.findIndex((i) => i.id === id)
  if (index !== -1) {
    illustrations[index] = { ...illustrations[index], ...data }
    await saveIllustrations(illustrations)
  }
}

// Linktree
export async function getLinktree(): Promise<LinkItem[]> {
  return readJsonFile<LinkItem[]>("linktree.json", [])
}

export async function saveLinktree(links: LinkItem[]): Promise<void> {
  await writeJsonFile("linktree.json", links)
}

export async function addLink(link: LinkItem): Promise<void> {
  const links = await getLinktree()
  links.push(link)
  await saveLinktree(links)
}

export async function deleteLink(id: string): Promise<void> {
  const links = await getLinktree()
  const filtered = links.filter((l) => l.id !== id)
  await saveLinktree(filtered)
}

export async function updateLink(
  id: string,
  data: Partial<LinkItem>
): Promise<void> {
  const links = await getLinktree()
  const index = links.findIndex((l) => l.id === id)
  if (index !== -1) {
    links[index] = { ...links[index], ...data }
    await saveLinktree(links)
  }
}

// Categories
const defaultCategories: CategoryImage[] = [
  {
    id: "profile",
    title: "Author",
    grayscaleImage: "",
    colorImage: "",
    href: "/profile",
  },
  {
    id: "webtoon",
    title: "Webtoon",
    grayscaleImage: "",
    colorImage: "",
    href: "/webtoon",
  },
  {
    id: "illustration",
    title: "Illustration",
    grayscaleImage: "",
    colorImage: "",
    href: "/illustration",
  },
  {
    id: "linktree",
    title: "Link",
    grayscaleImage: "",
    colorImage: "",
    href: "#",
    isModal: true,
  },
]

export async function getCategories(): Promise<CategoryImage[]> {
  return readJsonFile<CategoryImage[]>("categories.json", defaultCategories)
}

export async function saveCategories(categories: CategoryImage[]): Promise<void> {
  await writeJsonFile("categories.json", categories)
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryImage>
): Promise<void> {
  const categories = await getCategories()
  const index = categories.findIndex((c) => c.id === id)
  if (index !== -1) {
    categories[index] = { ...categories[index], ...data }
    await saveCategories(categories)
  }
}
