import { NextRequest } from 'next/server';
import { PaymentController } from '../controller/paymentController';

const paymentController = new PaymentController();

export async function POST(request: NextRequest) {
  return paymentController.verifyCheckoutSession(request);
}
