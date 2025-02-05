'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function AddWord() {
  const [word, setWord] = useState('')
  const [story, setStory] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [expired, setExpired] = useState(false)
  const [shareableLink, setShareableLink] = useState('')
  const params = useParams()

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`/api/stories/${params.id}`)
        if (!response.ok) {
          console.error('Failed to fetch story:', response.statusText)
          return
        }
        const data = await response.json()
        if (data.words) {
          setStory(data.words.map((w: { text: string }) => w.text))
        }
      } catch (error) {
        console.error('Failed to fetch story:', error)
      }
    }

    fetchStory()
    // Set up polling to keep the story updated
    const storyInterval = setInterval(fetchStory, 2000)

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setExpired(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
      clearInterval(storyInterval)
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (expired) return

    const trimmedWord = word.trim()
    if (trimmedWord.includes(' ')) {
      setWord('')
      return
    }

    try {
      const response = await fetch(`/api/stories/${params.id}/words`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: trimmedWord, token: params.token }),
      })

      if (!response.ok) {
        console.error('Failed to add word:', response.statusText)
        return
      }

      const data = await response.json()
      if (data.token) {
        const newUrl = `${window.location.origin}/story/${params.id}/${data.token}`
        setShareableLink(newUrl)
      }
    } catch (error) {
      console.error('Failed to add word:', error)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="story-card p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Continue the Story
        </h1>

        <div className="word-chain mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {story.map((word, index) => (
              <span
                key={index}
                className="word-orb word-animation"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6 text-center">
          <p className="text-xl font-semibold">
            Time remaining: {timeLeft} seconds
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={word}
            onChange={(e) => {
              const value = e.target.value.replace(/\s/g, '')
              setWord(value)
            }}
            placeholder="Add your word..."
            className="w-full p-3 border rounded-lg bg-background text-text focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            disabled={expired}
            required
          />
          <button
            type="submit"
            className={`w-full p-3 rounded-lg text-white transition ${
              expired 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary-hover'
            }`}
            disabled={expired}
          >
            Add Word
          </button>
          {expired && (
            <p className="text-red-500 text-center font-medium">
              Time expired! This link is no longer valid.
            </p>
          )}
        </form>

        {shareableLink && (
          <div className="mt-8 p-4 bg-card rounded-lg border border-primary/20">
            <p className="text-center mb-4">
              Share this link with the next person:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareableLink}
                readOnly
                className="w-full p-3 bg-background text-text rounded-lg text-sm border focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareableLink)
                  const btn = document.activeElement as HTMLButtonElement;
                  const originalText = btn.innerText;
                  btn.innerText = 'Copied!';
                  setTimeout(() => {
                    btn.innerText = originalText;
                  }, 2000);
                }}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition whitespace-nowrap"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 