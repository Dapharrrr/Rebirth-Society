import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, packId } = await request.json();
    if (!userId || !packId) return NextResponse.json({ has: false });

    const purchase = await prisma.purchase.findFirst({ where: { userId, packId } });
    return NextResponse.json({ has: !!purchase });
  } catch (err) {
    console.error('purchases/has error', err);
    return NextResponse.json({ has: false }, { status: 500 });
  }
}
