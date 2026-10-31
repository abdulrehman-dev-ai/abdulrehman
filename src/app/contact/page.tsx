import { Column } from "@/once-ui/components";
import { business } from "@/app/resources/content";
import { baseURL } from "@/app/resources";
import ProjectBrief from "@/components/ProjectBrief";
import styles from "./contact.module.scss";
export async function generateMetadata() {
  const title="Discuss Your Project";
  const description="Get in touch about web applications, commerce websites, cloud engineering, migrations and application security.";
  const img="https://" + baseURL + "/og?title=" + encodeURIComponent(title);
  return {title,description,alternates:{canonical:"https://" + baseURL + "/contact"},
    openGraph:{title,description,url:"https://" + baseURL + "/contact",images:[{url:img}]},
    twitter:{card:"summary_large_image",title,description,images:[img]}};
}
export default function ContactPage(){
  return <Column maxWidth="xl" gap="xl" fillWidth>
    <header className={styles.header}><p className={styles.kicker}>NEW ENGAGEMENTS / LET'S TALK</p>
      <h1>Tell me what you're <em>building.</em></h1>
      <p>I work with businesses and founders who need reliable engineering. Start with the problem you want to solve, not a list of technologies.</p>
    </header>
    <section className={styles.layout}>
      <div className={styles.left}><p className={styles.kicker}>START WITH A CLEAR BRIEF</p>
        <h2>Good work begins with understanding.</h2>
        <p>Share some context and I'll help turn it into a practical plan. No checkout, payment details or forced account creation.</p>
        <div className={styles.links}>
          <a href={"mailto:"+business.email}><span>EMAIL</span><strong>{business.email}</strong><b>↗</b></a>
          <a href={business.whatsapp} target="_blank" rel="noopener noreferrer"><span>QUICK CHAT</span><strong>WhatsApp</strong><b>↗</b></a>
          <a href="/work"><span>SEE THE WORK</span><strong>Delivered case studies</strong><b>↗</b></a>
        </div>
        <p className={styles.location}>Based in Lahore, Pakistan · Remote collaboration</p>
      </div>
      <ProjectBrief email={business.email} whatsapp={business.whatsapp}/>
    </section>
    <section className={styles.steps}><p className={styles.kicker}>WHAT HAPPENS NEXT</p>
      <div><strong>01 / Discuss</strong><p>We clarify the outcome and your constraints.</p></div>
      <div><strong>02 / Scope</strong><p>We agree on deliverables, timeline and cost.</p></div>
      <div><strong>03 / Deliver</strong><p>Work begins after the proposal is approved.</p></div>
    </section>
  </Column>;
}