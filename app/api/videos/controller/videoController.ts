import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { VideoService } from '../service/videoService';
import { Video } from '../model/videoModel';

export class VideoController {
  private videoService: VideoService;

  constructor() {
    this.videoService = new VideoService();
  }

  /**
   * Create a new video in the database.
   * - Reads JSON data from the request body.
   * - Ensures that `packId` is provided to associate the video with a pack.
   * - Delegates to VideoService to persist the video.
   * 
   * @param request - The incoming HTTP request containing video data.
   * @returns A JSON response with the created video and status 201 on success,
   *          or an error message with status 400 if validation fails or an error occurs.
   */
  async createVideo(request: NextRequest) {
    try {
      const videoData: Video & { packId: string } = await request.json();
      if (!videoData.packId) {
        return NextResponse.json(
          { error: 'packId is required' },
          { status: 400 }
        );
      }
      const video = await this.videoService.createVideo(videoData);
      return NextResponse.json(video, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 400 }
      );
    }
  }

  /**
   * Retrieve a video by its unique ID.
   * 
   * @param request - The incoming HTTP request.
   * @param id - The ID of the video to fetch.
   * @returns A JSON response containing the video if found,
   *          404 if not found, or 400 if an error occurs.
   */
  async getVideoById(request: NextRequest, id: string) {
    try {
      const video = await this.videoService.getVideoById(id);
      if (!video) {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 });
      }
      return NextResponse.json(video);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 400 }
      );
    }
  }

  /**
   * Retrieve all videos from the database.
   * 
   * @returns A JSON response with the list of all videos,
   *          or an error message with status 400 if retrieval fails.
   */
  async getAllVideos() {
    try {
      const videos = await this.videoService.getAllVideos();
      return NextResponse.json(videos);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 400 }
      );
    }
  }

//   async updateUser(request: NextRequest, id: string) {
//     try {
//       const userData: UpdateUserDto = await request.json();
//       const user = await this.userService.updateUser(id, userData);
//       return NextResponse.json(user);
//     } catch (error) {
//       return NextResponse.json(
//         { error: error instanceof Error ? error.message : 'Unknown error' },
//         { status: 400 }
//       );
//     }
//   }

//   async deleteUser(id: string) {
//     try {
//       await this.userService.deleteUser(id);
//       return new NextResponse(null, { status: 204 });
//     } catch (error) {
//       return NextResponse.json(
//         { error: error instanceof Error ? error.message : 'Unknown error' },
//         { status: 400 }
//       );
//     }
//   }

//   async deleteAllUsers() {
//     try {
//       await this.userService.deleteAllUsers();
//       return NextResponse.json({ message: 'All users deleted successfully' }, { status: 200 });
//     } catch (error) {
//       return NextResponse.json(
//         { error: error instanceof Error ? error.message : 'Unknown error' },
//         { status: 400 }
//       );
//     }
//   }
}
