/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { VideoController } from '../controller/videoController';

const videoController = new VideoController();

export async function GET(request: NextRequest, context: any) {
  return videoController.getVideoById(request, context.params.id);
}

// export async function PUT(request: NextRequest, context: any) {
//   return userController.updateUser(request, context.params.id);
// }

// export async function DELETE(request: NextRequest, context: any) {
//   return userController.deleteUser(context.params.id);
// }
