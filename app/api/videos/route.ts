import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      include: {
        pack: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error retrieving videos:', error)
    return NextResponse.json(
      { error: 'Error retrieving videos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, duration, link, packId } = body

    // Data validation
    if (!title || !description || !duration || !link || !packId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if the pack exists
    const pack = await prisma.pack.findUnique({
      where: { id: packId }
    })

    if (!pack) {
      return NextResponse.json(
        { error: 'Pack non trouvé' },
        { status: 404 }
      )
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        duration: parseInt(duration),
        link,
        packId,
      },
      include: {
        pack: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error: unknown) {
    console.error('Error while creating the video:', error)
    
    // Single link error management
    const errObj = error as { code?: string; meta?: { target?: string[] } };
    if (errObj.code === 'P2002' && errObj.meta?.target?.includes('link')) {
      return NextResponse.json(
        { error: 'This video link already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error while creating the video' },
      { status: 500 }
    )
  }
}
