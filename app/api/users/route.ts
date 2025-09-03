import { NextRequest } from 'next/server';
import { UserController } from './controller/userController';

export const dynamic = 'force-dynamic';

const userController = new UserController();

export async function GET() {
  return userController.getAllUsers();
}

export async function POST(request: NextRequest) {
  return userController.createUser(request);
}

// export async function DELETE() {
//   return userController.deleteAllUsers();
// }
