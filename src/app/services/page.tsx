import { getPosts } from "@/app/utils/utils";
import { Column, Flex, Heading, Text } from "@/once-ui/components";
import { Services } from "@/components/services/Services";
import { baseURL } from "@/app/resources";
import { business, person, services } from "@/app/resources/content";

export async function generateMetadata() {
  const title = services.title;
  const description = services.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/services`,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function ServicesPage() {
  const allServices = getPosts(["src", "app", "services", "items"]);

  return (
    <Column maxWidth="xl">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: business.name,
            description: services.description,
            url: `https://${baseURL}/services`,
            telephone: business.phone,
            email: business.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: business.address,
              addressLocality: "Lahore",
              addressRegion: "Punjab",
              postalCode: "54000",
              addressCountry: "PK",
            },
            provider: {
              "@type": "Person",
              name: person.name,
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Professional Services",
              itemListElement: allServices.map((service) => ({
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: service.metadata.title,
                  description: service.metadata.summary,
                  url: `https://${baseURL}/services/${service.slug}`,
                },
                price: service.metadata.price,
                priceCurrency: service.metadata.currency || "PKR",
              })),
            },
          }),
        }}
      />

      <Column maxWidth="m" gap="8" paddingX="m" marginBottom="32">
        <Heading variant="display-strong-l">{services.title}</Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          {services.description}
        </Text>
      </Column>

      <Services />

      <Flex
        fillWidth
        maxWidth="m"
        marginX="auto"
        border="neutral-medium"
        radius="l"
        padding="24"
        gap="8"
        direction="column"
        background="neutral-alpha-weak"
        marginBottom="40"
      >
        <Text variant="heading-strong-m">Need a custom solution?</Text>
        <Text variant="body-default-m" onBackground="neutral-weak">
          Every project is scoped individually. Reach out for a detailed quote tailored to
          your requirements.
        </Text>
        <Text variant="body-default-s" onBackground="neutral-weak">
          {business.email} · {business.phone}
        </Text>
      </Flex>
    </Column>
  );
}
