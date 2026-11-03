import Link from "next/link";
import { person, social } from "@/app/resources/content";
import styles from "./Footer.module.scss";

const navigation = [
  ["Home","/"],["Work","/work"],["Services","/services"],
  ["About","/about"],["Journal","/blog"],["Contact","/contact"]
];

export function Footer() {
  const year = new Date().getFullYear();
  return <footer className={styles.outer} data-ui="bento-footer">
    <div className={styles.main}>
      <Link className={styles.brand} href="/" aria-label="Abdul Rehman, home">
        <span className={styles.mark} aria-hidden="true">AR</span>
        <span><strong>{person.name}</strong><small>{person.role}</small></span>
      </Link>
      <nav className={styles.navigation} aria-label="Footer navigation">
        {navigation.map(([label,path]) => <Link href={path} key={path}>{label}</Link>)}
      </nav>
      <nav className={styles.social} aria-label="Professional profiles">
        {social.filter(item => item.link && ["GitHub","LinkedIn","Fiverr","Upwork"].includes(item.name))
          .map(item => <a key={item.name} href={item.link} target="_blank" rel="noopener noreferrer">{item.name} ↗</a>)}
      </nav>
    </div>
    <div className={styles.bottom}>
      <span>© {year} {person.name}. Technical Solutions Engineer.</span>
      <div><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/refund-policy">Refunds</Link><Link href="/service-policy">Service policy</Link></div>
      <span className={styles.credits}>Adapted from <a href="https://once-ui.com/templates/magic-portfolio" target="_blank" rel="noopener noreferrer">Once UI Magic Portfolio</a> · <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC 4.0</a></span>
    </div>
  </footer>;
}
