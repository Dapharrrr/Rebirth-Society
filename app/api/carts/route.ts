import { NextRequest } from 'next/server';
import { CartController } from './controller/cartController';

export const dynamic = 'force-dynamic';

const cartController = new CartController();

export async function GET() {
  return cartController.getAllCarts();
}

export async function POST(request: NextRequest) {
  return cartController.createCart(request);
}

// export async function DELETE() {
//   return userController.deleteAllUsers();
// }
