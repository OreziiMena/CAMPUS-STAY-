// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://campustent.com"),
  title: {
    default: "Campus Tent | Student Accommodation & Off-Campus Housing",
    template: "%s | Campus Tent",
  },
  description: "Find and secure verified off-campus student accommodation, self-contain hostels, apartments, and student roommates with zero stress.",
  keywords: [
    "campus tent",
    "student accommodation",
    "student hostels",
    "off campus housing",
    "student apartments",
    "hostels near me",
    "roommate finder",
  ],
  authors: [{ name: "Campus Tent" }],
  openGraph: {
    title: "Campus Tent | Student Accommodation & Off-Campus Housing",
    description: "Connecting students with verified off-campus hostels, apartments, and roommates.",
    url: "https://campustent.com",
    siteName: "Campus Tent",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Campus Tent Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campus Tent | Student Accommodation",
    description: "Find verified off-campus student accommodation with zero stress.",
    images: ["/icon.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Campus Tent",
  },
};

import { ToastProvider } from "@/components/ToastProvider";
import InstallPrompt from "@/components/InstallPrompt";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://campustent.com/#website",
        "url": "https://campustent.com",
        "name": "Campus Tent",
        "description": "Connecting students with verified off-campus hostels, apartments, and compatible roommates.",
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://campustent.com/explore?search={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://campustent.com/#organization",
        "name": "Campus Tent",
        "url": "https://campustent.com",
        "logo": "https://campustent.com/icon.png",
      },
      {
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "SiteNavigationElement",
            "position": 1,
            "name": "Explore Hostels & Apartments",
            "description": "Discover verified student hostels, single rooms, and self-contain apartments near campus.",
            "url": "https://campustent.com/explore",
          },
          {
            "@type": "SiteNavigationElement",
            "position": 2,
            "name": "Find Roommates",
            "description": "Find compatible, verified student roommates to share accommodation and split rent costs.",
            "url": "https://campustent.com/roommates",
          },
          {
            "@type": "SiteNavigationElement",
            "position": 3,
            "name": "Student & Agent Login",
            "description": "Log in to your Campus Tent account to manage listings or contact landlords.",
            "url": "https://campustent.com/auth/login",
          },
          {
            "@type": "SiteNavigationElement",
            "position": 4,
            "name": "Sign Up / Get Started",
            "description": "Create a free student or agent account on Campus Tent.",
            "url": "https://campustent.com/auth/rolepick",
          },
          {
            "@type": "SiteNavigationElement",
            "position": 5,
            "name": "Landlord & Agent Hub",
            "description": "List your hostels and apartments to reach thousands of university students.",
            "url": "https://campustent.com/landlord-hub",
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ToastProvider>
          {children}
          <InstallPrompt />
        </ToastProvider>
      </body>
    </html>
  );
}