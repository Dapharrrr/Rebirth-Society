import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

// GET - Retrieve a video by ID
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        pack: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error('rror retrieving videos', error)
    return NextResponse.json(
      { error: 'Error retrieving videos' },
      { status: 500 }
    )
  }
}

// PUT - Modify a video
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { title, description, duration, link, packId } = body

    // Data validation
    if (!title || !description || !duration || !link || !packId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check that the video exists
    const existingVideo = await prisma.video.findUnique({
      where: { id }
    })

    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Vidéo non trouvée' },
        { status: 404 }
      )
    }

    // Check if the pack exists
    const pack = await prisma.pack.findUnique({
      where: { id: packId }
    })

    if (!pack) {
      return NextResponse.json(
        { error: 'Pack not found' },
        { status: 404 }
      )
    }

    // Update video
    const updatedVideo = await prisma.video.update({
      where: { id },
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

    return NextResponse.json(updatedVideo)
  } catch (error: unknown) {
    console.error('Error during video modification:', error)
    
    // Single link error management
    const errObj = error as { code?: string; meta?: { target?: string[] } };
    if (errObj.code === 'P2002' && errObj.meta?.target?.includes('link')) {
      return NextResponse.json(
        { error: 'This video link already exists' },
        { status: 400 }
      )
    }
  
    return NextResponse.json(
      { error: 'Error during video modification' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a video
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    // Verify that the video exists
    const existingVideo = await prisma.video.findUnique({
      where: { id }
    })

    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    // Delete video
    await prisma.video.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Video successfully deleted' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error while deleting the video:', error)
    return NextResponse.json(
      { error: 'Error while deleting the video' },
      { status: 500 }
    )
  }
}
