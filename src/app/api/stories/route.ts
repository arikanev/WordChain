import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

export async function GET() {
  const stories = await prisma.story.findMany({
    include: {
      words: {
        select: { text: true },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
    where: { active: true },
  })

  return NextResponse.json(stories)
}

export async function POST(request: Request) {
  const { word } = await request.json()
  const token = uuidv4()

  const story = await prisma.story.create({
    data: {
      words: {
        create: {
          text: word,
          addedBy: token,
        },
      },
    },
  })

  return NextResponse.json({ id: story.id, token })
} 