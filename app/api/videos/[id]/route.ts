import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

interface Props {
  params: {
    id: string
  }
}

// GET - Récupérer une vidéo par ID
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const video = await prisma.video.findUnique({
      where: { id: params.id },
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
        { error: 'Vidéo non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error('Erreur lors de la récupération de la vidéo:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la vidéo' },
      { status: 500 }
    )
  }
}

// PUT - Modifier une vidéo
export async function PUT(request: NextRequest, { params }: Props) {
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

    // Vérifier que la vidéo existe
    const existingVideo = await prisma.video.findUnique({
      where: { id: params.id }
    })

    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Vidéo non trouvée' },
        { status: 404 }
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

    // Mettre à jour la vidéo
    const updatedVideo = await prisma.video.update({
      where: { id: params.id },
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
  } catch (error: any) {
    console.error('Erreur lors de la modification de la vidéo:', error)
    
    // Gestion de l'erreur de lien unique
    if (error.code === 'P2002' && error.meta?.target?.includes('link')) {
      return NextResponse.json(
        { error: 'Ce lien de vidéo existe déjà' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modification de la vidéo' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une vidéo
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    // Vérifier que la vidéo existe
    const existingVideo = await prisma.video.findUnique({
      where: { id: params.id }
    })

    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Vidéo non trouvée' },
        { status: 404 }
      )
    }

    // Supprimer la vidéo
    await prisma.video.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Vidéo supprimée avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de la suppression de la vidéo:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la vidéo' },
      { status: 500 }
    )
  }
}
