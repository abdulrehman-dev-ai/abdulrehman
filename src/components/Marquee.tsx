'use client';

import React, { ReactNode } from 'react';
import styles from './Marquee.module.scss';

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  speed = 20,
  pauseOnHover = true,
  className = '',
}) => {
  return (
    <div 
      className={`${styles.marquee} ${className} ${pauseOnHover ? styles.pauseOnHover : ''}`}
      style={{ '--marquee-speed': `${speed}s` } as React.CSSProperties}
    >
      <div className={styles.track}>
        <div className={styles.content}>{children}</div>
        <div className={styles.content} aria-hidden="true">{children}</div>
        <div className={styles.content} aria-hidden="true">{children}</div>
      </div>
    </div>
  );
};