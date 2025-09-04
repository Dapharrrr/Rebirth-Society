import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserService } from '../service/userService';
import { User } from '../model/userModel';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Create a new user in the database.
   * - Reads JSON data from the request body.
   * - Delegates to UserService to persist the user.
   * 
   * @param request - The incoming HTTP request containing user data.
   * @returns A JSON response with the created user and status 201 on success,
   *          or an error message with status 400 on failure.
   */
  async createUser(request: NextRequest) {
    try {
      const userData: User = await request.json();
      const user = await this.userService.createUser(userData);
      return NextResponse.json(user, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 400 }
      );
    }
  }

  /**
   * Retrieve a user by their unique ID.
   * 
   * @param request - The incoming HTTP request.
   * @param id - The ID of the user to fetch.
   * @returns A JSON response containing the user if found,
   *          404 if not found, or 400 if an error occurs.
   */
  async getUserById(request: NextRequest, id: string) {
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 400 }
      );
    }
  }

  /**
   * Retrieve all users from the database.
   * 
   * @returns A JSON response with the list of all users,
   *          or an error message with status 400 if retrieval fails.
   */
  async getAllUsers() {
    try {
      const users = await this.userService.getAllUsers();
      return NextResponse.json(users);
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
