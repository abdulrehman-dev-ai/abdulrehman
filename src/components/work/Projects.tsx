import { getPosts } from "@/app/utils/utils";
import { Grid } from "@/once-ui/components";
import { ProjectCard } from "@/components";

interface ProjectsProps {
  range?: [number, number?];
}

export function Projects({ range }: ProjectsProps) {
  let allProjects = getPosts(["src", "app", "work", "projects"]);

  const sortedProjects = allProjects.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedProjects = range
    ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
    : sortedProjects;

  return (
    <Grid 
      fillWidth 
      gap="xl" 
      marginBottom="40"
      paddingX="m"
      columns="3"
      tabletColumns="2"
      mobileColumns="1"
      style={{
        alignItems: "stretch",
        justifyItems: "center"
      }}
    >
      {displayedProjects.map((post, index) => (
        <ProjectCard
          priority={index < 2}
          key={post.slug}
          href={`work/${post.slug}`}
          images={post.metadata.images}
          title={post.metadata.title}
          description={post.metadata.summary}
          content={post.content}
          avatars={post.metadata.team?.map((member) => ({ 
            src: member.avatar,
            key: `${member.name}-${member.role}` 
          })) || []}
          link={post.metadata.link || ""}
        />
      ))}
    </Grid>
  );
}
