import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { getPosts } from "@/app/utils/utils";
import {
  Button,
  Column,
  Flex,
  Heading,
  SmartImage,
  Tag,
  Text,
} from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { person } from "@/app/resources/content";
import ScrollToHash from "@/components/ScrollToHash";
import { OrderCheckout } from "@/components/services/OrderCheckout";
import { Metadata } from "next";
import styles from "./service-detail.module.scss";

type ServiceParams = Promise<{
  slug: string;
}>;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const services = getPosts(["src", "app", "services", "items"]);
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: ServiceParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getPosts(["src", "app", "services", "items"]).find(
    (item) => item.slug === slug,
  );

  if (!service) {
    return {};
  }

  const { title, summary: description, images } = service.metadata;
  const ogImage = images?.[0]
    ? `https://${baseURL}${images[0]}`
    : `https://${baseURL}/og?title=${title}`;

  return {
    title,
    description,
    alternates: { canonical: `https://${baseURL}/services/${service.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://${baseURL}/services/${service.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ServiceDetail({ params }: { params: ServiceParams }) {
  const { slug } = await params;
  const service = getPosts(["src", "app", "services", "items"]).find(
    (item) => item.slug === slug,
  );

  if (!service) {
    notFound();
  }

  const { metadata } = service;

  return (
    <Column as="section" maxWidth="xl" horizontal="center" gap="l" className={styles.detail}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: metadata.title,
            description: metadata.summary,
            url: `https://${baseURL}/services/${service.slug}`,
            provider: {
              "@type": "Person",
              name: person.name,
            },
            offers: {
              "@type": "Offer",
              price: metadata.price,
              priceCurrency: metadata.currency || "PKR",
            },
          }),
        }}
      />

      <Column fillWidth gap="16" className={styles.intro}>
        <Button
          href="/services"
          variant="tertiary"
          weight="default"
          size="s"
          prefixIcon="chevronLeft"
        >
          Services
        </Button>
        <Flex gap="8" wrap vertical="center">
          {metadata.category && <Tag size="m">{metadata.category}</Tag>}
          {metadata.deliveryTime && (
            <Text variant="body-default-s" onBackground="neutral-weak">
              {metadata.deliveryTime}
            </Text>
          )}
        </Flex>
        <Heading variant="display-strong-s">{metadata.title}</Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          {metadata.summary}
        </Text>
      </Column>

      {metadata.images.length > 0 && (
        <SmartImage
          priority
          aspectRatio="16 / 9"
          radius="m"
          alt={metadata.title}
          src={metadata.images[0]}
        />
      )}

      <Flex
        className={styles.price}
        fillWidth
        maxWidth="xs"
        border="neutral-medium"
        radius="l"
        padding="24"
        gap="8"
        direction="column"
        background="neutral-alpha-weak"
      >
        <Text variant="body-default-s" onBackground="neutral-weak">
          {metadata.priceNote || "Starting from"}
        </Text>
        <Heading variant="display-strong-s" onBackground="brand-strong">
          {metadata.currency || "PKR"} {metadata.price}
        </Heading>
      </Flex>

      <OrderCheckout
        serviceSlug={slug}
        serviceTitle={metadata.title}
        price={metadata.price || ""}
        currency={metadata.currency}
        priceNote={metadata.priceNote}
      />

      <Column as="article" className={styles.article} fillWidth>
        <CustomMDX source={service.content} />
      </Column>

      <ScrollToHash />
    </Column>
  );
}
