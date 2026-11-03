import Link from "next/link";
import { Column } from "@/once-ui/components";
import {
  FiArrowUpRight, FiBox, FiCheckCircle, FiCloud, FiCpu, FiGitBranch,
  FiLayers, FiSettings, FiShield, FiZap
} from "react-icons/fi";
import { ActionLink } from "@/components/ui/ActionLink";
import { ClientShowcase } from "@/components/work/ClientShowcase";
import { getPosts } from "@/app/utils/utils";
import { baseURL, routes } from "@/app/resources";
import { home, person } from "@/app/resources/content";
import styles from "./BentoHome.module.scss";

const capabilities = [
  { title: "Cloud infrastructure", text: "Hosting, DNS & operations", icon: FiCloud, href: "/services/cloud-infrastructure-setup" },
  { title: "Automation & DevOps", text: "CI/CD & release workflows", icon: FiGitBranch, href: "/services/devops-cicd-pipeline" },
  { title: "AI-assisted development", text: "Practical digital solutions", icon: FiCpu, href: "/services/full-stack-web-development" },
  { title: "Systems integration", text: "Platforms, APIs & data", icon: FiLayers, href: "/services" },
];

const workflow = [
  { number: "01", title: "Discover", description: "Understand the problem and constraints", icon: FiBox },
  { number: "02", title: "Plan", description: "Choose systems and set a clear scope", icon: FiSettings },
  { number: "03", title: "Build", description: "Configure, integrate and automate", icon: FiZap },
  { number: "04", title: "Verify", description: "Test, release and document", icon: FiCheckCircle },
];

export async function generateMetadata() {
  const title = home.title;
  const description = home.description;
  const ogImage = "https://" + baseURL + "/og?title=" + encodeURIComponent(title);
  return {
    title: { absolute: title }, description,
    alternates: { canonical: "https://" + baseURL + "/" },
    openGraph: { title, description, type: "website" as const, url: "https://" + baseURL + "/", images: [{ url: ogImage, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default function Home() {
  const insights = getPosts(["src", "app", "blog", "posts"])
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
    .slice(0, 2);

  return <Column maxWidth="xl" fillWidth>
    <main className={styles.page}>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "ProfilePage",
        name: home.title, description: home.description, url: "https://" + baseURL + "/",
        mainEntity: { "@type": "Person", name: person.name, image: "https://" + baseURL + person.avatar, jobTitle: person.role },
      }) }} />
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroCopy}>
          <p className={styles.overline}><span className={styles.pulse} aria-hidden="true" /> TECHNICAL SOLUTIONS ENGINEER</p>
          <h1 id="home-title">Build. Deploy. Automate.<br /><em>Scale with confidence.</em></h1>
          <p className={styles.lead}>I’m Abdul Rehman. I help businesses connect cloud infrastructure, automation, systems integration and AI-assisted development to deliver practical digital solutions.</p>
          <div className={styles.heroActions}>
            <ActionLink href="/work" variant="primary">View my work</ActionLink>
            <ActionLink href="/contact" variant="secondary">Let’s talk</ActionLink>
          </div>
          <p className={styles.heroNote}><FiShield size={15} aria-hidden="true" /> Real projects · Transparent delivery status · Practical technical solutions</p>
        </div>
        <aside className={styles.identity} aria-label="About Abdul Rehman">
          <div className={styles.identityPhoto}>
            <span className={styles.availability}><span aria-hidden="true" /> Open to projects</span>
            <img src={person.avatar} alt="Portrait of Abdul Rehman" />
            <div className={styles.identityCaption}><strong>{person.name}</strong><small>{person.role}</small></div>
          </div>
          <div className={styles.identityFoot}><span>Lahore, Pakistan</span><span>Remote collaboration</span></div>
        </aside>
      </section>

      <section className={styles.dashboard} aria-label="Technical experience and core expertise">
        <div className={styles.factCard}>
          <p className={styles.miniLabel}>AT A GLANCE</p>
          <div className={styles.fact}><strong>2022</strong><span>IT operations foundation</span></div>
          <div className={styles.fact}><strong>2025–26</strong><span>Real client delivery experience</span></div>
          <div className={styles.fact}><strong>Cloud + Web</strong><span>Integration and automation focus</span></div>
        </div>
        <div className={styles.cloudArt} aria-hidden="true">
          <div className={styles.cloudHalo} />
          <div className={styles.cloudIcon}><FiCloud size={83} strokeWidth={1.2} /></div>
          <div className={styles.stackTop}><span /><span /></div>
          <div className={styles.stackBottom}><span /><span /></div>
          <div className={styles.cloudOrbit}><FiGitBranch size={19} /></div>
        </div>
        <div className={styles.capabilityPanel}>
          <div className={styles.capabilityHeading}><p className={styles.miniLabel}>WHAT I WORK ON</p><h2>Core expertise</h2></div>
          <div className={styles.capabilityGrid}>
            {capabilities.map(({ title, text, icon: Icon, href }) =>
              <Link key={title} href={href} className={styles.capability}>
                <span className={styles.capIcon}><Icon size={22} aria-hidden="true" /></span>
                <span><strong>{title}</strong><small>{text}</small></span>
                <FiArrowUpRight size={14} className={styles.capArrow} aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className={styles.work} aria-labelledby="featured-title">
        <div className={styles.sectionHead}>
          <div><p className={styles.miniLabel}>SELECTED CLIENT WORK</p><h2 id="featured-title">Featured work<span className={styles.headingDot}>.</span></h2>
            <p>Real projects, documented contributions and clear delivery status.</p></div>
          <ActionLink href="/work" size="sm" variant="quiet">All projects</ActionLink>
        </div>
        <ClientShowcase mode="home" />
      </section>

      <section className={styles.workflow} aria-labelledby="workflow-title">
        <div className={styles.sectionHead}>
          <div><p className={styles.miniLabel}>A PRACTICAL APPROACH</p><h2 id="workflow-title">How I work<span className={styles.headingDot}>.</span></h2>
            <p>From the initial problem to a tested, documented release.</p></div>
          <ActionLink href="/services" size="sm" variant="quiet">Explore services</ActionLink>
        </div>
        <div className={styles.steps}>
          {workflow.map(({ number, title, description, icon: Icon }) =>
            <article key={number} className={styles.step}>
              <div className={styles.stepIcon}><Icon size={22} aria-hidden="true" /></div>
              <div><span className={styles.stepNumber}>{number} / DELIVERY</span><h3>{title}</h3><p>{description}</p></div>
            </article>
          )}
        </div>
      </section>

      <section className={styles.value} aria-labelledby="why-title">
        <div className={styles.valueVisual} aria-hidden="true">
          <div className={styles.valueOrb} />
          <span className={styles.valueCubeA} /><span className={styles.valueCubeB} /><span className={styles.valueCubeC} />
          <div className={styles.valueOverlay}><FiLayers size={30} /></div>
        </div>
        <div className={styles.valueContent}>
          <p className={styles.miniLabel}>BUSINESS FIRST · TOOLS WITH PURPOSE</p>
          <h2 id="why-title">Why work with me?</h2>
          <ul>
            <li><FiCheckCircle size={17} aria-hidden="true" /> Technical solutions scoped around actual business needs</li>
            <li><FiCheckCircle size={17} aria-hidden="true" /> Practical experience across cloud, websites and integrations</li>
            <li><FiCheckCircle size={17} aria-hidden="true" /> AI-assisted implementation with transparent contributions</li>
            <li><FiCheckCircle size={17} aria-hidden="true" /> Clear communication, testing priorities and delivery status</li>
          </ul>
          <div className={styles.valueActions}>
            <Link href="/about">For hiring teams: explore my background <FiArrowUpRight size={15} aria-hidden="true" /></Link>
            <Link href="/contact">For businesses: discuss a project <FiArrowUpRight size={15} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      {routes["/blog"] && insights.length > 0 &&
        <section className={styles.insights} aria-labelledby="insights-title">
          <div className={styles.sectionHead}>
            <div><p className={styles.miniLabel}>FIELD NOTES & ENGINEERING LESSONS</p><h2 id="insights-title">Latest insights<span className={styles.headingDot}>.</span></h2>
              <p>What real implementations and troubleshooting have taught me.</p></div>
            <ActionLink href="/blog" size="sm" variant="quiet">All articles</ActionLink>
          </div>
          <div className={styles.insightGrid}>
            {insights.map((post, index) =>
              <Link key={post.slug} href={"/blog/" + post.slug} className={styles.insightCard}>
                <div className={styles.insightIllustration}>{index === 0 ? <FiGitBranch size={36} aria-hidden="true" /> : <FiShield size={36} aria-hidden="true" />}</div>
                <div className={styles.insightCopy}>
                  <span>{post.metadata.publishedAt} · ENGINEERING NOTE</span>
                  <h3>{post.metadata.title}</h3>
                  <small>Read the article <FiArrowUpRight size={13} aria-hidden="true" /></small>
                </div>
              </Link>
            )}
          </div>
        </section>}

      <section className={styles.cta} aria-labelledby="cta-title">
        <div className={styles.ctaEmblem}><FiZap size={28} aria-hidden="true" /></div>
        <div className={styles.ctaCopy}>
          <p className={styles.miniLabel}>LET'S MAKE IT WORK</p>
          <h2 id="cta-title">Let’s build your next solution together.</h2>
          <p>From cloud setup to business workflows, start with a conversation about the right approach.</p>
        </div>
        <ActionLink href="/contact" variant="primary">Start a project</ActionLink>
      </section>
    </main>
  </Column>;
}
