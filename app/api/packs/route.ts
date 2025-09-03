import { NextRequest } from 'next/server';
import { PackController } from './controller/packController';
import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'

export const dynamic = 'force-dynamic';

const packController = new PackController();

export async function GET() {
  try {
    const packs = await prisma.pack.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            videos: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(packs)
  } catch (error) {
    console.error('Erreur lors de la récupération des packs:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des packs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return packController.createPack(request);
}

// export async function DELETE() {
//   return userController.deleteAllUsers();
// }
