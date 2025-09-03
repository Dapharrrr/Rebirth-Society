import { NextRequest } from 'next/server';
import { VideoController } from './controller/videoController';

export const dynamic = 'force-dynamic';

const videoController = new VideoController();

export async function GET() {
  return videoController.getAllVideos();
}

export async function POST(request: NextRequest) {
  return videoController.createVideo(request);
}

// export async function DELETE() {
//   return userController.deleteAllUsers();
// }
