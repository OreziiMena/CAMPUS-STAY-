import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Student Roommates | Campus Tent",
  description: "Find verified and compatible student roommates near your campus with shared interests and verified student profiles.",
  openGraph: {
    title: "Find Student Roommates | Campus Tent",
    description: "Find verified student roommates near your campus.",
    url: "https://campustent.com/roommates",
  },
};

export default function RoommatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
