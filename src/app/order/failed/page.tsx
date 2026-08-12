import { Button, Column, Flex, Heading, Text } from "@/once-ui/components";
import { business } from "@/app/resources/content";
import { getOrder } from "@/lib/orders";

type SearchParams = Promise<{
  orderId?: string;
}>;

export async function generateMetadata() {
  return {
    title: "Payment Failed",
    description: "Your payment could not be completed.",
  };
}

export default async function OrderFailedPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { orderId } = await searchParams;
  const order = orderId ? await getOrder(orderId) : null;

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
        <Heading variant="display-strong-s">Payment Not Completed</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          {order
            ? `Your payment for ${order.serviceTitle} could not be completed.`
            : "Your payment could not be completed."}
        </Text>
        {order && (
          <Text variant="body-default-s" onBackground="neutral-weak">
            Order ID: <strong>{order.id}</strong>
          </Text>
        )}
        <Text variant="body-default-m" onBackground="neutral-weak">
          You can try again with card payment or choose bank transfer instead.
        </Text>
        <Flex gap="12" wrap>
          {order && (
            <Button href={`/services/${order.serviceSlug}#order`} variant="primary">
              Try Again
            </Button>
          )}
          <Button href={`mailto:${business.email}`} variant="secondary">
            Contact Support
          </Button>
        </Flex>
      </Column>
    </Column>
  );
}
