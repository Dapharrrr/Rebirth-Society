/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { CartController } from '../controller/cartController';

const cartController = new CartController();

export async function GET(request: NextRequest, context: any) {
  return cartController.getCartById(request, context.params.id);
}

// export async function PUT(request: NextRequest, context: any) {
//   return userController.updateUser(request, context.params.id);
// }

// export async function DELETE(request: NextRequest, context: any) {
//   return userController.deleteUser(context.params.id);
// }
