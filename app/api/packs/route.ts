// app/api/packs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'

export async function GET() {
  try {
    console.log('GET /api/packs called') // Debug

    const packs = await prisma.pack.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('Packs found:', packs.length) // Debug
    return NextResponse.json(packs)
  } catch (error) {
    console.error('Error retrieving packs:', error)
    return NextResponse.json(
      { error: 'Error retrieving packs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const pack = await prisma.pack.create({
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

    return NextResponse.json(pack, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating pack', error)
    
    const errObj = error as { code?: string; meta?: { target?: string[] } };
    // Single error image
    if (errObj.code === 'P2002' && errObj.meta?.target?.includes('image')) {
      return NextResponse.json(
        { error: 'This image is already used' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error creating pack' },
      { status: 500 }
    )
  }
}
