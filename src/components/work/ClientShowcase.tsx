import Link from "next/link";
import { getPosts } from "@/app/utils/utils";
import styles from "./ClientShowcase.module.scss";

type Project = ReturnType<typeof getPosts>[number];
const visuals: Record<string, { src?: string; label: string; kind: string; tools: string[] }> = {
  "ocean-yacht-registration": {
    src: "https://oceanyachtregistration.com/ocean-yacht-logo-white.svg",
    label: "Official Ocean Yacht Registration branding",
    kind: "Full-stack platform",
    tools: ["Cloudflare Workers", "D1", "Supabase", "Resend"],
  },
  "auto-levels": {
    src: "https://www.autolevels.pk/assets/black-tF-bFyqn.png",
    label: "Official Auto Levels website branding",
    kind: "Client website",
    tools: ["Web delivery", "Business operations"],
  },
  "maqwi-organics": {
    src: "https://maqwiorganics.gt.tc/wp-content/themes/maqwi-organics/assets/images/hero-collection-v3.webp?v=studio-1",
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

function Visual({ slug, title, large = false }: { slug: string; title: string; large?: boolean }) {
  const visual = visuals[slug];
  const variant = slug === "ocean-yacht-registration" ? styles.ocean
    : slug === "maqwi-organics" ? styles.organic
    : slug === "auto-levels" ? styles.auto
    : styles.fragrance;
  return (
    <div className={[styles.art, variant, large ? styles.artLarge : ""].join(" ")}>
      <div className={styles.browserTop}>
        <span aria-hidden="true" className={styles.dots}>● ● ●</span>
        <span>{slug.replace(/-/g, ".")}</span>
        <span>↗</span>
      </div>
      {visual?.src
        ? <img className={styles.brandImage} src={visual.src} alt={visual.label}
            loading={large ? "eager" : "lazy"} referrerPolicy="no-referrer" />
        : <div className={styles.brandType} aria-label={title}>RICO<span>SCENTS</span></div>}
      <div className={styles.artFoot}>
        <span>{visual?.kind || "Engineering work"}</span>
        <span>PROJECT / {slug === "ocean-yacht-registration" || slug === "auto-levels" ? "LIVE" : "ONGOING"}</span>
      </div>
    </div>
  );
}

function SmallCard({ project, index }: { project: Project; index: number }) {
  const visual = visuals[project.slug];
  const title = project.metadata.title.split(" — ")[0];
  return (
    <article className={styles.smallCard}>
      <Link href={"/work/" + project.slug} className={styles.artLink} aria-label={"Read " + title + " case study"}>
        <Visual slug={project.slug} title={title} />
      </Link>
      <div className={styles.smallBody}>
        <div className={styles.itemOverline}>
          <span>0{index + 2} / {visual?.kind || project.metadata.category}</span>
          <span className={styles.dot} aria-hidden="true" />
        </div>
        <h3><Link href={"/work/" + project.slug}>{title}</Link></h3>
        <p>{project.metadata.summary}</p>
        <div className={styles.smallFooter}>
          <Link href={"/work/" + project.slug}>Explore the case study <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </article>
  );
}

export function ClientShowcase({ mode = "home" }: { mode?: "home" | "all" }) {
  const projects = sortedClientProjects();
  const lead = projects[0];
  if (!lead) return null;
  const title = lead.metadata.title.split(" — ")[0];
  const visual = visuals[lead.slug];
  return (
    <div className={styles.showcase}>
      <article className={styles.lead}>
        <Link className={styles.leadVisualLink} href={"/work/" + lead.slug} aria-label={"Explore " + title}>
          <Visual slug={lead.slug} title={title} large />
        </Link>
        <div className={styles.leadBody}>
          <div className={styles.leadEyebrow}><span className={styles.dot} /> 01 / FEATURED DELIVERY</div>
          <h3><Link href={"/work/" + lead.slug}>{title}</Link></h3>
          <p>{lead.metadata.summary}</p>
          <div className={styles.techs}>
            {(visual?.tools || []).map((tool) => <span key={tool}>{tool}</span>)}
          </div>
          <div className={styles.leadActions}>
            <Link href={"/work/" + lead.slug} className={styles.primaryLink}>Explore case study <span aria-hidden="true">↗</span></Link>
            {lead.metadata.link && <a href={lead.metadata.link} target="_blank" rel="noopener noreferrer">View live platform ↗</a>}
          </div>
        </div>
      </article>
      <div className={styles.supporting}>
        {projects.slice(1, mode === "home" ? 4 : undefined).map((project, index) => <SmallCard project={project} index={index} key={project.slug} />)}
      </div>
      <p className={styles.disclosure}>Project photography and branding come from the respective public websites. Screenshots of private admin areas and customer data are intentionally excluded. Delivery status is indicated on each case study.</p>
    </div>
  );
}
