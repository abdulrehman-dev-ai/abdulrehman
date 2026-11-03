import { Heading, Column } from "@/once-ui/components";
import { FiCloud, FiGitBranch, FiLayers } from "react-icons/fi";
import { ActionLink } from "@/components/ui/ActionLink";
import { ClientShowcase } from "@/components/work/ClientShowcase";
import { Posts } from "@/components/blog/Posts";
import { baseURL, routes } from "@/app/resources";
import { home, person } from "@/app/resources/content";
import styles from "./page.module.scss";

export async function generateMetadata() {
  const title = home.title;
  const description = home.description;
  const ogImage = "https://" + baseURL + "/og?title=" + encodeURIComponent(title);
  return { title: { absolute: title }, description, alternates: { canonical: "https://" + baseURL + "/" },
    openGraph: { title, description, type: "website" as const, url: "https://" + baseURL + "/", images: [{url:ogImage,alt:title}] },
    twitter: { card:"summary_large_image", title, description, images:[ogImage] } };
}

export default function Home() {
  return <Column maxWidth="xl" gap="xl" fillWidth horizontal="center">
    <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{__html:JSON.stringify({
      "@context":"https://schema.org","@type":"ProfilePage",name:home.title,
      description:home.description,url:"https://" + baseURL + "/",
      mainEntity:{"@type":"Person",name:person.name,image:"https://" + baseURL + person.avatar,
        jobTitle:person.role}
    })}} />
    <section className={styles.hero} data-ui="hero" aria-labelledby="home-intro">
      <div className={styles.heroCopy} data-ui="hero-copy">
        <p className={styles.kicker} data-ui="eyebrow"><span className={styles.liveDot} /> TECHNICAL SOLUTIONS ENGINEER · LAHORE / REMOTE</p>
        <Heading as="h1" id="home-intro" className={styles.display} data-ui="hero-title" wrap="balance">
          Turning technical challenges into <em>working solutions.</em>
        </Heading>
        <p className={styles.lead} data-ui="hero-lead">I’m Abdul Rehman, a Technical Solutions Engineer working across cloud infrastructure, automation, systems integration and AI-assisted application delivery. I help connect the right tools and turn requirements into deployable solutions.</p>
        <div className={styles.actions} data-ui="hero-actions">
          <ActionLink href="/work" variant="primary">Explore real projects</ActionLink>
          <ActionLink href="/contact">Work with me</ActionLink>
        </div>
        <div className={styles.proof} data-ui="hero-proof" aria-label="Technical focus areas"><span>MY PRACTICE</span><ul><li>Cloud operations</li><li>Automation & CI/CD</li><li>AI-assisted delivery</li></ul></div>
      </div>
      <aside className={styles.heroAside} data-ui="portrait" aria-label="Meet the engineer">
        <div className={styles.portraitWrap} data-ui="portrait-frame">
          <img src="/images/avatar.png" alt="Portrait of Abdul Rehman" className={styles.portrait} />
          <span className={styles.portraitOverlay}>ABDUL REHMAN <small>TECHNICAL SOLUTIONS ENGINEER</small></span>
        </div>
        <div className={styles.asideBottom}>
          <span>DISCOVER → INTEGRATE → DEPLOY</span>
          <span>LAHORE · REMOTE COLLABORATION</span>
        </div>
      </aside>
    </section>
    <section className={styles.servicesRibbon} data-ui="expertise" aria-label="What I do">
      <div><span aria-hidden="true"><FiCloud size={21}/></span><strong>Cloud operations</strong><small>Hosting, DNS & migrations</small><b aria-hidden="true">01</b></div>
      <div><span aria-hidden="true"><FiGitBranch size={21}/></span><strong>Automation</strong><small>CI/CD & integrations</small><b aria-hidden="true">02</b></div>
      <div><span aria-hidden="true"><FiLayers size={21}/></span><strong>Digital delivery</strong><small>Web & commerce platforms</small><b aria-hidden="true">03</b></div>
    </section>
    <section className={styles.selected} data-ui="selected-work" aria-labelledby="featured-title">
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.kicker}>01 / SELECTED CLIENT WORK · 2025—2026</p>
          <Heading as="h2" id="featured-title" className={styles.sectionTitle}>Built for real businesses.</Heading>
          <p className={styles.sectionSub}>Real client platforms, infrastructure work and commerce projects. Each case study explains the contribution and clearly distinguishes delivered work from work in progress.</p>
        </div>
        <ActionLink href="/work" size="sm">Explore the portfolio</ActionLink>
      </div>
      <ClientShowcase mode="home" />
    </section>
    <section className={styles.fit} data-ui="audiences" aria-labelledby="audiences-title">
      <div className={styles.fitHeading}>
        <p className={styles.kicker}>02 / A PRACTICAL WAY TO COLLABORATE</p>
        <Heading as="h2" id="audiences-title" className={styles.sectionTitle}>The right support for the right problem.</Heading>
        <p className={styles.sectionSub}>My experience spans IT operations, modern cloud platforms and AI-assisted technical implementation. Here’s where I can contribute.</p>
      </div>
      <div className={styles.fitGrid}>
        <article className={styles.fitCard} data-ui="audience-card">
          <span className={styles.fitLabel}>FOR HIRING TEAMS</span>
          <h3>Technical delivery with an operations mindset.</h3>
          <p>IT operations experience since 2022, hands-on cloud troubleshooting and deployment workflows, and a practical approach to integrating business systems.</p>
          <div className={styles.fitTags}><span>Cloud operations</span><span>CI/CD</span><span>Integration</span></div>
          <ActionLink href="/about" variant="secondary" size="sm">Experience & background</ActionLink>
        </article>
        <article className={styles.fitCard} data-ui="audience-card">
          <span className={styles.fitLabel}>FOR FOUNDERS & BUSINESSES</span>
          <h3>From a requirement to a working solution.</h3>
          <p>Need an existing system repaired, a workflow automated or a new customer-facing platform delivered? We start with scope, operational needs and a way to verify the result.</p>
          <div className={styles.fitTags}><span>Web platforms</span><span>Automation</span><span>Cloud setup</span></div>
          <ActionLink href="/contact" variant="primary" size="sm">Discuss a solution</ActionLink>
        </article>
      </div>
    </section>
    <section className={styles.approach} data-ui="process" aria-labelledby="approach-title">
      <div>
        <p className={styles.kicker}>03 / HOW I WORK</p>
        <Heading as="h2" id="approach-title" className={styles.sectionTitle}>Tools are only useful when the solution works.</Heading>
        <p className={styles.sectionSub}>I use AI-assisted tools to move faster, but the essentials remain the same: clear requirements, sensible integrations, technical review and careful handover.</p>
        <ActionLink href="/services" size="sm">Explore engineering services</ActionLink>
      </div>
      <div className={styles.process}>
        <article><span>01</span><div><h3>Clarify the real requirement</h3><p>Understand the users, existing systems, constraints and outcome before implementation.</p></div></article>
        <article><span>02</span><div><h3>Connect the right systems</h3><p>Choose suitable platforms, configure integrations and automate repeatable work.</p></div></article>
        <article><span>03</span><div><h3>Validate and hand over</h3><p>Check important user journeys, release carefully and document known limits.</p></div></article>
      </div>
    </section>
    {routes["/blog"] && <section className={styles.journal} data-ui="journal" aria-labelledby="journal-title">
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.kicker}>04 / FIELD NOTES & JOURNAL</p>
          <Heading as="h2" id="journal-title" className={styles.sectionTitle}>Things worth documenting.</Heading>
          <p className={styles.sectionSub}>Engineering decisions, lessons from delivery and security-minded development.</p>
        </div>
        <ActionLink href="/blog" size="sm">Read the journal</ActionLink>
      </div>
      <Posts range={[1, 2]} columns="2" thumbnail />
    </section>}
    <aside className={styles.contactPanel} data-ui="cta-panel">
      <div><p className={styles.kicker}>05 / NEW ENGAGEMENTS</p>
        <Heading as="h2" className={styles.sectionTitle}>Have a technical problem worth solving?</Heading>
        <p className={styles.sectionSub}>Share the challenge, your current setup and what success looks like. We'll start with a realistic scope.</p>
      </div>
      <ActionLink href="/contact" variant="primary">Start the conversation</ActionLink>
    </aside>
  </Column>;
}