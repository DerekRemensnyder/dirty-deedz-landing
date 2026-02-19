import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const body = await req.json();
  const { pinName, address, months, monthlyPrice, totalPrice, customerName, customerEmail } = body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Dirty Deedz — ${pinName}`,
            description: `${address} · ${months}-month lease`,
          },
          unit_amount: totalPrice * 100, // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      pin_name: pinName,
      address,
      months: String(months),
      monthly_price: String(monthlyPrice),
      customer_name: customerName,
    },
    success_url: `${req.nextUrl.origin}/map/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.nextUrl.origin}/map`,
  });

  return NextResponse.json({ url: session.url });
}
