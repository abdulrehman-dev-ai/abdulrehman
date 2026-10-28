"use client";

import {
  AvatarGroup,
  Card,
  Carousel,
  Column,
  Flex,
  Heading,
  SmartLink,
  Text,
} from "@/once-ui/components";
import styles from "./ProjectCard.module.scss";

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
        <div className={styles.projectVisual} aria-label={category || "Portfolio case study"}>
          <span className={styles.projectEyebrow}>SELECTED WORK / REAL-WORLD DELIVERY</span>
          <span className={styles.projectCategory}>{category || "Engineering project"}</span>
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
              <SmartLink
                suffixIcon="arrowRight"
                style={{ margin: "0", width: "fit-content" }}
                href={href}
              >
                <Text variant="body-default-s" onBackground="accent-strong">Read case study</Text>
              </SmartLink>
            )}
            {link && (
              <SmartLink
                suffixIcon="arrowUpRightFromSquare"
                style={{ margin: "0", width: "fit-content" }}
                href={link}
              >
                <Text variant="body-default-s" onBackground="accent-strong">View project</Text>
              </SmartLink>
            )}
          </Flex>
        </Flex>
      </Column>
    </Card>
  );
};