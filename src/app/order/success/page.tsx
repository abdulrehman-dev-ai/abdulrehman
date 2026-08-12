import { Button, Column, Flex, Heading, Text } from "@/once-ui/components";
import { business, payments } from "@/app/resources/content";
import { getOrder } from "@/lib/orders";

type SearchParams = Promise<{
  orderId?: string;
  method?: string;
}>;

export async function generateMetadata() {
  return {
    title: "Order Confirmed",
    description: "Your service order has been received.",
  };
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { orderId, method } = await searchParams;
  const order = orderId ? await getOrder(orderId) : null;
  const isBankTransfer = method === "bank_transfer" || order?.paymentMethod === "bank_transfer";

  return (
    <Column maxWidth="m" gap="l" paddingY="l" horizontal="center">
      <Column
        maxWidth="xs"
        gap="16"
        border="neutral-medium"
        radius="l"
        padding="24"
        background="surface"
      >
        <Heading variant="display-strong-s">Order Received</Heading>

        {order ? (
          <Column gap="8">
            <Text variant="body-default-m" onBackground="neutral-weak">
              Thank you, {order.customerName}. Your order for{" "}
              <strong>{order.serviceTitle}</strong> has been placed.
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Order ID: <strong>{order.id}</strong>
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Amount: {order.currency} {order.amount.toLocaleString()}
            </Text>
          </Column>
        ) : (
          <Text variant="body-default-m" onBackground="neutral-weak">
            Your order has been received successfully.
          </Text>
        )}

        {isBankTransfer ? (
          <Column gap="8" border="neutral-medium" radius="m" padding="16" background="neutral-alpha-weak">
            <Text variant="heading-strong-s">Complete Your Bank Transfer</Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Bank: {payments.bankTransfer.bankName}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Account Title: {payments.bankTransfer.accountTitle}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Account Number: {payments.bankTransfer.accountNumber}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              IBAN: {payments.bankTransfer.iban}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              Use your Order ID as the payment reference and share the receipt via WhatsApp or email.
            </Text>
          </Column>
        ) : (
          <Text variant="body-default-m" onBackground="neutral-weak">
            Your card payment was processed through PayFast. We will contact you shortly to begin your project.
          </Text>
        )}

        <Flex gap="12" wrap>
          <Button href={business.whatsapp} variant="primary">
            Contact on WhatsApp
          </Button>
          <Button href="/services" variant="secondary">
            Back to Services
          </Button>
        </Flex>
      </Column>
    </Column>
  );
}
