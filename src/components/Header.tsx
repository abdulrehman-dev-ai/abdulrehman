"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Header.module.scss";
import { ActionLink } from "@/components/ui/ActionLink";
import { ThemeToggle } from "./ThemeToggle";

const navigation=[
  {href:"/work",label:"Work"},
  {href:"/services",label:"Services"},
  {href:"/about",label:"About"},
  {href:"/blog",label:"Journal"},
];
export function Header(){
  const pathname=usePathname()||"/";
  return <header className={styles.shell} data-ui="site-header">
    <div className={styles.inner} data-ui="header-inner">
      <Link className={styles.brand} data-ui="brand" href="/" aria-label="Abdul Rehman, homepage">
        <span className={styles.monogram}>
          <Image
            src="/images/avatar.png"
            alt=""
            width={80}
            height={80}
            className={styles.profilePhoto}
            priority
          />
          <span className={styles.statusDot} aria-hidden="true" />
        </span>
        <span className={styles.brandText}>Abdul Rehman<small>Technical Solutions Engineer</small></span>
      </Link>
      <nav aria-label="Primary navigation" className={styles.navigation} data-ui="nav-links">
        {navigation.map(item=><Link key={item.href} href={item.href}
          className={styles.navItem}
          aria-current={pathname===item.href||pathname.startsWith(item.href+"/")?"page":undefined}>
          {item.label}
        </Link>)}
      </nav>
      <div className={styles.controls} data-ui="header-controls"><ThemeToggle /><ActionLink href="/contact" size="sm" variant="secondary">Let's talk</ActionLink></div>
    </div>
  </header>;
}