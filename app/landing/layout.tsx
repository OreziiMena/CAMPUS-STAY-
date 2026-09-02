import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campus Tent | Student Housing & Hostel Finder",
  description: "Connecting university students with verified off-campus accommodation, hostels, self-contain apartments, and compatible roommates.",
  openGraph: {
    title: "Campus Tent | Student Housing & Hostel Finder",
    description: "Connecting university students with verified off-campus accommodation.",
    url: "https://campustent.com/landing",
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
