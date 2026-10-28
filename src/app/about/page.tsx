import { Column } from "@/once-ui/components";
import { person, about } from "@/app/resources/content";
import { baseURL } from "@/app/resources";
import styles from "./about.module.scss";

export async function generateMetadata() {
  const title="About Abdul Rehman";
  const description="Independent full-stack, cloud and security engineer with experience delivering real applications, commerce and infrastructure.";
  const img="https://" + baseURL + "/og?title=" + encodeURIComponent(title);
  return {title,description,alternates:{canonical:"https://" + baseURL + "/about"},
    openGraph:{title,description,url:"https://" + baseURL + "/about",images:[{url:img}]},
    twitter:{card:"summary_large_image",title,description,images:[img]}};
}
export default function AboutPage() {
  const selected=about.work.experiences.filter(x=>["Ocean Yacht Registration","Independent Freelance / Consulting","Auto Levels Pvt.Ltd"].includes(x.company));
  const earlier=about.work.experiences.filter(x=>!selected.includes(x));
  return <Column maxWidth="xl" fillWidth gap="xl">
    <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{__html:JSON.stringify({
      "@context":"https://schema.org","@type":"Person",name:person.name,jobTitle:person.role,
      url:"https://" + baseURL + "/about",image:"https://" + baseURL + person.avatar
    })}} />
    <section className={styles.hero}>
      <div className={styles.intro}>
        <p className={styles.kicker}>ABOUT / THE PERSON BEHIND THE PROJECTS</p>
        <h1>Engineering is about <em>making things work.</em></h1>
        <p className={styles.lead}>I'm Abdul Rehman, an independent engineer based in Lahore. My work connects full-stack applications, cloud operations and practical security to real business requirements.</p>
        <p>I work on the things behind the interface too: access rules, workflows, data handling, deployments and the details that keep a product usable after launch.</p>
        <div className={styles.links}><a href="/work">See client work ↗</a><a href="/contact">Start a conversation ↗</a></div>
      </div>
      <div className={styles.portraitCard}>
        <img src={person.avatar} alt="Portrait of Abdul Rehman" />
        <span>ABDUL REHMAN <small>LAHORE / REMOTE COLLABORATION</small></span>
      </div>
    </section>
    <section className={styles.philosophy}>
      <p className={styles.kicker}>WORKING PRINCIPLES</p>
      <div><h2>From a problem to an operable system.</h2><p>Good engineering needs correct rules, maintainable architecture, honest testing and a responsible handover — not just an attractive user interface.</p></div>
    </section>
    <section className={styles.experience}>
      <div className={styles.heading}><p className={styles.kicker}>SELECTED EXPERIENCE</p><h2>The work behind the portfolio.</h2></div>
      {selected.map((exp,index)=><article key={exp.company} className={styles.role}>
        <div className={styles.roleMeta}><strong>0{index+1}</strong><small>{exp.timeframe}</small></div>
        <div><h3>{exp.company}</h3><p>{exp.role}</p><ul>{exp.achievements.slice(0,3).map((item,i)=><li key={i}>{item}</li>)}</ul></div>
      </article>)}
      <details className={styles.archive}><summary>Earlier roles and internships <span aria-hidden="true">+</span></summary>
        {earlier.map(exp=><article key={exp.company}><h3>{exp.company}</h3><small>{exp.timeframe} / {exp.role}</small><ul>{exp.achievements.slice(0,2).map((item,i)=><li key={i}>{item}</li>)}</ul></article>)}
      </details>
    </section>
    <section className={styles.credentials}>
      <div><p className={styles.kicker}>EDUCATION & CREDENTIALS</p><h2>Always learning, always applying.</h2><p>Security, networking, engineering fundamentals and continued practical training inform my work.</p></div>
      <div className={styles.credentialsList}>
        {about.studies.institutions.map(x=><article key={x.name}><small>EDUCATION</small><strong>{x.name}</strong></article>)}
        {about.technical.certifications.slice(0,6).map(x=><article key={x.title}><small>TRAINING / CERTIFICATION</small>{x.link?<a href={x.link} target="_blank" rel="noopener noreferrer">{x.title} ↗</a>:<strong>{x.title}</strong>}</article>)}
      </div>
    </section>
    <aside className={styles.cta}><p className={styles.kicker}>LET'S TALK ABOUT YOUR PROJECT</p><h2>Clarity, craft and responsibility.</h2><a href="/contact">Start a conversation ↗</a></aside>
  </Column>;
}