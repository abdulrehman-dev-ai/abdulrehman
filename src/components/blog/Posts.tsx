import { getPosts } from "@/app/utils/utils";
import Post from "./Post";
import styles from "./Posts.module.scss";

interface PostsProps {
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
}

const columnStyles = {
  "1": styles.oneColumn,
  "2": styles.twoColumns,
  "3": styles.threeColumns,
};

export function Posts({ range, columns = "1", thumbnail = false }: PostsProps) {
  const allBlogs = getPosts(["src", "app", "blog", "posts"]);
  const sortedBlogs = allBlogs.sort(
    (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  );
  const displayedBlogs = range
    ? sortedBlogs.slice(range[0] - 1, range.length === 2 ? range[1] : sortedBlogs.length)
    : sortedBlogs;

  if (!displayedBlogs.length) return null;

  return (
    <div className={`${styles.grid} ${columnStyles[columns]}`} aria-label="Latest journal entries">
      {displayedBlogs.map(post => <Post key={post.slug} post={post} thumbnail={thumbnail} />)}
    </div>
  );
}
