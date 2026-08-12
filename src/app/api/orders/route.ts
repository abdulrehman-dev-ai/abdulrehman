import { NextRequest, NextResponse } from "next/server";
import { getPosts } from "@/app/utils/utils";
import { baseURL } from "@/app/resources";
import {
  generateOrderId,
  parsePrice,
  saveOrder,
  type PaymentMethod,
} from "@/lib/orders";

interface OrderRequestBody {
  serviceSlug: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
}

function getServiceBySlug(slug: string) {
  return getPosts(["src", "app", "services", "items"]).find((item) => item.slug === slug);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OrderRequestBody;
    const {
      serviceSlug,
      customerName,
      customerEmail,
      customerPhone,
      company,
      notes,
      paymentMethod,
    } = body;

    if (!serviceSlug || !customerName || !customerEmail || !customerPhone || !paymentMethod) {
      return NextResponse.json({ error: "Missing required order fields." }, { status: 400 });
    }

    if (paymentMethod !== "bank_transfer") {
      return NextResponse.json(
        { error: "Use the PayFast checkout endpoint for card payments." },
        { status: 400 },
      );
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

    const order = await saveOrder({
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
      paymentMethod,
      status: "pending_bank_transfer",
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      order,
      redirectUrl: `https://${baseURL}/order/success?orderId=${orderId}&method=bank_transfer`,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: "Unable to create order." }, { status: 500 });
  }
}
