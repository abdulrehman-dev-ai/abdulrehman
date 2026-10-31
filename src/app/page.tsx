import Image from "next/image";
import { Heading, Column } from "@/once-ui/components";
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
  return {
    title,
    description,
    alternates: { canonical: "https://" + baseURL + "/" },
    openGraph: { title, description, type: "website" as const, url: "https://" + baseURL + "/", images: [{ url: ogImage, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default function Home() {
  return (
    <Column maxWidth="xl" gap="xl" fillWidth horizontal="center">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            name: home.title,
            description: home.description,
            url: "https://" + baseURL + "/",
            mainEntity: {
              "@type": "Person",
              name: person.name,
              image: "https://" + baseURL + person.avatar,
              jobTitle: "Cloud, DevOps & Security Engineer",
            },
          }),
        }}
      />
      <section className={styles.hero} aria-labelledby="home-intro">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}><span className={styles.liveDot} aria-hidden="true" /> CLOUD · DEVOPS · SECURITY · PRODUCT ENGINEERING</p>
          <Heading as="h1" id="home-intro" className={styles.display} wrap="balance">
            Digital products built to work. <em>Infrastructure built to last.</em>
          </Heading>
          <p className={styles.lead}>
            I’m Abdul Rehman. I design, build and operate secure digital experiences —
            from customer-facing platforms to the systems and automation behind them.
          </p>
          <div className={styles.actions}>
            <ActionLink href="/work" variant="primary">Explore selected work</ActionLink>
            <ActionLink href="/contact" variant="secondary">Discuss your project</ActionLink>
          </div>
          <div className={styles.heroDisciplines} aria-label="Core areas of expertise">
            <span>Cloud architecture</span>
            <span>DevOps & automation</span>
            <span>Secure web delivery</span>
          </div>
        </div>
        <aside className={styles.heroAside} aria-label="Introduction to Abdul Rehman">
          <div className={styles.portraitWrap}>
            <Image
              src="/images/avatar.png"
              alt="Portrait of Abdul Rehman"
              fill
              priority
              sizes="(max-width: 600px) 92vw, (max-width: 900px) 420px, 32vw"
              className={styles.portrait}
            />
            <div className={styles.portraitOverlay}>
              <span className={styles.portraitIndex}>01 / THE ENGINEER</span>
              <strong>Abdul Rehman</strong>
              <small>Cloud · DevOps · Security</small>
            </div>
          </div>
          <div className={styles.asideBottom}>
            <span>BASED IN PAKISTAN</span>
            <span>BUILD → OPERATE → IMPROVE</span>
          </div>
        </aside>
      </section>
      <section className={styles.servicesRibbon} aria-label="Engineering specialties">
        <div><span>01</span><strong>Architect</strong><small>Cloud systems and application foundations</small></div>
        <div><span>02</span><strong>Deliver</strong><small>Web platforms, commerce and automation</small></div>
        <div><span>03</span><strong>Protect</strong><small>Security-aware engineering and operations</small></div>
      </section>
      <section className={styles.selected} aria-labelledby="featured-title">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.kicker}>SELECTED CLIENT WORK / CASE STUDIES</p>
            <Heading as="h2" id="featured-title" className={styles.sectionTitle}>Work beyond the mockup.</Heading>
            <p className={styles.sectionSub}>
              Real businesses, practical engineering decisions and transparent delivery status.
              Explore what was built and how it works.
            </p>
          </div>
          <ActionLink href="/work" size="sm">View all case studies</ActionLink>
        </div>
        <ClientShowcase mode="home" />
      </section>
      <section className={styles.approach} aria-labelledby="approach-title">
        <div>
          <p className={styles.kicker}>MY APPROACH / FROM IDEA TO OPERATION</p>
          <Heading as="h2" id="approach-title" className={styles.sectionTitle}>Thoughtful engineering. <em>Reliable delivery.</em></Heading>
          <p className={styles.sectionSub}>
            A premium experience is more than appearances. It should be fast, understandable,
            secure by design and maintainable after handoff.
          </p>
          <ActionLink href="/services" size="sm">Explore services</ActionLink>
        </div>
        <div className={styles.process}>
          <article><span>01</span><div><h3>Understand</h3><p>Map the users, business goals, workflows and constraints before writing code.</p></div></article>
          <article><span>02</span><div><h3>Engineer</h3><p>Choose a maintainable architecture and build accessible, responsive interfaces.</p></div></article>
          <article><span>03</span><div><h3>Validate & operate</h3><p>Test critical paths, deploy with care and make operations observable.</p></div></article>
        </div>
      </section>
      {routes["/blog"] && (
        <section className={styles.journal} aria-labelledby="journal-title">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>THE ENGINEERING JOURNAL</p>
              <Heading as="h2" id="journal-title" className={styles.sectionTitle}>Notes from the field.</Heading>
              <p className={styles.sectionSub}>Technical decisions, project lessons and security-minded delivery.</p>
            </div>
            <ActionLink href="/blog" size="sm">Read the journal</ActionLink>
          </div>
          <Posts range={[1, 2]} columns="2" thumbnail />
        </section>
      )}
      <aside className={styles.contactPanel} aria-label="Start a project">
        <div>
          <p className={styles.kicker}>LET’S BUILD SOMETHING USEFUL</p>
          <Heading as="h2" className={styles.sectionTitle}>Bring the challenge. <em>We’ll shape the solution.</em></Heading>
          <p className={styles.sectionSub}>Tell me about your project, current infrastructure or delivery challenge.</p>
        </div>
        <ActionLink href="/contact" variant="primary">Start a conversation</ActionLink>
      </aside>
    </Column>
  );
}
