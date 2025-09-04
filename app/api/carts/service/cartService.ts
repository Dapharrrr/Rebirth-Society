import { PrismaClient } from '@prisma/client';
import { Cart } from '../model/cartModel';

const prisma = new PrismaClient();

export class CartService {
  /**
   * Create a new cart in the database.
   * - Connects the cart to an existing user via `userId`.
   * - Connects the cart to an existing pack via `packId`.
   * - Persists the `id` and `totalPrice` along with relations.
   * 
   * @param data - Cart data including `id`, `totalPrice`, `userId`, and `packId`.
   * @returns The newly created cart.
   */
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

  /**
   * Retrieve a cart by its unique ID.
   * 
   * @param id - The ID of the cart to fetch.
   * @returns The cart object if found, otherwise `null`.
   */
  async getCartById(id: string): Promise<Cart | null> {
    return prisma.cart.findUnique({
      where: { id },
    });
  }

  /**
   * Retrieve all carts from the database.
   * 
   * @returns An array of all existing carts.
   */
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
