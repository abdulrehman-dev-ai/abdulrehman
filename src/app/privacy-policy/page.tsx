import { Column, Heading, Text } from "@/once-ui/components";
import { LegalPage } from "@/components/LegalPage";
import { baseURL } from "@/app/resources";
import { business, legal, person } from "@/app/resources/content";

export async function generateMetadata() {
  const title = legal.privacy.title;
  const description = `Privacy Policy for ${business.name}`;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: `https://${baseURL}/privacy-policy`, images: [{ url: ogImage, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title={legal.privacy.title} lastUpdated={legal.privacy.lastUpdated}>
      <Text>
        {business.name} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), operated by{" "}
        {person.name}, is committed to protecting your privacy. This Privacy Policy explains how
        we collect, use, and safeguard your information when you visit our website or use our
        services.
      </Text>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">1. Information We Collect</Heading>
        <Text>We may collect the following types of information:</Text>
        <Column as="ul" gap="8">
          <Text as="li"><strong>Personal Information:</strong> Name, email address, phone number, and company details when you contact us or request a quote.</Text>
          <Text as="li"><strong>Project Information:</strong> Technical requirements, server credentials, and other data necessary to deliver our services.</Text>
          <Text as="li"><strong>Payment Information:</strong> Transaction details processed through our payment gateway (PayFast). We do not store credit card or bank account details on our servers.</Text>
          <Text as="li"><strong>Usage Data:</strong> IP address, browser type, pages visited, and time spent on our website via analytics tools.</Text>
        </Column>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">2. How We Use Your Information</Heading>
        <Column as="ul" gap="8">
          <Text as="li">To provide, maintain, and improve our services</Text>
          <Text as="li">To process payments and send transaction confirmations</Text>
          <Text as="li">To communicate about projects, support requests, and service updates</Text>
          <Text as="li">To comply with legal obligations and prevent fraud</Text>
        </Column>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">3. Data Sharing</Heading>
        <Text>
          We do not sell your personal information. We may share data with trusted third parties
          only when necessary — such as payment processors (PayFast), cloud hosting providers, or
          when required by law.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">4. Data Security</Heading>
        <Text>
          We implement industry-standard security measures including encrypted connections (HTTPS),
          access controls, and secure credential handling. However, no method of transmission
          over the internet is 100% secure.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">5. Data Retention</Heading>
        <Text>
          We retain personal data only as long as necessary to fulfill the purposes outlined in
          this policy, comply with legal obligations, or resolve disputes. Project-related data
          is deleted upon client request after project completion.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">6. Your Rights</Heading>
        <Text>You have the right to:</Text>
        <Column as="ul" gap="8">
          <Text as="li">Access, correct, or delete your personal data</Text>
          <Text as="li">Withdraw consent for data processing</Text>
          <Text as="li">Request a copy of your data</Text>
        </Column>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">7. Cookies</Heading>
        <Text>
          Our website uses cookies and similar technologies for analytics and to improve user
          experience. You can control cookie preferences through your browser settings.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">8. Contact Us</Heading>
        <Text>
          For privacy-related inquiries, contact us at {business.email} or {business.phone}.
          Office: {business.address}.
        </Text>
      </Column>
    </LegalPage>
  );
}
