import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PaymentService } from '../service/paymentService';
import { prisma } from '../../../lib/prisma';

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

  async verifyCheckoutSession(request: NextRequest) {
    try {
      const data = await request.json();
      const session = await this.paymentService.retrieveSession(data.sessionId);
      // If payment completed and there's a logged user, persist purchase
      if (session.payment_status === 'paid') {
        try {
          const userId = session.metadata?.userId as string | undefined;
          const packId = session.metadata?.packId as string | undefined;
          if (userId && packId) {
            // create purchase if not existing
            await prisma.purchase.upsert({
              where: { stripeSessionId: session.id },
              update: {},
              create: {
                userId,
                packId,
                amount: session.amount_total ?? 0,
                currency: session.currency ?? 'eur',
                stripeSessionId: session.id,
              },
            });
          }
        } catch (e) {
          console.error('Error saving purchase', e);
        }
      }

      return NextResponse.json(session);
    } catch (error) {
      console.error('PaymentController verify error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 400 }
      );
    }
  }
}
