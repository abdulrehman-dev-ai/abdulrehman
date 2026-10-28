import { Column, Heading, Text } from "@/once-ui/components";
import styles from "./LegalPage.module.scss";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <Column maxWidth="m" gap="l" paddingY="l" className={styles.layout}>
      <Column gap="8" className={styles.header}>
        <Heading variant="display-strong-l">{title}</Heading>
        <Text variant="body-default-s" onBackground="neutral-weak">
          Last updated: {lastUpdated}
        </Text>
      </Column>
      <Column gap="m" textVariant="body-default-m" className={styles.body}>
        {children}
      </Column>
    </Column>
  );
}
