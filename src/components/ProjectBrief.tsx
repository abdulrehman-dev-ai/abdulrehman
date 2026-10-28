"use client";
import { useState } from "react";
import styles from "./ProjectBrief.module.scss";
export default function ProjectBrief({ email }: { email: string }) {
  const [kind,setKind]=useState("Full-stack application");
  const [budget,setBudget]=useState("Let's discuss");
  const [sender,setSender]=useState("");
  const [goal,setGoal]=useState("");
  const [details,setDetails]=useState("");
  function prepare(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject=encodeURIComponent("Project inquiry: "+kind);
    const body=encodeURIComponent(["Project: "+kind,"My email: "+sender,"Estimated budget: "+budget,
      "Goal: "+goal,"","Additional context:",details||"I'd like to discuss the scope.","","Please reply with next steps."].join("\n"));
    window.location.href="mailto:"+email+"?subject="+subject+"&body="+body;
  }
  return <form className={styles.form} onSubmit={prepare}>
    <div className={styles.grid}>
      <label>What are you planning?<select value={kind} onChange={e=>setKind(e.target.value)}>
        <option>Full-stack application</option><option>Business website / e-commerce</option>
        <option>Cloud migration / DevOps</option><option>Security assessment</option><option>Other</option>
      </select></label>
      <label>Estimated budget<select value={budget} onChange={e=>setBudget(e.target.value)}>
        <option>Let's discuss</option><option>Below PKR 50,000</option>
        <option>PKR 50,000–150,000</option><option>PKR 150,000+</option><option>International / custom quote</option>
      </select></label>
    </div>
    <label>Your email<input type="email" required maxLength={254} value={sender} onChange={e=>setSender(e.target.value)} placeholder="you@company.com"/></label>
    <label>What outcome do you need?<input required minLength={10} maxLength={180} value={goal} onChange={e=>setGoal(e.target.value)} placeholder="A client portal with secure login…"/></label>
    <label>Anything else?<textarea maxLength={2400} rows={5} value={details} onChange={e=>setDetails(e.target.value)} placeholder="Timeline, existing stack, links or constraints…"/></label>
    <button type="submit">Prepare email inquiry ↗</button>
    <p className={styles.notice}>This opens your email app with the details filled in. Nothing is stored or sent until you choose to send the message.</p>
  </form>;
}