import React from "react";

import { Heading, Flex, Text, Button, Avatar, RevealFx, Arrow, Column } from "@/once-ui/components";
import { Projects } from "@/components/work/Projects";

import { baseURL, routes } from "@/app/resources";
import { home, about, person, newsletter } from "@/app/resources/content";
import { Mailchimp } from "@/components";
import { Posts } from "@/components/blog/Posts";

export async function generateMetadata() {
  const title = home.title;
  const description = home.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}`,
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

export default function Home() {
  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: home.title,
            description: home.description,
            url: `https://${baseURL}`,
            image: `${baseURL}/og?title=${encodeURIComponent(home.title)}`,
            publisher: {
              "@type": "Person",
              name: person.name,
              image: {
                "@type": "ImageObject",
                url: `${baseURL}${person.avatar}`,
              },
            },
          }),
        }}
      />
      <Column fillWidth paddingY="l" gap="m">
        <Column maxWidth="s">
          <RevealFx translateY="4" fillWidth horizontal="start" paddingBottom="m">
            <Heading wrap="balance" variant="display-strong-l">
              {home.headline}
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="start" paddingBottom="m">
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
              {home.subline}
            </Text>
          </RevealFx>
          <RevealFx translateY="12" delay={0.4} horizontal="start">
            <Button
              id="about"
              data-border="rounded"
              href="/about"
              variant="secondary"
              size="m"
              arrowIcon
            >
              <Flex gap="8" vertical="center">
                {about.avatar.display && (
                  <Avatar
                    style={{ marginLeft: "-0.75rem", marginRight: "0.25rem" }}
                    src={person.avatar}
                    size="m"
                  />
                )}
                {about.title}
              </Flex>
            </Button>
          </RevealFx>
        </Column>
      </Column>
      <section aria-label="Capabilities" style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1rem", width: "100%", paddingBlock: "1rem",
      }}>
        {[
          { title: "Cloud & Infrastructure", description: "Linux, cloud architecture, secure migrations and resilient deployment workflows." },
          { title: "Application Engineering", description: "Full-stack web products, role-based portals and operational dashboards." },
          { title: "Security & Automation", description: "Threat-aware development, infrastructure hardening and AI-assisted delivery." },
        ].map((capability) => (
          <article key={capability.title} style={{
            border: "1px solid var(--neutral-alpha-medium)",
            borderRadius: "1.25rem", padding: "1.5rem",
            background: "var(--surface-background)",
            backdropFilter: "blur(14px)", minHeight: "155px",
          }}>
            <h2 style={{ fontSize: "1.08rem", fontWeight: 650, marginBottom: "0.6rem" }}>{capability.title}</h2>
            <p style={{ opacity: 0.8, lineHeight: 1.65 }}>{capability.description}</p>
          </article>
        ))}
      </section>
      <nav aria-label="Primary actions" style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", width: "100%" }}>
        <Button href="/work" variant="primary" size="m" arrowIcon>Explore Case Studies</Button>
        <Button href="/contact" variant="secondary" size="m" arrowIcon>Start a Conversation</Button>
      </nav>
      <RevealFx translateY="16" delay={0.6}>
        <Projects range={[1, 3]} /> {/* Display first 3 projects */}
      </RevealFx>
      {routes["/blog"] && (
        <Flex fillWidth gap="24" mobileDirection="column">
          <Flex flex={1} paddingLeft="l">
            <Heading as="h2" variant="display-strong-xs" wrap="balance">
              Latest from the blog
            </Heading>
          </Flex>
          <Flex flex={3} paddingX="20">
            <Posts range={[1, 2]} columns="2" /> {/* Display first 2 blog posts */}
          </Flex>
        </Flex>
      )}
      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </Column>
  );
}