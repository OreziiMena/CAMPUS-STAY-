import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Student Accommodation & Hostels | Campus Tent",
  description: "Browse and discover verified off-campus student hostels, self-contain apartments, single rooms, and shared accommodation near universities.",
  openGraph: {
    title: "Explore Student Accommodation & Hostels | Campus Tent",
    description: "Browse verified student hostels and apartments on Campus Tent.",
    url: "https://campustent.com/explore",
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
