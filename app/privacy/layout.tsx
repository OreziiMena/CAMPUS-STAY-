import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Campus Tent",
  description: "Read the Privacy Policy and data protection standards for Campus Tent.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
