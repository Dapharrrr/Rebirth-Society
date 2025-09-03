/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { PackController } from '../controller/cartController';

const packController = new PackController();

export async function GET(request: NextRequest, context: any) {
  return packController.getPackById(request, context.params.id);
}

// export async function PUT(request: NextRequest, context: any) {
//   return userController.updateUser(request, context.params.id);
// }

// export async function DELETE(request: NextRequest, context: any) {
//   return userController.deleteUser(context.params.id);
// }
