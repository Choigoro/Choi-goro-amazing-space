import type { Metadata } from "next"
import { Noto_Sans_KR, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: 'The most "Choi goro" amazing space',
  description: "작가 포트폴리오 웹사이트",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="light">
      <body className={`${notoSansKr.variable} ${playfairDisplay.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
