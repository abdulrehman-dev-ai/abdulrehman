/**
 * Platform-neutral D1 lead repository.
 * This module has no Vercel/Workers-specific imports and never sends email.
 * The API adapter supplies a validated Cloudflare D1 binding plus admin recipient.
 */
const kinds = new Set([
  "Full-stack application", "Business website / e-commerce",
  "Cloud migration / DevOps", "Security assessment", "Other",
]);
const budgets = new Set([
  "Let's discuss", "Below PKR 50,000", "PKR 50,000–150,000",
  "PKR 150,000+", "International / custom quote",
]);

export type InquirySubmission = {
  kind: string;
  budget: string;
  sender: string;
  goal: string;
  details?: string;
  service?: string;
  source?: string;
};

export type D1Bound = string | number | null;
export interface D1Statement {
  bind(...values: D1Bound[]): D1Statement;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
}
export interface D1Connection {
  prepare(sql: string): D1Statement;
  /** Cloudflare D1 batch executes statements transactionally. */
  batch(statements: D1Statement[]): Promise<unknown[]>;
}

export class InvalidInquiryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidInquiryError";
  }
}

const txt = (value: unknown, max: number) =>
  typeof value === "string" && value.length <= max ? value.trim() : null;

export function validateInquiry(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new InvalidInquiryError("Invalid inquiry payload.");
  const raw = value as Record<string, unknown>;
  const kind = txt(raw.kind, 100);
  const budget = txt(raw.budget, 100);
  const sender = txt(raw.sender, 254);
  const goal = txt(raw.goal, 180);
  const details = txt(raw.details ?? "", 2400);
  const service = txt(raw.service ?? "", 120);
  const source = txt(raw.source ?? "portfolio", 120);
  if (!kind || !kinds.has(kind) || !budget || !budgets.has(budget))
    throw new InvalidInquiryError("Select a valid project type and budget.");
  if (!sender || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sender) ||
      /[\r\n]/.test(sender))
    throw new InvalidInquiryError("Enter a valid contact email.");
  if (!goal || goal.length < 10 || details === null ||
      service === null || source === null || !source ||
      (service !== "" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(service)))
    throw new InvalidInquiryError("Check the project details.");
  return { kind, budget, sender, goal, details, service, source };
}

export async function recordInquiryAndQueue(
  db: D1Connection,
  body: unknown,
  requestKey: string,
  adminEmail: string,
): Promise<{ id: string; duplicate: boolean }> {
  const input = validateInquiry(body);
  // Random UUIDs are unguessable, so a duplicate key can be safely returned to
  // the same client retry. Never use email or IP as the idempotency key.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestKey))
    throw new InvalidInquiryError("Invalid request reference.");
  if (typeof adminEmail !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail))
    throw new Error("Administrator notification recipient is not configured.");

  const existing = await db.prepare("SELECT id,client_email,goal FROM inquiries WHERE request_key=?")
    .bind(requestKey).first<{ id: string; client_email: string; goal: string }>();
  if (existing) {
    if (existing.client_email !== input.sender || existing.goal !== input.goal)
      throw new InvalidInquiryError("This request reference was already used.");
    return { id: existing.id, duplicate: true };
  }

  const leadId = crypto.randomUUID();
  const eventId = crypto.randomUUID();
  const mailId = crypto.randomUUID();
  const message = [
    "New portfolio project inquiry", "",
    "Project type: " + input.kind,
    ...(input.service ? ["Service: " + input.service] : []),
    "Client email: " + input.sender,
    "Budget: " + input.budget,
    "Goal: " + input.goal,
    "", "Additional context:", input.details || "(none)",
    "", "Reference: " + leadId,
  ].join("\n");

  try {
    await db.batch([
      db.prepare(
        "INSERT INTO inquiries(id,request_key,client_email,project_type,service_slug,budget_band,goal,details,source) VALUES(?,?,?,?,?,?,?,?,?)"
      ).bind(leadId, requestKey, input.sender, input.kind, input.service || null, input.budget, input.goal, input.details, input.source),
      db.prepare("INSERT INTO inquiry_events(id,inquiry_id,event_type,actor) VALUES(?,?,?,?)")
        .bind(eventId, leadId, "created", "system"),
      db.prepare(
        "INSERT INTO email_outbox(id,idempotency_key,entity_type,entity_id,purpose,recipient,subject,body_text) VALUES(?,?,?,?,?,?,?,?)"
      ).bind(mailId, "inquiry:" + leadId + ":admin", "inquiry", leadId, "admin_notice",
        adminEmail, "New portfolio project inquiry", message),
    ]);
    return { id: leadId, duplicate: false };
  } catch (error) {
    // Two concurrent requests with the same client idempotency key may race.
    const duplicate = await db.prepare("SELECT id,client_email,goal FROM inquiries WHERE request_key=?")
      .bind(requestKey).first<{ id: string; client_email: string; goal: string }>();
    if (duplicate && duplicate.client_email === input.sender && duplicate.goal === input.goal)
      return { id: duplicate.id, duplicate: true };
    throw error;
  }
}
