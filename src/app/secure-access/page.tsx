import type { Metadata } from "next";
import { Column, Heading, Text } from "@/once-ui/components";
import { ActionLink } from "@/components/ui/ActionLink";

export const metadata: Metadata = {
  title: "Restricted area unavailable",
  description: "Private portfolio content is not accessible through a public password form.",
  robots: { index: false, follow: false },
};

export default function PrivateAccessPage() {
  return <Column as="main" maxWidth="m" gap="20" paddingY="xl" horizontal="center">
    <Heading as="h1" variant="display-strong-s">Restricted content</Heading>
    <Text variant="body-default-l" onBackground="neutral-weak">
      The public password form has been retired because no authenticated access service is configured.
      Request access to private work through the contact page.
    </Text>
    <ActionLink href="/contact" variant="primary">Request access</ActionLink>
    <ActionLink href="/work" variant="quiet" icon="arrow-left">Back to public work</ActionLink>
  </Column>;
