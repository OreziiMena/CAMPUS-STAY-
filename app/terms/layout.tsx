import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Campus Tent",
  description: "Read the Terms of Service, user agreement, and platform policies for Campus Tent.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
