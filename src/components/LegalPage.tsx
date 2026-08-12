import { Column, Heading, Text } from "@/once-ui/components";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <Column maxWidth="m" gap="l" paddingY="l">
      <Column gap="8">
        <Heading variant="display-strong-l">{title}</Heading>
        <Text variant="body-default-s" onBackground="neutral-weak">
          Last updated: {lastUpdated}
        </Text>
      </Column>
      <Column gap="m" textVariant="body-default-m">
        {children}
      </Column>
    </Column>
  );
}
