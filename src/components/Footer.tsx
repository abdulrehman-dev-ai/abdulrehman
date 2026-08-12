import { Flex, IconButton, SmartLink, Text } from "@/once-ui/components";
import { person, social } from "@/app/resources/content";
import styles from "./Footer.module.scss";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Service Policy", href: "/service-policy" },
  { label: "Contact", href: "/contact" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Flex
      as="footer"
      position="relative"
      fillWidth
      padding="8"
      horizontal="center"
      mobileDirection="column"
    >
      <Flex
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="space-between"
        vertical="center"
        direction="column"
      >
        <Flex gap="12" wrap horizontal="center">
          {legalLinks.map((link) => (
            <SmartLink key={link.href} href={link.href}>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                {link.label}
              </Text>
            </SmartLink>
          ))}
        </Flex>
        <Text variant="body-default-xs" onBackground="neutral-strong" style={{ letterSpacing: '-0.01em' }}>
          <Text onBackground="neutral-strong">©{currentYear}</Text>
          <Text paddingX="2" onBackground="neutral-strong">
            <SmartLink href="/" style={{ textDecoration: 'none' }}>
              {person.name}
            </SmartLink>
          </Text>
          <Text onBackground="neutral-strong">
            Developed by{" "}
            <Text>{person.name}</Text>
            {" "}using{" "}
            <SmartLink
              style={{ marginLeft: "-0.125rem" }}
              href="https://once-ui.com/templates/magic-portfolio"
            >
              Once UI
            </SmartLink>
          </Text>
        </Text>
        <Flex gap="16">
          {social.map(
            (item) =>
              item.link && (
                <IconButton
                  key={item.name}
                  href={item.link}
                  icon={item.icon}
                  tooltip={item.name}
                  size="s"
                  variant="ghost"
                />
              ),
          )}
        </Flex>
      </Flex>
      <Flex height="80" show="s"></Flex>
    </Flex>
  );
};
