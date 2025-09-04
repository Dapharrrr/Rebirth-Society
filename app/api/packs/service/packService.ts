import { PrismaClient } from '@prisma/client';
import { Pack } from '../model/packModel';

const prisma = new PrismaClient();

export class PackService {
  /**
   * Create a new pack in the database.
   * - Accepts a Pack object with all necessary fields.
   * - Uses Prisma to insert the pack into the database.
   * 
   * @param data - The pack data to create.
   * @returns A Promise that resolves to the newly created Pack.
   */
  async createPack(data: Pack): Promise<Pack> {
    return prisma.pack.create({
      data: {
        ...data,
      },
    });
  }

  /**
   * Retrieve a single pack by its unique ID.
   * 
   * @param id - The ID of the pack to fetch.
   * @returns A Promise that resolves to the Pack if found, or `null` if not found.
   */
  async getPackById(id: string): Promise<Pack | null> {
    return prisma.pack.findUnique({
      where: { id },
    });
  }

  /**
   * Retrieve all packs from the database.
   * 
   * @returns A Promise that resolves to an array of Pack objects.
   */
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
