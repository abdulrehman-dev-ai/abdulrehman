import { Heading, Button, Column } from "@/once-ui/components";
import { ClientShowcase } from "@/components/work/ClientShowcase";
import { Posts } from "@/components/blog/Posts";
import { baseURL, routes } from "@/app/resources";
import { home, person } from "@/app/resources/content";
import styles from "./page.module.scss";

export async function generateMetadata() {
  const title = home.title;
  const description = home.description;
  const ogImage = "https://" + baseURL + "/og?title=" + encodeURIComponent(title);
  return { title, description, alternates: { canonical: "https://" + baseURL + "/" },
    openGraph: { title, description, type: "website" as const, url: "https://" + baseURL + "/", images: [{url:ogImage,alt:title}] },
    twitter: { card:"summary_large_image", title, description, images:[ogImage] } };
}

export default function Home() {
  return <Column maxWidth="xl" gap="xl" fillWidth horizontal="center">
    <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{__html:JSON.stringify({
      "@context":"https://schema.org","@type":"ProfilePage",name:home.title,
      description:home.description,url:"https://" + baseURL + "/",
      mainEntity:{"@type":"Person",name:person.name,image:"https://" + baseURL + person.avatar,
        jobTitle:"Full-Stack, Cloud & Security Engineer"}
    })}} />
    <section className={styles.hero} aria-labelledby="home-intro">
      <div className={styles.heroCopy}>
        <p className={styles.kicker}><span className={styles.liveDot} /> INDEPENDENT ENGINEERING CONSULTANT · LAHORE, PAKISTAN</p>
        <Heading as="h1" id="home-intro" className={styles.display} wrap="balance">
          Engineering the digital products <em>businesses rely on.</em>
        </Heading>
        <p className={styles.lead}>I’m Abdul Rehman. I turn business requirements into secure applications, dependable cloud infrastructure and websites built for real customers.</p>
        <div className={styles.actions}>
          <Button href="/work" variant="primary" size="m" arrowIcon>See selected work</Button>
          <Button href="/contact" variant="secondary" size="m" arrowIcon>Discuss a project</Button>
        </div>
        <p className={styles.proof}><span>IN PRACTICE</span> Full-stack delivery / Cloud & DevOps / Security-aware implementation</p>
      </div>
      <aside className={styles.heroAside} aria-label="Meet the engineer">
        <div className={styles.portraitWrap}>
          <img src="/images/avatar.png" alt="Portrait of Abdul Rehman" className={styles.portrait} />
          <span className={styles.portraitOverlay}>ABDUL REHMAN <small>INDEPENDENT ENGINEER</small></span>
        </div>
        <div className={styles.asideBottom}>
          <span>DESIGN → BUILD → DEPLOY</span>
          <span>OPEN TO CLIENT ENGAGEMENTS</span>
        </div>
      </aside>
    </section>
    <section className={styles.servicesRibbon} aria-label="What I do">
      <div><span>01 /</span><strong>Build</strong><small>Platforms & commerce</small></div>
      <div><span>02 /</span><strong>Operate</strong><small>Cloud & automation</small></div>
      <div><span>03 /</span><strong>Secure</strong><small>Hardening & resilience</small></div>
    </section>
    <section className={styles.selected} aria-labelledby="featured-title">
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.kicker}>SELECTED WORK / 2025—2026</p>
          <Heading as="h2" id="featured-title" className={styles.sectionTitle}>Built for real businesses.</Heading>
          <p className={styles.sectionSub}>Client platforms, commerce systems and operational engineering — the work, the approach, and its delivery status.</p>
        </div>
        <a className={styles.more} href="/work">Explore the portfolio ↗</a>
      </div>
      <ClientShowcase mode="home" />
    </section>
    <section className={styles.approach} aria-labelledby="approach-title">
      <div>
        <p className={styles.kicker}>HOW I WORK</p>
        <Heading as="h2" id="approach-title" className={styles.sectionTitle}>More than a polished interface.</Heading>
        <p className={styles.sectionSub}>A good product needs a clear workflow, sound technical choices and a responsible release process. My work spans all three.</p>
        <a href="/services" className={styles.more}>Explore engineering services ↗</a>
      </div>
      <div className={styles.process}>
        <article><span>01</span><div><h3>Understand the operation</h3><p>Define real users, roles, workflows and constraints before building.</p></div></article>
        <article><span>02</span><div><h3>Engineer for maintainability</h3><p>Develop practical interfaces, server-side rules and infrastructure that can be operated.</p></div></article>
        <article><span>03</span><div><h3>Verify and deliver</h3><p>Test critical journeys, deploy carefully and document what is ready — and what is not.</p></div></article>
      </div>
    </section>
    {routes["/blog"] && <section className={styles.journal} aria-labelledby="journal-title">
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.kicker}>FIELD NOTES / JOURNAL</p>
          <Heading as="h2" id="journal-title" className={styles.sectionTitle}>Things worth documenting.</Heading>
          <p className={styles.sectionSub}>Engineering decisions, lessons from delivery and security-minded development.</p>
        </div>
        <a href="/blog" className={styles.more}>Read the journal ↗</a>
      </div>
      <Posts range={[1, 2]} columns="2" thumbnail />
    </section>}
    <aside className={styles.contactPanel}>
      <div><p className={styles.kicker}>NEW ENGAGEMENTS</p>
        <Heading as="h2" className={styles.sectionTitle}>Have something ambitious to build?</Heading>
        <p className={styles.sectionSub}>Tell me what you're planning and I'll help define a practical approach.</p>
      </div>
      <Button href="/contact" variant="primary" size="m" arrowIcon>Start the conversation</Button>
    </aside>
  </Column>;
}