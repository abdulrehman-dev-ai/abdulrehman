"use client";
import { useEffect, useState } from "react";
import styles from "./ProjectBrief.module.scss";

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
  const [feedback, setFeedback] = useState("");

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

  function prepare(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("Your email app should open with the prepared inquiry. Please press Send there to complete it.");
    window.location.href = "mailto:" + email +
      "?subject=" + encodeURIComponent("Project inquiry: " + (service || kind)) +
      "&body=" + encodeURIComponent(message);
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
      setFeedback("Copy isn't available in this browser. Use Prepare email inquiry or email " + email + " directly.");
    }
  }

  return <form className={styles.form} onSubmit={prepare}>
    <div className={styles.grid}>
      <label>What are you planning?
        <select value={kind} onChange={e => setKind(e.target.value)}>
          {categories.map(option => <option key={option}>{option}</option>)}
        </select>
      </label>
      <label>Estimated budget
        <select value={budget} onChange={e => setBudget(e.target.value)}>
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
        value={sender} onChange={e => setSender(e.target.value)} placeholder="you@company.com"/>
    </label>
    <label>What outcome do you need?
      <input required minLength={10} maxLength={180}
        value={goal} onChange={e => setGoal(e.target.value)} placeholder="A client portal with secure login…"/>
    </label>
    <label>Anything else?
      <textarea maxLength={2400} rows={5} value={details}
        onChange={e => setDetails(e.target.value)} placeholder="Timeline, existing stack, links or constraints…"/>
    </label>
    <div className={styles.actions}>
      <button className="neo-action neo-action--primary" type="submit">
        Prepare email inquiry <span className="neo-action__icon" aria-hidden="true">↗</span>
      </button>
      <button className="neo-action neo-action--secondary" type="button" onClick={copyInquiry}>
        Copy inquiry <span className="neo-action__icon" aria-hidden="true">⧉</span>
      </button>
    </div>
    {feedback && <p className={styles.feedback} role="status">{feedback}</p>}
    <p className={styles.notice}>Nothing is submitted automatically. Send the prepared email yourself, or copy it into your preferred email app.</p>
  </form>;
}