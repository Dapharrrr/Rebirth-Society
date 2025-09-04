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
    console.error('Erreur lors de la récupération des vidéos:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des vidéos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, duration, link, packId } = body

    // Validation des données
    if (!title || !description || !duration || !link || !packId) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Vérifier que le pack existe
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
  } catch (error: any) {
    console.error('Erreur lors de la création de la vidéo:', error)
    
    // Gestion de l'erreur de lien unique
    if (error.code === 'P2002' && error.meta?.target?.includes('link')) {
      return NextResponse.json(
        { error: 'Ce lien de vidéo existe déjà' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de la vidéo' },
      { status: 500 }
    )
  }
}
