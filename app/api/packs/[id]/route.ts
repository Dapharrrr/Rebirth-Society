import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const pack = await prisma.pack.findUnique({
      where: {
        id,
      },
      include: {
        videos: {
          select: {
            id: true,
            title: true,
          }
        },
        _count: {
          select: {
            videos: true,
            carts: true,
          }
        }
      }
    })

    if (!pack) {
      return NextResponse.json(
        { error: 'Pack not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(pack)
  } catch (error) {
    console.error('Error retrieving packs:', error)
    return NextResponse.json(
      { error: 'Error retrieving pack' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { name, description, price, image } = body

    // Data validation
    if (!name || !description || !price || !image) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Price validation
    const priceFloat = parseFloat(price)
    if (isNaN(priceFloat) || priceFloat < 0) {
      return NextResponse.json(
        { error: 'Price must be higher than 0' },
        { status: 400 }
      )
    }

    // Verify if the pack exists
    const existingPack = await prisma.pack.findUnique({
      where: { id }
    })

    if (!existingPack) {
      return NextResponse.json(
        { error: 'Pack not found' },
        { status: 404 }
      )
    }

    // Update pack
    const updatedPack = await prisma.pack.update({
      where: { id },
      data: {
        name,
        description,
        price: priceFloat,
        image,
      },
      include: {
        videos: {
          select: {
            id: true,
            title: true,
          }
        },
        _count: {
          select: {
            videos: true,
            carts: true,
          }
        }
      }
    })

    return NextResponse.json(updatedPack)
  } catch (error: unknown) {
    console.error('Error modifying pack:', error)

    const errObj = error as { code?: string; meta?: { target?: string[] } };
    if (errObj.code === 'P2002' && errObj.meta?.target?.includes('image')) {
      return NextResponse.json(
        { error: 'This image is already used for another pack' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error modifying pack' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    // Verify if the pack exists
    const existingPack = await prisma.pack.findUnique({
      where: { id },
      include: {
        videos: true,
        carts: true,
      }
    })

    if (!existingPack) {
      return NextResponse.json(
        { error: 'Pack not found' },
        { status: 404 }
      )
    }

    if (existingPack.videos.length > 0) {
      return NextResponse.json(
        { error: 'Impossible to delete a pack that contains videos' },
        { status: 400 }
      )
    }

    if (existingPack.carts.length > 0) {
      return NextResponse.json(
        { error: 'Impossible to delete a pack that is in a cart' },
        { status: 400 }
      )
    }

    // Delete pack
    await prisma.pack.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Pack deleted successfully' },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Error deleting pack:', error)

    const errObj = error as { code?: string };
    // Error management
    if (errObj.code === 'P2003') {
      return NextResponse.json(
        { error: 'Impossible to delete this pack because it is used by others' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error deleting pack' },
      { status: 500 }
    )
  }
}
