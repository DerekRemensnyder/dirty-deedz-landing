import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

interface CheckoutItem {
  pinName: string;
  address: string;
  months: number;
  monthlyPrice: number;
  parcels: number;
  parcelIndex?: number;
  totalParcels?: number;
  totalPrice: number;
  designOption: string;
  designFee: number;
  adMessage?: string;
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const body = await req.json();
  const { items, customerName, customerEmail } = body as {
    items: CheckoutItem[];
    customerName: string;
    customerEmail: string;
  };

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
    const parcelLabel = item.totalParcels && item.totalParcels > 1
      ? ` · Parcel ${item.parcelIndex} of ${item.totalParcels}`
      : "";

    const designLabel = item.designOption === "need_design"
      ? "Designed by Dirty Deedz (+$200)"
      : "Client template";

    const descParts = [
      item.address,
      `${item.months}-month lease · $${item.monthlyPrice}/mo`,
      `Design: ${designLabel}`,
    ];
    if (item.adMessage) {
      descParts.push(`Ad copy: "${item.adMessage}"`);
    }

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: `Dirty Deedz — ${item.pinName}${parcelLabel}`,
          description: descParts.join(" | "),
          metadata: {
            address: item.address,
            lease_months: String(item.months),
            monthly_rate: String(item.monthlyPrice),
            design_option: item.designOption,
            design_fee: String(item.designFee),
            ...(item.adMessage ? { ad_copy: item.adMessage } : {}),
            ...(item.parcelIndex ? { parcel_index: String(item.parcelIndex) } : {}),
            ...(item.totalParcels ? { total_parcels: String(item.totalParcels) } : {}),
          },
        },
        unit_amount: item.totalPrice * 100,
      },
      quantity: 1,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: customerEmail,
    line_items,
    mode: "payment",
    metadata: {
      customer_name: customerName,
      items_count: String(items.length),
      pin_names: items.map((i) => i.pinName).join(", "),
    },
    success_url: `${req.nextUrl.origin}/map/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.nextUrl.origin}/map`,
  });

  return NextResponse.json({ url: session.url });
}
