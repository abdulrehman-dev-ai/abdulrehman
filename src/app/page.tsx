import React from "react";
import { Heading, Button, Column } from "@/once-ui/components";
import { Projects } from "@/components/work/Projects";
import { Posts } from "@/components/blog/Posts";
import { baseURL, routes } from "@/app/resources";
import { home, person } from "@/app/resources/content";
import styles from "./page.module.scss";

export async function generateMetadata() {
  const title = home.title;
  const description = home.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;
  return {
    title,
    description,
    alternates: { canonical: `https://${baseURL}/` },
    openGraph: {
      title, description, type: "website", url: `https://${baseURL}/`,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default function Home() {
  return (
    <Column maxWidth="m" gap="xl" horizontal="center" fillWidth>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          name: home.title,
          description: home.description,
          url: `https://${baseURL}/`,
          image: `https://${baseURL}/og?title=${encodeURIComponent(home.title)}`,
          mainEntity: {
            "@type": "Person", name: person.name,
            image: `https://${baseURL}${person.avatar}`,
            jobTitle: "Full-Stack, Cloud & Security Engineer",
          },
        }),
      }} />
      <section aria-labelledby="hero-title" className={styles.hero}>
        <span className={styles.eyebrow}><span className={styles.pulse} aria-hidden="true" />FULL-STACK ENGINEERING / CLOUD / SECURITY</span>
        <Heading as="h1" id="hero-title" variant="display-strong-l" wrap="balance" className={styles.heroTitle}>
          {home.headline}
        </Heading>
        <div className={styles.heroSummary}>{home.subline}</div>
        <div className={styles.heroActions}>
          <Button href="/work" variant="primary" size="m" arrowIcon>Explore client work</Button>
          <Button href="/contact" variant="secondary" size="m" arrowIcon>Start a project</Button>
        </div>
        <div className={styles.heroFoot}>
          <span>ABDUL REHMAN</span>
          <span>ENGINEERED FOR DELIVERY, NOT JUST DEMOS</span>
        </div>
      </section>

      <section className={styles.expertise} aria-label="Core expertise">
        <span><strong>01</strong> Full-stack platforms</span>
        <span><strong>02</strong> Cloud & DevOps</span>
        <span><strong>03</strong> Security-first delivery</span>
      </section>

      <section id="selected-work" aria-labelledby="work-title" className={styles.work}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.sectionLabel}>01 / SELECTED CLIENT WORK</p>
            <Heading id="work-title" as="h2" variant="display-strong-s" wrap="balance">Real projects. Real delivery.</Heading>
            <p className={styles.sectionDescription}>A closer look at production systems, client websites and commerce work — with clear, honest delivery status.</p>
          </div>
          <Button href="/work" variant="secondary" size="s" arrowIcon>All case studies</Button>
        </div>
        <Projects range={[1, 4]} columns="2" />
      </section>

      {routes["/blog"] && (
        <section aria-labelledby="blog-title" className={styles.writing}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.sectionLabel}>02 / JOURNAL</p>
              <Heading id="blog-title" as="h2" variant="display-strong-xs">Notes from the field.</Heading>
              <p className={styles.sectionDescription}>Engineering decisions, useful lessons and ideas worth sharing.</p>
            </div>
            <Button href="/blog" variant="tertiary" size="s" arrowIcon>Read all articles</Button>
          </div>
          <Posts range={[1, 2]} columns="2" />
        </section>
      )}

      <aside className={styles.contactPanel} aria-label="Work together">
        <div>
          <p className={styles.sectionLabel}>HAVE A PROJECT IN MIND?</p>
          <Heading as="h2" variant="display-strong-xs" wrap="balance">Let's build something that works.</Heading>
          <p className={styles.sectionDescription}>From client-ready websites to secure applications and cloud infrastructure — tell me what you're building.</p>
        </div>
        <Button href="/contact" variant="primary" size="m" arrowIcon>Discuss your project</Button>
      </aside>
    </Column>
  );
}
