'use client';

import React from 'react';
import { Marquee } from './Marquee';
import { Flex, Text } from '@/once-ui/components';
import styles from './MarqueeText.module.scss';

export const MarqueeText = () => {
  return (
    <Marquee speed={30} pauseOnHover={true} className={styles.marqueeContainer}>
      <Text 
        size="xl"
        weight="strong"
        variant="body-strong-xl"
        className={styles.outlinedText}
        style={{ whiteSpace: 'nowrap', paddingRight: '2rem' }}
      >
        Cloud & DevOps • Linux Automation • Infrastructure Hardening • System Administration • Leveraging AI • 
      </Text>
    </Marquee>
  );
};