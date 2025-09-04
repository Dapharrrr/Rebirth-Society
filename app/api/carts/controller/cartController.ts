import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CartService } from '../service/cartService';
import { Cart } from '../model/cartModel';

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  /**
   * Create a new cart.
   * Reads the request body as JSON, validates it against the Cart model,
   * then delegates to CartService to persist the new cart.
   * Returns the created cart with a 201 status, or an error with 400 status.
   */
  async createCart(request: NextRequest) {
    try {
      const cartData: Cart = await request.json();
      const cart = await this.cartService.createCart(cartData);
      return NextResponse.json(cart, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 400 }
      );
    }
  }

   /**
   * Retrieve a cart by its ID.
   * Delegates to CartService to fetch the cart by its identifier.
   * Returns the cart if found, or a 404 error if the cart does not exist.
   */
  async getCartById(request: NextRequest, id: string) {
    try {
      const cart = await this.cartService.getCartById(id);
      if (!cart) {
        return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
      }
      return NextResponse.json(cart);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 400 }
      );
    }
  }

  /**
   * Retrieve all carts.
   * Delegates to CartService to fetch all existing carts in the database.
   * Returns an array of carts, or a 400 error if retrieval fails.
   */
  async getAllCarts() {
    try {
      const carts = await this.cartService.getAllCarts();
      return NextResponse.json(carts);
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
