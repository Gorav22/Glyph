import Head from "next/head"
import "./globals.css"
import { Inter } from "next/font/google"
// import { useEffect } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Glyph",
  description: "A full-stack browser application inspired by Arc",
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

