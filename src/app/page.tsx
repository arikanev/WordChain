import StoryList from '@/components/StoryList'
import CreateStory from '@/components/CreateStory'

export default function Home() {
  return (
    <main className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
        Word Chain Stories
      </h1>
      <CreateStory />
      <StoryList />
    </main>
  )
} 