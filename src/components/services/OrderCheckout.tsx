"use client";

import { Button, Column, Heading, Text } from "@/once-ui/components";
import { business } from "@/app/resources/content";
import styles from "./OrderCheckout.module.scss";

interface OrderCheckoutProps {
  serviceSlug: string;
  serviceTitle: string;
  price: string;
  currency?: string;
  priceNote?: string;
}

export function OrderCheckout({ serviceTitle, price, currency = "PKR", priceNote = "Starting from" }: OrderCheckoutProps) {
  const subject = encodeURIComponent(`Project inquiry: ${serviceTitle}`);
  const body = encodeURIComponent(`Hello, I'd like to discuss ${serviceTitle}. Please share scope, timeline and a tailored quote.`);
  return (
    <Column id="order" fillWidth maxWidth="xs" className={styles.checkout} border="neutral-medium" radius="l"
      padding="24" gap="16" background="surface">
      <Heading as="h2" variant="heading-strong-l">Let's discuss your project</Heading>
      <Text onBackground="neutral-weak" variant="body-default-m">
        Tell me about your requirements. I will confirm the scope and provide a tailored proposal.
      </Text>
      <Text onBackground="neutral-medium" variant="body-default-s">{serviceTitle}</Text>
      <Heading variant="heading-strong-l" onBackground="brand-strong">
        {priceNote}: {currency} {price}
      </Heading>
      <Button href={`mailto:${business.email}?subject=${subject}&body=${body}`}
        variant="primary" fillWidth>Request a quote</Button>
      <Text variant="body-default-xs" onBackground="neutral-weak">
        Online payments are not enabled. No payment information is collected on this page.
      </Text>
    </Column>
  );
}
