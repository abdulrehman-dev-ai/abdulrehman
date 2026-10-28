import { notFound } from "next/navigation";
import { getPosts } from "@/app/utils/utils";
import { CustomMDX } from "@/components/mdx";
import { Column } from "@/once-ui/components";
import { ProjectVisual } from "@/components/work/ClientShowcase";
import { baseURL } from "@/app/resources";
import { person } from "@/app/resources/content";
import styles from "./case-study.module.scss";
import { ActionLink } from "@/components/ui/ActionLink";

type Params = Promise<{ slug:string }>;
export async function generateStaticParams() {
  return getPosts(["src","app","work","projects"]).map(p=>({slug:p.slug}));
}
export async function generateMetadata({params}:{params:Params}){
  const {slug}=await params;
  const post=getPosts(["src","app","work","projects"]).find(p=>p.slug===slug);
  if(!post)return {};
  const title=post.metadata.title;
  const description=post.metadata.summary;
  const image="https://" + baseURL + "/og?title=" + encodeURIComponent(title);
  return {title,description,alternates:{canonical:"https://"+baseURL+"/work/"+slug},
    openGraph:{title,description,type:"article" as const,url:"https://"+baseURL+"/work/"+slug,images:[{url:image}]},
    twitter:{card:"summary_large_image",title,description,images:[image]}};
}
export default async function ProjectPage({params}:{params:Params}){
  const {slug}=await params;
  const post=getPosts(["src","app","work","projects"]).find(p=>p.slug===slug);
  if(!post)notFound();
  const title=post.metadata.title;
  const shortTitle=title.split(" — ")[0];
  const category=post.metadata.category||"Engineering project";
  const live=category.toLowerCase().includes("live")||category.toLowerCase().includes("delivered");
  const status=category.toLowerCase().includes("pre-launch")?"Pre-launch":category.toLowerCase().includes("in progress")?"In progress":live?"Live / delivered":"Project documentation";
  return <Column maxWidth="xl" fillWidth gap="xl">
    <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{__html:JSON.stringify({
      "@context":"https://schema.org","@type":"CreativeWork",name:title,
      description:post.metadata.summary,url:"https://"+baseURL+"/work/"+slug,
      author:{"@type":"Person",name:person.name}
    })}}/>
    <header className={styles.header}>
      <ActionLink href="/work" variant="quiet" size="sm" icon="arrow-left">All case studies</ActionLink>
      <div className={styles.tags}><span>{category}</span><span>{status}</span></div>
      <h1>{shortTitle}<span className={styles.titleSuffix}>{title.includes(" — ")?" — "+title.split(" — ").slice(1).join(" — "):""}</span></h1>
      <p className={styles.summary}>{post.metadata.summary}</p>
      <div className={styles.headerActions}>
        {post.metadata.link && <ActionLink href={post.metadata.link} variant="primary">Open public project</ActionLink>}
        <ActionLink href="/contact" variant="secondary">Discuss a similar project</ActionLink>
      </div>
    </header>
    <div className={styles.visual}><ProjectVisual slug={slug} title={shortTitle} large /></div>
    <div className={styles.bodyLayout}>
      <aside className={styles.sidebar}>
        <p className={styles.eyebrow}>PROJECT OVERVIEW</p>
        <div><small>STATUS</small><strong>{status}</strong></div>
        <div><small>AREA</small><strong>{category}</strong></div>
        <div><small>PUBLISHED</small><strong>{post.metadata.publishedAt}</strong></div>
        <ActionLink href="/work" size="sm" variant="quiet">More projects</ActionLink>
      </aside>
      <article className={styles.prose}><CustomMDX source={post.content} />
        <div className={styles.end}><h2>Have a similar challenge?</h2><p>Let's talk about what your business needs — and how to build it responsibly.</p><ActionLink href="/contact" variant="primary">Start the conversation</ActionLink></div>
      </article>
    </div>
  </Column>;
}