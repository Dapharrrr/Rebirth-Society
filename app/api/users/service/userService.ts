import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { User } from '../model/userModel';

const prisma = new PrismaClient();

export class UserService {
  async createUser(data: User): Promise<User> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Adresse email invalide.');
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(data.password)) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
    }
    const hashedPassword = await hash(data.password, 10);
    
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return prisma.user.findMany();
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
