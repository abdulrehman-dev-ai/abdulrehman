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
      >
        Abdul Rehman • Software Engineer • Cyber Security Researcher
      </Text>
    </Marquee>
  );
};