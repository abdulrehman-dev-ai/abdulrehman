import { Column, Heading, Text } from "@/once-ui/components";
import { ActionLink } from "@/components/ui/ActionLink";
import styles from "./OrderCheckout.module.scss";

interface OrderCheckoutProps {
  serviceSlug: string;
  serviceTitle: string;
  price: string;
  currency?: string;
  priceNote?: string;
}
export function OrderCheckout({ serviceSlug, serviceTitle, price, currency = "PKR", priceNote = "Starting from" }: OrderCheckoutProps) {
  return <Column id="order" fillWidth maxWidth="xs" className={styles.checkout}
      border="neutral-medium" radius="l" padding="24" gap="16" background="surface">
      <Heading as="h2" variant="heading-strong-l">Let's discuss your project</Heading>
      <Text onBackground="neutral-weak" variant="body-default-m">
        Tell me your requirements. I'll review the scope and prepare a tailored proposal.
      </Text>
      <Text onBackground="neutral-medium" variant="body-default-s">{serviceTitle}</Text>
      <Heading variant="heading-strong-l" onBackground="brand-strong">
        {priceNote}: {currency} {price}
      </Heading>
      <ActionLink href={"/contact?service=" + encodeURIComponent(serviceSlug)} variant="primary" fullWidth>
        Request a quote
      </ActionLink>
      <Text variant="body-default-xs" onBackground="neutral-weak">
        No payment details are collected. Your inquiry opens in your own email app when you submit the project brief.
      </Text>
    </Column>;
}