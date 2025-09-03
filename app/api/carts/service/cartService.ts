import { PrismaClient } from '@prisma/client';
import { Cart } from '../model/cartModel';

const prisma = new PrismaClient();

export class CartService {
  async createCart(data: Cart): Promise<Cart> {
    return prisma.cart.create({
      data: {
        id: data.id,
        totalPrice: data.totalPrice,
        user: {
          connect: { id: data.userId }, // assuming data.userId exists
        },
        pack: {
          connect: { id: data.packId }, // assuming data.packId exists
        },
      },
    });
  }

  async getCartById(id: string): Promise<Cart | null> {
    return prisma.cart.findUnique({
      where: { id },
    });
  }

  async getAllCarts(): Promise<Cart[]> {
    return prisma.cart.findMany();
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
