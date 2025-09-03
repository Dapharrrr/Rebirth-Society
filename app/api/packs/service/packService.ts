import { PrismaClient } from '@prisma/client';
import { Pack } from '../model/packModel';

const prisma = new PrismaClient();

export class PackService {
  async createPack(data: Pack): Promise<Pack> {
    return prisma.pack.create({
      data: {
        ...data,
      },
    });
  }

  async getPackById(id: string): Promise<Pack | null> {
    return prisma.pack.findUnique({
      where: { id },
    });
  }

  async getAllPacks(): Promise<Pack[]> {
    return prisma.pack.findMany();
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
