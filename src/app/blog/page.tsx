import { Column } from "@/once-ui/components";
import { getPosts } from "@/app/utils/utils";
import { baseURL } from "@/app/resources";
import { person } from "@/app/resources/content";
import styles from "./blog.module.scss";
import { ActionLink } from "@/components/ui/ActionLink";

export async function generateMetadata() {
  const title="Engineering Journal";
  const description="Notes on real deployments, application architecture, security and solving practical problems.";
  const img="https://" + baseURL + "/og?title=" + encodeURIComponent(title);
  return {title,description,alternates:{canonical:"https://" + baseURL + "/blog"},
    openGraph:{title,description,url:"https://" + baseURL + "/blog",images:[{url:img}]},
    twitter:{card:"summary_large_image",title,description,images:[img]}};
}
export default function Blog() {
  const posts=getPosts(["src","app","blog","posts"]);
  return <Column maxWidth="xl" fillWidth gap="xl">
    <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{__html:JSON.stringify({
      "@context":"https://schema.org","@type":"Blog",name:"Engineering Journal",author:{"@type":"Person",name:person.name},
      url:"https://" + baseURL + "/blog"
    })}}/>
    <header className={styles.header}><p className={styles.kicker}>THE JOURNAL / ENGINEERING NOTES</p>
      <h1>From the workbench.</h1>
      <p>Practical writing on building products, debugging infrastructure, shipping safely, and learning from real work.</p>
    </header>
    <section className={styles.list} aria-label="Journal articles">
      {posts.map((post,index)=><a className={styles.entry} key={post.slug} href={"/blog/"+post.slug}>
        <div className={styles.number}>/ {String(index+1).padStart(2,"0")}</div>
        <div className={[styles.thumbnail, post.slug.includes("payment") ? styles.thumbnailPayment : post.slug.includes("ai-") ? styles.thumbnailAi : ""].join(" ")} aria-hidden="true">
          <span>{post.slug.includes("payment") ? "✓" : post.slug.includes("ai-") ? "</>" : "▣"}</span>
        </div>
        <div className={styles.details}>
          <div className={styles.meta}><time dateTime={post.metadata.publishedAt}>{new Date(post.metadata.publishedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</time>
            {post.metadata.tag && <span>{String(post.metadata.tag).split(",")[0]}</span>}</div>
          <h2>{post.metadata.title}</h2>
          <p>{post.metadata.summary}</p>
        </div>
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </a>)}
    </section>
    <aside className={styles.cta}><div><span className={styles.kicker}>BEYOND THE ARTICLES</span><h2>Want to see the work behind the writing?</h2></div><ActionLink href="/work" variant="secondary">Explore case studies</ActionLink></aside>
  </Column>;
}