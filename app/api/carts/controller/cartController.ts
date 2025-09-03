import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CartService } from '../service/cartService';
import { Cart } from '../model/cartModel';

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

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
