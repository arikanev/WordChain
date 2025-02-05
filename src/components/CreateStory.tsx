'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateStory() {
  const [word, setWord] = useState('')
  const [shareableLink, setShareableLink] = useState('')
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // For HTTPS or localhost
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for HTTP
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
        } finally {
          textArea.remove()
        }
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: word.trim() }),
      })

      if (!response.ok) {
        console.error('Failed to create story:', response.statusText)
        return
      }

      const data = await response.json()
      if (data.id && data.token) {
        const newUrl = `${window.location.origin}/story/${data.id}/${data.token}`
        setShareableLink(newUrl)
      }
    } catch (error) {
      console.error('Failed to create story:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto story-card p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Start a New Story</h2>
      {!shareableLink ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Enter the first word..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            required
          />
          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-lg hover:bg-primary-hover transition"
          >
            Start Story
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-center text-text-secondary mb-4">
            Share this link with someone to continue the story:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareableLink}
              readOnly
              className="w-full p-3 bg-background text-text rounded-lg text-sm border focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <button
              onClick={() => copyToClipboard(shareableLink)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 