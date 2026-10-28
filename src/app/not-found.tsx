import { Column, Heading, Text } from "@/once-ui/components";
import { ActionLink } from "@/components/ui/ActionLink";

export default function NotFound() {
  return <Column as="section" fill center paddingY="128" gap="20">
    <Text variant="display-strong-xl" onBackground="brand-strong">404</Text>
    <Heading as="h1" variant="display-default-xs">Page not found</Heading>
    <Text onBackground="neutral-weak">This page isn't available. You can return to the portfolio or explore the latest work.</Text>
    <Column gap="12" horizontal="center">
      <ActionLink href="/" variant="primary" icon="arrow-left">Back to homepage</ActionLink>
      <ActionLink href="/work" variant="secondary">Explore projects</ActionLink>
    </Column>
  </Column>;
}
