import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { word, token } = await request.json()

  // Check if story exists and is active
  const story = await prisma.story.findUnique({
    where: { id: params.id },
    include: { words: true },
  })

  if (!story || !story.active) {
    return NextResponse.json({ error: 'Story not found or inactive' }, { status: 404 })
  }

  // Check if word limit reached
  if (story.words.length >= 20) {
    await prisma.story.update({
      where: { id: params.id },
      data: { active: false },
    })
    return NextResponse.json({ error: 'Story has reached word limit' }, { status: 400 })
  }

  // Check if token is valid (last word's token)
  const lastWord = story.words[story.words.length - 1]
  if (lastWord.addedBy !== token) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
  }

  const newToken = uuidv4()
  
  await prisma.word.create({
    data: {
      text: word,
      storyId: params.id,
      addedBy: newToken,
    },
  })

  return NextResponse.json({ token: newToken })
} 