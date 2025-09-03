import { NextRequest } from 'next/server';
import { PackController } from './controller/packController';

export const dynamic = 'force-dynamic';

const packController = new PackController();

export async function GET() {
  return packController.getAllPacks();
}

export async function POST(request: NextRequest) {
  return packController.createPack(request);
}

// export async function DELETE() {
//   return userController.deleteAllUsers();
// }
