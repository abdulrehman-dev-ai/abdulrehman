import Link from "next/link";
import { formatDate } from "@/app/utils/formatDate";
import styles from "./Posts.module.scss";

interface PostProps {
  post: {
    slug: string;
    metadata: {
      title: string;
      publishedAt?: string;
      tag?: string;
      image?: string;
    };
  };
  thumbnail: boolean;
}

/* Native semantic cards avoid typography inheritance from Once UI Heading/Flex.
   The title has an explicit, fluid line-height and can never collide with metadata. */
export default function Post({ post, thumbnail }: PostProps) {
  const tags = (post.metadata.tag || "").split(",").map(tag => tag.trim()).filter(Boolean).slice(0, 3);
  const published = post.metadata.publishedAt;
  return (
    <article className={styles.card}>
      <Link className={styles.link} href={`/blog/${post.slug}`}>
        {thumbnail && post.metadata.image && (
          <div className={styles.imageWrap}>
            <img src={post.metadata.image} alt="" className={styles.image} loading="lazy" />
          </div>
        )}
        <div className={styles.content}>
          <span className={styles.eyebrow}>FIELD NOTE <span aria-hidden="true">/</span> ENGINEERING</span>
          <h3 className={styles.title}>{post.metadata.title}</h3>
          {published && (
            <time className={styles.date} dateTime={published}>
              {formatDate(published, false)}
            </time>
          )}
          {tags.length > 0 && (
            <div className={styles.tags} aria-label="Topics">
              {tags.map(tag => <span className={styles.tag} key={tag}>{tag}</span>)}
            </div>
          )}
          <span className={styles.read}>Read article <span aria-hidden="true">↗</span></span>
        </div>
      </Link>
    </article>
  );
}
