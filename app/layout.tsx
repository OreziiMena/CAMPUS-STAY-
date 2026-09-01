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
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <ToastProvider>
          {children}
          <InstallPrompt />
        </ToastProvider>
      </body>
    </html>
  );
}