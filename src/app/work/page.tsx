import { getPosts } from "@/app/utils/utils";
import { Column, Heading, Text } from "@/once-ui/components";
import { Projects } from "@/components/work/Projects";
import { baseURL } from "@/app/resources";
import { person, work } from "@/app/resources/content";

export async function generateMetadata() {
  const title = work.title;
  const description = work.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/work/`,
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function Work() {
  const allProjects = getPosts(["src", "app", "work", "projects"]);
  const featuredProjects = allProjects.filter((project) => (project.metadata.featuredRank || 0) > 0);

  return (
    <Column maxWidth="xl" gap="xl">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            headline: work.title,
            description: work.description,
            url: `https://${baseURL}/work`,
            image: `https://${baseURL}/og?title=Client%20Case%20Studies`,
            author: {
              "@type": "Person",
              name: person.name,
            },
            hasPart: featuredProjects.map((project) => ({
              "@type": "CreativeWork",
              headline: project.metadata.title,
              description: project.metadata.summary,
              url: `https://${baseURL}/work/${project.slug}`,
              image: project.metadata.image ? `https://${baseURL}${project.metadata.image}` : `https://${baseURL}/og?title=${encodeURIComponent(project.metadata.title)}`,
            })),
          }),
        }}
      />
      <Column maxWidth="m" paddingY="l" gap="m">
        <Text variant="label-default-s" onBackground="accent-medium">PRODUCTION WORK & CLIENT BUILDS</Text>
        <Heading as="h1" variant="display-strong-m" wrap="balance">Work that goes beyond a demo.</Heading>
        <Text variant="heading-default-l" onBackground="neutral-weak" wrap="balance">
          Delivered web platforms, operational workflows and e-commerce implementations. Each case study explains the scope, technology and real delivery status.
        </Text>
      </Column>
      <Projects clientWorkOnly columns="2" />
    </Column>
  );
}
