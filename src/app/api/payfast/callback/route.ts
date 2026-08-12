import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/orders";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let payload: Record<string, string> = {};

    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        payload[key] = String(value);
      });
    }

    const orderId =
      payload.order_id ||
      payload.BASKET_ID ||
      payload.basket_id ||
      request.nextUrl.searchParams.get("order_id");

    const status = (payload.STATUS || payload.status || payload.transaction_status || "").toLowerCase();
    const transactionId =
      payload.TRANSACTION_ID || payload.transaction_id || payload.transactionId;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID missing." }, { status: 400 });
    }

    if (["success", "completed", "paid", "00"].includes(status)) {
      await updateOrderStatus(orderId, "paid", {
        payfastTransactionId: transactionId,
      });
    } else if (status) {
      await updateOrderStatus(orderId, "failed", {
        payfastTransactionId: transactionId,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayFast callback failed:", error);
    return NextResponse.json({ error: "Callback processing failed." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
