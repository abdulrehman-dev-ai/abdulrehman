import { NextRequest, NextResponse } from "next/server";
import { getPosts } from "@/app/utils/utils";
import { baseURL } from "@/app/resources";
import { generateOrderId, parsePrice, saveOrder } from "@/lib/orders";
import { buildPayfastCheckout } from "@/lib/payfast";

interface CheckoutRequestBody {
  serviceSlug: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company?: string;
  notes?: string;
}

function getServiceBySlug(slug: string) {
  return getPosts(["src", "app", "services", "items"]).find((item) => item.slug === slug);
}

export async function POST(request: NextRequest) {
  // Explicit launch gate: Vercel's filesystem is ephemeral and the current
  // JSON order store is not a durable production database.
  // Keep checkout disabled until D1 persistence, callback verification,
  // abuse controls and end-to-end order tests are complete.
  if (process.env.ORDER_CHECKOUT_ENABLED !== "true") {
    return NextResponse.json(
      { error: "Online ordering is not available yet. Please contact us for a quote." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
  try {
    const body = (await request.json()) as CheckoutRequestBody;
    const { serviceSlug, customerName, customerEmail, customerPhone, company, notes } = body;

    if (!serviceSlug || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ error: "Missing required checkout fields." }, { status: 400 });
    }

    const service = getServiceBySlug(serviceSlug);

    if (!service) {
      return NextResponse.json({ error: "Service not found." }, { status: 404 });
    }

    const amount = parsePrice(service.metadata.price);

    if (!amount) {
      return NextResponse.json({ error: "Invalid service price." }, { status: 400 });
    }

    const orderId = generateOrderId();
    const now = new Date().toISOString();
    const siteUrl = `https://${baseURL}`;

    await saveOrder({
      id: orderId,
      serviceSlug,
      serviceTitle: service.metadata.title,
      amount,
      currency: service.metadata.currency || "PKR",
      customerName,
      customerEmail,
      customerPhone,
      company,
      notes,
      paymentMethod: "card",
      status: "pending_payment",
      createdAt: now,
      updatedAt: now,
    });

    const checkout = await buildPayfastCheckout({
      orderId,
      amount,
      customerEmail,
      customerPhone,
      description: `${service.metadata.title} - ${businessName()}`,
      successUrl: `${siteUrl}/order/success?orderId=${orderId}&method=card`,
      failureUrl: `${siteUrl}/order/failed?orderId=${orderId}`,
      callbackUrl: `${siteUrl}/api/payfast/callback`,
    });

    return NextResponse.json({ checkout });
  } catch (error) {
    console.error("PayFast checkout failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to start PayFast checkout. Please try bank transfer or contact support.",
      },
      { status: 500 },
    );
  }
}

function businessName() {
  return process.env.PAYFAST_MERCHANT_NAME || "Abdul Rehman Tech Solutions";
}
