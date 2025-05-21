'use client';

import React from 'react';
import styles from './marquee.module.scss';

interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  children,
  direction = 'left',
  speed = 50,
  pauseOnHover = true,
  className = '',
}) => {
  return (
    <div 
      className={`${styles.marquee} ${className}`}
      style={{
        '--marquee-speed': `${speed}s`,
        '--marquee-direction': direction === 'left' ? 'normal' : 'reverse',
      } as React.CSSProperties}
      data-pause-on-hover={pauseOnHover}
    >
      <div className={styles.content}>
        {children}
        <div aria-hidden="true" className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};