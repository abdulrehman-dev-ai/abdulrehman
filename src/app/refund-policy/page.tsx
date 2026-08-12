import { Column, Heading, Text } from "@/once-ui/components";
import { LegalPage } from "@/components/LegalPage";
import { baseURL } from "@/app/resources";
import { business, legal } from "@/app/resources/content";

export async function generateMetadata() {
  const title = legal.refund.title;
  const description = `Return and Refund Policy for ${business.name}`;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: `https://${baseURL}/refund-policy`, images: [{ url: ogImage, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default function RefundPolicyPage() {
  return (
    <LegalPage title={legal.refund.title} lastUpdated={legal.refund.lastUpdated}>
      <Text>
        At {business.name}, we are committed to delivering high-quality professional services.
        This Return & Refund Policy outlines the conditions under which refunds may be issued.
      </Text>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">1. Digital Services</Heading>
        <Text>
          Our services are digital and professional in nature (cloud setup, DevOps, development,
          security assessments). As such, traditional &quot;returns&quot; do not apply. Refunds are
          evaluated on a case-by-case basis based on the terms below.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">2. Refund Eligibility</Heading>
        <Column as="ul" gap="8">
          <Text as="li"><strong>Before work begins:</strong> Full refund if you cancel before any work has been started on your project.</Text>
          <Text as="li"><strong>During the project:</strong> Partial refund may be issued for the uncompleted portion of work, minus any costs already incurred.</Text>
          <Text as="li"><strong>After delivery:</strong> Refunds are generally not available once deliverables have been accepted. If deliverables do not match the agreed scope, we will revise the work at no additional cost.</Text>
        </Column>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">3. Non-Refundable Items</Heading>
        <Column as="ul" gap="8">
          <Text as="li">Third-party costs (domain registrations, hosting fees, SSL certificates, cloud resources)</Text>
          <Text as="li">Completed and accepted deliverables</Text>
          <Text as="li">Consultation sessions that have already been conducted</Text>
          <Text as="li">Payment processing fees charged by the payment gateway</Text>
        </Column>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">4. Refund Process</Heading>
        <Text>To request a refund:</Text>
        <Column as="ol" gap="8">
          <Text as="li">Email us at {business.email} with your order/project details and reason for the refund request.</Text>
          <Text as="li">We will review your request within 3–5 business days.</Text>
          <Text as="li">Approved refunds will be processed within 7–14 business days to the original payment method.</Text>
        </Column>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">5. Disputes</Heading>
        <Text>
          If you are unsatisfied with our service, we encourage you to contact us first so we can
          resolve the issue. We are committed to finding a fair solution for both parties.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">6. Contact</Heading>
        <Text>
          For refund requests or questions, contact us at {business.email} or {business.phone}.
          Office: {business.address}.
        </Text>
      </Column>
    </LegalPage>
  );
}
