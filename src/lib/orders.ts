import { createHash, randomBytes } from "crypto";

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

import { d1Query } from "./d1-rest";

export function generateOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomBytes(8).toString("hex").toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function saveOrder(order: OrderRecord) {
  await d1Query(
    `INSERT INTO orders (id, service_slug, service_title, amount, currency, customer_name, customer_email,
      customer_phone, company, notes, payment_method, status, created_at, updated_at, payfast_transaction_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET status=excluded.status, updated_at=excluded.updated_at,
      payfast_transaction_id=excluded.payfast_transaction_id`,
    [order.id, order.serviceSlug, order.serviceTitle, order.amount, order.currency,
      order.customerName, order.customerEmail, order.customerPhone, order.company || null,
      order.notes || null, order.paymentMethod, order.status, order.createdAt, order.updatedAt,
      order.payfastTransactionId || null],
  );
  return order;
}

export async function getOrder(orderId: string) {
  if (!/^ORD-[A-Z0-9-]+$/.test(orderId)) return null;
  const rows = await d1Query("SELECT * FROM orders WHERE id = ? LIMIT 1", [orderId]);
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id, serviceSlug: row.service_slug, serviceTitle: row.service_title,
    amount: row.amount, currency: row.currency, customerName: row.customer_name,
    customerEmail: row.customer_email, customerPhone: row.customer_phone,
    company: row.company, notes: row.notes, paymentMethod: row.payment_method,
    status: row.status, createdAt: row.created_at, updatedAt: row.updated_at,
    payfastTransactionId: row.payfast_transaction_id,
  } as OrderRecord;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, extra: Partial<OrderRecord> = {}) {
  const order = await getOrder(orderId);
  if (!order) return null;
  return saveOrder({ ...order, ...extra, status, updatedAt: new Date().toISOString() });
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
