import { createHash, randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export type PaymentMethod = "bank_transfer" | "card";
export type OrderStatus =
  | "pending_bank_transfer"
  | "pending_payment"
  | "paid"
  | "failed"
  | "cancelled";

export interface OrderRecord {
  id: string;
  serviceSlug: string;
  serviceTitle: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  payfastTransactionId?: string;
}

const ORDERS_DIR = path.join(process.cwd(), "data", "orders");

async function ensureOrdersDir() {
  await fs.mkdir(ORDERS_DIR, { recursive: true });
}

export function generateOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomBytes(3).toString("hex").toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function saveOrder(order: OrderRecord) {
  await ensureOrdersDir();
  const filePath = path.join(ORDERS_DIR, `${order.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(order, null, 2), "utf-8");
  return order;
}

export async function getOrder(orderId: string) {
  try {
    const filePath = path.join(ORDERS_DIR, `${orderId}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as OrderRecord;
  } catch {
    return null;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  extra: Partial<OrderRecord> = {},
) {
  const order = await getOrder(orderId);
  if (!order) {
    return null;
  }

  const updatedOrder: OrderRecord = {
    ...order,
    ...extra,
    status,
    updatedAt: new Date().toISOString(),
  };

  return saveOrder(updatedOrder);
}

export function parsePrice(price: string) {
  const numeric = Number(price.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

export function createPayfastSignature(
  merchantId: string,
  merchantName: string,
  amount: number,
  basketId: string,
) {
  return createHash("md5")
    .update(`${merchantId}:${merchantName}:${amount}:${basketId}`)
    .digest("hex");
}
