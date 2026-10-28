"use client";

import Image from "next/image";
import {
  Card,
  Column,
  Flex,
  Heading,
  Tag,
  Text,
} from "@/once-ui/components";
import styles from "./ServiceCard.module.scss";
import { ActionLink } from "@/components/ui/ActionLink";

interface ServiceCardProps {
  href: string;
  image: string;
  title: string;
  description: string;
  category?: string;
  price?: string;
  currency?: string;
  priceNote?: string;
  deliveryTime?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  href,
  image,
  title,
  description,
  category,
  price,
  currency = "PKR",
  priceNote = "Starting from",
  deliveryTime,
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
      className={styles.serviceCard}
    >
      <div className={styles.imageWrapper}>
        {category && (
          <Tag size="s" className={styles.categoryTag}>
            {category}
          </Tag>
        )}
        {price && (
          <div className={styles.priceBadge}>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              {priceNote}
            </Text>
            <Text variant="heading-strong-s" onBackground="brand-strong">
              {currency} {price}
            </Text>
          </div>
        )}
        <Image
          src={image}
          alt={title}
          width={120}
          height={120}
          className={styles.serviceImage}
        />
      </div>

      <Column fillWidth gap="0" className={styles.cardContent}>
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

        {deliveryTime && (
          <Flex className={styles.metaRow} gap="8" vertical="center">
            <Text variant="body-default-xs" onBackground="neutral-weak">
              Delivery: {deliveryTime}
            </Text>
          </Flex>
        )}

        <Flex gap="l" wrap style={{ marginTop: "auto" }} className={styles.actionButtons}>
          <Flex gap="l" wrap className={styles.buttonGroup}>
            <ActionLink href={href} variant="quiet" size="sm">View details</ActionLink>
            <ActionLink href={href + "#order"} variant="primary" size="sm">Request a quote</ActionLink>
          </Flex>
        </Flex>
      </Column>
    </Card>
  );
};
