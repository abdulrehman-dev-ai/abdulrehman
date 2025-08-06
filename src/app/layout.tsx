import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";
import classNames from "classnames";
import { Footer, Header, RouteGuard, MarqueeText, GoogleAnalytics, LocationGif } from "@/components";
import { baseURL, effects, style } from "@/app/resources";
import { Inter, Source_Code_Pro } from "next/font/google";
import { person, home } from "@/app/resources/content";
import { Background, Column, Flex, ToastProvider } from "@/once-ui/components";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  // Define absolute URLs for images
  const ogImageUrl = `https://${baseURL}/images/cover.png`;
  const twitterImageUrl = `https://${baseURL}/images/cover.png`;
  const avatarUrl = `https://${baseURL}/images/avatar.png`;

  return {
    metadataBase: new URL(`https://${baseURL}`),
    title: {
      template: "%s | Abdul Rehman",
      default: "Abdul Rehman – Software Engineer & Cyber Security Researcher",
    },
    description: "Portfolio of Abdul Rehman, a passionate Software Engineer and Cyber Security Researcher from Pakistan, showcasing innovative projects and creative solutions.",
    keywords: ["Abdul Rehman", "Software Engineer", "Developer", "Cyber Security", "Flutter", "Portfolio", "React", "Next.js"],
    authors: [{ name: person.name, url: `https://${baseURL}` }],
    creator: person.name,
    publisher: person.name,
    
    // Favicon and app icons
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    
    // Open Graph metadata (for Facebook, LinkedIn, etc.)
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `https://${baseURL}`,
      siteName: "Abdul Rehman Portfolio",
      title: "Abdul Rehman – Software Engineer & Cyber Security Researcher",
      description: "Portfolio of Abdul Rehman, a passionate Software Engineer and Cyber Security Researcher from Pakistan, showcasing innovative projects and creative solutions.",
      images: [
        {
          url: ogImageUrl,
          width: 3840,
          height: 2102,
          alt: "Abdul Rehman - Software Engineer & Cyber Security Researcher",
        },
        {
          url: avatarUrl,
          width: 400,
          height: 400,
          alt: "Abdul Rehman's Profile Picture",
        }
      ],
    },
    
    // Twitter metadata
    twitter: {
      card: "summary_large_image",
      title: "Abdul Rehman – Software Engineer & Cyber Security Researcher",
      description: "Portfolio of Abdul Rehman, a passionate Software Engineer and Cyber Security Researcher from Pakistan, showcasing innovative projects and creative solutions.",
      creator: "@abdulsrehman", // Replace with your actual Twitter handle if you have one
      images: [twitterImageUrl],
    },
    
    // Additional structured metadata
    alternates: {
      canonical: `https://${baseURL}`,
    },
    
    // Robots directive
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
    
    // Verification for search engines
    verification: {
      google: "google-site-verification-code", // Replace with your actual verification code if you have one
    },
  };
}

const primary = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-primary",
});

const code = Source_Code_Pro({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-code",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <Flex
      as="html"
      lang="en"
      background="page"
      data-neutral={style.neutral}
      data-brand={style.brand}
      data-accent={style.accent}
      data-solid={style.solid}
      data-solid-style={style.solidStyle}
      data-theme={style.theme}
      data-border={style.border}
      data-surface={style.surface}
      data-transition={style.transition}
      className={classNames(primary.variable, code.variable)}
    >
      <ToastProvider>
        <Column style={{ minHeight: "100vh" }} as="body" fillWidth margin="0" padding="0">
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
          <Background
            mask={{
              cursor: effects.mask.cursor,
              x: effects.mask.x,
              y: effects.mask.y,
              radius: effects.mask.radius,
            }}
            gradient={{
              display: effects.gradient.display,
              x: effects.gradient.x,
              y: effects.gradient.y,
              width: effects.gradient.width,
              height: effects.gradient.height,
              tilt: effects.gradient.tilt,
              colorStart: effects.gradient.colorStart,
              colorEnd: effects.gradient.colorEnd,
              opacity: effects.gradient.opacity as
                | 0
                | 10
                | 20
                | 30
                | 40
                | 50
                | 60
                | 70
                | 80
                | 90
                | 100,
            }}
            dots={{
              display: effects.dots.display,
              color: effects.dots.color,
              size: effects.dots.size as any,
              opacity: effects.dots.opacity as any,
            }}
            grid={{
              display: effects.grid.display,
              color: effects.grid.color,
              width: effects.grid.width as any,
              height: effects.grid.height as any,
              opacity: effects.grid.opacity as any,
            }}
            lines={{
              display: effects.lines.display,
              opacity: effects.lines.opacity as any,
            }}
          />
          <Flex fillWidth minHeight="16"></Flex>
          <Header />
<LocationGif />
<Flex
  position="relative"
  zIndex={0}
  fillWidth
  paddingY="l"
  paddingX="l"
  horizontal="center"
  flex={1}
>
  <Flex horizontal="center" fillWidth minHeight="0">
    <RouteGuard>{children}</RouteGuard>
  </Flex>
</Flex>
          <MarqueeText />
          <Footer />
        </Column>
      </ToastProvider>
    </Flex>
  );
}
