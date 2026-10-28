import type { Metadata } from "next";
import { Button, Column, Heading, Text } from "@/once-ui/components";

export const metadata: Metadata = {
  title: "Online Checkout Unavailable",
  description: "Online ordering is not yet available; request a quote.",
  robots: { index: false, follow: false },
};

export default function OrderStatusPage() {
  return (
    <Column maxWidth="m" paddingY="xl" gap="24" horizontal="center">
      <Heading as="h1" variant="display-strong-s">Online checkout is temporarily unavailable</Heading>
      <Text variant="body-default-l" onBackground="neutral-weak">
        We are currently accepting project inquiries and tailored quote requests.
        No online order or payment has been processed through this page.
      </Text>
      <Button href="/contact" variant="primary" arrowIcon>Request a project quote</Button>
    </Column>
  );
}
