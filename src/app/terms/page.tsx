import { Column, Heading, Text } from "@/once-ui/components";
import { LegalPage } from "@/components/LegalPage";
import { baseURL } from "@/app/resources";
import { business, legal, person } from "@/app/resources/content";

export async function generateMetadata() {
  const title = legal.terms.title;
  const description = `Terms and Conditions for ${business.name}`;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: `https://${baseURL}/terms`, images: [{ url: ogImage, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default function TermsPage() {
  return (
    <LegalPage title={legal.terms.title} lastUpdated={legal.terms.lastUpdated}>
      <Text>
        These Terms and Conditions (&quot;Terms&quot;) govern your use of the website and services
        provided by {business.name}, operated by {person.name}. By accessing our website or
        purchasing our services, you agree to these Terms.
      </Text>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">1. Services</Heading>
        <Text>
          We provide professional technology services including cloud infrastructure, DevOps
          automation, cybersecurity assessments, and web development. Service scope, deliverables,
          and timelines are defined in individual project agreements or quotes.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">2. Pricing & Payment</Heading>
        <Text>
          All prices are listed in Pakistani Rupees (PKR) unless otherwise stated. Payment is
          required as per the agreed schedule — typically 50% upfront and 50% upon completion
          for project-based work. Payments are processed securely through PayFast or other
          approved payment methods.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">3. Client Responsibilities</Heading>
        <Column as="ul" gap="8">
          <Text as="li">Provide accurate project requirements and necessary access credentials</Text>
          <Text as="li">Respond to communications within agreed timeframes</Text>
          <Text as="li">Ensure you have the legal right to any content or data provided to us</Text>
          <Text as="li">Make timely payments as per the agreed schedule</Text>
        </Column>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">4. Intellectual Property</Heading>
        <Text>
          Upon full payment, clients receive ownership of custom deliverables created specifically
          for their project. We retain the right to use general methodologies, frameworks, and
          non-proprietary tools. We may showcase completed work in our portfolio unless a
          non-disclosure agreement is in place.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">5. Confidentiality</Heading>
        <Text>
          We treat all client data, credentials, and business information as confidential. We will
          not disclose client information to third parties without consent, except as required by
          law.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">6. Limitation of Liability</Heading>
        <Text>
          Our liability is limited to the amount paid for the specific service in question. We
          are not liable for indirect, incidental, or consequential damages. For infrastructure
          and security services, we follow industry best practices but cannot guarantee
          protection against all threats.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">7. Cancellation</Heading>
        <Text>
          Either party may cancel a project with written notice. Cancellation terms, including
          any applicable fees for work completed, are outlined in our Refund Policy.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">8. Governing Law</Heading>
        <Text>
          These Terms are governed by the laws of Pakistan. Any disputes shall be resolved in
          the courts of Lahore, Punjab.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">9. Contact</Heading>
        <Text>
          For questions about these Terms, contact us at {business.email} or {business.phone}.
          Office: {business.address}.
        </Text>
      </Column>
    </LegalPage>
  );
}
