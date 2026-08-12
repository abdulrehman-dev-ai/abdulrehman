import { Column, Heading, Text } from "@/once-ui/components";
import { LegalPage } from "@/components/LegalPage";
import { baseURL } from "@/app/resources";
import { business, legal } from "@/app/resources/content";

export async function generateMetadata() {
  const title = legal.servicePolicy.title;
  const description = `Service delivery policy for ${business.name}`;
  const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: `https://${baseURL}/service-policy`, images: [{ url: ogImage, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default function ServicePolicyPage() {
  return (
    <LegalPage title={legal.servicePolicy.title} lastUpdated={legal.servicePolicy.lastUpdated}>
      <Text>
        {business.name} provides digital professional services. This policy describes how our
        services are delivered. As we do not sell physical products, no physical shipping is
        involved.
      </Text>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">1. Service Delivery</Heading>
        <Text>
          All services are delivered digitally. Depending on the service type, deliverables may
          include configured cloud infrastructure, deployed applications, security assessment
          reports, automation scripts, documentation, or source code repositories.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">2. Delivery Timelines</Heading>
        <Column as="ul" gap="8">
          <Text as="li"><strong>Small tasks</strong> (server setup, scripting): 2–5 business days</Text>
          <Text as="li"><strong>Medium projects</strong> (CI/CD pipelines, containerization): 1–2 weeks</Text>
          <Text as="li"><strong>Large projects</strong> (full-stack development, VAPT): 2–6 weeks</Text>
          <Text as="li"><strong>Ongoing support:</strong> Response within 24 hours during business days</Text>
        </Column>
        <Text>
          Exact timelines are agreed upon in the project quote before work begins.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">3. Delivery Method</Heading>
        <Column as="ul" gap="8">
          <Text as="li">Cloud infrastructure: Access credentials and documentation delivered via secure channels</Text>
          <Text as="li">Code & scripts: Delivered via GitHub repository or secure file transfer</Text>
          <Text as="li">Reports: Delivered as PDF documents via email</Text>
          <Text as="li">Deployed applications: Live URL provided upon completion</Text>
        </Column>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">4. Shipping Policy</Heading>
        <Text>
          We do not ship physical products. All services are delivered electronically. No shipping
          charges apply.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">5. Post-Delivery Support</Heading>
        <Text>
          All projects include a 14-day post-delivery support period for bug fixes and minor
          adjustments related to the original scope. Extended support and maintenance plans are
          available upon request.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">6. Service Availability</Heading>
        <Text>
          We operate {business.hours}. Emergency support for critical production issues may be
          available outside business hours by prior arrangement.
        </Text>
      </Column>

      <Column gap="8">
        <Heading as="h2" variant="heading-strong-l">7. Contact</Heading>
        <Text>
          For service delivery inquiries, contact us at {business.email} or {business.phone}.
          Office: {business.address}.
        </Text>
      </Column>
    </LegalPage>
  );
}
