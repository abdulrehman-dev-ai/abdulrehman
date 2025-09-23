"use client";

import { Flex } from "@/once-ui/components";
import { display } from "@/app/resources";
import Image from "next/image";

export const LocationGif = () => {
  if (!display.location) return null;

  return (
    <Flex
      position="fixed"
      zIndex={7}
      style={{
        top: "60px", // Adjust based on your header height
        left: "32px",
        flexDirection: "column", // Stack children vertically
        alignItems: "flex-start", // Align items to the left
        gap: "-12px", // Reduced gap for closer placement
        pointerEvents: "none",
      }}
    >
      <Image
        src="/videos/top-left.gif"
        alt="Pakistan Flag"
        width={120}
        height={120}
        unoptimized
        style={{
          display: "none",
          objectFit: "contain",
        }}
      />
    </Flex>
  );
};