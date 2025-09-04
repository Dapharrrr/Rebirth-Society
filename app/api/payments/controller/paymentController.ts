import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PaymentService } from '../service/paymentService';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  async createCheckoutSession(request: NextRequest) {
    try {
      const data = await request.json();
      const session = await this.paymentService.createCheckoutSession(data);
      return NextResponse.json(session);
    } catch (error) {
      console.error('PaymentController error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 400 }
      );
    }
  }
}
