"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.scss";

const navigation=[
  {href:"/work",label:"Work"},
  {href:"/services",label:"Services"},
  {href:"/about",label:"About"},
  {href:"/blog",label:"Journal"},
];
export function Header(){
  const pathname=usePathname()||"/";
  return <header className={styles.shell}>
    <div className={styles.inner}>
      <Link className={styles.brand} href="/" aria-label="Abdul Rehman, homepage">
        <span className={styles.monogram}>AR<span aria-hidden="true">.</span></span>
        <span className={styles.brandText}>Abdul Rehman<small>Engineering & delivery</small></span>
      </Link>
      <nav aria-label="Primary navigation" className={styles.navigation}>
        {navigation.map(item=><Link key={item.href} href={item.href}
          className={styles.navItem}
          aria-current={pathname===item.href||pathname.startsWith(item.href+"/")?"page":undefined}>
          {item.label}
        </Link>)}
      </nav>
      <Link href="/contact" className={styles.contact}>Let's talk <span aria-hidden="true">↗</span></Link>
    </div>
  </header>;
}