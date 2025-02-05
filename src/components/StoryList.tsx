'use client'

import { useEffect, useState } from 'react'

interface Story {
  id: string
  words: { text: string }[]
  createdAt: string
}

export default function StoryList() {
  const [stories, setStories] = useState<Story[]>([])

  useEffect(() => {
    const fetchStories = async () => {
      const response = await fetch('/api/stories')
      const data = await response.json()
      setStories(data)
    }

    fetchStories()
    const interval = setInterval(fetchStories, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Recent Stories</h2>
      <div className="space-y-6">
        {stories.map((story, storyIndex) => (
          <div key={story.id} className="story-card p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {story.words.map((word, index) => (
                <span
                  key={index}
                  className="word-orb word-animation"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {word.text}
                </span>
              ))}
            </div>
            <p className="text-sm text-text-secondary">
              Started {new Date(story.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
} 