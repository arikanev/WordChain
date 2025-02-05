import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Word Chain Stories',
  description: 'Create and share word chain stories with friends',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="transition-colors duration-200">
        {children}
      </body>
    </html>
  )
} 