"use client";
import { useEffect, useState } from "react";
import styles from "./ProjectBrief.module.scss";
import actionStyles from "./ui/ActionLink.module.scss";

const categories = [
  "Full-stack application", "Business website / e-commerce",
  "Cloud migration / DevOps", "Security assessment", "Other",
];

function describeService(slug: string) {
  if (/wordpress|website|commerce/i.test(slug)) return "Business website / e-commerce";
  if (/cloud|devops|docker|linux|server|migration/i.test(slug)) return "Cloud migration / DevOps";
  if (/vulnerability|penetration|security/i.test(slug)) return "Security assessment";
  if (/full-stack|application/i.test(slug)) return "Full-stack application";
  return "Other";
}

export default function ProjectBrief({ email }: { email: string }) {
  const [kind, setKind] = useState(categories[0]);
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("Let's discuss");
  const [sender, setSender] = useState("");
  const [goal, setGoal] = useState("");
  const [details, setDetails] = useState("");
  const [website, setWebsite] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service") || "";
    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length < 100) {
      setService(slug);
      setKind(describeService(slug));
    }
  }, []);

  const message = [
    "Project type: " + kind,
    ...(service ? ["Requested service: " + service.replace(/-/g, " ")] : []),
    "Contact email: " + sender,
    "Indicative budget: " + budget,
    "Goal: " + goal,
    "",
    "Additional context:",
    details || "I'd like to discuss the scope and next steps.",
    "",
    "Please reply with the next steps.",
  ].join("\n");

  const emailHref =
    "mailto:" + email +
    "?subject=" + encodeURIComponent("Project inquiry: " + (service || kind)) +
    "&body=" + encodeURIComponent(message);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || sent) return;
    setSending(true);
    setFeedback("");
    try {
      const result = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, service, budget, sender, goal, details, website }),
      });
      if (!result.ok) {
        setFeedback("Direct submission couldn't be completed. Please use the email option below.");
        return;
      }
      setSent(true);
      setFeedback("Your inquiry was accepted for email sending. I'll follow up using the address you provided.");
    } catch {
      setFeedback("The connection failed. Please use the email option below.");
    } finally {
      setSending(false);
    }
  }

  async function copyInquiry() {
    if (!sender.trim() || goal.trim().length < 10) {
      setFeedback("Enter your email and project goal first, then copy the inquiry.");
      return;
    }
    try {
      await navigator.clipboard.writeText(
        "To: " + email + "\nSubject: Project inquiry: " + (service || kind) + "\n\n" + message
      );
      setFeedback("Inquiry copied. Paste it into your email app and send it to " + email + ".");
    } catch {
      setFeedback("Copy isn't available in this browser. Use the email option or contact " + email + " directly.");
    }
  }

  return <form className={styles.form} onSubmit={submit}>
    <div className={styles.grid}>
      <label>What are you planning?
        <select value={kind} onChange={e => setKind(e.target.value)} disabled={sending || sent}>
          {categories.map(option => <option key={option}>{option}</option>)}
        </select>
      </label>
      <label>Estimated budget
        <select value={budget} onChange={e => setBudget(e.target.value)} disabled={sending || sent}>
          <option>Let's discuss</option>
          <option>Below PKR 50,000</option>
          <option>PKR 50,000–150,000</option>
          <option>PKR 150,000+</option>
          <option>International / custom quote</option>
        </select>
      </label>
    </div>
    {service && <p className={styles.selectedService}>Selected service: {service.replace(/-/g, " ")}</p>}
    <label>Your email
      <input type="email" required maxLength={254} autoComplete="email"
        value={sender} onChange={e => setSender(e.target.value)} disabled={sending || sent}
        placeholder="you@company.com"/>
    </label>
    <label>What outcome do you need?
      <input required minLength={10} maxLength={180} disabled={sending || sent}
        value={goal} onChange={e => setGoal(e.target.value)}
        placeholder="A client portal with secure login…"/>
    </label>
    <label>Anything else?
      <textarea maxLength={2400} rows={5} value={details} disabled={sending || sent}
        onChange={e => setDetails(e.target.value)}
        placeholder="Timeline, existing stack, links or constraints…"/>
    </label>
    <div className={styles.honeypot} aria-hidden="true">
      <label>Website <input type="text" name="website" tabIndex={-1} autoComplete="off"
        value={website} onChange={e => setWebsite(e.target.value)} /></label>
    </div>
    <div className={styles.actions}>
      <button className={"neo-action neo-action--primary " + actionStyles.control + " " + actionStyles.primary}
        type="submit" disabled={sending || sent}>
        {sending ? "Sending inquiry…" : sent ? "Inquiry submitted" : "Send project inquiry"}
        <span className="neo-action__icon" aria-hidden="true">↗</span>
      </button>
      {!sent && <a className={"neo-action neo-action--secondary " + actionStyles.control + " " + actionStyles.secondary}
        href={emailHref}>
        Open email app <span className="neo-action__icon" aria-hidden="true">↗</span>
      </a>}
      {!sent && <button className={"neo-action neo-action--secondary " + actionStyles.control + " " + actionStyles.secondary}
        type="button" onClick={copyInquiry}>
        Copy inquiry <span className="neo-action__icon" aria-hidden="true">⧉</span>
      </button>}
    </div>
    {feedback && <p className={styles.feedback} role="status" aria-live="polite">{feedback}</p>}
    <p className={styles.notice}>Submit directly, or use your email app as a backup. We only use your details to respond to your project inquiry.</p>
  </form>;
}
