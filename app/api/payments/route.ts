import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

/**
 * Payment Infrastructure - Ready but Inactive
 * 
 * This API is prepared for future payment integration with:
 * - Stripe (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY)
 * - PayPal (PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)
 * 
 * To activate payments:
 * 1. Set payment provider API keys in .env.local
 * 2. Update this route to call Stripe/PayPal APIs
 * 3. Configure PaymentMethod records in database
 * 4. Use webhook endpoints to handle payment callbacks
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      registrationId,
      amount,
      currency = 'USD',
      paymentMethod = 'stripe',
    } = body;

    if (!registrationId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if payment provider is configured
    const provider = await prisma.paymentMethod.findUnique({
      where: { provider: paymentMethod },
    });

    if (!provider || !provider.isActive) {
      return NextResponse.json(
        {
          error: 'Payment provider not available',
          message: 'Payments are currently in demo mode. Please contact support.',
        },
        { status: 503 }
      );
    }

    // Create payment record with pending status
    const payment = await prisma.payment.create({
      data: {
        registrationId,
        amount,
        currency,
        status: 'pending',
        paymentMethod,
      },
    });

    // TODO: Implement actual payment processing
    // if (paymentMethod === 'stripe') {
    //   // Call Stripe API
    // } else if (paymentMethod === 'paypal') {
    //   // Call PayPal API
    // }

    return NextResponse.json(
      {
        payment,
        message: 'Payment infrastructure ready. Configure API keys to enable payments.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Payment POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID required' },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { id: transactionId },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Payment GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment' },
      { status: 500 }
    );
  }
}
