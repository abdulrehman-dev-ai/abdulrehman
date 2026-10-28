import Link from "next/link";
import { getPosts } from "@/app/utils/utils";
import styles from "./ClientShowcase.module.scss";
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
    <div className={[styles.art, variant, large ? styles.artLarge : ""].join(" ")}>
      <div className={styles.browserTop}>
        <span aria-hidden="true" className={styles.dots}>● ● ●</span>
        <span>{slug.replace(/-/g, ".")}</span>
        <span>↗</span>
      </div>
      {visual?.src
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

function SmallCard({ project, index }: { project: Project; index: number }) {
  const visual = visuals[project.slug];
  const title = project.metadata.title.split(" — ")[0];
  return (
    <article className={styles.smallCard}>
      <Link href={"/work/" + project.slug} className={styles.artLink} aria-label={"Read " + title + " case study"}>
        <ProjectVisual slug={project.slug} title={title} />
      </Link>
      <div className={styles.smallBody}>
        <div className={styles.itemOverline}>
          <span>0{index + 2} / {visual?.kind || project.metadata.category}</span>
          <span className={styles.dot} aria-hidden="true" />
        </div>
        <h3><Link href={"/work/" + project.slug}>{title}</Link></h3>
        <p>{project.metadata.summary}</p>
        <div className={styles.smallFooter}>
          <ActionLink href={"/work/" + project.slug} size="sm" variant="quiet">Explore case study</ActionLink>
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
          <ProjectVisual slug={lead.slug} title={title} large />
        </Link>
        <div className={styles.leadBody}>
          <div className={styles.leadEyebrow}><span className={styles.dot} /> 01 / FEATURED DELIVERY</div>
          <h3><Link href={"/work/" + lead.slug}>{title}</Link></h3>
          <p>{lead.metadata.summary}</p>
          <div className={styles.techs}>
            {(visual?.tools || []).map((tool) => <span key={tool}>{tool}</span>)}
          </div>
          <div className={styles.leadActions}>
            <ActionLink href={"/work/" + lead.slug} variant="primary">Explore case study</ActionLink>
            {lead.metadata.link && <ActionLink href={lead.metadata.link} variant="quiet">View live platform</ActionLink>}
          </div>
        </div>
      </article>
      <div className={styles.supporting}>
        {projects.slice(1, mode === "home" ? 4 : undefined).map((project, index) => <SmallCard project={project} index={index} key={project.slug} />)}
      </div>
      <p className={styles.disclosure}>Project visuals use public brand assets or clearly marked editorial treatments. Confidential infrastructure, private dashboards and customer records are not shown. Individual case studies distinguish delivered work from work still in progress.</p>
    </div>
  );
}
