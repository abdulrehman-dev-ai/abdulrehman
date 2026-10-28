import { getPosts } from "@/app/utils/utils";
import { Column, Heading } from "@/once-ui/components";
import { ClientShowcase } from "@/components/work/ClientShowcase";
import { baseURL } from "@/app/resources";
import { work, person } from "@/app/resources/content";
import styles from "./work.module.scss";

export async function generateMetadata() {
  const title = "Selected Engineering Work";
  const description = "Real client projects spanning cloud applications, automotive web, WordPress commerce and Shopify.";
  const image = "https://" + baseURL + "/og?title=" + encodeURIComponent(title);
  return { title, description, alternates:{canonical:"https://" + baseURL + "/work"},
    openGraph:{title,description,url:"https://" + baseURL + "/work",images:[{url:image}]},
    twitter:{card:"summary_large_image",title,description,images:[image]} };
}

export default function Work() {
  const featured = getPosts(["src","app","work","projects"]).filter(p=>Number(p.metadata.featuredRank||0)>0);
  return <Column maxWidth="xl" gap="xl" fillWidth>
    <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{__html:JSON.stringify({
      "@context":"https://schema.org","@type":"CollectionPage",name:work.title,
      url:"https://" + baseURL + "/work",author:{"@type":"Person",name:person.name},
      hasPart:featured.map(p=>({"@type":"CreativeWork",name:p.metadata.title,url:"https://" + baseURL + "/work/" + p.slug}))
    })}} />
    <header className={styles.header}>
      <p className={styles.overline}>PORTFOLIO / SELECTED ENGAGEMENTS</p>
      <Heading as="h1" variant="display-strong-l" wrap="balance">Proof of work. Not just promises.</Heading>
      <p className={styles.summary}>Production platforms, client websites and active commerce projects. Explore what I built, the engineering decisions, and the actual delivery status.</p>
      <div className={styles.factline}><span>CLIENT DELIVERY</span><span>PLATFORM ENGINEERING</span><span>RELEASE & OPERATIONS</span></div>
    </header>
    <ClientShowcase mode="all" />
    <section className={styles.end}>
      <p>Have a similar challenge?</p>
      <h2>Build with someone who can take it to production.</h2>
      <a href="/contact">Start a conversation <span aria-hidden="true">↗</span></a>
    </section>
  </Column>;
}