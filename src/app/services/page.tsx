import Link from "next/link";
import { getPosts } from "@/app/utils/utils";
import { Column } from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { services, person } from "@/app/resources/content";
import styles from "./services.module.scss";
import { ActionLink } from "@/components/ui/ActionLink";

export async function generateMetadata() {
  const title = "Engineering Services";
  const description = "Full-stack business applications, commerce websites, cloud migration, CI/CD and security-aware engineering. Scoped project proposals.";
  const image = "https://" + baseURL + "/og?title=" + encodeURIComponent(title);
  return { title, description, alternates:{canonical:"https://" + baseURL + "/services"},
    openGraph:{title,description,url:"https://" + baseURL + "/services",images:[{url:image}]},
    twitter:{card:"summary_large_image",title,description,images:[image]} };
}
const groups = [
  { n:"01", heading:"Build & launch", intro:"Business websites, applications and commerce platforms engineered for the people who use them.",
    slugs:["full-stack-web-development","wordpress-website-development"], outcome:"From initial requirements to an accessible, deployable product." },
  { n:"02", heading:"Cloud & automate", intro:"Move, deploy and maintain infrastructure with repeatable, observable workflows.",
    slugs:["cloud-infrastructure-setup","devops-cicd-pipeline","docker-containerization","linux-automation-scripting","server-migration-administration"], outcome:"Less manual work. Clearer releases. Better operational control." },
  { n:"03", heading:"Secure & improve", intro:"Identify risks and harden systems so security becomes part of delivery, not an afterthought.",
    slugs:["vulnerability-assessment-pentesting"], outcome:"Actionable security findings and a practical remediation plan." },
];
export default function ServicesPage() {
  const all = getPosts(["src","app","services","items"]);
  const bySlug = new Map(all.map(s=>[s.slug,s]));
  const used = new Set(groups.flatMap(g=>g.slugs));
  const extra = all.filter(s=>!used.has(s.slug));
  return <Column maxWidth="xl" gap="xl" fillWidth>
    <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{__html:JSON.stringify({
      "@context":"https://schema.org","@type":"Service",name:services.title,
      provider:{"@type":"Person",name:person.name},
      url:"https://" + baseURL + "/services",description:services.description
    })}}/>
    <header className={styles.hero}>
      <p className={styles.kicker}>WAYS TO WORK TOGETHER / ENGINEERING SERVICES</p>
      <h1>Solutions first. <em>Technology with purpose.</em></h1>
      <p>Whether you need a working product, reliable infrastructure or a safer system, I scope the work around your goals, constraints and operations.</p>
      <div className={styles.heroAction}><ActionLink href="/contact" variant="primary">Discuss your requirements</ActionLink></div>
    </header>
    <div className={styles.groups}>
      {groups.map(g=><section key={g.n} className={styles.group} aria-labelledby={"group-"+g.n}>
        <div className={styles.groupIntro}>
          <span className={styles.kicker}>{g.n} / SERVICE PRACTICE</span>
          <h2 id={"group-"+g.n}>{g.heading}</h2>
          <p>{g.intro}</p>
          <small>{g.outcome}</small>
        </div>
        <div className={styles.list}>
          {g.slugs.map(slug=>{
            const s=bySlug.get(slug);
            return s?<Link href={"/services/"+s.slug} key={slug} className={styles.service}>
              <div><h3>{s.metadata.title}</h3><p>{s.metadata.summary}</p></div>
              <span className={styles.serviceAside}>{s.metadata.price ? "From "+(s.metadata.currency||"PKR")+" "+s.metadata.price : "Custom scope"}<strong aria-hidden="true">↗</strong></span>
            </Link>:null;
          })}
        </div>
      </section>)}
      {extra.length>0 && <section className={styles.extra}>
        <h2>Additional capabilities</h2>
        {extra.map(s=><Link key={s.slug} href={"/services/"+s.slug}>{s.metadata.title} ↗</Link>)}
      </section>}
    </div>
    <section className={styles.process}>
      <div><p className={styles.kicker}>ENGAGEMENT PROCESS</p><h2>Clarity before commitment.</h2></div>
      <div className={styles.steps}>
        <div><strong>01 / Discover</strong><p>Share your requirements, current environment and desired outcome.</p></div>
        <div><strong>02 / Scope</strong><p>Agree on deliverables, timeline, assumptions and a tailored quote.</p></div>
        <div><strong>03 / Deliver</strong><p>Build, review, test and hand over the agreed work.</p></div>
      </div>
    </section>
    <aside className={styles.cta}>
      <div><p className={styles.kicker}>YOUR PROJECT IS UNIQUE</p><h2>Let's define the right solution.</h2><p>Starting prices are indicative. A written proposal confirms scope and cost before any work begins. Online checkout is not currently enabled.</p></div>
      <ActionLink href="/contact" variant="primary">Request a proposal</ActionLink>
    </aside>
  </Column>;
}