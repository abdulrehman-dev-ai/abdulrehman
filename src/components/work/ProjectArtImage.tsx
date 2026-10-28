"use client";
import { useState } from "react";
import styles from "./ClientShowcase.module.scss";

interface Props { src:string; alt:string; title:string; slug:string; priority?:boolean; }
export default function ProjectArtImage({src,alt,title,slug,priority=false}:Props){
  const [failed,setFailed]=useState(false);
  if(failed) return <div className={styles.visualFallback} role="img" aria-label={title+" project identity"}>{slug==="maqwi-organics"?"Maqwi Organics":title}</div>;
  return <img className={styles.brandImage} src={src} alt={alt}
    loading={priority?"eager":"lazy"} referrerPolicy="no-referrer"
    onError={()=>setFailed(true)}/>;
}
