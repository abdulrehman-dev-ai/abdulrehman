"use client";

import { useEffect, useState } from "react";
import styles from "./ProjectBrief.module.scss";
import actionStyles from "./ui/ActionLink.module.scss";

const categories = [
  "Full-stack application",
  "Business website / e-commerce",
  "Cloud migration / DevOps",
  "Security assessment",
  "Other",
] as const;
const timelines = [
  "Flexible — let's plan",
  "As soon as possible",
  "Within 2–4 weeks",
  "Within 1–3 months",
  "Exploring options",
] as const;

function describeService(slug: string) {
  if (/wordpress|website|commerce/i.test(slug)) return "Business website / e-commerce";
  if (/cloud|devops|docker|linux|server|migration/i.test(slug)) return "Cloud migration / DevOps";
  if (/vulnerability|penetration|security/i.test(slug)) return "Security assessment";
  if (/full-stack|application/i.test(slug)) return "Full-stack application";
  return "Other";
}
function prettifySlug(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, letter => letter.toUpperCase());
}

export default function ProjectBrief({ email, whatsapp }: { email: string; whatsapp?: string }) {
  const [kind, setKind] = useState<string>(categories[0]);
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("Let's discuss");
  const [timeline, setTimeline] = useState<string>(timelines[0]);
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

  const summary = [
    "Project inquiry",
    "",
    "Project type: " + kind,
    ...(service ? ["Requested service: " + prettifySlug(service)] : []),
    "Contact email: " + (sender.trim() || "(enter your email)"),
    "Indicative budget: " + budget,
    "Target timeline: " + timeline,
    "Project goal: " + (goal.trim() || "(describe your goal)"),
    "",
    "Additional context:",
    details.trim() || "To be discussed.",
    "",
    "Please reply with the next steps and a suitable time to discuss.",
  ].join("\n");

  const subject = "Project inquiry: " + (service ? prettifySlug(service) : kind);
  const emailHref = "mailto:" + email +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(summary);

  const validBrief = sender.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sender.trim()) &&
    goal.trim().length >= 10;

  function prepare(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validBrief) {
      setFeedback("Add a valid email and describe your project goal (at least 10 characters).");
      return;
    }
    setFeedback("Your email app will open with this brief. Press Send in your email app to deliver it.");
    window.location.href = emailHref;
  }

  async function copyInquiry() {
    if (!validBrief) {
      setFeedback("First add a valid email and a project goal of at least 10 characters.");
      return;
    }
    try {
      await navigator.clipboard.writeText("To: " + email + "\nSubject: " + subject + "\n\n" + summary);
      setFeedback("Project brief copied. Paste it into your preferred email app or WhatsApp chat.");
    } catch {
      setFeedback("Copy is unavailable in this browser. Please use the email option instead.");
    }
  }

  return (
    <form className={styles.form} onSubmit={prepare}>
      <div className={styles.formHeading}>
        <div className={styles.formHeadingBadge}>PROJECT INQUIRY</div>
        <h2>Let's make a plan.</h2>
        <p>Share the outcome you're aiming for. I'll review your brief before discussing scope and a proposal.</p>
      </div>

      <div className={styles.sectionLabel}><span>01</span> Project details</div>
      <div className={styles.grid}>
        <label htmlFor="project-kind">Project type
          <select id="project-kind" value={kind} onChange={e => setKind(e.target.value)}>
            {categories.map(option => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label htmlFor="project-budget">Estimated budget
          <select id="project-budget" value={budget} onChange={e => setBudget(e.target.value)}>
            <option>Let's discuss</option>
            <option>Below PKR 50,000</option>
            <option>PKR 50,000–150,000</option>
            <option>PKR 150,000+</option>
            <option>International / custom quote</option>
          </select>
        </label>
      </div>
      {service && <div className={styles.selectedService}>
        <span>Selected service</span><strong>{prettifySlug(service)}</strong>
        <a href="/services">Change service</a>
      </div>}
      <label htmlFor="project-timeline">Preferred timeline
        <select id="project-timeline" value={timeline} onChange={e => setTimeline(e.target.value)}>
          {timelines.map(option => <option key={option}>{option}</option>)}
        </select>
      </label>

      <div className={styles.sectionLabel}><span>02</span> Your brief</div>
      <label htmlFor="project-email">Your email <span className={styles.required}>Required</span>
        <input id="project-email" type="email" required maxLength={254} autoComplete="email"
          value={sender} onChange={e => setSender(e.target.value)} placeholder="you@company.com" />
      </label>
      <label htmlFor="project-goal">What would a successful project achieve? <span className={styles.required}>Required</span>
        <input id="project-goal" required minLength={10} maxLength={180}
          value={goal} onChange={e => setGoal(e.target.value)}
          placeholder="e.g. A secure customer portal with automated emails" />
      </label>
      <label htmlFor="project-context">Helpful details <span className={styles.optional}>Optional</span>
        <textarea id="project-context" maxLength={2400} rows={5} value={details}
          onChange={e => setDetails(e.target.value)}
          placeholder="Existing website, links, workflows, team size or constraints…" />
      </label>

      <div className={styles.preview} aria-label="Project brief preview">
        <div className={styles.previewTitle}>
          <span><span aria-hidden="true">↗</span> YOUR BRIEF PREVIEW</span>
          <span>{goal.trim().length}/180</span>
        </div>
        <div className={styles.previewRows}>
          <div><span>Project</span><strong>{service ? prettifySlug(service) : kind}</strong></div>
          <div><span>Budget</span><strong>{budget}</strong></div>
          <div><span>Timeline</span><strong>{timeline}</strong></div>
          <div><span>Outcome</span><strong>{goal.trim() || "Your project goal will appear here."}</strong></div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={"neo-action neo-action--primary " + actionStyles.control + " " + actionStyles.primary}
          type="submit">
          Prepare inquiry email <span className="neo-action__icon" aria-hidden="true">↗</span>
        </button>
        <button className={"neo-action neo-action--secondary " + actionStyles.control + " " + actionStyles.secondary}
          type="button" onClick={copyInquiry}>
          Copy brief <span className="neo-action__icon" aria-hidden="true">⧉</span>
        </button>
        {whatsapp && <a className={"neo-action neo-action--secondary " + actionStyles.control + " " + actionStyles.secondary}
          href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Open a WhatsApp conversation">
          WhatsApp chat <span className="neo-action__icon" aria-hidden="true">↗</span>
        </a>}
      </div>
      {feedback && <p className={styles.feedback} role="status" aria-live="polite">{feedback}</p>}
      <p className={styles.notice}>
        No payment or account required. Nothing is submitted automatically yet:
        please press Send in your email app, or copy your brief into WhatsApp.
      </p>
    </form>
  );
}
