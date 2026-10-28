"use client";

import {
  AvatarGroup,
  Card,
  Carousel,
  Column,
  Flex,
  Heading,
  Text,
} from "@/once-ui/components";
import styles from "./ProjectCard.module.scss";
import { ActionLink } from "@/components/ui/ActionLink";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  category?: string;
  avatars: { src: string }[];
  link: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  category,
  avatars,
  link,
}) => {
  const tone = href.includes("ocean-yacht") ? styles.toneOcean
    : href.includes("auto-levels") ? styles.toneAutomotive
    : href.includes("maqwi") ? styles.toneOrganics
    : href.includes("rico-scents") ? styles.toneFragrance
    : styles.toneDefault;
  const shortTitle = title.split(" — ")[0];
  return (
    <Card
      fillWidth
      direction="column"
      gap="0"
      radius="l"
      overflow="hidden"
      border="neutral-alpha-weak"
      background="surface"
      className={styles.projectCard}
    >
      {images.length > 0 ? (
        <Carousel
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          aspectRatio="16 / 10"
          images={images.map((image) => ({
            src: image,
            alt: title,
          }))}
        />
      ) : (
        <div className={`${styles.projectVisual} ${tone}`} role="img" aria-label={`Editorial brand artwork for ${shortTitle}; not a screenshot`}>
          <div className={styles.visualTop}>
            <span>CLIENT PROJECT / PORTFOLIO</span>
            <span className={styles.visualAccent} aria-hidden="true" />
          </div>
          <div className={styles.visualBody}>
            <strong>{shortTitle}</strong>
            <span>{category || "Engineering project"}</span>
          </div>
          <span className={styles.projectDecoration} aria-hidden="true">↗</span>
        </div>
      )}
      <Column
        fillWidth
        gap="0"
        className={styles.cardContent}
      >
        {title && (
          <Heading 
            as="h2" 
            wrap="balance" 
            variant="heading-strong-xl"
            marginBottom="s"
            className={styles.cardTitle}
          >
            {title}
          </Heading>
        )}
        
        {description?.trim() && (
          <Text 
            wrap="balance" 
            variant="body-default-m" 
            onBackground="neutral-medium"
            marginBottom="m"
            className={styles.cardDescription}
          >
            {description}
          </Text>
        )}
        
        <Flex gap="l" wrap style={{ marginTop: "auto" }} className={styles.actionButtons}>
          {avatars?.length > 0 && (
            <AvatarGroup
              avatars={avatars.map((avatar) => ({ ...avatar }))} 
              size="s"
              reverse
              className={styles.avatarGroup}
            />
          )}
          <Flex gap="l" wrap className={styles.buttonGroup}>
            {content?.trim() && (
              <ActionLink href={href} variant="primary" size="sm">Read case study</ActionLink>
            )}
            {link && (
              <ActionLink href={link} variant="secondary" size="sm">View project</ActionLink>
            )}
          </Flex>
        </Flex>
      </Column>
    </Card>
  );
};