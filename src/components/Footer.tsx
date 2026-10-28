import Link from "next/link";
import { person, social, business } from "@/app/resources/content";
import styles from "./Footer.module.scss";
import { ActionLink } from "@/components/ui/ActionLink";

const nav=[["Work","/work"],["Services","/services"],["About","/about"],["Journal","/blog"],["Contact","/contact"]];
export function Footer(){
  const year=new Date().getFullYear();
  return <footer className={styles.outer}>
    <div className={styles.main}>
      <div className={styles.left}>
        <span className={styles.eyebrow}>INDEPENDENT ENGINEERING / LAHORE · WORLDWIDE</span>
        <h2>Good work.<br/><em>Built to last.</em></h2>
        <ActionLink href={"/contact"} variant="primary" className={styles.mail}>Let's talk about your project</ActionLink>
      </div>
      <div className={styles.right}>
        <div><p>EXPLORE</p><nav aria-label="Footer navigation">
          {nav.map(([label,path])=><Link href={path} key={path}>{label}</Link>)}
        </nav></div>
        <div><p>FIND ME</p><nav aria-label="Social profiles">
          {social.filter(item=>item.link&&["GitHub","LinkedIn","Fiverr","Upwork"].includes(item.name)).map(item=><a key={item.name} href={item.link} target="_blank" rel="noopener noreferrer">{item.name} ↗</a>)}
        </nav></div>
      </div>
    </div>
    <div className={styles.bottom}>
      <span>© {year} {person.name}. Full-stack, cloud & security engineering.</span>
      <div><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/refund-policy">Refunds</Link><Link href="/service-policy">Service policy</Link></div>
      <span className={styles.credits}>Adapted from <a href="https://once-ui.com/templates/magic-portfolio" target="_blank" rel="noopener noreferrer">Once UI Magic Portfolio</a> · <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC 4.0</a></span>
    </div>
  </footer>;
}