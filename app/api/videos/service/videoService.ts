import { PrismaClient } from '@prisma/client';
import { Video } from '../model/videoModel';

const prisma = new PrismaClient();

export class VideoService {
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

  async getVideoById(id: string): Promise<Video | null> {
    return prisma.video.findUnique({
      where: { id },
    });
  }

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
