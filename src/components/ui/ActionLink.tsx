import Link from "next/link";
import type { ReactNode } from "react";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet";
  size?: "sm" | "md" | "lg";
  icon?: "arrow-up-right" | "arrow-right" | "arrow-left" | "none";
  className?: string;
  fullWidth?: boolean;
  ariaLabel?: string;
};

export function ActionLink({
  href,
  children,
  variant = "secondary",
  size = "md",
  icon = "arrow-up-right",
  className = "",
  fullWidth = false,
  ariaLabel,
}: ActionLinkProps) {
  const classes = [
    "neo-action",
    "neo-action--" + variant,
    size !== "md" ? "neo-action--" + size : "",
    fullWidth ? "neo-action--full" : "",
    className,
  ].filter(Boolean).join(" ");

  const arrow = icon === "arrow-left" ? "←" : icon === "arrow-right" ? "→" : "↗";
  const content = <>
    <span>{children}</span>
    {icon !== "none" && <span aria-hidden="true" className="neo-action__icon">{arrow}</span>}
  </>;

  const external = /^https?:\/\//i.test(href);
  const special = /^(mailto:|tel:)/i.test(href);
  if (external || special) {
    return <a href={href} className={classes} data-neo-action={variant} aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{content}</a>;
  }

  return <Link href={href} className={classes} data-neo-action={variant} aria-label={ariaLabel}>{content}</Link>;
}
