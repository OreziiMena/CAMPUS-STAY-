// app/layout.tsx
import type { Metadata } from "next";
// 1. Import the specific fonts you need from Google
import { Open_Sans, Poppins } from "next/font/google";
import "./globals.css"; 

// 2. Configure the fonts (specify weights and subsets)
const openSans = Open_Sans({ 
  subsets: ["latin"],
  variable: '--font-open-sans', // Optional: Creates a CSS variable
});

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800'], // Add the weights you use
  subsets: ["latin"],
  variable: '--font-poppins',
});

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
      {/* 3. Add the font variables to the body tag */}
      <body className={`${openSans.variable} ${poppins.variable}`}>
        <ToastProvider>
          {children}
          <InstallPrompt />
        </ToastProvider>
      </body>
    </html>
  );
}