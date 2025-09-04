import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { User } from '../model/userModel';

const prisma = new PrismaClient();

export class UserService {
  /**
   * Create a new user in the database.
   * - Validates email format.
   * - Validates password strength (min 8 characters, uppercase, lowercase, digit, special character).
   * - Hashes the password before storing it.
   * 
   * @param data - The user data to create, including email and password.
   * @returns A Promise that resolves to the newly created User.
   * @throws An error if email or password validation fails.
   */
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

  /**
   * Retrieve a user by their unique ID.
   * 
   * @param id - The ID of the user to fetch.
   * @returns A Promise that resolves to the User if found, or `null` if not found.
   */
  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Retrieve a user by their email address.
   * Useful for login and authentication.
   * 
   * @param email - The email of the user to fetch.
   * @returns A Promise that resolves to the User if found, or `null` if not found.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Retrieve all users from the database.
   * 
   * @returns A Promise that resolves to an array of all Users.
   */
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
