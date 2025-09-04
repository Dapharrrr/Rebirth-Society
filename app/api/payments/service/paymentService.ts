import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
  throw new Error('STRIPE_SECRET_KEY not set in environment');
}

const stripe = new Stripe(stripeSecret, { 
  apiVersion: '2025-08-27.basil', // Updated to required version
  typescript: true // Enable TypeScript support
});

interface CheckoutSessionData {
  price: number;
  currency?: string;
  productName?: string;
  successUrl: string;
  cancelUrl: string;
  packId?: string;
  userId?: string;
}

interface CheckoutSessionResponse {
  id: string;
  url: string | null;
}

export class PaymentService {
  async createCheckoutSession(data: CheckoutSessionData): Promise<CheckoutSessionResponse> {
    const { price, currency = 'eur', productName = 'Purchase', successUrl, cancelUrl } = data;

    if (!price || !successUrl || !cancelUrl) {
      throw new Error('Missing required parameters: price, successUrl, cancelUrl');
    }

    // Stripe expects amount in cents
    const amount = Math.round(Number(price) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: productName },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        packId: data.packId ?? '',
        userId: data.userId ?? '',
      },
    });

    return { id: session.id, url: session.url };
  }
  
  async retrieveSession(sessionId: string) {
    if (!sessionId) throw new Error('sessionId is required');

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });

    return {
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
  payment_intent: session.payment_intent,
  metadata: session.metadata,
    };
  }
}
