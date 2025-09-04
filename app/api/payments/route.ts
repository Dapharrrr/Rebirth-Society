import { NextRequest, NextResponse } from 'next/server';
import { PaymentController } from './controller/paymentController';

export const dynamic = 'force-dynamic';

const paymentController = new PaymentController();

export async function POST(request: NextRequest) {
  return paymentController.createCheckoutSession(request);
}
