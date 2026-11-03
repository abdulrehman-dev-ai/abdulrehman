import Link from "next/link";
import { getPosts } from "@/app/utils/utils";
import styles from "./ClientShowcase.module.scss";
import bento from "./BentoWork.module.scss";
import ProjectArtImage from "./ProjectArtImage";
import { ActionLink } from "@/components/ui/ActionLink";

type Project = ReturnType<typeof getPosts>[number];
const visuals: Record<string, { src?: string; label: string; kind: string; tools: string[] }> = {
  "ocean-yacht-registration": {
    src: "https://oceanyachtregistration.com/ocean-yacht-logo-white.svg",
    label: "Official Ocean Yacht Registration branding",
    kind: "Full-stack platform",
    tools: ["Cloudflare Workers", "D1", "Supabase", "Resend"],
  },
  "anyarabic": {
    label: "AnyArabic editorial identity — not a website screenshot",
    kind: "WordPress / VPS Migration · Delivered",
    tools: ["WordPress", "Vultr VPS", "Nginx", "Cloudflare"],
  },
  "auto-levels": {
    src: "https://www.autolevels.pk/assets/black-tF-bFyqn.png",
    label: "Official Auto Levels website branding",
    kind: "Client website",
    tools: ["Web delivery", "Business operations"],
  },
  "maqwi-organics": {
    src: "https://raw.githubusercontent.com/maqwiorganics/maqwiorganics/main/wp-content/themes/maqwi-organics/assets/images/hero-collection-v3.webp",
    label: "Maqwi Organics actual storefront collection imagery",
    kind: "WooCommerce · Pre-launch",
    tools: ["WordPress", "WooCommerce", "Responsive UX"],
  },
  "rico-scents": {
    label: "Rico Scents editorial identity — not a storefront screenshot",
    kind: "Shopify · In progress",
    tools: ["Shopify", "Commerce UX", "Merchandising"],
  },
};

function sortedClientProjects(): Project[] {
  return getPosts(["src", "app", "work", "projects"])
    .filter((project) => Number(project.metadata.featuredRank || 0) > 0)
    .sort((a, b) => Number(a.metadata.featuredRank || 99) - Number(b.metadata.featuredRank || 99));
}

export function ProjectVisual({ slug, title, large = false }: { slug: string; title: string; large?: boolean }) {
  const visual = visuals[slug];
  const variant = slug === "anyarabic" ? styles.academy
    : slug === "ocean-yacht-registration" ? styles.ocean
    : slug === "maqwi-organics" ? styles.organic
    : slug === "auto-levels" ? styles.auto
    : styles.fragrance;
  return (
    <div className={[styles.art, variant, large ? styles.artLarge : ""].join(" ")} data-ui="project-art">
      <div className={styles.browserTop}>
        <span aria-hidden="true" className={styles.dots}>● ● ●</span>
        <span>{slug.replace(/-/g, ".")}</span>
        <span>↗</span>
      </div>
      {slug === "ocean-yacht-registration" && visual?.src
        ? <>
            <div className={styles.oceanBrand}>
              <div className={styles.oceanLogoFrame}><ProjectArtImage src={visual.src} alt={visual.label} title={title} slug={slug} priority={large} /></div>
              <strong>OCEAN YACHT <span>REGISTRATION</span></strong>
              <small>VESSEL REGISTRATION · DIGITAL WORKFLOWS</small>
            </div>
            <div className={styles.oceanNightArt}><ProjectArtImage src={visual.src} alt={visual.label} title={title} slug={slug} priority={large} /></div>
          </>
        : visual?.src
        ? <ProjectArtImage src={visual.src} alt={visual.label} title={title} slug={slug} priority={large} />
        : slug === "anyarabic"
          ? <div className={styles.academyBrand} role="img" aria-label="AnyArabic editorial project identity">
              <span className={styles.academyGlyph} aria-hidden="true">ع</span>
              <strong>Any<span>Arabic</span></strong>
              <small>WORDPRESS · VPS · CLOUD DELIVERY</small>
            </div>
          : <div className={styles.brandType} aria-label={title}>RICO<span>SCENTS</span></div>}
      <div className={styles.artFoot}>
        <span>{visual?.kind || "Engineering work"}</span>
        <span>PROJECT / {slug === "ocean-yacht-registration" || slug === "auto-levels" || slug === "anyarabic" ? "LIVE" : "ONGOING"}</span>
      </div>
    </div>
  );
}


function MiniVisual({ project }: { project: Project }) {
  const visual = visuals[project.slug];
  return <span className={[bento.miniVisual, project.slug === "maqwi-organics" ? bento.organic : project.slug === "auto-levels" ? bento.auto : project.slug === "rico-scents" ? bento.rico : bento.navy].join(" ")}>
    {visual?.src ? <img loading="lazy" src={visual.src} alt="" /> : <strong aria-hidden="true">{project.slug === "anyarabic" ? "ع" : "R"}</strong>}
  </span>;
}

function ProjectRow({ project }: { project: Project }) {
  const title = project.metadata.title.split(" — ")[0];
  return <Link className={bento.projectRow} href={"/work/" + project.slug} aria-label={"Read case study: " + title}>
    <MiniVisual project={project} />
    <span className={bento.rowDetails}>
      <strong>{title}</strong>
      <small>{visuals[project.slug]?.kind || project.metadata.category}</small>
    </span>
    <span className={bento.rowArrow} aria-hidden="true">↗</span>
  </Link>;
}

export function ClientShowcase({ mode = "home" }: { mode?: "home" | "all" }) {
  const projects = sortedClientProjects();
  const lead = projects[0];
  if (!lead) return null;
  const title = lead.metadata.title.split(" — ")[0];
  const visual = visuals[lead.slug];
  const archive = mode === "all"
    ? getPosts(["src", "app", "work", "projects"])
      .filter(project => Number(project.metadata.featuredRank || 0) === 0 && project.slug !== "simple-portfolio-builder")
      .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
    : [];

  return <div className={bento.root} aria-label="Selected client case studies">
    <div className={bento.layout}>
      <article className={bento.featured}>
        <Link className={bento.visualLink} href={"/work/" + lead.slug} aria-label={"Explore " + title}>
          <ProjectVisual slug={lead.slug} title={title} />
        </Link>
        <div className={bento.featureBody}>
          <div className={bento.featureMeta}><span className={bento.liveDot} /> FEATURED DELIVERY <span className={bento.status}>{lead.metadata.category}</span></div>
          <h3><Link href={"/work/" + lead.slug}>{title}</Link></h3>
          <p>{lead.metadata.summary}</p>
          <div className={bento.tags} aria-label="Technologies used">{(visual?.tools || []).slice(0, 4).map(tool => <span key={tool}>{tool}</span>)}</div>
          <div className={bento.actions}>
            <ActionLink href={"/work/" + lead.slug} variant="primary" size="sm">Read case study</ActionLink>
            {lead.metadata.link && <ActionLink href={lead.metadata.link} variant="quiet" size="sm">View live website</ActionLink>}
          </div>
        </div>
      </article>
      <div className={bento.projectList} aria-label="More selected projects">
        <div className={bento.listHeading}><strong>More projects</strong><span>CLIENT & BUSINESS WORK</span></div>
        {projects.slice(1, mode === "home" ? 5 : undefined).map(project => <ProjectRow project={project} key={project.slug} />)}
      </div>
    </div>
    {mode === "all" && archive.length > 0 && <section className={bento.archive} aria-labelledby="archive-title">
      <div className={bento.archiveHeading}>
        <div><span>ADDITIONAL EXPERIENCE</span><h2 id="archive-title">Earlier projects & learning work</h2></div>
        <p>Internship exercises, prototypes and experiments — shown separately from paid client deliveries.</p>
      </div>
      <div className={bento.archiveGrid}>
        {archive.map(project => <Link href={"/work/" + project.slug} key={project.slug} className={bento.archiveCard}>
          <span>{project.metadata.category || "Practice project"}</span>
          <h3>{project.metadata.title.split(" — ")[0]}</h3>
          <p>{project.metadata.summary}</p>
          <small>Explore project ↗</small>
        </Link>)}
      </div>
    </section>}
    <p className={bento.disclosure}>Visuals use public brand assets or clearly labeled editorial representations. Case studies distinguish delivered work from ongoing work; private dashboards, customer records and credentials are not displayed.</p>
  </div>;
}
