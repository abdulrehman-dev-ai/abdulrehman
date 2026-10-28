import { Button, Column, Flex, Heading, Icon, Text } from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { business, contact } from "@/app/resources/content";
import ContactInquiry from "@/components/ContactInquiry";

export async function generateMetadata() {
  const title = contact.title;
  const description = contact.description;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://${baseURL}/contact`,
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

export default function ContactPage() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="l">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: contact.title,
            url: `https://${baseURL}/contact`,
            mainEntity: {
              "@type": "Organization",
              name: business.name,
              email: business.email,
              telephone: business.phone,
              address: {
                "@type": "PostalAddress",
                streetAddress: business.address,
                addressLocality: "Lahore",
                addressRegion: "Punjab",
                postalCode: "54000",
                addressCountry: "PK",
              },
            },
          }),
        }}
      />

      <Column gap="8">
        <Heading variant="display-strong-l">{contact.title}</Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          {contact.description}
        </Text>
      </Column>

      <Column gap="l">
        <Flex border="neutral-medium" radius="l" padding="24" gap="16" vertical="center">
          <Icon name="person" size="l" onBackground="brand-weak" />
          <Column gap="4">
            <Text variant="heading-strong-m">Business Name</Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {business.name}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              {business.tagline}
            </Text>
          </Column>
        </Flex>

        <Flex border="neutral-medium" radius="l" padding="24" gap="16" vertical="center">
          <Icon name="globe" size="l" onBackground="brand-weak" />
          <Column gap="4">
            <Text variant="heading-strong-m">Office Address</Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {business.address}
            </Text>
          </Column>
        </Flex>

        <Flex border="neutral-medium" radius="l" padding="24" gap="16" vertical="center">
          <Icon name="email" size="l" onBackground="brand-weak" />
          <Column gap="4">
            <Text variant="heading-strong-m">Email</Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {business.email}
            </Text>
          </Column>
        </Flex>

        <Flex border="neutral-medium" radius="l" padding="24" gap="16" vertical="center">
          <Icon name="calendar" size="l" onBackground="brand-weak" />
          <Column gap="4">
            <Text variant="heading-strong-m">Phone</Text>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {business.phone}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              {business.hours}
            </Text>
          </Column>
        </Flex>
      </Column>

      <Flex gap="12" wrap>
        <Button href={`mailto:${business.email}`} prefixIcon="email" variant="primary">
          Send Email
        </Button>
        <Button href={business.whatsapp} prefixIcon="arrowUpRightFromSquare" variant="secondary">
          WhatsApp
        </Button>
      </Flex>

      <Column gap="16" paddingTop="l">
        <Heading variant="heading-strong-l">Project Inquiry</Heading>
        <ContactInquiry siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} email={business.email} />
      </Column>

      <Column gap="8" paddingTop="l">
        <Text variant="heading-strong-m">Support & Inquiries</Text>
        <Text variant="body-default-m" onBackground="neutral-weak">
          For service inquiries, project quotes, or support regarding existing projects, please
          reach out via email or WhatsApp. We typically respond within 24 hours during business
          days.
        </Text>
      </Column>
    </Column>
  );
}
