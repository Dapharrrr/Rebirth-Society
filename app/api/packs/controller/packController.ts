import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PackService } from '../service/packService';
import { Pack } from '../model/packModel';

export class PackController {
  private packService: PackService;

  constructor() {
    this.packService = new PackService();
  }

   /**
   * Create a new pack in the database.
   * - Reads JSON data from the request body.
   * - Passes the data to the PackService to persist it.
   * 
   * @param request - The incoming HTTP request with pack data in the body.
   * @returns A JSON response with the created pack and status 201 on success,
   *          or an error message with status 400 on failure.
   */
  async createPack(request: NextRequest) {
    try {
      const packData: Pack = await request.json();
      const pack = await this.packService.createPack(packData);
      return NextResponse.json(pack, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 400 }
      );
    }
  }

  /**
   * Retrieve a pack by its unique ID.
   * 
   * @param request - The incoming HTTP request.
   * @param id - The ID of the pack to retrieve.
   * @returns A JSON response containing the pack if found,
   *          404 if not found, or 400 if an error occurs.
   */
  async getPackById(request: NextRequest, id: string) {
    try {
      const pack = await this.packService.getPackById(id);
      if (!pack) {
        return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
      }
      return NextResponse.json(pack);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 400 }
      );
    }
  }

  /**
   * Retrieve all packs from the database.
   * 
   * @returns A JSON response with the list of all packs,
   *          or an error message with status 400 if retrieval fails.
   */
  async getAllPacks() {
    try {
      const packs = await this.packService.getAllPacks();
      return NextResponse.json(packs);
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
