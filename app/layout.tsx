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
  title: "Campus-Stay",
  description: "Find your perfect off-campus housing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      {/* 3. Add the font variables to the body tag */}
      <body className={`${openSans.variable} ${poppins.variable}`}>
        {children}
      </body>
      
    </html>
  );
}