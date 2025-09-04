import { PrismaClient } from '@prisma/client';
import { Video } from '../model/videoModel';

const prisma = new PrismaClient();

export class VideoService {
  /**
   * Create a new video in the database.
   * - Accepts a Video object along with `packId` to associate it with a pack.
   * - Uses Prisma to insert the video and connect it to an existing pack.
   * 
   * @param data - The video data including packId.
   * @returns A Promise that resolves to the newly created Video.
   */
  async createVideo(data: Video & { packId: string }): Promise<Video> {
    return prisma.video.create({
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        duration: data.duration,
        link: data.link,
        // Connect the video to an existing pack by its ID
        pack: {
          connect: { id: data.packId }
        }
      },
    });
  }

  /**
   * Retrieve a video by its unique ID.
   * 
   * @param id - The ID of the video to fetch.
   * @returns A Promise that resolves to the Video if found, or `null` if not found.
   */
  async getVideoById(id: string): Promise<Video | null> {
    return prisma.video.findUnique({
      where: { id },
    });
  }

  /**
   * Retrieve all videos from the database.
   * 
   * @returns A Promise that resolves to an array of all Videos.
   */
  async getAllVideos(): Promise<Video[]> {
    return prisma.video.findMany();
  }

//   async updateUser(id: string, data: UpdateUserDto): Promise<User> {
//     const updateData = { ...data };
    
//     if (data.password) {
//       updateData.password = await hash(data.password, 10);
//     }

//     return prisma.user.update({
//       where: { id },
//       data: updateData,
//     });
//   }

//   async deleteUser(id: string): Promise<User> {
//     return prisma.user.delete({
//       where: { id },
//     });
//   }

//   async deleteAllUsers(): Promise<void> {
//     await prisma.$transaction([
//       // Delete related records first
//       prisma.reservation.deleteMany({}),
//       prisma.passwordResetToken.deleteMany({}),
//       prisma.session.deleteMany({}),
//       prisma.account.deleteMany({}),
//       prisma.event.deleteMany({}),
//       // Then delete all users
//       prisma.user.deleteMany({})
//     ]);
//   }
}
