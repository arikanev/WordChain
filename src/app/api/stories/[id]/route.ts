import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Props = {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  context: Props
) {
  try {
    const story = await prisma.story.findUnique({
      where: { id: context.params.id },
      include: {
        words: {
          select: { text: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    return NextResponse.json(story)
  } catch (error) {
    console.error('Failed to fetch story:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 